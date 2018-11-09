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

struct CompressorNodeInfo : public NodeInfo {
  enum class DetectionMode {max, rms};
  static const std::map<std::string, DetectionMode> &detectionModeMap() {
    static const std::map<std::string, DetectionMode> m {
      {"max", DetectionMode::max}, {"rms", DetectionMode::rms}
    };
    return m;
  };
  enum class KneeMode {hard, soft};
  static const std::map<std::string, KneeMode> &kneeModeMap() {
    static const std::map<std::string, KneeMode> m {
      {"hard", KneeMode::hard}, {"soft", KneeMode::soft}
    };
    return m;
  };

  CompressorNodeInfo(const std::string &id)
    : NodeInfo(id), _cutoffs({  }), _threshold_db(-24), _knee_db(30), _ratio_db(12), _attack(0.0003), _release(0.25) {}

  CompressorNodeInfo(const nfgrapher::Node &sn)
    : NodeInfo(sn.id), _cutoffs({  }), _threshold_db(-24), _knee_db(30), _ratio_db(12), _attack(0.0003), _release(0.25) {
    if (sn.kind != kind()) {
      std::string msg = "cannot initialize CompressorNodeInfo from Node kind = ";
      msg += sn.kind;
      throw std::invalid_argument(msg);
    }
    if (sn.config) {
      if (sn.config->count("detectionMode")) {
        std::string key = sn.config->at("detectionMode").get<std::string>();
        if (!detectionModeMap().count(key)) {
          std::string msg = key;
          msg += " is not a valid value for CompressorNodeInfo::DetectionMode. ";
          msg += "Must be one of: ";
          msg += "max, rms";
          throw std::invalid_argument(msg);
        } else {
          _detection_mode = detectionModeMap().at(key);
        }
      } else {
        /* There's a default value. Carry on! */
        _detection_mode = detectionModeMap().at("max");
      }
      if (sn.config->count("kneeMode")) {
        std::string key = sn.config->at("kneeMode").get<std::string>();
        if (!kneeModeMap().count(key)) {
          std::string msg = key;
          msg += " is not a valid value for CompressorNodeInfo::KneeMode. ";
          msg += "Must be one of: ";
          msg += "hard, soft";
          throw std::invalid_argument(msg);
        } else {
          _knee_mode = kneeModeMap().at(key);
        }
      } else {
        /* There's a default value. Carry on! */
        _knee_mode = kneeModeMap().at("hard");
      }
      if (sn.config->count("cutoffs")) {
        _cutoffs = sn.config->at("cutoffs").get<std::vector<double>>();
      } else {
        /* There's a default value. Carry on! */
        
      }
    }
    if (sn.params) {
      if (sn.params->count("thresholdDb")) {
        _threshold_db = std::move(AudioParamInfo(-24, sn.params->at("thresholdDb")));
      }
      if (sn.params->count("kneeDb")) {
        _knee_db = std::move(AudioParamInfo(30, sn.params->at("kneeDb")));
      }
      if (sn.params->count("ratioDb")) {
        _ratio_db = std::move(AudioParamInfo(12, sn.params->at("ratioDb")));
      }
      if (sn.params->count("attack")) {
        _attack = std::move(AudioParamInfo(0.0003, sn.params->at("attack")));
      }
      if (sn.params->count("release")) {
        _release = std::move(AudioParamInfo(0.25, sn.params->at("release")));
      }
    }
  }
  virtual ~CompressorNodeInfo() {}

  DetectionMode _detection_mode;
  KneeMode _knee_mode;
  std::vector<double> _cutoffs;
  AudioParamInfo _threshold_db;
  AudioParamInfo _knee_db;
  AudioParamInfo _ratio_db;
  AudioParamInfo _attack;
  AudioParamInfo _release;
  static constexpr const char *kind() { return "com.nativeformat.plugin.compressor.compressor"; }
  static constexpr const char *name() { return "compressor"; }
  static ContentTypeMap inputs() { return {{"audio", ContentType::audio},{"sidechain", ContentType::audio}}; }
  static ContentTypeMap outputs() { return {{"audio", ContentType::audio}}; }
};

} // namespace contract
} // namespace nfgrapher