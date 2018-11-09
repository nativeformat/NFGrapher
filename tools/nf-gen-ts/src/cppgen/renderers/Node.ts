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
import { commaLists, source, stripIndent } from 'common-tags';
import { filter, flatten, isUndefined, isEmpty, map } from 'lodash';
import * as path from 'path';
import { ArgDef, PluginDef } from '../../defs.generated';
import { OutputFile } from '../../interfaces';
import { cppMemberFromName, mapNameFromName, nodeClassFromKind, nodeNameFromKind,
  typeTokenForValueKind, valueTokenForValue, paramClassFromKind, contentTypeFromKind, quote } from '../helpers';
import { defined } from 'quicktype/dist/Support';


export function renderNode(def: PluginDef): OutputFile {
  const className = nodeClassFromKind(def.kind);
  const filepath = path.join(`include`, `NFGrapher`, `${className}.h`);

  const paramsToInit = filter(def.paramDefs, p => !isUndefined(p.initialValue));
  const configsToInit = filter(def.configDefs, c =>
    !isUndefined(c.defaultValue) && isUndefined(c.possibleValues));
  const configsWithEnums = filter(def.configDefs, c => !isUndefined(c.possibleValues));
  const configEnums = map(configsWithEnums, c =>
    ({name: Case.pascal(c.name), kind: c.kind, possibleValues: c.possibleValues}));
  const paramInits = map(paramsToInit, ({name, initialValue}) =>
    `${cppMemberFromName(name)}(${initialValue})`);
  const configInits = map(configsToInit, ({name, kind, defaultValue}) =>
    `${cppMemberFromName(name)}(${valueTokenForValue(defaultValue, kind)})`);
  const initList = flatten([`NodeInfo(id)`, configInits, paramInits]);
  const nodeInitList = flatten([`NodeInfo(sn.id)`, configInits, paramInits]);
  const inputs = def.portDefs && def.portDefs.input || [];
  const outputs = def.portDefs && def.portDefs.output || [];

  const content = /* prettier-ignore */ source`
    #pragma once

    #include "NodeInfo.h"
    #include "ContentType.h"

    #include <NFGrapher/ParamTypes.h>
    #include <NFGrapher/Score.generated.h>

    #include <map>
    #include <string>

    namespace nfgrapher {
    namespace contract {

    struct ${className} : public NodeInfo {
      ${map(configEnums, ({ name, kind, possibleValues }) =>
      source`enum class ${name} {${commaLists`${possibleValues}`}};
      static const std::map<${typeTokenForValueKind(kind)}, ${name}> &${mapNameFromName(name)} {
        static const std::map<${typeTokenForValueKind(kind)}, ${name}> m {
          ${commaLists`${map(possibleValues, e => `{${valueTokenForValue(e, kind)}, ${name}::${e}}`)}`}
        };
        return m;
      };`)}

      ${className}(const std::string &id)
        : ${commaLists`${initList}`} {}

      ${className}(const nfgrapher::Node &sn)
        : ${commaLists`${nodeInitList}`} {
        if (sn.kind != kind()) {
          std::string msg = "cannot initialize ${className} from Node kind = ";
          msg += sn.kind;
          throw std::invalid_argument(msg);
        }
        if (sn.config) {
          ${map(def.configDefs, c =>
          `if (sn.config->count(${quote(c.name)})) {
            ${isUndefined(c.possibleValues)
              ? `${cppMemberFromName(c.name)} = sn.config->at(${quote(c.name)}).get<${
                typeTokenForValueKind(c.kind)}>();`
              : `${typeTokenForValueKind(c.kind)} key = sn.config->at(${quote(c.name)}).get<${
                typeTokenForValueKind(c.kind)}>();
            if (!${mapNameFromName(c.name)}.count(key)) {
              std::string msg = key;
              msg += " is not a valid value for ${className}::${Case.pascal(c.name)}. ";
              msg += "Must be one of: ";
              msg += "${commaLists`${c.possibleValues}`}";
              throw std::invalid_argument(msg);
            } else {
              ${cppMemberFromName(c.name)} = ${mapNameFromName(c.name)}.at(key);
            }`}
          } else {
            ${isUndefined(c.defaultValue)
              ? `throw std::out_of_range("no value provided for \\"${c.name}\\" in ${className}");`
              : `/* There's a default value. Carry on! */`}
            ${isUndefined(c.possibleValues) || isUndefined(c.defaultValue)
              ? ``
              : `${cppMemberFromName(c.name)} = ${mapNameFromName(c.name)}.at(${
                   valueTokenForValue(c.defaultValue, c.kind)});`}
          }`)}
        }
        if (sn.params) {
          ${map(def.paramDefs, ({name, kind, initialValue}) =>
          source`if (sn.params->count(${quote(name)})) {
            ${cppMemberFromName(name)} = std::move(${
              paramClassFromKind(kind)}(${initialValue}, sn.params->at(${quote(name)})));
          }`)}
        }
      }
      virtual ~${className}() {}

      ${map(def.configDefs, c =>
        isUndefined(c.possibleValues)
          ? `${typeTokenForValueKind(c.kind)} ${cppMemberFromName(c.name)};`
          : `${Case.pascal(c.name)} ${cppMemberFromName(c.name)};`
      )}
      ${map(def.paramDefs, ({name, kind}) =>
        source`${paramClassFromKind(kind)} ${cppMemberFromName(name)};`
      )}
      static constexpr const char *kind() { return ${quote(def.kind)}; }
      static constexpr const char *name() { return ${quote(nodeNameFromKind(def.kind))}; }
      static ContentTypeMap inputs() { return ${isEmpty(inputs) ? 'ContentTypeMap()' : `{${map(inputs, ({name, kind}) => `{"${name}", ContentType::${contentTypeFromKind(kind)}}`)}}`}; }
      static ContentTypeMap outputs() { return ${isEmpty(outputs) ? 'ContentTypeMap()' : `{${map(outputs, ({name, kind}) => `{"${name}", ContentType::${contentTypeFromKind(kind)}}`)}}`}; }
    };

    } // namespace contract
    } // namespace nfgrapher
  `;
  return { filepath, content };
}

export function renderNodeImports(pluginDefs: PluginDef[]): string {
  const includes = map(pluginDefs, ({kind}) => `
    #include "${nodeClassFromKind(kind)}.h"`);
  return source`${includes}`;
}