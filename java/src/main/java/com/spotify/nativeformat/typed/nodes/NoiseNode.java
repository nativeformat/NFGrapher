/* Generated */

package com.spotify.nativeformat.typed.nodes;

import com.spotify.nativeformat.schema.ArgMapper;
import com.spotify.nativeformat.score.Command;
import com.spotify.nativeformat.score.ContentType;
import com.spotify.nativeformat.score.LoadingPolicy;
import com.spotify.nativeformat.score.Node;
import com.spotify.nativeformat.score.Time;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** A plugin that outputs noise. */
public class NoiseNode extends TypedNode {

  /** Unique identifier for the plugin kind this node represents. */
  public static final String PLUGIN_KIND = "com.nativeformat.plugin.noise.noise";

  private static final ArgMapper<Time> WHEN_CONFIG =
      ArgMapper.newTimeArg("when", Time.fromNanos(0));

  private static final ArgMapper<Time> DURATION_CONFIG =
      ArgMapper.newTimeArg("duration", Time.fromNanos(0));

  private Time when;

  private Time duration;

  private NoiseNode(String id, LoadingPolicy loadingPolicy, Time when, Time duration) {
    super(id, PLUGIN_KIND, loadingPolicy);

    this.when = when;

    this.duration = duration;
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param config a Config object used to initialze the node
   * @return a new NoiseNode
   */
  public static NoiseNode create(Config config) {
    return create(null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH, config);
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialze the node
   * @return a new NoiseNode
   */
  public static NoiseNode create(LoadingPolicy loadingPolicy, Config config) {
    return create(null, loadingPolicy, config);
  }

  /**
   * Factory method.
   *
   * @param id the desired node id
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialize the node
   * @return a new NoiseNode
   */
  public static NoiseNode create(String id, LoadingPolicy loadingPolicy, Config config) {
    return new NoiseNode(
        id,
        loadingPolicy,
        WHEN_CONFIG.getValueOrThrow(config.when),
        DURATION_CONFIG.getValueOrThrow(config.duration));
  }

  /**
   * Creates a new NoiseNode from the given Score Node.
   *
   * @param node the Score Node to convert from
   * @return a new NoiseNode
   */
  public static NoiseNode from(Node node) {
    if (!PLUGIN_KIND.equals(node.kind())) {
      throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
    }

    return new NoiseNode(
        node.id(),
        node.loadingPolicy(),
        WHEN_CONFIG.readConfig(node),
        DURATION_CONFIG.readConfig(node));
  }

  /**
   * Tells the plugin when to start producing noise.
   *
   * @return Time
   */
  public Time when() {
    return this.when;
  }

  /**
   * Tells the plugin for how long to produce noise.
   *
   * @return Time
   */
  public Time duration() {
    return this.duration;
  }

  @Override
  public Map<String, List<Command>> params() {
    final Map<String, List<Command>> paramsResult = new HashMap<>();

    return paramsResult;
  }

  @Override
  public Map<String, Object> config() {
    final Map<String, Object> configResult = new HashMap<>();
    WHEN_CONFIG.addToMap(when, configResult);
    DURATION_CONFIG.addToMap(duration, configResult);
    return configResult;
  }

  @Override
  public Map<String, ContentType> inputs() {
    final Map<String, ContentType> inputsResult = new HashMap<>();

    return inputsResult;
  }

  @Override
  public Map<String, ContentType> outputs() {
    final Map<String, ContentType> outputsResult = new HashMap<>();
    outputsResult.put("audio", ContentType.AUDIO);
    return outputsResult;
  }

  /**
   * A configuration class for a NoiseNode.
   *
   * @see NoiseNode#create(Config)
   * @see NoiseNode#create(LoadingPolicy, Config)
   * @see NoiseNode#create(String, LoadingPolicy, Config)
   */
  public static class Config {

    private Time when;

    private Time duration;

    /** @return the current value of <code>when</code> */
    public Time when() {
      return this.when;
    }

    /**
     * Sets the value of <code>when</code>.
     *
     * @see NoiseNode#when()
     * @return this Config instance
     */
    public Config when(final Time when) {
      this.when = when;
      return this;
    }

    /** @return the current value of <code>duration</code> */
    public Time duration() {
      return this.duration;
    }

    /**
     * Sets the value of <code>duration</code>.
     *
     * @see NoiseNode#duration()
     * @return this Config instance
     */
    public Config duration(final Time duration) {
      this.duration = duration;
      return this;
    }
  }
}
