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
import * as Case from 'case';
import { source, stripIndent } from 'common-tags';
import { compact, flatten, map, uniqBy } from 'lodash';
import * as path from 'path';
import { ParamKindDef } from '../../defs.generated';
import { OutputFile } from '../../interfaces';
import { commandClassFromName, paramClassFromKind, quote, typeTokenForValueKind, cppMemberFromName } from '../helpers';


const paramHeaderName = `ParamTypes.h`;

export function renderParams(defs: ParamKindDef[]): OutputFile {
  const filepath = path.join(`include`, `NFGrapher`, paramHeaderName);

  // get all the commandDefs
  const commandDefs = flatten(compact(map(defs, d => d.commandDefs)));
  const uniqueCmds = uniqBy(commandDefs, c => c.name);
  const cmds = map(uniqueCmds, command => ({
    ...command,
    className: `${Case.pascal(command.name)}Command`,
    classStr: `${quote(command.name)}`,
    args: map(compact(command.argDefs), argDef => ({
      member: `_${Case.snake(argDef.name)}`,
      name: argDef.name,
      type: typeTokenForValueKind(argDef.kind),
    }))
  }));

  const params = map(defs, ({kind, valueKind, commandDefs}) => ({
    className: paramClassFromKind(kind),
    valueType: typeTokenForValueKind(valueKind),
    commands: commandDefs,
    commandNames: map(commandDefs, ({name}) => commandClassFromName(name))
  }));

  const paramHeader = /* prettier-ignore */ source`
    #pragma once

    #include "ParamInfo.h"

    #include <nlohmann/json.hpp>

    #include <vector>

    namespace nfgrapher {
    namespace contract {

    // Param types
    ${map(params, ({className, valueType, commandNames, commands}) =>
      source`struct ${className} : public ParamInfo<${valueType}> {

      // Embedded command types
      ${map(cmds, ({ className, classStr, args }) =>
        source`struct ${className} : public Command {
        ${className}() : Command(name()) {}
        ${className}(const std::map<std::string, nlohmann::json> &args)
          : Command(name()) {
          ${map(args, ({name, member, type}) =>
          source`try {
            ${member} = args.at(${quote(name)}).get<${type}>();
          } catch (const std::exception&) {
            std::string msg = "${className} requires a value for \\"${name}\\"";
            throw std::out_of_range(msg);
          }`)}
        }
        virtual ~${className}() {}
        static constexpr const char *name() { return ${classStr}; };
        ${map(args, ({name, type}) => `${type} ${cppMemberFromName(name)};`)}
      };

      `)}
      ${map(commandNames, cmd => `std::vector<${cmd}> ${cppMemberFromName(cmd)}s;`)}

      // Constructors and destructor
      ${className}(const ${valueType} &initial_val): ParamInfo<${valueType}>(initial_val) {}
      ${className}(const ${valueType} &initial_val,
                   const std::vector<nfgrapher::Command> &commands)
                   : ParamInfo<${valueType}>(initial_val) {
        for (auto &cmd : commands) {
          ${map(commands, ({name}) =>
            source`if (cmd.name == ${quote(name)} && cmd.args) {
            try {
              ${cppMemberFromName(name)}_commands.emplace_back(*cmd.args.get());
            } catch (const std::exception &e) {
              std::string msg = "Invalid arguments for ${name} command: ";
              msg += e.what();
              throw std::invalid_argument(msg);
            }
            continue;
          }`)}
          std::string msg = cmd.name + " is not a recognized command name";
          throw std::invalid_argument(msg);
        }
      }
      virtual ~${className}() {}
    };

    } // namespace contract
    } // namespace nfgrapher
    `)}
  `;
  const content = stripIndent`${paramHeader}`;
  return { filepath, content };
}

export function renderParamImport(): string {
  return source`#include "${paramHeaderName}"`;
}