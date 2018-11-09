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

struct FilterNodeInfo : public NodeInfo {
  enum class FilterType {lowPass, highPass, bandPass};
  static const std::map<std::string, FilterType> &filterTypeMap() {
    static const std::map<std::string, FilterType> m {
      {"lowPass", FilterType::lowPass}, {"highPass", FilterType::highPass}, {"bandPass", FilterType::bandPass}
    };
    return m;
  };

  FilterNodeInfo(const std::string &id)
    : NodeInfo(id), _low_cutoff(0), _high_cutoff(22050) {}

  FilterNodeInfo(const nfgrapher::Node &sn)
    : NodeInfo(sn.id), _low_cutoff(0), _high_cutoff(22050) {
    if (sn.kind != kind()) {
      std::string msg = "cannot initialize FilterNodeInfo from Node kind = ";
      msg += sn.kind;
      throw std::invalid_argument(msg);
    }
    if (sn.config) {
      if (sn.config->count("filterType")) {
        std::string key = sn.config->at("filterType").get<std::string>();
        if (!filterTypeMap().count(key)) {
          std::string msg = key;
          msg += " is not a valid value for FilterNodeInfo::FilterType. ";
          msg += "Must be one of: ";
          msg += "lowPass, highPass, bandPass";
          throw std::invalid_argument(msg);
        } else {
          _filter_type = filterTypeMap().at(key);
        }
      } else {
        /* There's a default value. Carry on! */
        _filter_type = filterTypeMap().at("bandPass");
      }
    }
    if (sn.params) {
      if (sn.params->count("lowCutoff")) {
        _low_cutoff = std::move(AudioParamInfo(0, sn.params->at("lowCutoff")));
      }
      if (sn.params->count("highCutoff")) {
        _high_cutoff = std::move(AudioParamInfo(22050, sn.params->at("highCutoff")));
      }
    }
  }
  virtual ~FilterNodeInfo() {}

  FilterType _filter_type;
  AudioParamInfo _low_cutoff;
  AudioParamInfo _high_cutoff;
  static constexpr const char *kind() { return "com.nativeformat.plugin.eq.filter"; }
  static constexpr const char *name() { return "filter"; }
  static ContentTypeMap inputs() { return {{"audio", ContentType::audio}}; }
  static ContentTypeMap outputs() { return {{"audio", ContentType::audio}}; }
};

} // namespace contract
} // namespace nfgrapher