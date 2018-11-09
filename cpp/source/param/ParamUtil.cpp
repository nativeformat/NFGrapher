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

#include <NFGrapher/param/ParamUtil.h>

namespace nfgrapher {
namespace param {

void addCommands(std::shared_ptr<nativeformat::param::Param> &param,
                 const nfgrapher::contract::AudioParamInfo &info) {
  for (const auto &c : info._set_value_at_time_commands) {
    param->setValueAtTime(c._value, 1.0e-9 * c._start_time);
  }
  for (const auto &c : info._set_target_at_time_commands) {
    param->setTargetAtTime(c._target, 1.0e-9 * c._start_time, c._time_constant);
  }
  for (const auto &c : info._set_value_curve_at_time_commands) {
    std::vector<float> vals;
    for (auto v : c._values) vals.push_back(v);
    param->setValueCurveAtTime(vals, 1.0e-9 * c._start_time, 1.0e-9 * c._duration);
  }
  for (const auto &c : info._linear_ramp_to_value_at_time_commands) {
    param->linearRampToValueAtTime(c._value, 1.0e-9 * c._end_time);
  }
  for (const auto &c : info._exponential_ramp_to_value_at_time_commands) {
    param->exponentialRampToValueAtTime(c._value, 1.0e-9 * c._end_time);
  }
}

} // namespace param
} // namespace nfgrapher