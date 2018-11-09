/*
 * Copyright (c) 2018 Spotify AB.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* Generated */

#pragma once

#include "NodeInfo.h"
#include "ContentType.h"

#include <NFGrapher/ParamTypes.h>
#include <NFGrapher/Score.generated.h>

#include <map>
#include <string>

namespace nfgrapher {
namespace contract {

struct FileNodeInfo : public NodeInfo {
  

  FileNodeInfo(const std::string &id)
    : NodeInfo(id), _when(0L), _duration(0L), _offset(0L) {}

  FileNodeInfo(const nfgrapher::Node &sn)
    : NodeInfo(sn.id), _when(0L), _duration(0L), _offset(0L) {
    if (sn.kind != kind()) {
      std::string msg = "cannot initialize FileNodeInfo from Node kind = ";
      msg += sn.kind;
      throw std::invalid_argument(msg);
    }
    if (sn.config) {
      if (sn.config->count("file")) {
        _file = sn.config->at("file").get<std::string>();
      } else {
        throw std::out_of_range("no value provided for \"file\" in FileNodeInfo");
        
      }
      if (sn.config->count("when")) {
        _when = sn.config->at("when").get<long>();
      } else {
        /* There's a default value. Carry on! */
        
      }
      if (sn.config->count("duration")) {
        _duration = sn.config->at("duration").get<long>();
      } else {
        /* There's a default value. Carry on! */
        
      }
      if (sn.config->count("offset")) {
        _offset = sn.config->at("offset").get<long>();
      } else {
        /* There's a default value. Carry on! */
        
      }
    }
    if (sn.params) {
      
    }
  }
  virtual ~FileNodeInfo() {}

  std::string _file;
  long _when;
  long _duration;
  long _offset;
  
  static constexpr const char *kind() { return "com.nativeformat.plugin.file.file"; }
  static constexpr const char *name() { return "file"; }
  static ContentTypeMap inputs() { return ContentTypeMap(); }
  static ContentTypeMap outputs() { return {{"audio", ContentType::audio}}; }
};

} // namespace contract
} // namespace nfgrapher