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
import { constant, pascal, snake } from 'case';
import { source } from 'common-tags';
import { ContractDef, ParamKindDef, PluginDef, ContentDef, ValueKind } from '../../defs.generated';
import { valueTokenForValue, assertNameForKind } from '../helpers';
import { OutputFile } from '../../interfaces';
import { isEmpty, isUndefined, map } from 'lodash';
import { asList, when } from '../../utils';

function nodeNameFromKind(kind: string): string {
  return kind.split('.').pop() || '';
}

function contentNameFromKind(kind: string): string {
  return kind.split('.').pop() || '';
}

export default function render(contractDef: ContractDef): OutputFile[] {
  const content = `
from .score import Command, LoadingPolicy, ContentType
from .typedNode import TypedNode
from . import util

${map(contractDef.paramKindDefs, renderParamDef).join('\n\n')}


${map(contractDef.pluginDefs, renderPluginDef).join('\n\n')}
  `;

  return [
    { filepath: 'typed.py', content}
  ];
}

function createPluginRenderData(def: PluginDef) {
  const inputs: ContentDef[] = def.portDefs && def.portDefs.input || [];
  const outputs: ContentDef[] = def.portDefs && def.portDefs.output || [];

  return {
    kind: def.kind,
    description: def.description,
    className: `${pascal(nodeNameFromKind(def.kind))}Node`,
    params: map(def.paramDefs, param => ({
      pyName: snake(param.name),
      name: param.name,
      // TODO(falcon): this is hardcoded because of the complicated lookup
      value: valueTokenForValue(param.initialValue, ValueKind.Float),
      description: param.description,
    })),
    configs: map(def.configDefs, config => ({
      pyName: snake(config.name),
      name: config.name,
      assertName: assertNameForKind(config.kind),
      value: isEmpty(config.possibleValues) || isUndefined(config.defaultValue)
        ? valueTokenForValue(config.defaultValue, config.kind)
        : `${pascal(config.name)}.${constant(config.defaultValue.toString())}`,
      required: isUndefined(config.defaultValue),
      possibleValues: config.possibleValues,
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
  const { configs } = createPluginRenderData(def);
  const enums = configs.filter(config => !isUndefined(config.possibleValues));

  return /* prettier-ignore */ source`
    ${map(enums, ({ name, possibleValues }) => {
    const enumName = pascal(name);
    return source`
class ${enumName}:
        ${map(possibleValues, value => `${constant(value)} = '${value}'`)}

`;
    })}
  `;
}

function renderPluginDef(def: PluginDef): string {
  const { className, kind, params, configs, inputs, outputs, description } = createPluginRenderData(def);
  const initArgs = [
    'self',
    ...map(configs.filter(c => c.required), ({ pyName }) => `${pyName}`),
    ...map(configs.filter(c => !c.required), ({ pyName, value }) => `${pyName}=${value}`),
    ...map(params, ({ pyName }) => `${pyName}=None`),
    'id=None',
    'loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH'
  ];

  return /* prettier-ignore */ source`
class ${className}(TypedNode):
    """${description}"""

    ${renderConfigEnums(def)}
    PLUGIN_KIND = '${kind}'

    def __init__(${asList(initArgs)}):
        """
        Args:
            ${map([...configs, ...params], ({ pyName, description }) => `${pyName}: ${description}`)}
        """

        super().__init__(${className}.PLUGIN_KIND, id, loading_policy)
        ${map(params, ({ pyName, value }) => `self.${pyName} = ${pyName} or AudioParam(${value})`)}
        ${map(configs, ({ pyName }) => `self.${pyName} = ${pyName}`)}

    def config(self):
        return {
            ${asList(configs, ({ name, pyName }) => `'${name}': self.${pyName}`)}
        }

    def params(self):
        return {
            ${asList(params, ({ name, pyName }) => `'${name}': self.${pyName}.commands`)}
        }

    def inputs(self):
        return {
            ${asList(inputs, ({ name, kind }) => `'${name}': ContentType.${kind}`)}
        }

    def outputs(self):
        return {
            ${asList(outputs, ({ name, kind }) => `'${name}': ContentType.${kind}`)}
        }

    ${when(configs.length > 0,
    source`def validate(self):
        ${map(configs, ({name, pyName, assertName}) => `util.assert_${assertName}(self.${pyName}, '${name}')`)}`
    )}
  `;
}

function createParamRenderData(def: ParamKindDef) {
  return {
    description: def.description,
    className: `${pascal(def.kind)}Param`,
    commands: map(def.commandDefs, command => ({
      ...command,
      method: snake(command.name),
      params: map(command.argDefs, argDef => ({
        ...argDef,
        assertName: assertNameForKind(argDef.kind),
        arg: snake(argDef.name),
      }))
    }))
  };
}

function renderParamDef(def: ParamKindDef): string {
  const { className, commands, description } = createParamRenderData(def);
  return /* prettier-ignore */ source`
class ${className}:
    """${description}"""

    def __init__(self, initial_value, commands=None):
        self.initial_value = initial_value
        self.commands = commands or []

    ${map(commands, ({ name, method, params, description }) => source`
    def ${method}(${asList(['self', ...map(params, ({ arg }) => `${arg}`)])}):
            """
            ${description}

            Args:
                ${map(params, ({arg, description}) => `${arg}: ${description}`)}
            """
            ${map(params, ({ arg, assertName, name }) => `util.assert_${assertName}(${arg}, '${name}')`)}
            self.commands.append(Command('${name}', {
                ${asList(params, ({ arg, name }) => `'${name}': ${arg}`)}
            }))
    `)}
  `;
}
