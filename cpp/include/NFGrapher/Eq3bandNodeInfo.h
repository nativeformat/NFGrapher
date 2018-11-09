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

struct Eq3bandNodeInfo : public NodeInfo {
  

  Eq3bandNodeInfo(const std::string &id)
    : NodeInfo(id), _low_cutoff(264), _mid_frequency(1000), _high_cutoff(3300), _low_gain(0), _mid_gain(0), _high_gain(0) {}

  Eq3bandNodeInfo(const nfgrapher::Node &sn)
    : NodeInfo(sn.id), _low_cutoff(264), _mid_frequency(1000), _high_cutoff(3300), _low_gain(0), _mid_gain(0), _high_gain(0) {
    if (sn.kind != kind()) {
      std::string msg = "cannot initialize Eq3bandNodeInfo from Node kind = ";
      msg += sn.kind;
      throw std::invalid_argument(msg);
    }
    if (sn.config) {
      
    }
    if (sn.params) {
      if (sn.params->count("lowCutoff")) {
        _low_cutoff = std::move(AudioParamInfo(264, sn.params->at("lowCutoff")));
      }
      if (sn.params->count("midFrequency")) {
        _mid_frequency = std::move(AudioParamInfo(1000, sn.params->at("midFrequency")));
      }
      if (sn.params->count("highCutoff")) {
        _high_cutoff = std::move(AudioParamInfo(3300, sn.params->at("highCutoff")));
      }
      if (sn.params->count("lowGain")) {
        _low_gain = std::move(AudioParamInfo(0, sn.params->at("lowGain")));
      }
      if (sn.params->count("midGain")) {
        _mid_gain = std::move(AudioParamInfo(0, sn.params->at("midGain")));
      }
      if (sn.params->count("highGain")) {
        _high_gain = std::move(AudioParamInfo(0, sn.params->at("highGain")));
      }
    }
  }
  virtual ~Eq3bandNodeInfo() {}

  
  AudioParamInfo _low_cutoff;
  AudioParamInfo _mid_frequency;
  AudioParamInfo _high_cutoff;
  AudioParamInfo _low_gain;
  AudioParamInfo _mid_gain;
  AudioParamInfo _high_gain;
  static constexpr const char *kind() { return "com.nativeformat.plugin.eq.eq3band"; }
  static constexpr const char *name() { return "eq3band"; }
  static ContentTypeMap inputs() { return {{"audio", ContentType::audio}}; }
  static ContentTypeMap outputs() { return {{"audio", ContentType::audio}}; }
};

} // namespace contract
} // namespace nfgrapher