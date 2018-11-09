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
import { OutputFile } from '../../interfaces';
import { ContractDef } from '../../defs.generated';
import { source } from 'common-tags';
import { pathForClass } from '../helpers';

export default function render(contractDef: ContractDef): OutputFile {
  const packageName = 'com.spotify.nativeformat.score';
  const className = 'Score';

  const filepath = pathForClass(packageName, className);
  const content = /* prettier-ignore */ source`
    package ${packageName};

    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    import com.fasterxml.jackson.annotation.JsonInclude;
    import com.fasterxml.jackson.annotation.JsonProperty;
    import io.norberg.automatter.AutoMatter;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @AutoMatter
    public interface ${className} {

      @JsonProperty
      Graph graph();

      @JsonProperty
      String version();

      static ${className} create(final Graph graph) {
        return create(graph, "${contractDef.version}");
      }

      static ${className} create(final Graph graph, final String version) {
        return builder().graph(graph).version(version).build();
      }

      static ${className}Builder builder() {
        return new ${className}Builder().version("${contractDef.version}");
      }
    }
  `;

  return { filepath, content };
}
