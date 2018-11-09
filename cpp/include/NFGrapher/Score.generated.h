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

//  To parse this JSON data, first install
//
//      Boost     http://www.boost.org
//      json.hpp  https://github.com/nlohmann/json
//
//  Then include this file, and then do
//
//     Score data = nlohmann::json::parse(jsonString);

#ifndef __QUICKTYPE_SCORE_HPP__
#define __QUICKTYPE_SCORE_HPP__

#include <nlohmann/json.hpp>

namespace nfgrapher {
  using nlohmann::json;

  struct Edge {
    std::string id;
    std::string source;
    std::string target;
    std::unique_ptr<std::string> source_port;
    std::unique_ptr<std::string> target_port;
  };

  enum class LoadingPolicy { ALL_CONTENT_PLAYTHROUGH, SOME_CONTENT_PLAYTHROUGH };

  struct Command {
    std::string name;
    std::unique_ptr<std::map<std::string, nlohmann::json>> args;
  };

  struct Node {
    std::string id;
    std::string kind;
    std::unique_ptr<LoadingPolicy> loading_policy;
    std::unique_ptr<std::map<std::string, std::vector<struct Command>>> params;
    std::unique_ptr<std::map<std::string, nlohmann::json>> config;
  };

  struct Script {
    std::string name;
    std::string code;
  };

  struct Graph {
    std::string id;
    std::unique_ptr<LoadingPolicy> loading_policy;
    std::unique_ptr<std::vector<struct Node>> nodes;
    std::unique_ptr<std::vector<struct Edge>> edges;
    std::unique_ptr<std::vector<struct Script>> scripts;
  };

  struct Score {
    struct Graph graph;
    std::string version;
  };
  
  inline json get_untyped(const json &j, const char *property) {
    if (j.find(property) != j.end()) {
      return j.at(property).get<json>();
    }
    return json();
  }
  
  template <typename T>
  inline std::unique_ptr<T> get_optional(const json &j, const char *property) {
    if (j.find(property) != j.end())
      return j.at(property).get<std::unique_ptr<T>>();
    return std::unique_ptr<T>();
  }
}

namespace nlohmann {
  template <typename T>
  struct adl_serializer<std::unique_ptr<T>> {
    static void to_json(json& j, const std::unique_ptr<T>& opt) {
      if (!opt)
        j = nullptr;
      else
        j = *opt;
    }

    static std::unique_ptr<T> from_json(const json& j) {
      if (j.is_null())
        return std::unique_ptr<T>();
      else
        return std::unique_ptr<T>(new T(j.get<T>()));
    }
  };

  inline void from_json(const json& _j, struct nfgrapher::Edge& _x) {
    _x.id = _j.at("id").get<std::string>();
    _x.source = _j.at("source").get<std::string>();
    _x.target = _j.at("target").get<std::string>();
    _x.source_port = nfgrapher::get_optional<std::string>(_j, "sourcePort");
    _x.target_port = nfgrapher::get_optional<std::string>(_j, "targetPort");
  }

  inline void to_json(json& _j, const struct nfgrapher::Edge& _x) {
    _j = json::object();
    _j["id"] = _x.id;
    _j["source"] = _x.source;
    _j["target"] = _x.target;
    _j["sourcePort"] = _x.source_port;
    _j["targetPort"] = _x.target_port;
  }

  inline void from_json(const json& _j, struct nfgrapher::Command& _x) {
    _x.name = _j.at("name").get<std::string>();
    _x.args = nfgrapher::get_optional<std::map<std::string, json>>(_j, "args");
  }

  inline void to_json(json& _j, const struct nfgrapher::Command& _x) {
    _j = json::object();
    _j["name"] = _x.name;
    _j["args"] = _x.args;
  }

  inline void from_json(const json& _j, struct nfgrapher::Node& _x) {
    _x.id = _j.at("id").get<std::string>();
    _x.kind = _j.at("kind").get<std::string>();
    _x.loading_policy = nfgrapher::get_optional<nfgrapher::LoadingPolicy>(_j, "loadingPolicy");
    _x.params = nfgrapher::get_optional<std::map<std::string, std::vector<struct nfgrapher::Command>>>(_j, "params");
    _x.config = nfgrapher::get_optional<std::map<std::string, json>>(_j, "config");
  }

  inline void to_json(json& _j, const struct nfgrapher::Node& _x) {
    _j = json::object();
    _j["id"] = _x.id;
    _j["kind"] = _x.kind;
    _j["loadingPolicy"] = _x.loading_policy;
    _j["params"] = _x.params;
    _j["config"] = _x.config;
  }

  inline void from_json(const json& _j, struct nfgrapher::Script& _x) {
    _x.name = _j.at("name").get<std::string>();
    _x.code = _j.at("code").get<std::string>();
  }

  inline void to_json(json& _j, const struct nfgrapher::Script& _x) {
    _j = json::object();
    _j["name"] = _x.name;
    _j["code"] = _x.code;
  }

  inline void from_json(const json& _j, struct nfgrapher::Graph& _x) {
    _x.id = _j.at("id").get<std::string>();
    _x.loading_policy = nfgrapher::get_optional<nfgrapher::LoadingPolicy>(_j, "loadingPolicy");
    _x.nodes = nfgrapher::get_optional<std::vector<struct nfgrapher::Node>>(_j, "nodes");
    _x.edges = nfgrapher::get_optional<std::vector<struct nfgrapher::Edge>>(_j, "edges");
    _x.scripts = nfgrapher::get_optional<std::vector<struct nfgrapher::Script>>(_j, "scripts");
  }

  inline void to_json(json& _j, const struct nfgrapher::Graph& _x) {
    _j = json::object();
    _j["id"] = _x.id;
    _j["loadingPolicy"] = _x.loading_policy;
    _j["nodes"] = _x.nodes;
    _j["edges"] = _x.edges;
    _j["scripts"] = _x.scripts;
  }

  inline void from_json(const json& _j, struct nfgrapher::Score& _x) {
    _x.graph = _j.at("graph").get<struct nfgrapher::Graph>();
    _x.version = _j.at("version").get<std::string>();
  }

  inline void to_json(json& _j, const struct nfgrapher::Score& _x) {
    _j = json::object();
    _j["graph"] = _x.graph;
    _j["version"] = _x.version;
  }

  inline void from_json(const json& _j, nfgrapher::LoadingPolicy& _x) {
    if (_j == "allContentPlaythrough") _x = nfgrapher::LoadingPolicy::ALL_CONTENT_PLAYTHROUGH;
    else if (_j == "someContentPlaythrough") _x = nfgrapher::LoadingPolicy::SOME_CONTENT_PLAYTHROUGH;
    else throw "Input JSON does not conform to schema";
  }

  inline void to_json(json& _j, const nfgrapher::LoadingPolicy& _x) {
    switch (_x) {
      case nfgrapher::LoadingPolicy::ALL_CONTENT_PLAYTHROUGH: _j = "allContentPlaythrough"; break;
      case nfgrapher::LoadingPolicy::SOME_CONTENT_PLAYTHROUGH: _j = "someContentPlaythrough"; break;
      default: throw "This should not happen";
    }
  }
}

#endif
