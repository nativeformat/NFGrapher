/*-
 * -\-\-
 * nf-grapher-java
 * --
 * Copyright (C) 2016 - 2018 Spotify AB
 * --
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * -/-/-
 */

package com.spotify.nativeformat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jackson.JsonLoader;
import com.github.fge.jsonschema.main.JsonSchema;
import com.github.fge.jsonschema.main.JsonSchemaFactory;

public class SchemaValidation {

  private SchemaValidation() {}

  /**
   * Asserts that the given JSON string validates against the Score JSONSchema. This does not
   * validate that the given JSON string validates against the high level player contract.
   *
   * @param json the JSON to check
   * @return true when compliant
   */
  public static boolean isScoreSchemaCompliant(final String json) {
    try {
      final JsonSchemaFactory factory = JsonSchemaFactory.byDefault();
      final JsonSchema jsonSchema =
          factory.getJsonSchema(JsonLoader.fromResource("/score-schema.json"));

      return jsonSchema.validate(new ObjectMapper().readTree(json)).isSuccess();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

}
