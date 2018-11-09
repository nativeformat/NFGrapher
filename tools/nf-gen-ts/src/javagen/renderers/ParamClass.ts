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
import { typeTokenForValueKind, pathForClass } from '../helpers';
import { OutputFile } from '../../interfaces';
import { map } from 'lodash';

function createRenderData(def: ParamKindDef) {
  return {
    description: def.description,
    packageName: 'com.spotify.nativeformat.typed.params',
    className: `${pascal(def.kind)}Param`,
    valueType: typeTokenForValueKind(def.valueKind),
    commands: map(def.commandDefs, command => ({
      ...command,
      method: camel(command.name),
      params: map(command.argDefs, argDef => ({
        name: camel(argDef.name),
        type: typeTokenForValueKind(argDef.kind),
      }))
    }))
  };
}

export default function render(def: ParamKindDef): OutputFile {
  const { description, packageName, className, valueType, commands } = createRenderData(def);
  const filepath = pathForClass(packageName, className);
  const content = /* prettier-ignore */ source`
    package ${packageName};

    import com.spotify.nativeformat.schema.ParamMapper;
    import com.spotify.nativeformat.score.Command;
    import com.spotify.nativeformat.score.Time;

    import java.util.ArrayList;
    import java.util.Collections;
    import java.util.List;

    /**
     * ${description}
     */
    public class ${className} extends TypedParam<${valueType}> {

      private List<Command> commands;

      private ${className}(${valueType} initialValue, List<Command> commands) {
        super(initialValue);
        this.commands = commands;
      }

      /**
       * Returns a new ParamMapper with the given name and initial value.
       *
       * @param name the name to use for mapping
       * @param initialValue the initial value
       * @return a new ParamMapper
       */
      public static ParamMapper<${className}> newParamMapper(final String name, final ${valueType} initialValue) {
        return new ParamMapper<>(name, commands -> new ${className}(initialValue, new ArrayList<>(commands)));
      }

      @Override
      public List<Command> getCommands() {
        return Collections.unmodifiableList(this.commands);
      }

      ${commands.map(({ name, description, method, params, argDefs }) => source`
      /**
       * ${description}
       *
       ${map(argDefs, ({ name, description }) => `@param ${name} ${description}`)}
       * @return this ${className} instance
       */
      public ${className} ${method}(${asList(params, p => `final ${p.type} ${p.name}`)}) {
        this.commands.add(
          Command.builder()
              .name("${name}")
              ${map(argDefs, a => `
              .putArg("${a.name}", ${camel(a.name)})
              `)}
              .build()
        );
        return this;
      }
      `)}
    }
  `;
  return { filepath, content };
}
