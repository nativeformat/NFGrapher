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
import java.util.Objects;

/** A plugin that plays different types of media files. */
public class FileNode extends TypedNode {

  /** Unique identifier for the plugin kind this node represents. */
  public static final String PLUGIN_KIND = "com.nativeformat.plugin.file.file";

  private static final ArgMapper<String> FILE_CONFIG = ArgMapper.newStringArg("file", null);

  private static final ArgMapper<Time> WHEN_CONFIG =
      ArgMapper.newTimeArg("when", Time.fromNanos(0));

  private static final ArgMapper<Time> DURATION_CONFIG =
      ArgMapper.newTimeArg("duration", Time.fromNanos(0));

  private static final ArgMapper<Time> OFFSET_CONFIG =
      ArgMapper.newTimeArg("offset", Time.fromNanos(0));

  private String file;

  private Time when;

  private Time duration;

  private Time offset;

  private FileNode(
      String id, LoadingPolicy loadingPolicy, String file, Time when, Time duration, Time offset) {
    super(id, PLUGIN_KIND, loadingPolicy);

    this.file = file;

    this.when = when;

    this.duration = duration;

    this.offset = offset;
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param config a Config object used to initialze the node
   * @return a new FileNode
   */
  public static FileNode create(Config config) {
    return create(null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH, config);
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialze the node
   * @return a new FileNode
   */
  public static FileNode create(LoadingPolicy loadingPolicy, Config config) {
    return create(null, loadingPolicy, config);
  }

  /**
   * Factory method.
   *
   * @param id the desired node id
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialize the node
   * @return a new FileNode
   */
  public static FileNode create(String id, LoadingPolicy loadingPolicy, Config config) {
    return new FileNode(
        id,
        loadingPolicy,
        Objects.requireNonNull(config.file, "file"),
        WHEN_CONFIG.getValueOrThrow(config.when),
        DURATION_CONFIG.getValueOrThrow(config.duration),
        OFFSET_CONFIG.getValueOrThrow(config.offset));
  }

  /**
   * Creates a new FileNode from the given Score Node.
   *
   * @param node the Score Node to convert from
   * @return a new FileNode
   */
  public static FileNode from(Node node) {
    if (!PLUGIN_KIND.equals(node.kind())) {
      throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
    }

    return new FileNode(
        node.id(),
        node.loadingPolicy(),
        FILE_CONFIG.readConfig(node),
        WHEN_CONFIG.readConfig(node),
        DURATION_CONFIG.readConfig(node),
        OFFSET_CONFIG.readConfig(node));
  }

  /**
   * Tells the plugin where to pull the file from, it supports both local files and HTTP based
   * files.<br>
   * Possible string formats:</br><br>
   * - File: `<absolute-path-to-file>`</br><br>
   * - Streamable Audio: `<HTTP(s)-URL>`</br><br>
   * - Spotify Track: `spotify:track:<uri>`</br><br>
   * - MIDI File: `midi:<absolute-path-to-midi-file>:soundfont:<absolute-path-to-soundfont-file>`
   *
   * @return String
   */
  public String file() {
    return this.file;
  }

  /**
   * Tells the plugin when to start playing the file.
   *
   * @return Time
   */
  public Time when() {
    return this.when;
  }

  /**
   * Tells the plugin how long to play the file for.
   *
   * @return Time
   */
  public Time duration() {
    return this.duration;
  }

  /**
   * Tells the plugin where within the track playback should begin.
   *
   * @return Time
   */
  public Time offset() {
    return this.offset;
  }

  @Override
  public Map<String, List<Command>> params() {
    final Map<String, List<Command>> paramsResult = new HashMap<>();

    return paramsResult;
  }

  @Override
  public Map<String, Object> config() {
    final Map<String, Object> configResult = new HashMap<>();
    FILE_CONFIG.addToMap(file, configResult);
    WHEN_CONFIG.addToMap(when, configResult);
    DURATION_CONFIG.addToMap(duration, configResult);
    OFFSET_CONFIG.addToMap(offset, configResult);
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
   * A configuration class for a FileNode.
   *
   * @see FileNode#create(Config)
   * @see FileNode#create(LoadingPolicy, Config)
   * @see FileNode#create(String, LoadingPolicy, Config)
   */
  public static class Config {

    private String file;

    private Time when;

    private Time duration;

    private Time offset;

    /** @return the current value of <code>file</code> */
    public String file() {
      return this.file;
    }

    /**
     * Sets the value of <code>file</code>.
     *
     * @see FileNode#file()
     * @return this Config instance
     */
    public Config file(final String file) {
      this.file = file;
      return this;
    }

    /** @return the current value of <code>when</code> */
    public Time when() {
      return this.when;
    }

    /**
     * Sets the value of <code>when</code>.
     *
     * @see FileNode#when()
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
     * @see FileNode#duration()
     * @return this Config instance
     */
    public Config duration(final Time duration) {
      this.duration = duration;
      return this;
    }

    /** @return the current value of <code>offset</code> */
    public Time offset() {
      return this.offset;
    }

    /**
     * Sets the value of <code>offset</code>.
     *
     * @see FileNode#offset()
     * @return this Config instance
     */
    public Config offset(final Time offset) {
      this.offset = offset;
      return this;
    }
  }
}
