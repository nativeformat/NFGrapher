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

#define CATCH_CONFIG_MAIN  // This tells Catch to provide a main() - only do this in one cpp file

#include <NFGrapher/NFGrapher.h>
#include <NFGrapher/param/ParamUtil.h>

#include <catch.hpp>
#include <iostream>
#include <nlohmann/json.hpp>

static const nlohmann::json eq_json = {
    {"id", "eq-1"},
    {"kind", "com.nativeformat.plugin.eq.eq3band"},
    {"config", {}},
    {"params", {
      {"highGain", {
        {
          {"name", "setValueAtTime"},
          {"args", {{"value", 12}, {"startTime", 1E9}}}
        },
        {
          {"name", "linearRampToValueAtTime"},
          {"args", {{"value", 6}, {"endTime", 7E9}}}
        }
      }}
    }}
  };

TEST_CASE( "Score JSON deserializes", "[score]" ) {
  // Easier to read than inline JSON, perhaps?
  nlohmann::json input = {
    {"version", "0.2.0"},
    {"graph", {
      {"id", "an-id"},
      {"nodes", {
        {
          {"id", "node-id-01"},
          {"kind", "node-kind-01"},
          {"config", {
            {"prop1", 0.5}
          }}
        }
      }},
      {"edges", {
        {
          {"id", "edge-id-01"},
          {"source", "node-id-01"},
          {"target", "node-id-02"}
        }
      }}
    }}
  };

  nfgrapher::Score data = nlohmann::json::parse(input.dump());

  REQUIRE( data.version == "0.2.0" );
  REQUIRE( data.graph.nodes->at(0).config->at("prop1") == 0.5 );
}

TEST_CASE( "SmartPlayer API Parse FileNode", "[playerapi]" ) {
  using nfgrapher::contract::FileNodeInfo;
  std::string uri("spotify:track:xxx");

  nlohmann::json input = {
    {"id", "node-id-01"},
    {"kind", FileNodeInfo::kind()},
    {"config", {
      {FileNodeInfo::name(), uri},
      {"duration", 2000},
      {"offset", 3000}
      // TODO: the below "value" parses just fine, even though it's not properly structured!
      // It of course results in a nullptr deref below.
      //{"value", uri}
    }}
  };

  nfgrapher::Node node = nlohmann::json::parse(input.dump());
  nfgrapher::contract::FileNodeInfo file_node(node);

  REQUIRE( node.kind == FileNodeInfo::kind() );
  REQUIRE( node.config->at("file") == uri );
  REQUIRE( file_node._file == uri );
  REQUIRE( file_node._duration == 2000L );
  REQUIRE( file_node._offset == 3000L );
  REQUIRE( file_node._when == 0L );
}

TEST_CASE( "SmartPlayer API Parse GainNode", "[playerapi]" ) {
  using nfgrapher::contract::FileNodeInfo;
  using nfgrapher::contract::GainNodeInfo;

  nlohmann::json input = {
    {"id", "node-id-02"},
    {"kind", GainNodeInfo::kind()},
    {"params", {
      {"gain", {{
        {"name", "setValueAtTime"},
        {"args", {
          {"value", 1.234},
          {"startTime", 1000}
        }}
      }}}
    }}
  };

  nfgrapher::Node node = nlohmann::json::parse(input.dump());
  GainNodeInfo gain_node(node);

  std::string msg;
  try {
    FileNodeInfo file_node(node);
  } catch (const std::exception &e) {
    msg = e.what();
  }

  std::string expected_msg = "cannot initialize FileNodeInfo from Node kind = ";
  expected_msg += GainNodeInfo::kind();

  REQUIRE( msg == expected_msg );
  REQUIRE( node.kind == GainNodeInfo::kind() );
  REQUIRE( gain_node._gain._set_value_at_time_commands.size() == 1);
  REQUIRE( gain_node._gain._set_value_at_time_commands.front()._value == 1.234);
}

TEST_CASE ( "SmartPlayer API Parse Eq3BandNodeInfo", "[playerapi]" ) {
  using nfgrapher::contract::Eq3bandNodeInfo;

  nfgrapher::Node node = eq_json;
  Eq3bandNodeInfo eq_node(node);
  
  REQUIRE( eq_node._high_gain._set_value_at_time_commands.size() == 1 );
}

TEST_CASE ( "SmartPlayer API Parse Malformed Eq3BandNodeInfo", "[playerapi]" ) {
  using nfgrapher::contract::Eq3bandNodeInfo;

  nlohmann::json bad_eq_json = {
    {"id", "eq-1"},
    {"kind", "com.nativeformat.plugin.eq.eq3band"},
    {"config", {}},
    {"params", {
      {"highGain", {
        {
          {"name", "setValueAtTime"},
          {"args", {{"value", 24}, {"startTime", 0}}}
        },
        {
          {"name", "linearRampToValueAtTime"},
          {"args", {{"value", 0}, {"BAD_KEY", 15E9}}}
        }
      }}
    }}
  };

  nfgrapher::Node node = bad_eq_json;
  std::string msg;
  try {
    Eq3bandNodeInfo eq_node(node);
  } catch (const std::exception &e) {
    msg = e.what();
  }

  std::string expected_msg = "Invalid arguments for linearRampToValueAtTime command: ";
  expected_msg += "LinearRampToValueAtTimeCommand requires a value for \"endTime\"";
  
  REQUIRE( msg == expected_msg );
}

TEST_CASE ( "NFGrapher Param object should correctly initialize NFParam" ) {
  using nfgrapher::contract::Eq3bandNodeInfo;
  using nfgrapher::param::addCommands;

  nfgrapher::Node node = eq_json;
  Eq3bandNodeInfo eq_node(node);
  
  std::shared_ptr<nativeformat::param::Param> high_gain =
      nativeformat::param::createParam(
          eq_node._high_gain._initial_val, 24.0f, -24.0f, "highGain");
  
  addCommands(high_gain, eq_node._high_gain);

  REQUIRE( high_gain->valueForTime(0.0) == 0.0f );
  REQUIRE( high_gain->valueForTime(1.0) == 12.0f );
  REQUIRE( high_gain->valueForTime(8.0) == 6.0f );
}

TEST_CASE ( "NFGrapher should deserialize vectors and enums successfully" ) {
  using nfgrapher::contract::CompressorNodeInfo;

  nlohmann::json compressor_json = {
    {"id", "compressor-1"},
    {"kind", "com.nativeformat.plugin.compressor.compressor"},
    {"config", {
      {"cutoffs", {200.0, 1000.0}},
      {"kneeMode", "soft"}
    }}
  };

  nfgrapher::Node node = compressor_json;
  CompressorNodeInfo comp_node(node);

  REQUIRE ( comp_node._cutoffs.size() == 2 );
  REQUIRE ( comp_node._knee_mode == CompressorNodeInfo::KneeMode::soft);
  REQUIRE ( comp_node._detection_mode == CompressorNodeInfo::DetectionMode::max);
}

TEST_CASE ( "Invalid enum values should result in an exception" ) {
  using nfgrapher::contract::CompressorNodeInfo;

  nlohmann::json compressor_json = {
    {"id", "compressor-2"},
    {"kind", "com.nativeformat.plugin.compressor.compressor"},
    {"config", {
      {"cutoffs", {200.0, 1000.0}},
      {"kneeMode", "nonsense"}
    }}
  };

  nfgrapher::Node node = compressor_json;
  std::string actual;
  try {
    CompressorNodeInfo comp_node(node);
  } catch (const std::exception &e) {
    actual = e.what();
  }
  std::string expected = "nonsense is not a valid value for "
                         "CompressorNodeInfo::KneeMode. "
                         "Must be one of: hard, soft";
  REQUIRE ( actual == expected );
}
