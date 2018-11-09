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
import {
  argMapperConstructorForValueKind,
  typeTokenForValueKind,
  valueTokenForValue
} from '../helpers';
import { camel, capital, constant, pascal } from 'case';
import { source } from 'common-tags';
import { isUndefined, isEmpty, map, filter, uniq, uniqBy } from 'lodash';
import { OutputFile } from '../../interfaces';
import { PluginDef, ContentDef } from '../../defs.generated';
import { asList, when } from '../../utils';

function contentNameFromKind(kind: string): string {
  return kind.split('.').pop() || '';
}

export function createRenderData(def: PluginDef) {
  const inputs: ContentDef[] = def.portDefs && def.portDefs.input || [];
  const outputs: ContentDef[] = def.portDefs && def.portDefs.output || [];

  return {
    kind: def.kind,
    className: `${pascal(def.kind.split('.').pop() || '')}Node`,
    configs: map(def.configDefs, config => {
      const isEnum = !isEmpty(config.possibleValues);
      const result: any = {
        isEnum,
        name: config.name,
        argMapper: argMapperConstructorForValueKind(config.kind),
        type: typeTokenForValueKind(config.kind),
        value: valueTokenForValue(config.defaultValue),
        required: isUndefined(config.defaultValue),
        possibleValues: config.possibleValues,
        constant: `${constant(config.name)}_CONFIG`
      };
      if (isEnum) {
        result.enumName = pascal(config.name);
        result.enumValue = constant(String(config.defaultValue));
        result.enumValues = config.possibleValues!.map(constant);
      }
      return result;
    }),
    params: map(def.paramDefs, param => ({
      name: param.name,
      type: `${capital(camel(param.kind))}Param`,
      value: valueTokenForValue(param.initialValue),
      constant: `${constant(param.name)}_PARAM`
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

export default function render(def: PluginDef): OutputFile {
  const { kind, className, params, configs, inputs, outputs } = createRenderData(def);
  const hasConfig = configs.length > 0;
  const hasParams = params.length > 0;
  const enums = filter(configs, 'isEnum');
  const filepath = `typed/nodes/${className}.ts`;
  const content = /* prettier-ignore */ source`
    import { v4 as uuid } from 'uuid';
    import { Command, Node, ContentType } from '../../score';
    import ArgMapper from '../../schema/ArgMapper';
    import TypedNode from './TypedNode';
    ${uniq(map(params, ({ type }) => source`
    import ${type} from '../params/${type}';
    `))}

    ${map(enums, ({ enumName, possibleValues, enumValues }) => source`
    /**
     * ${className}${enumName}.
     */
    export enum ${className}${enumName} {
      ${asList(possibleValues, (value, index) => `${enumValues[index]} = '${value}'`)}
    }
    `)}

    ${when(hasConfig, source`
    /**
     * ${className}Config.
     */
    export interface ${className}Config {
      ${map(configs, ({ name, type, required, isEnum, enumName }) => source`
      ${name}${when(!required, '?')}: ${isEnum ? className.concat(enumName) : type};
      `)}
    }
    `)}

    /**
     * ${className}.
     */
    class ${className} extends TypedNode {

      /**
       * Unique identifier for the plugin kind this node represents.
       */
      public static PLUGIN_KIND = '${kind}';

      ${map(configs, ({ isEnum, name, enumName, constant, type, argMapper, value, enumValue }) => `
      /**
       * Creates a new \`${type}\` mapper for the \`${name}\` param.
       */
      private static ${constant} = ${isEnum
        ? `ArgMapper.newEnumArg<${className}${enumName}>('${name}', ${className}${enumName}.${enumValue}, Object.values(${className}${enumName}))`
        : `ArgMapper.${argMapper}('${name}', ${value})`
      }`)}

      ${map(params, ({ name, constant, type, value }) => `
      /**
       * \`${name}\` param factory.
       */
      private static ${constant} = ${type}.newParamMapper('${name}', ${value});
      `)}

      /**
       * Creates a new \`${className}\` instance.
       */
      constructor(
        id: string,
        ${asList(map(configs, ({ name, type, isEnum, enumName }) => `
        public readonly ${name}: ${isEnum ? className.concat(enumName) : type}`
        ).concat(map(params, ({ name, type }) => `
        public readonly ${name}: ${type}`
      )))}
      ) {
        super(id, ${className}.PLUGIN_KIND);
      }

      /**
       * \`${className}\` factory.
       */
      public static create(${when(hasConfig, `config: ${className}Config,`)} id: string = uuid()): ${className} {
        return new ${className}(
          id,
          ${asList([...map(configs, ({ name, constant }) => `
          ${className}.${constant}.getValueOrThrow(config.${name})
          `), ...map(params, ({ constant }) => `
          ${className}.${constant}.create()
          `)])}
        );
      }

      /**
       * Creates a new \`${className}\` from a score \`Node\`.
       */
      public static from(node: Node): ${className} {
        if (${className}.PLUGIN_KIND !== node.kind) {
          throw new Error(\`Expected plugin kind="\${${className}.PLUGIN_KIND}"\`);
        }
        return new ${className}(
          node.id,
          ${asList([...map(configs, ({ name, constant }) => `
          ${className}.${constant}.readConfig(node)
          `), ...map(params, ({ name, constant }) => `
          ${className}.${constant}.readParam(node)
          `)])}
        );
      }

      ${when(hasConfig, source`
      /**
       * Configs for this node.
       */
      public getConfig(): ${className}Config {
        return {
          ${asList(map(configs, ({ name, constant }) => `
          "${name}": this.${name}
          `))}
        };
      }
      `)}

      ${when(hasParams, source`
      /**
       * Params for this node.
       */
      public getParams(): { [key: string]: Command[] } {
        return {
          ${asList(map(params, ({ name, constant }) => `
          "${name}": this.${name}.getCommands()
          `))}
        };
      }
      `)}

      /**
       * Inputs for this node.
       */
      public getInputs(): Map<string, ContentType> {
        return new Map([${map(inputs, ({ name, kind }) => `["${name}", ContentType.${kind}]`).join(', ')}])
      }

      /**
       * Outputs for this node.
       */
      public getOutputs(): Map<string, ContentType> {
        return new Map([${map(outputs, ({ name, kind }) => `["${name}", ContentType.${kind}]`).join(', ')}])
      }
    }

    /**
     * Export.
     */
    export default ${className};
  `;
  return { filepath, content };
}
