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

package com.spotify.nativeformat.score;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * An abstraction of time backed by nanoseconds.
 */
public class Time {

  /**
   * Time zero. Useful for representing the zero point on a timeline.
   */
  public static final Time ZERO = Time.fromNanos(0);

  private final long nanos;

  private Time(long nanos) {
    this.nanos = nanos;
  }

  /**
   * Returns the number of nanoseconds represented by this instance.
   *
   * @return number of nanoseconds
   */
  @JsonValue
  public long getNanos() {
    return this.nanos;
  }

  /**
   * Creates a new Time instance with the given number of nanoseconds.
   *
   * @param value number of nanoseconds
   * @return a new Time instance
   */
  @JsonCreator
  public static Time fromNanos(final long value) {
    return new Time(value);
  }

  /**
   * Creates a new Time instance with the given number of milliseconds.
   *
   * <p>Lossy.
   *
   * @param value number of milliseconds
   * @return a new Time instance
   */
  public static Time fromMillis(final double value) {
    return fromNanos((long) (value * 1e+6));
  }

  /**
   * Creates a new Time instance with the given number of seconds.
   *
   * <p>Lossy.
   *
   * @param value number of seconds
   * @return a new Time instance
   */
  public static Time fromSeconds(final double value) {
    return fromNanos((long) (value * 1e+9));
  }

  /**
   * Creates a new Time instance with the given number of minutes.
   *
   * <p>Lossy.
   *
   * @param value number of minutes
   * @return a new Time instance
   */
  public static Time fromMinutes(final double value) {
    return fromNanos((long) (value * 6e+10));
  }

}

