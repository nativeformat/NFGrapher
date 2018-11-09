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

#include "ParamInfo.h"

#include <nlohmann/json.hpp>

#include <vector>

namespace nfgrapher {
namespace contract {

// Param types
struct AudioParamInfo : public ParamInfo<double> {

  // Embedded command types
  struct SetValueAtTimeCommand : public Command {
    SetValueAtTimeCommand() : Command(name()) {}
    SetValueAtTimeCommand(const std::map<std::string, nlohmann::json> &args)
      : Command(name()) {
      try {
        _value = args.at("value").get<double>();
      } catch (const std::exception&) {
        std::string msg = "SetValueAtTimeCommand requires a value for \"value\"";
        throw std::out_of_range(msg);
      }
      try {
        _start_time = args.at("startTime").get<long>();
      } catch (const std::exception&) {
        std::string msg = "SetValueAtTimeCommand requires a value for \"startTime\"";
        throw std::out_of_range(msg);
      }
    }
    virtual ~SetValueAtTimeCommand() {}
    static constexpr const char *name() { return "setValueAtTime"; };
    double _value;
    long _start_time;
  };
  struct LinearRampToValueAtTimeCommand : public Command {
    LinearRampToValueAtTimeCommand() : Command(name()) {}
    LinearRampToValueAtTimeCommand(const std::map<std::string, nlohmann::json> &args)
      : Command(name()) {
      try {
        _value = args.at("value").get<double>();
      } catch (const std::exception&) {
        std::string msg = "LinearRampToValueAtTimeCommand requires a value for \"value\"";
        throw std::out_of_range(msg);
      }
      try {
        _end_time = args.at("endTime").get<long>();
      } catch (const std::exception&) {
        std::string msg = "LinearRampToValueAtTimeCommand requires a value for \"endTime\"";
        throw std::out_of_range(msg);
      }
    }
    virtual ~LinearRampToValueAtTimeCommand() {}
    static constexpr const char *name() { return "linearRampToValueAtTime"; };
    double _value;
    long _end_time;
  };
  struct ExponentialRampToValueAtTimeCommand : public Command {
    ExponentialRampToValueAtTimeCommand() : Command(name()) {}
    ExponentialRampToValueAtTimeCommand(const std::map<std::string, nlohmann::json> &args)
      : Command(name()) {
      try {
        _value = args.at("value").get<double>();
      } catch (const std::exception&) {
        std::string msg = "ExponentialRampToValueAtTimeCommand requires a value for \"value\"";
        throw std::out_of_range(msg);
      }
      try {
        _end_time = args.at("endTime").get<long>();
      } catch (const std::exception&) {
        std::string msg = "ExponentialRampToValueAtTimeCommand requires a value for \"endTime\"";
        throw std::out_of_range(msg);
      }
    }
    virtual ~ExponentialRampToValueAtTimeCommand() {}
    static constexpr const char *name() { return "exponentialRampToValueAtTime"; };
    double _value;
    long _end_time;
  };
  struct SetTargetAtTimeCommand : public Command {
    SetTargetAtTimeCommand() : Command(name()) {}
    SetTargetAtTimeCommand(const std::map<std::string, nlohmann::json> &args)
      : Command(name()) {
      try {
        _target = args.at("target").get<double>();
      } catch (const std::exception&) {
        std::string msg = "SetTargetAtTimeCommand requires a value for \"target\"";
        throw std::out_of_range(msg);
      }
      try {
        _start_time = args.at("startTime").get<long>();
      } catch (const std::exception&) {
        std::string msg = "SetTargetAtTimeCommand requires a value for \"startTime\"";
        throw std::out_of_range(msg);
      }
      try {
        _time_constant = args.at("timeConstant").get<double>();
      } catch (const std::exception&) {
        std::string msg = "SetTargetAtTimeCommand requires a value for \"timeConstant\"";
        throw std::out_of_range(msg);
      }
    }
    virtual ~SetTargetAtTimeCommand() {}
    static constexpr const char *name() { return "setTargetAtTime"; };
    double _target;
    long _start_time;
    double _time_constant;
  };
  struct SetValueCurveAtTimeCommand : public Command {
    SetValueCurveAtTimeCommand() : Command(name()) {}
    SetValueCurveAtTimeCommand(const std::map<std::string, nlohmann::json> &args)
      : Command(name()) {
      try {
        _values = args.at("values").get<std::vector<double>>();
      } catch (const std::exception&) {
        std::string msg = "SetValueCurveAtTimeCommand requires a value for \"values\"";
        throw std::out_of_range(msg);
      }
      try {
        _start_time = args.at("startTime").get<long>();
      } catch (const std::exception&) {
        std::string msg = "SetValueCurveAtTimeCommand requires a value for \"startTime\"";
        throw std::out_of_range(msg);
      }
      try {
        _duration = args.at("duration").get<long>();
      } catch (const std::exception&) {
        std::string msg = "SetValueCurveAtTimeCommand requires a value for \"duration\"";
        throw std::out_of_range(msg);
      }
    }
    virtual ~SetValueCurveAtTimeCommand() {}
    static constexpr const char *name() { return "setValueCurveAtTime"; };
    std::vector<double> _values;
    long _start_time;
    long _duration;
  };
  std::vector<SetValueAtTimeCommand> _set_value_at_time_commands;
  std::vector<LinearRampToValueAtTimeCommand> _linear_ramp_to_value_at_time_commands;
  std::vector<ExponentialRampToValueAtTimeCommand> _exponential_ramp_to_value_at_time_commands;
  std::vector<SetTargetAtTimeCommand> _set_target_at_time_commands;
  std::vector<SetValueCurveAtTimeCommand> _set_value_curve_at_time_commands;

  // Constructors and destructor
  AudioParamInfo(const double &initial_val): ParamInfo<double>(initial_val) {}
  AudioParamInfo(const double &initial_val,
               const std::vector<nfgrapher::Command> &commands)
               : ParamInfo<double>(initial_val) {
    for (auto &cmd : commands) {
      if (cmd.name == "setValueAtTime" && cmd.args) {
        try {
          _set_value_at_time_commands.emplace_back(*cmd.args.get());
        } catch (const std::exception &e) {
          std::string msg = "Invalid arguments for setValueAtTime command: ";
          msg += e.what();
          throw std::invalid_argument(msg);
        }
        continue;
      }
      if (cmd.name == "linearRampToValueAtTime" && cmd.args) {
        try {
          _linear_ramp_to_value_at_time_commands.emplace_back(*cmd.args.get());
        } catch (const std::exception &e) {
          std::string msg = "Invalid arguments for linearRampToValueAtTime command: ";
          msg += e.what();
          throw std::invalid_argument(msg);
        }
        continue;
      }
      if (cmd.name == "exponentialRampToValueAtTime" && cmd.args) {
        try {
          _exponential_ramp_to_value_at_time_commands.emplace_back(*cmd.args.get());
        } catch (const std::exception &e) {
          std::string msg = "Invalid arguments for exponentialRampToValueAtTime command: ";
          msg += e.what();
          throw std::invalid_argument(msg);
        }
        continue;
      }
      if (cmd.name == "setTargetAtTime" && cmd.args) {
        try {
          _set_target_at_time_commands.emplace_back(*cmd.args.get());
        } catch (const std::exception &e) {
          std::string msg = "Invalid arguments for setTargetAtTime command: ";
          msg += e.what();
          throw std::invalid_argument(msg);
        }
        continue;
      }
      if (cmd.name == "setValueCurveAtTime" && cmd.args) {
        try {
          _set_value_curve_at_time_commands.emplace_back(*cmd.args.get());
        } catch (const std::exception &e) {
          std::string msg = "Invalid arguments for setValueCurveAtTime command: ";
          msg += e.what();
          throw std::invalid_argument(msg);
        }
        continue;
      }
      std::string msg = cmd.name + " is not a recognized command name";
      throw std::invalid_argument(msg);
    }
  }
  virtual ~AudioParamInfo() {}
};

} // namespace contract
} // namespace nfgrapher