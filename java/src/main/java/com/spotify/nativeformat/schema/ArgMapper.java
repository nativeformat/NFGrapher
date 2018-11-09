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

package com.spotify.nativeformat.schema;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spotify.nativeformat.score.Command;
import com.spotify.nativeformat.score.Node;
import com.spotify.nativeformat.score.Time;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Describes an ArgDef and provides utility methods for reading from and writing to Score objects.
 *
 * @param <T> the real Java type this describes. Should be a type found in Value.
 */
public class ArgMapper<T> {

  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

  private final String name;

  private final String kind;

  private final T defaultValue;

  private final Predicate<JsonNode> kindChecker;

  private final Function<JsonNode, T> valueGetter;

  private ArgMapper(final String name,
                    final String kind,
                    final T defaultValue,
                    final Predicate<JsonNode> kindChecker,
                    final Function<JsonNode, T> valueGetter) {
    this.name = name;
    this.kind = kind;
    this.defaultValue = defaultValue;
    this.kindChecker = kindChecker;
    this.valueGetter = valueGetter;
  }

  public static <T extends Enum> ArgMapper<T> newEnumArg(final String name,
                                                         final T defaultValue,
                                                         final Class<T> enumClass) {
    return new ArgMapper<T>(name, "string", defaultValue, JsonNode::isTextual,
        j -> OBJECT_MAPPER.convertValue(j, enumClass));
  }

  public static ArgMapper<String> newStringArg(final String name, final String defaultValue) {
    return new ArgMapper<>(name, "string", defaultValue, JsonNode::isTextual, JsonNode::asText);
  }

  public static ArgMapper<Long> newIntArg(final String name, final Long defaultValue) {
    return new ArgMapper<>(name, "int", defaultValue, JsonNode::isIntegralNumber, JsonNode::asLong);
  }

  public static ArgMapper<Double> newFloatArg(final String name, final Double defaultValue) {
    return new ArgMapper<>(name, "float", defaultValue, JsonNode::isFloatingPointNumber,
        JsonNode::asDouble);
  }

  public static ArgMapper<Boolean> newBoolArg(final String name, final Boolean defaultValue) {
    return new ArgMapper<>(name, "bool", defaultValue, JsonNode::isBoolean, JsonNode::asBoolean);
  }

  public static ArgMapper<Time> newTimeArg(final String name, final Time defaultValue) {
    return new ArgMapper<>(name, "time", defaultValue, JsonNode::isIntegralNumber,
        (jsonNode) -> OBJECT_MAPPER.convertValue(jsonNode, Time.class));
  }

  public static ArgMapper<List<String>> newStringListArg(final String name,
                                                         final List<String> defaultValue) {
    return newListArg(name, "list(string)", defaultValue,
        JsonNode::isTextual, JsonNode::asText);
  }

  public static ArgMapper<List<Long>> newIntListArg(final String name,
                                                    final List<Long> defaultValue) {
    return newListArg(name, "list(int)", defaultValue,
        JsonNode::isIntegralNumber, JsonNode::asLong);
  }

  public static ArgMapper<List<Double>> newFloatListArg(final String name,
                                                        final List<Double> defaultValue) {
    return newListArg(name, "list(float)", defaultValue,
        JsonNode::isFloatingPointNumber, JsonNode::asDouble);
  }

  public static ArgMapper<List<Boolean>> newBoolListArg(final String name,
                                                        final List<Boolean> defaultValue) {
    return newListArg(name, "list(bool)", defaultValue, JsonNode::isBoolean, JsonNode::asBoolean);
  }

  public static ArgMapper<List<Time>> newTimeListArg(final String name,
                                                     final List<Time> defaultValue) {
    return newListArg(name, "list(time)", defaultValue,
        JsonNode::isIntegralNumber,
        (jsonNode) -> OBJECT_MAPPER.convertValue(jsonNode, Time.class));
  }

  private static <T> ArgMapper<List<T>> newListArg(final String name,
                                                   final String expectedType,
                                                   final List<T> defaultValue,
                                                   final Predicate<JsonNode> typeChecker,
                                                   final Function<JsonNode, T> valueGetter) {
    return new ArgMapper<>(
        name,
        expectedType,
        defaultValue,
        n -> n.isArray() && stream(n).allMatch(typeChecker),
        n -> stream(n).map(valueGetter).collect(Collectors.toList())
    );
  }

  /**
   * Returns the given value if it is non-null or the default value if it exists.
   * Throws an exception if there is no non-null value available.
   *
   * @return the default value
   */
  public T getValueOrThrow(final T val) {
    return this.getValueOrThrow(val, "expected '" + this.name + "'");
  }

  /**
   * Returns the given value if it is non-null or the default value if it exists.
   * Throws an exception if there is no non-null value available.
   *
   * @param message the message to include in the exception
   * @return the default value
   */
  public T getValueOrThrow(final T val, final String message) {
    if (val == null && this.defaultValue != null) {
      return this.defaultValue;
    } else if (val != null) {
      return val;
    } else {
      throw new NullPointerException(message);
    }
  }

  public void addToMap(final T value, final Map<String, Object> map) {
    map.put(this.name, OBJECT_MAPPER.valueToTree(value));
  }

  /**
   * Reads the concrete Java value matching this description from the given Node's config.
   *
   * @param node the node to read from.
   * @return a value
   */
  public T readConfig(final Node node) {
    return readValue(Optional.ofNullable(node.config().get(this.name)));
  }

  /**
   * Reads the concrete Java value matching this description from the given Commands's arguments.
   *
   * @param command the command to read from.
   * @return a value
   */
  public T readArg(final Command command) {
    return readValue(Optional.ofNullable(command.args().get(this.name)));
  }

  @SuppressWarnings("unchecked")
  private T readValue(final Optional<Object> maybeValue) {
    if (!maybeValue.isPresent() && defaultValue == null) {
      throw new RuntimeException("arg=" + name + " is not set and has no default value");
    } else if (!maybeValue.isPresent()) {
      return defaultValue;
    }

    final JsonNode value = OBJECT_MAPPER.valueToTree(maybeValue.get());
    if (!kindChecker.test(value)) {
      throw new RuntimeException(String.format(
          "arg=%s expects kind=%s but value is kind=%s", name, kind, value.getNodeType()
      ));
    }

    return valueGetter.apply(value);
  }

  private static Stream<JsonNode> stream(final JsonNode array) {
    return StreamSupport.stream(array.spliterator(), false);
  }
}
