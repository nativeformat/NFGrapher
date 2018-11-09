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
    commands: map(def.commandDefs, command => ({
      ...command,
      className: `${pascal(command.name)}Command`,
      method: camel(command.name),
      params: map(command.argDefs, argDef => ({
        name: argDef.name,
        type: typeTokenForValueKind(argDef.kind),
        property: camel(argDef.name),
        description: argDef.description,
      }))
    }))
  };
}

export default function render(def: ParamKindDef): OutputFile {
  const { className, valueType, commands } = createRenderData(def);
  const filepath = `Sources/Grapher/Params/${className}+Commands.swift`;
  const content = /* prettier-ignore */ source`
    import Foundation

    public extension ${className} {
        /// Command that can be applied to a ${className}.
        public class Command: Codable {
            /**
                Enumeration of different command names.

                ${map(commands, ({ name, description }) => `- ${name}: ${description}`)}
             */
            public enum Name: String, Codable {
                ${map(commands, ({ name, method }) => `case ${method} = "${name}"`)}
            }

            internal enum CodingKeys: String, CodingKey {
                case name
                case args
            }

            /// Name of this command.
            public var name: Name

            /**
                Designated initializer

                - Parameters:
                    - name: Name of this command.
             */
            public init(name: Name) {
                self.name = name
            }

            // MARK: Codable

            public required init(from decoder: Decoder) throws {
                let container = try decoder.container(keyedBy: CodingKeys.self)
                name = try container.decode(Name.self, forKey: .name)
            }

            public func encode(to encoder: Encoder) throws {
                var container = encoder.container(keyedBy: CodingKeys.self)
                try container.encode(name, forKey: .name)
            }
        }
        ${map(commands, ({ className, method, params, description }) => source`/// ${description}
        public final class ${className}: Command {
            private enum ArgKeys: String, CodingKey {
                ${map(params, ({ name, property }) => `case ${property} = "${name}"`)}
            }

            ${map(params, ({ type, property, description }) => `/// ${description}
            public var ${property}: ${type}
            `)}
            /**
                Designated initializer

                - Parameters:
                    ${map(params, ({ property, description }) => `- ${property}: ${description}`)}
             */
            public init(${asList(params, p => `${p.property}: ${p.type}`)}) {
              ${map(params, ({ property }) => `self.${property} = ${property}`)}

              super.init(name: .${method})
            }

            // MARK: Codable

            public required init(from decoder: Decoder) throws {
                let container = try decoder.container(keyedBy: CodingKeys.self)
                let args = try container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
                ${map(params, ({ type, property }) => `${property} = try args.decode(${type}.self, forKey: .${property})`)}
                try super.init(from: decoder)
            }

            public override func encode(to encoder: Encoder) throws {
                var container = encoder.container(keyedBy: CodingKeys.self)
                var args = container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
                ${map(params, ({ property }) => `try args.encode(${property}, forKey: .${property})`)}
                try super.encode(to: encoder)
            }
        }`)}
    }
  `;
  return { filepath, content };
}
