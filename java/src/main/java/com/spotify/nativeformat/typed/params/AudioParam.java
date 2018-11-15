/* Generated */

package com.spotify.nativeformat.typed.params;

import com.spotify.nativeformat.schema.ParamMapper;
import com.spotify.nativeformat.score.Command;
import com.spotify.nativeformat.score.Time;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** A float value that can change over time. */
public class AudioParam extends TypedParam<Double> {

  private List<Command> commands;

  private AudioParam(Double initialValue, List<Command> commands) {
    super(initialValue);
    this.commands = commands;
  }

  /**
   * Returns a new ParamMapper with the given name and initial value.
   *
   * @param name the name to use for mapping
   * @param initialValue the initial value
   * @return a new ParamMapper
   */
  public static ParamMapper<AudioParam> newParamMapper(
      final String name, final Double initialValue) {
    return new ParamMapper<>(
        name, commands -> new AudioParam(initialValue, new ArrayList<>(commands)));
  }

  @Override
  public List<Command> getCommands() {
    return Collections.unmodifiableList(this.commands);
  }

  /**
   * Sets the value of this param at the given start time.
   *
   * @param value The desired value.
   * @param startTime The time the value should be set.
   * @return this AudioParam instance
   */
  public AudioParam setValueAtTime(final Double value, final Time startTime) {
    this.commands.add(
        Command.builder()
            .name("setValueAtTime")
            .putArg("value", value)
            .putArg("startTime", startTime)
            .build());
    return this;
  }
  /**
   * Linearly interpolates the param from its current value to the give value at the given time.
   *
   * @param value The desired value.
   * @param endTime The time at which this param should have the given value.
   * @return this AudioParam instance
   */
  public AudioParam linearRampToValueAtTime(final Double value, final Time endTime) {
    this.commands.add(
        Command.builder()
            .name("linearRampToValueAtTime")
            .putArg("value", value)
            .putArg("endTime", endTime)
            .build());
    return this;
  }
  /**
   * Exponentially interpolates the param from its current value to the give value at the given
   * time.
   *
   * @param value The desired value.
   * @param endTime The time at which this param should have the given value.
   * @return this AudioParam instance
   */
  public AudioParam exponentialRampToValueAtTime(final Double value, final Time endTime) {
    this.commands.add(
        Command.builder()
            .name("exponentialRampToValueAtTime")
            .putArg("value", value)
            .putArg("endTime", endTime)
            .build());
    return this;
  }
  /**
   * Specifies a target to reach starting at a given time and gives a constant with which to guide
   * the curve along.
   *
   * @param target The target value to reach.
   * @param startTime The starting time.
   * @param timeConstant A constant to guide the curve.
   * @return this AudioParam instance
   */
  public AudioParam setTargetAtTime(
      final Double target, final Time startTime, final Double timeConstant) {
    this.commands.add(
        Command.builder()
            .name("setTargetAtTime")
            .putArg("target", target)
            .putArg("startTime", startTime)
            .putArg("timeConstant", timeConstant)
            .build());
    return this;
  }
  /**
   * Specifies a curve to render based on the given float values.
   *
   * @param values The curve values.
   * @param startTime The starting time.
   * @param duration The duration of the curve.
   * @return this AudioParam instance
   */
  public AudioParam setValueCurveAtTime(
      final List<Double> values, final Time startTime, final Time duration) {
    this.commands.add(
        Command.builder()
            .name("setValueCurveAtTime")
            .putArg("values", values)
            .putArg("startTime", startTime)
            .putArg("duration", duration)
            .build());
    return this;
  }
}
