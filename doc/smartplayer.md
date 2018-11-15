# Native Format Smart Player API

> Version 1.2.10

## Table of Contents

- [Plugins](#plugins)
  - [Eq3band](#eq3band)
    - [Params](#params)
  - [File](#file)
    - [Config](#config)
  - [Noise](#noise)
    - [Config](#config-1)
  - [Silence](#silence)
    - [Config](#config-2)
  - [Loop](#loop)
    - [Config](#config-3)
  - [Stretch](#stretch)
    - [Params](#params-1)
  - [Delay](#delay)
    - [Params](#params-2)
  - [Gain](#gain)
    - [Params](#params-3)
  - [Sine](#sine)
    - [Config](#config-4)
  - [Filter](#filter)
    - [Config](#config-5)
    - [Params](#params-4)
  - [Compressor](#compressor)
    - [Config](#config-6)
    - [Params](#params-5)
  - [Expander](#expander)
    - [Config](#config-7)
    - [Params](#params-6)
  - [Compander](#compander)
    - [Config](#config-8)
    - [Params](#params-7)
- [Param Kinds](#param-kinds)
  - [Audio](#audio)
    - [Commands](#commands)
      - [SetValueAtTime](#setvalueattime)
        - [Arguments](#arguments)
      - [LinearRampToValueAtTime](#linearramptovalueattime)
        - [Arguments](#arguments-1)
      - [ExponentialRampToValueAtTime](#exponentialramptovalueattime)
        - [Arguments](#arguments-2)
      - [SetTargetAtTime](#settargetattime)
        - [Arguments](#arguments-3)
      - [SetValueCurveAtTime](#setvaluecurveattime)
        - [Arguments](#arguments-4)

## Plugins

### Eq3band

> com.nativeformat.plugin.eq.eq3band

A 3-band EQ consisting of a low shelf, a mid-range peaking filter, and high shelf. The gain and cutoff or center frequency of each section are controlled by audio parameters.

#### Params

| Name         | Type  | Initial Value | Description                                                                                                                |
| ------------ | ----- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| lowCutoff    | audio | `264`         | An audio parameter specifying the cutoff frequency (Hz) for the low shelf filter, below which the lowGain will be applied. |
| midFrequency | audio | `1000`        | An audio parameter specifying the center frequency (Hz) of the peq filter, at which midGain will be applied.               |
| highCutoff   | audio | `3300`        | An audio parameter specifying the cutoff frequency for the high shelf filter, above which the highGain will be applied.    |
| lowGain      | audio | `0`           | An audio parameter specifying the gain (dB) for the low shelf.                                                             |
| midGain      | audio | `0`           | An audio parameter specifying the gain (dB) for the mid range filter.                                                      |
| highGain     | audio | `0`           | An audio parameter specifying the gain (dB) for the high shelf.                                                            |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.eq.eq3band",
  "config": {},
  "params": {
    "lowCutoff": [],
    "midFrequency": [],
    "highCutoff": [],
    "lowGain": [],
    "midGain": [],
    "highGain": []
  }
}
```

### File

> com.nativeformat.plugin.file.file

A plugin that plays different types of media files.

#### Config

| Name     | Type   | Default Value | Description                                                                                                                                                                                                                                                                                                                                                            |
| -------- | ------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| file     | string | -             | Tells the plugin where to pull the file from, it supports both local files and HTTP based files.<br>Possible string formats:</br><br>- File: `<absolute-path-to-file>`</br><br>- Streamable Audio: `<HTTP(s)-URL>`</br><br>- Spotify Track: `spotify:track:<uri>`</br><br>- MIDI File: `midi:<absolute-path-to-midi-file>:soundfont:<absolute-path-to-soundfont-file>` |
| when     | number | `0`           | Tells the plugin when to start playing the file.                                                                                                                                                                                                                                                                                                                       |
| duration | number | `0`           | Tells the plugin how long to play the file for.                                                                                                                                                                                                                                                                                                                        |
| offset   | number | `0`           | Tells the plugin where within the track playback should begin.                                                                                                                                                                                                                                                                                                         |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.file.file",
  "config": {
    "file": "a string",
    "when": 1000,
    "duration": 1000,
    "offset": 1000
  },
  "params": {}
}
```

### Noise

> com.nativeformat.plugin.noise.noise

A plugin that outputs noise.

#### Config

| Name     | Type   | Default Value | Description                                     |
| -------- | ------ | ------------- | ----------------------------------------------- |
| when     | number | `0`           | Tells the plugin when to start producing noise. |
| duration | number | `0`           | Tells the plugin for how long to produce noise. |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.noise.noise",
  "config": {
    "when": 1000,
    "duration": 1000
  },
  "params": {}
}
```

### Silence

> com.nativeformat.plugin.noise.silence

A plugin that outputs silence.

#### Config

| Name     | Type   | Default Value | Description                                       |
| -------- | ------ | ------------- | ------------------------------------------------- |
| when     | number | `0`           | Tells the plugin when to start producing silence. |
| duration | number | `0`           | Tells the plugin for how long to produce silence. |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.noise.silence",
  "config": {
    "when": 1000,
    "duration": 1000
  },
  "params": {}
}
```

### Loop

> com.nativeformat.plugin.time.loop

A plugin that loops an audio stream.

#### Config

| Name      | Type   | Default Value | Description                                               |
| --------- | ------ | ------------- | --------------------------------------------------------- |
| when      | number | -             | Describes when the plugin should begin looping.           |
| duration  | number | -             | Describes the duration of the loop.                       |
| loopCount | number | `-1`          | Describes the total number of loops. -1 loops infinitely. |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.time.loop",
  "config": {
    "when": 1000,
    "duration": 1000,
    "loopCount": 42
  },
  "params": {}
}
```

### Stretch

> com.nativeformat.plugin.time.stretch

A plugin that can independently stretch time and shift the pitch of an audio stream.

#### Params

| Name         | Type  | Initial Value | Description                                                                                                                                                         |
| ------------ | ----- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pitchRatio   | audio | `1`           | An audio parameter specifying the pitch multiplier. For example, a pitchRatio value of 2.0 will double the original audio frequencies.                              |
| stretch      | audio | `1`           | An audio parameter specifying the time stretch multiplier. For example, a stretch value of 2.0 will make audio play at half the original speed.                     |
| formantRatio | audio | `1`           | An audio parameter specifying the formant envelope multiplier. If the formantRatio is equal to the pitchRatio, formant-preserving pitch shifting will be performed. |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.time.stretch",
  "config": {},
  "params": {
    "pitchRatio": [],
    "stretch": [],
    "formantRatio": []
  }
}
```

### Delay

> com.nativeformat.plugin.waa.delay

A plugin that controls delay time.

#### Params

| Name      | Type  | Initial Value | Description                                                        |
| --------- | ----- | ------------- | ------------------------------------------------------------------ |
| delayTime | audio | `0`           | An audio parameter controlling the current delay time on the node. |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.waa.delay",
  "config": {},
  "params": {
    "delayTime": []
  }
}
```

### Gain

> com.nativeformat.plugin.waa.gain

A plugin that manipulates the volume of an audio stream.

#### Params

| Name | Type  | Initial Value | Description                                                                  |
| ---- | ----- | ------------- | ---------------------------------------------------------------------------- |
| gain | audio | `1`           | An audio parameter specifying the amplitude multiplier for the input signal. |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.waa.gain",
  "config": {},
  "params": {
    "gain": []
  }
}
```

### Sine

> com.nativeformat.plugin.wave.sine

A plugin that generates sine wave signals.

#### Config

| Name      | Type   | Default Value | Description                                 |
| --------- | ------ | ------------- | ------------------------------------------- |
| frequency | number | `0`           | The frequency to generate the sine wave at. |
| when      | number | `0`           | When to start playing the wave.             |
| duration  | number | `0`           | The total duration of playback.             |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.wave.sine",
  "config": {
    "frequency": 1.234,
    "when": 1000,
    "duration": 1000
  },
  "params": {}
}
```

### Filter

> com.nativeformat.plugin.eq.filter

A filter that attenuates low and/or high frequencies

#### Config

| Name       | Type   | Default Value | Description                                                                                                                                                                    |
| ---------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| filterType | string | `"bandPass"`  | The type of filter to create. A lowPass filter attenuates frequencies above highCutoff. A highPass filter attenuates frequencies below lowCutoff. A bandPass filter does both. |

#### Params

| Name       | Type  | Initial Value | Description                                                                                                 |
| ---------- | ----- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| lowCutoff  | audio | `0`           | An audio parameter specifying the low cutoff frequency (Hz). Only used for high-pass and band-pass filters. |
| highCutoff | audio | `22050`       | An audio parameter specifying the high cutoff frequency (Hz). Only used for low-pass and band-pass filters. |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.eq.filter",
  "config": {
    "filterType": "a string"
  },
  "params": {
    "lowCutoff": [],
    "highCutoff": []
  }
}
```

### Compressor

> com.nativeformat.plugin.compressor.compressor

A plugin that performs dynamic range compression on an audio stream.

#### Config

| Name          | Type     | Default Value | Description                                                                                                                                                                                                                            |
| ------------- | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| detectionMode | string   | `"max"`       | The signal level detection algorithm to use. Possible values are 'max' and 'rms' (root mean square). This configuration is case-sensitive. Any specified configuration not matching 'max' or 'rms' will be automatically set to 'max'. |
| kneeMode      | string   | `"hard"`      | The shape of the knee in the compression function. Possible values are hard and soft. This configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will be automatically set to 'hard'.             |
| cutoffs       | number[] | `[]`          | A list of cutoff frequencies in Hz for multiband compression. If the list is empty, no band splitting will be performed.                                                                                                               |

#### Params

| Name        | Type  | Initial Value | Description                                                                                                                                |
| ----------- | ----- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| thresholdDb | audio | `-24`         | An audio parameter specifying the threshold (in dB) at which compression will start.                                                       |
| kneeDb      | audio | `30`          | An audio parameter specifying the range (in dB) above the threshold at which point the compression curve transitions to the ratio portion. |
| ratioDb     | audio | `12`          | An audio parameter specifying the amount of dB change from input to 1 dB of output.                                                        |
| attack      | audio | `0.0003`      | An audio parameter specifying the amount time till the compressor starts reducing the gain.                                                |
| release     | audio | `0.25`        | An audio parameter specifying the amount time till the compressor starts increasing the gain.                                              |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.compressor.compressor",
  "config": {
    "detectionMode": "a string",
    "kneeMode": "a string",
    "cutoffs": [1.234, 2.42, 3.14]
  },
  "params": {
    "thresholdDb": [],
    "kneeDb": [],
    "ratioDb": [],
    "attack": [],
    "release": []
  }
}
```

### Expander

> com.nativeformat.plugin.compressor.expander

A plugin that performs dynamic range expansion on an audio stream.

#### Config

| Name          | Type     | Default Value | Description                                                                                                                                                                                                                            |
| ------------- | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| detectionMode | string   | `"max"`       | The signal level detection algorithm to use. Possible values are 'max' and 'rms' (root mean square). This configuration is case-sensitive. Any specified configuration not matching 'max' or 'rms' will be automatically set to 'max'. |
| kneeMode      | string   | `"hard"`      | The shape of the knee in the expansion function. Possible values are hard and soft. This configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will be automatically set to 'hard'.               |
| cutoffs       | number[] | `[]`          | A list of cutoff frequencies in Hz for multiband expansion. If the list is empty, no band splitting will be performed.                                                                                                                 |

#### Params

| Name        | Type  | Initial Value | Description                                                                                                                              |
| ----------- | ----- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| thresholdDb | audio | `-24`         | An audio parameter specifying the threshold (in dB) at which expansion will start.                                                       |
| kneeDb      | audio | `30`          | An audio parameter specifying the range (in dB) above the threshold at which point the expansion curve transitions to the ratio portion. |
| ratioDb     | audio | `12`          | An audio parameter specifying the amount of dB change from input to 1 dB of output.                                                      |
| attack      | audio | `0.0003`      | An audio parameter specifying the amount time till the expander starts reducing the gain.                                                |
| release     | audio | `0.25`        | An audio parameter specifying the amount time till the expander starts increasing the gain.                                              |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.compressor.expander",
  "config": {
    "detectionMode": "a string",
    "kneeMode": "a string",
    "cutoffs": [1.234, 2.42, 3.14]
  },
  "params": {
    "thresholdDb": [],
    "kneeDb": [],
    "ratioDb": [],
    "attack": [],
    "release": []
  }
}
```

### Compander

> com.nativeformat.plugin.compressor.compander

A plugin that performs dynamic range compansion (compression + expansion) on an audio stream.

#### Config

| Name          | Type     | Default Value | Description                                                                                                                                                                                                                            |
| ------------- | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| detectionMode | string   | `"max"`       | The signal level detection algorithm to use. Possible values are 'max' and 'rms' (root mean square). This configuration is case-sensitive. Any specified configuration not matching 'max' or 'rms' will be automatically set to 'max'. |
| kneeMode      | string   | `"hard"`      | The shape of the knee in the compression function. Possible values are hard and soft. This configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will be automatically set to 'hard'.             |
| cutoffs       | number[] | `[]`          | A list of cutoff frequencies in Hz for multiband compression. If the list is empty, no band splitting will be performed.                                                                                                               |

#### Params

| Name                  | Type  | Initial Value | Description                                                                                                                                |
| --------------------- | ----- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| compressorThresholdDb | audio | `-24`         | An audio parameter specifying the threshold (in dB) at which compression will start.                                                       |
| compressorKneeDb      | audio | `30`          | An audio parameter specifying the range (in dB) above the threshold at which point the compression curve transitions to the ratio portion. |
| compressorRatioDb     | audio | `12`          | An audio parameter specifying the amount of dB change from input to 1 dB of output in the compressor.                                      |
| expanderThresholdDb   | audio | `-24`         | An audio parameter specifying the threshold (in dB) at which expansion will start.                                                         |
| expanderKneeDb        | audio | `30`          | An audio parameter specifying the range (in dB) above the threshold at which point the expansion curve transitions to the ratio portion.   |
| expanderRatioDb       | audio | `12`          | An audio parameter specifying the amount of dB change from input to 1 dB of output in the expander.                                        |
| attack                | audio | `0.0003`      | An audio parameter specifying the amount time till the compander starts reducing the gain.                                                 |
| release               | audio | `0.25`        | An audio parameter specifying the amount time till the compander starts increasing the gain.                                               |

```json
{
  "id": "f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5",
  "kind": "com.nativeformat.plugin.compressor.compander",
  "config": {
    "detectionMode": "a string",
    "kneeMode": "a string",
    "cutoffs": [1.234, 2.42, 3.14]
  },
  "params": {
    "compressorThresholdDb": [],
    "compressorKneeDb": [],
    "compressorRatioDb": [],
    "expanderThresholdDb": [],
    "expanderKneeDb": [],
    "expanderRatioDb": [],
    "attack": [],
    "release": []
  }
}
```

## Param Kinds

### Audio

A float value that can change over time.

#### Commands

##### SetValueAtTime

Sets the value of this param at the given start time.

###### Arguments

| Name      | Type   | Default Value | Description                       |
| --------- | ------ | ------------- | --------------------------------- |
| value     | number | -             | The desired value.                |
| startTime | number | -             | The time the value should be set. |

```json
{
  "name": "setValueAtTime",
  "args": {
    "value": 1.234,
    "startTime": 1000
  }
}
```

##### LinearRampToValueAtTime

Linearly interpolates the param from its current value to the give value at the given time.

###### Arguments

| Name    | Type   | Default Value | Description                                               |
| ------- | ------ | ------------- | --------------------------------------------------------- |
| value   | number | -             | The desired value.                                        |
| endTime | number | -             | The time at which this param should have the given value. |

```json
{
  "name": "linearRampToValueAtTime",
  "args": {
    "value": 1.234,
    "endTime": 1000
  }
}
```

##### ExponentialRampToValueAtTime

Exponentially interpolates the param from its current value to the give value at the given time.

###### Arguments

| Name    | Type   | Default Value | Description                                               |
| ------- | ------ | ------------- | --------------------------------------------------------- |
| value   | number | -             | The desired value.                                        |
| endTime | number | -             | The time at which this param should have the given value. |

```json
{
  "name": "exponentialRampToValueAtTime",
  "args": {
    "value": 1.234,
    "endTime": 1000
  }
}
```

##### SetTargetAtTime

Specifies a target to reach starting at a given time and gives a constant with which to guide the curve along.

###### Arguments

| Name         | Type   | Default Value | Description                    |
| ------------ | ------ | ------------- | ------------------------------ |
| target       | number | -             | The target value to reach.     |
| startTime    | number | -             | The starting time.             |
| timeConstant | number | -             | A constant to guide the curve. |

```json
{
  "name": "setTargetAtTime",
  "args": {
    "target": 1.234,
    "startTime": 1000,
    "timeConstant": 1.234
  }
}
```

##### SetValueCurveAtTime

Specifies a curve to render based on the given float values.

###### Arguments

| Name      | Type     | Default Value | Description                |
| --------- | -------- | ------------- | -------------------------- |
| values    | number[] | -             | The curve values.          |
| startTime | number   | -             | The starting time.         |
| duration  | number   | -             | The duration of the curve. |

```json
{
  "name": "setValueCurveAtTime",
  "args": {
    "values": [1.234, 2.42, 3.14],
    "startTime": 1000,
    "duration": 1000
  }
}
```
