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
import { ParamKindDef, CommandDef } from '../../defs.generated';
import { typeTokenForValueKind } from '../helpers';
import { OutputFile } from '../../interfaces';
import { map } from 'lodash';

function createRenderData(def: ParamKindDef) {
  return {
    className: `${pascal(def.kind)}Param`,
    valueType: typeTokenForValueKind(def.valueKind),
    description: def.description,
    commands: map(def.commandDefs, command => ({
      ...command,
      className: `${pascal(command.name)}Command`,
      method: camel(command.name),
      params: map(command.argDefs, argDef => ({
        name: argDef.name,
        type: typeTokenForValueKind(argDef.kind),
        property: camel(argDef.name),
        description: argDef.description
      }))
    }))
  };
}

export default function render(def: ParamKindDef): OutputFile {
  const { className, valueType, commands, description } = createRenderData(def);
  const filepath = `Sources/Grapher/Params/${className}.swift`;
  const content = /* prettier-ignore */ source`
    import Foundation

    /// ${description}
    public final class ${className}: Param {
        private enum CommandNameKey: String, CodingKey {
            case name
        }

        /// Initial value of this param.
        public var initialValue: ${valueType} = 0

        /// List of commands to apply to this param.
        public var commands: [Command]

        /**
            Designated initializer

            - Parameters:
                - commands: List of commands to apply to this param.
         */
        public init(commands: [Command] = []) {
            self.commands = commands
        }

        ${map(commands, ({ name, className, description, method, params, argDefs }) => source`/**
            ${description}

            - Parameters:
                ${map(params, ({ property, description }) => `- ${property}: ${description}`)}
         */
        public func ${method}(${asList(params, p => `${p.property}: ${p.type}`)}) {
            commands.append(${className}(${asList(params, p => `${p.property}: ${p.name}`)}))
        }`)}

        // MARK: Codable

        public init(from decoder: Decoder) throws {
            var commandsContainerForName = try decoder.unkeyedContainer()
            var commandsContainer = commandsContainerForName

            var commands: [Command] = []

            while !commandsContainerForName.isAtEnd {
                let command = try commandsContainerForName.nestedContainer(keyedBy: CommandNameKey.self)
                let commandName = try command.decode(Command.Name.self, forKey: .name)

                switch commandName {
                  ${map(commands, ({ className, method }) => `case .${method}:
                      commands.append(try commandsContainer.decode(${className}.self))`)}
                }
            }

            self.commands = commands
        }

        public func encode(to encoder: Encoder) throws {
            var container = encoder.singleValueContainer()
            try container.encode(commands)
        }
    }

    extension KeyedDecodingContainer {
        func decode<T>(_ type: T.Type, forKey key: K, initialValue: ${valueType}) throws -> T where T : ${className} {
            let param = try decodeIfPresent(type, forKey: key) ?? T()
            param.initialValue = initialValue
            return param
        }
    }
  `;
  return { filepath, content };
}
