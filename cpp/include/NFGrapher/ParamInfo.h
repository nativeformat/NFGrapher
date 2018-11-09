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

#pragma once

#include <vector>

#include <nlohmann/json.hpp>

namespace nfgrapher {
namespace contract {

// e.g. setValueAtTime
struct Command {
  Command(const char name[]): _name(name) {}
  virtual ~Command() {}
  std::string _name;
};

template <typename T>
struct ParamInfo {
  ParamInfo(const T &initial_val): _initial_val(initial_val) {}
  virtual ~ParamInfo() {}

  const std::vector<const Command*> &getCommands() const;
  const T &getInitialVal() const { return _initial_val; }

  T _initial_val;
};

} // namespace contract
} // namespace nfgrapher