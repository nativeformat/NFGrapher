// Copyright (c) 2018 Spotify AB.
// 
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
// 
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
import { camel, constant, pascal } from 'case';
import { source } from 'common-tags';
import { PluginDef, ContentDef, ValueKind } from '../../defs.generated';
import {
  argMapperConstructorForValueKind,
  pathForClass,
  typeTokenForValueKind,
  valueTokenForValue
} from '../helpers';
import { OutputFile } from '../../interfaces';
import { isEmpty, isUndefined, map, uniqBy } from 'lodash';
import { asList, when } from '../../utils';

function nodeNameFromKind(kind: string): string {
  return kind.split('.').pop() || '';
}

function contentNameFromKind(kind: string): string {
  return kind.split('.').pop() || '';
}

export function createRenderData(def: PluginDef) {
  const inputs: ContentDef[] = def.portDefs && def.portDefs.input || [];
  const outputs: ContentDef[] = def.portDefs && def.portDefs.output || [];

  return {
    kind: def.kind,
    description: def.description,
    packageName: 'com.spotify.nativeformat.typed.nodes',
    className: `${pascal(nodeNameFromKind(def.kind))}Node`,
    hasConfig: !isEmpty(def.configDefs),
    params: map(def.paramDefs, param => ({
      name: param.name,
      constant: `${constant(param.name)}_PARAM`,
      property: camel(param.name),
      type: `${pascal(camel(param.kind))}Param`,
      // TODO(falcon): this is hardcoded because of the complicated lookup
      value: valueTokenForValue(param.initialValue, ValueKind.Float),
      description: param.description,
    })),
    configs: map(def.configDefs, config => ({
      name: config.name,
      property: camel(config.name),
      argMapper: argMapperConstructorForValueKind(config.kind),
      isEnum: !isEmpty(config.possibleValues),
      type: isEmpty(config.possibleValues)
        ?  typeTokenForValueKind(config.kind)
        : pascal(config.name),
      value: valueTokenForValue(config.defaultValue, config.kind),
      required: isUndefined(config.defaultValue),
      possibleValues: config.possibleValues,
      constant: `${constant(config.name)}_CONFIG`,
      description: config.description,
    })),
    inputs: map(inputs, input => ({
      name: input.name,
      kind: constant(contentNameFromKind(input.kind)),
      isDefault: !isUndefined(input.isDefault) ? input.isDefault : false
    })),
    outputs: map(outputs, output => ({
      name: output.name,
      kind: constant(contentNameFromKind(output.kind)),
      isDefault: !isUndefined(output.isDefault) ? output.isDefault : false
    })),
  };
}

function renderConfigEnums(def: PluginDef): string {
  const { configs } = createRenderData(def);
  const enums = configs.filter(config => !isUndefined(config.possibleValues));

  return /* prettier-ignore */ source`
    ${map(enums, ({ name, property, possibleValues }) => {
      const enumName = pascal(property);

      return source`
        public enum ${enumName} {
          ${map(possibleValues, value => `${constant(value)}("${value}")`).join(',') + ';'}

          private static Map<String, ${enumName}> lookup = new HashMap<>();
          static {
            for (${enumName} mode : ${enumName}.values()) {
              lookup.put(mode.value, mode);
            }
          }

          private String value;

          ${enumName}(String value) {
            this.value = value;
          }

          @JsonValue
          public String toValue() {
            return this.value;
          }

          @JsonCreator
          public static ${enumName} fromValue(final String value) {
            final ${enumName} e = lookup.get(value);
            if (e == null) {
              throw new IllegalArgumentException("Cannot build ${enumName} for value=" + value);
            }
            return e;
          }
        }`;
    })}
   `;
}

function renderConfigClass(def: PluginDef): string {
  const { className, configs } = createRenderData(def);
  return /* prettier-ignore */ source`
    /**
     * A configuration class for a ${className}.
     *
     * @see ${className}#create(Config)
     * @see ${className}#create(LoadingPolicy, Config)
     * @see ${className}#create(String, LoadingPolicy, Config)
     */
    public static class Config {

      ${map(configs, c => `
      private ${c.type} ${c.property};
      `)}

      ${map(configs, ({ type, property }) => `
      /**
       * @return the current value of <code>${property}</code>
       */
      public ${type} ${property}() {
        return this.${property};
      }

      /**
       * Sets the value of <code>${property}</code>.
       *
       * @see ${className}#${property}()
       * @return this Config instance
       */
      public Config ${property}(final ${type} ${property}) {
        this.${property} = ${property};
        return this;
      }
      `)}
    }
  `;
}

export default function render(def: PluginDef): OutputFile {
  const { packageName, className, kind, params, configs, inputs, outputs, hasConfig, description } = createRenderData(def);
  const filepath = pathForClass(packageName, className);
  const content = /* prettier-ignore */ source`
    package ${packageName};

    import com.fasterxml.jackson.annotation.JsonCreator;
    import com.fasterxml.jackson.annotation.JsonValue;
    import com.spotify.nativeformat.schema.ArgMapper;
    import com.spotify.nativeformat.schema.ParamMapper;
    import com.spotify.nativeformat.score.Command;
    import com.spotify.nativeformat.score.Node;
    import com.spotify.nativeformat.score.Param;
    import com.spotify.nativeformat.score.Time;
    import com.spotify.nativeformat.score.LoadingPolicy;
    import com.spotify.nativeformat.score.ContentType;
    ${uniqBy(params, p => p.type).map(p => `
    import com.spotify.nativeformat.typed.params.${p.type};
    `)}

    import java.util.Arrays;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;
    import java.util.Objects;
    import com.fasterxml.jackson.databind.JsonNode;

    /**
     * ${description}
     */
    public class ${className} extends TypedNode {

      /**
       * Unique identifier for the plugin kind this node represents.
       */
      public static final String PLUGIN_KIND = "${kind}";

      ${map(params, ({ name, constant, type, value }) => `
      private static final ParamMapper<${type}> ${constant} =
          ${type}.newParamMapper("${name}", ${value});
      `)}

      ${map(configs, ({ name, constant, type, argMapper, value, isEnum }) => `
      private static final ArgMapper<${type}> ${constant} =
          ArgMapper.${isEnum ? 'newEnumArg' : argMapper}("${name}", ${isEnum ? `${type}.fromValue(${value})` : value}${isEnum ? `, ${type}.class` : ''});
      `)}

      ${map([...params, ...configs], ({ type, property }) => `
      private ${type} ${property};
      `)}

      private ${className}(String id, LoadingPolicy loadingPolicy, ${asList([...params, ...configs], ({ type, property }) => `${type} ${property}`)}) {
        super(id, PLUGIN_KIND, loadingPolicy);
        ${map([...params, ...configs], ({ property }) => `
        this.${property} = ${property};
        `)}
      }

      /**
       * Factory method. Generates a random id for the created instance.
       *
       ${when(hasConfig, '@param config a Config object used to initialze the node')}
       * @return a new ${className}
       */
      public static ${className} create(${hasConfig ? 'Config config' : ''}) {
        return create(${hasConfig ? 'null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH, config' : 'null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH'});
      }

      /**
       * Factory method. Generates a random id for the created instance.
       *
       * @param loadingPolicy the desired node loading policy
       ${when(hasConfig, '@param config a Config object used to initialze the node')}
       * @return a new ${className}
       */
      public static ${className} create(${hasConfig ? 'LoadingPolicy loadingPolicy, Config config' : 'LoadingPolicy loadingPolicy'}) {
        return create(${hasConfig ? 'null, loadingPolicy, config' : 'null, loadingPolicy'});
      }

      /**
       * Factory method.
       *
       * @param id the desired node id
       * @param loadingPolicy the desired node loading policy
       ${when(hasConfig, '@param config a Config object used to initialize the node')}
       * @return a new ${className}
       */
      public static ${className} create(${hasConfig ? 'String id, LoadingPolicy loadingPolicy, Config config' : 'String id, LoadingPolicy loadingPolicy'}) {
        return new ${className}(
          id,
          loadingPolicy,
          ${asList([
            ...map(params, p => `${p.constant}.create()`),
            ...map(configs, ({ constant, required, property }) => required
              ? `Objects.requireNonNull(config.${property}, "${property}")`
              : `${constant}.getValueOrThrow(config.${property})`)
          ])}
        );
      }

      /**
       * Creates a new ${className} from the given Score Node.
       *
       * @param node the Score Node to convert from
       * @return a new ${className}
       */
      public static ${className} from(Node node) {
        if (!PLUGIN_KIND.equals(node.kind())) {
          throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
        }

        return new ${className}(
            node.id(),
            node.loadingPolicy(),
            ${asList([
              ...map(params, p => `${p.constant}.readParam(node)`),
              ...map(configs, c => `${c.constant}.readConfig(node)`)
            ])}
        );
      }

      ${map([...params, ...configs], ({ type, property, description }) => `
      /**
       * ${description}
       *
       * @return ${type}
       */
      public ${type} ${property}() {
        return this.${property};
      }
      `)}

      @Override
      public Map<String, List<Command>> params() {
        final Map<String, List<Command>> paramsResult = new HashMap<>();
        ${map(params, p => `${p.constant}.addToMap(${p.property}, paramsResult);`)}
        return paramsResult;
      }

      @Override
      public Map<String, Object> config() {
        final Map<String, Object> configResult = new HashMap<>();
        ${map(configs, c => `${c.constant}.addToMap(${c.property}, configResult);`)}
        return configResult;
      }

      @Override
      public Map<String, ContentType> inputs() {
        final Map<String, ContentType> inputsResult = new HashMap<>();
        ${map(inputs, i => `inputsResult.put("${i.name}", ContentType.${i.kind});`)}
        return inputsResult;
      }

      @Override
      public Map<String, ContentType> outputs() {
        final Map<String, ContentType> outputsResult = new HashMap<>();
        ${map(outputs, o => `outputsResult.put("${o.name}", ContentType.${o.kind});`)}
        return outputsResult;
      }

      ${renderConfigEnums(def)}
      ${when(hasConfig, () => renderConfigClass(def))}
    }
  `;
  return { filepath, content };
}
