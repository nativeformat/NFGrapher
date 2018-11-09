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
import { PluginDef, ValueKind, ArgDef, ContentDef, CommandDef } from '../../defs.generated';
import {
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

function configType(config: ArgDef): string {
  if(!isUndefined(config.possibleValues)) {
    return pascal(config.name);
  }
  else {
    return typeTokenForValueKind(config.kind);
  }
}

function configValue(config: ArgDef): string {
  if(!isUndefined(config.possibleValues) && !isUndefined(config.defaultValue)) {
    return `.${camel(config.defaultValue as string)}`;
  }
  else {
    return valueTokenForValue(config.defaultValue, config.kind);
  }
}

function createRenderData(def: PluginDef) {
  const inputs: ContentDef[] = def.portDefs && def.portDefs.input || [];
  const outputs: ContentDef[] = def.portDefs && def.portDefs.output || [];

  return {
    kind: `${camel(nodeNameFromKind(def.kind))}Node`,
    className: `${pascal(nodeNameFromKind(def.kind))}Node`,
    hasConfig: !isEmpty(def.configDefs),
    hasInputs: !isEmpty(inputs),
    hasOutputs: !isEmpty(outputs),
    hasParams: !isEmpty(def.paramDefs),
    description: def.description,
    configs: map(def.configDefs, config => ({
      name: config.name,
      property: camel(config.name),
      type: configType(config),
      value: configValue(config),
      required: isUndefined(config.defaultValue),
      possibleValues: config.possibleValues,
      description: config.description,
    })),
    inputs: map(inputs, input => ({
      name: input.name,
      kind: camel(contentNameFromKind(input.kind)),
      isDefault: !isUndefined(input.isDefault) ? input.isDefault : false
    })),
    outputs: map(outputs, output => ({
      name: output.name,
      kind: camel(contentNameFromKind(output.kind)),
      isDefault: !isUndefined(output.isDefault) ? output.isDefault : false
    })),
    params: map(def.paramDefs, param => ({
      name: param.name,
      property: camel(param.name),
      type: `${pascal(camel(param.kind))}Param`,
      value: valueTokenForValue(param.initialValue, ValueKind.Float),
      required: true,
      description: param.description,
    })),
  };
}

function renderConfigEnums(def: PluginDef): string {
  const { configs } = createRenderData(def);
  const enums = configs.filter(config => !isUndefined(config.possibleValues));

  return /* prettier-ignore */ source`
    ${map(enums, ({ name, property, possibleValues }) => source`public enum ${pascal(property)}: String, Codable {
        ${map(possibleValues, value => `case ${camel(value)} = "${value}"`).join('\n')}
    }
    `)}
  `;
}

function renderConfigKeys(def: PluginDef): string {
  const { configs } = createRenderData(def);
  return /* prettier-ignore */ source`
    private enum ConfigKeys: String, CodingKey {
        ${map(configs, ({ name, property }) => `case ${property} = "${name}"`)}
    }
  `;
}

function renderParamKeys(def: PluginDef): string {
  const { params } = createRenderData(def);
  return /* prettier-ignore */ source`
    private enum ParamKeys: String, CodingKey {
        ${map(params, ({ name, property }) => `case ${property} = "${name}"`)}
    }
  `;
}

export default function render(def: PluginDef): OutputFile {
  const { className, kind, configs, inputs, outputs, params, hasConfig, hasInputs, hasOutputs, hasParams, description } = createRenderData(def);
  const filepath = `Sources/Grapher/Nodes/${className}.swift`;
  const content = /* prettier-ignore */ source`
    import Foundation

    /// ${description}
    public final class ${className}: Node {
        ${[...hasConfig ? [renderConfigEnums(def), renderConfigKeys(def)] : [],
           ...hasParams ? [renderParamKeys(def)] : []].join('\n\n')}

        public override class var inputs: [String: ContentType] {
            return ${hasInputs ? `[${map(inputs, ({ name, kind }) => `"${name}": .${kind}`).join(',\n')}]` : '[:]'}
        }

        public override class var outputs: [String: ContentType] {
            return ${hasOutputs ? `[${map(outputs, ({ name, kind }) => `"${name}": .${kind}`).join(',\n')}]` : '[:]'}
        }

        ${map([...configs, ...params], ({ type, property, description }) => `/// ${description}
        public var ${property}: ${type}
        `)}

        /**
            Designated initializer

            - Parameters:
                - id: Unique identifier of this node.
                ${map([...configs, ...params], ({ type, property, description }) => `- ${property}: ${description}`)}
         */
        public init(id: String = IDGenerator.generateUniqueID(), ${asList([...configs, ...params], ({ type, property, value, required }) => required ? `${property}: ${type}` : `${property}: ${type} = ${value}`)}) {
            ${map([...configs, ...params], ({ property }) => `self.${property} = ${property}`)}

            super.init(id: id, kind: .${kind})
        }

        // MARK: Codable

        public required init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            ${[...hasConfig ? ['let config = try container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)'].concat(
               map(configs, ({ type, property, value, required }) => required ? `${property} = try config.decode(${type}.self, forKey: .${property})` : `${property} = try config.decodeIfPresent(${type}.self, forKey: .${property}) ?? ${value}`)) : [],
               ...hasParams ? ['let params = try container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)'].concat(
               map(params, ({ type, property, value }) => `${property} = try params.decode(${type}.self, forKey: .${property}, initialValue: ${value})`)) : []].join('\n')}

            try super.init(from: decoder)
        }

        public override func encode(to encoder: Encoder) throws {
            var container = encoder.container(keyedBy: CodingKeys.self)
            ${[...hasConfig ? ['var config = container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)'].concat(
               map(configs, ({ property }) => `try config.encode(${property}, forKey: .${property})`)) : [],
               ...hasParams ? ['var params = container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)'].concat(
               map(params, ({ property }) => `try params.encode(${property}, forKey: .${property})`)) : []].join('\n')}

            try super.encode(to: encoder)
        }
    }
  `;
  return { filepath, content };
}
