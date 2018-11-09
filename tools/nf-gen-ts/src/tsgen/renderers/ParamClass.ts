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
import { camel, pascal } from 'case';
import { source } from 'common-tags';
import { asList } from '../../utils';
import { ParamKindDef } from '../../defs.generated';
import { typeTokenForValueKind } from '../helpers';
import { OutputFile } from '../../interfaces';
import { map } from 'lodash';

export function createRenderData(def: ParamKindDef) {
  return {
    className: `${pascal(def.kind)}Param`,
    valueType: typeTokenForValueKind(def.valueKind),
    commands: map(def.commandDefs, command => ({
      ...command,
      method: camel(command.name),
      params: map(command.argDefs, argDef => ({
        name: camel(argDef.name),
        type: typeTokenForValueKind(argDef.kind)
      }))
    }))
  };
}

export default function render(def: ParamKindDef): OutputFile {
  const { className, valueType, commands } = createRenderData(def);
  const filepath = `typed/params/${className}.ts`;
  const content = /* prettier-ignore */ source`
    import { Command } from '../../score';
    import ParamMapper from '../../schema/ParamMapper';
    import TypedParam from './TypedParam';

    /**
     * ${className}.
     */
    class ${className} extends TypedParam<${valueType}> {

      /**
       * Creates a new \`${className}\` instance.
       */
      constructor(initialValue: ${valueType}, private commands: Command[] = []) {
        super(initialValue);
      }

      /**
       * Creates a new ${className} mapper.
       */
      public static newParamMapper(name: string, initialValue: ${valueType}): ParamMapper<${className}> {
        return new ParamMapper<${className}>(name, cmds => new ${className}(initialValue, [...cmds]));
      }

      ${map(commands, ({ name, description, method, params, argDefs }) => `
      /**
       * ${description || name}
       */
      public ${method}(${asList(params, p => `${p.name}:${p.type}`)}): ${className} {
        this.commands.push({
          name: '${name}',
          args: {${asList(argDefs, arg => `
            ${arg.name}
          `)}
          }
        });
        return this;
      }
      `)}

      /**
       * Returns an array of all commands added to this param.
       */
      public getCommands(): Command[] {
        return [...this.commands];
      }
    }

    /**
     * Export.
     */
    export default ${className};
  `;
  return { filepath, content };
}
