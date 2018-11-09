#
#  Copyright 2018 Spotify AB.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing,
#  software distributed under the License is distributed on an
#  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
#  specific language governing permissions and limitations
#  under the License.

# Generated

from .score import Command, LoadingPolicy, ContentType
from .typedNode import TypedNode
from . import util


class AudioParam:
    """A float value that can change over time."""

    def __init__(self, initial_value, commands=None):
        self.initial_value = initial_value
        self.commands = commands or []

    def set_value_at_time(self, value, start_time):
        """
        Sets the value of this param at the given start time.

        Args:
            value: The desired value.
            start_time: The time the value should be set.
        """
        util.assert_float(value, 'value')
        util.assert_time(start_time, 'startTime')
        self.commands.append(
            Command('setValueAtTime', {
                'value': value,
                'startTime': start_time
            }))

    def linear_ramp_to_value_at_time(self, value, end_time):
        """
        Linearly interpolates the param from its current value to the give value at the given time.

        Args:
            value: The desired value.
            end_time: The time at which this param should have the given value.
        """
        util.assert_float(value, 'value')
        util.assert_time(end_time, 'endTime')
        self.commands.append(
            Command('linearRampToValueAtTime', {
                'value': value,
                'endTime': end_time
            }))

    def exponential_ramp_to_value_at_time(self, value, end_time):
        """
        Exponentially interpolates the param from its current value to the give value at the given time.

        Args:
            value: The desired value.
            end_time: The time at which this param should have the given value.
        """
        util.assert_float(value, 'value')
        util.assert_time(end_time, 'endTime')
        self.commands.append(
            Command('exponentialRampToValueAtTime', {
                'value': value,
                'endTime': end_time
            }))

    def set_target_at_time(self, target, start_time, time_constant):
        """
        Specifies a target to reach starting at a given time and gives a constant with which to guide the curve along.

        Args:
            target: The target value to reach.
            start_time: The starting time.
            time_constant: A constant to guide the curve.
        """
        util.assert_float(target, 'target')
        util.assert_time(start_time, 'startTime')
        util.assert_float(time_constant, 'timeConstant')
        self.commands.append(
            Command(
                'setTargetAtTime', {
                    'target': target,
                    'startTime': start_time,
                    'timeConstant': time_constant
                }))

    def set_value_curve_at_time(self, values, start_time, duration):
        """
        Specifies a curve to render based on the given float values.

        Args:
            values: The curve values.
            start_time: The starting time.
            duration: The duration of the curve.
        """
        util.assert_list_float(values, 'values')
        util.assert_time(start_time, 'startTime')
        util.assert_time(duration, 'duration')
        self.commands.append(
            Command('setValueCurveAtTime', {
                'values': values,
                'startTime': start_time,
                'duration': duration
            }))


class Eq3bandNode(TypedNode):
    """A 3-band EQ consisting of a low shelf, a mid-range peaking filter, and high shelf. The gain and cutoff or center frequency of each section are controlled by audio parameters."""

    PLUGIN_KIND = 'com.nativeformat.plugin.eq.eq3band'

    def __init__(self,
                 low_cutoff=None,
                 mid_frequency=None,
                 high_cutoff=None,
                 low_gain=None,
                 mid_gain=None,
                 high_gain=None,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            low_cutoff: An audio parameter specifying the cutoff frequency (Hz) for the low shelf filter, below which the lowGain will be applied.
            mid_frequency: An audio parameter specifying the center frequency (Hz) of the peq filter, at which midGain will be applied.
            high_cutoff: An audio parameter specifying the cutoff frequency for the high shelf filter, above which the highGain will be applied.
            low_gain: An audio parameter specifying the gain (dB) for the low shelf.
            mid_gain: An audio parameter specifying the gain (dB) for the mid range filter.
            high_gain: An audio parameter specifying the gain (dB) for the high shelf.
        """

        super().__init__(Eq3bandNode.PLUGIN_KIND, id, loading_policy)
        self.low_cutoff = low_cutoff or AudioParam(264)
        self.mid_frequency = mid_frequency or AudioParam(1000)
        self.high_cutoff = high_cutoff or AudioParam(3300)
        self.low_gain = low_gain or AudioParam(0)
        self.mid_gain = mid_gain or AudioParam(0)
        self.high_gain = high_gain or AudioParam(0)

    def config(self):
        return {}

    def params(self):
        return {
            'lowCutoff': self.low_cutoff.commands,
            'midFrequency': self.mid_frequency.commands,
            'highCutoff': self.high_cutoff.commands,
            'lowGain': self.low_gain.commands,
            'midGain': self.mid_gain.commands,
            'highGain': self.high_gain.commands
        }

    def inputs(self):
        return {'audio': ContentType.AUDIO}

    def outputs(self):
        return {'audio': ContentType.AUDIO}


class FileNode(TypedNode):
    """A plugin that plays different types of media files."""

    PLUGIN_KIND = 'com.nativeformat.plugin.file.file'

    def __init__(self,
                 file,
                 when=0,
                 duration=0,
                 offset=0,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            file: Tells the plugin where to pull the file from, it supports both local files and HTTP based files.<br>Possible string formats:</br><br>- File: `<absolute-path-to-file>`</br><br>- Streamable Audio: `<HTTP(s)-URL>`</br><br>- Spotify Track: `spotify:track:<uri>`</br><br>- MIDI File: `midi:<absolute-path-to-midi-file>:soundfont:<absolute-path-to-soundfont-file>`
            when: Tells the plugin when to start playing the file.
            duration: Tells the plugin how long to play the file for.
            offset: Tells the plugin where within the track playback should begin.
        """

        super().__init__(FileNode.PLUGIN_KIND, id, loading_policy)

        self.file = file
        self.when = when
        self.duration = duration
        self.offset = offset

    def config(self):
        return {
            'file': self.file,
            'when': self.when,
            'duration': self.duration,
            'offset': self.offset
        }

    def params(self):
        return {}

    def inputs(self):
        return {}

    def outputs(self):
        return {'audio': ContentType.AUDIO}

    def validate(self):
        util.assert_string(self.file, 'file')
        util.assert_time(self.when, 'when')
        util.assert_time(self.duration, 'duration')
        util.assert_time(self.offset, 'offset')


class NoiseNode(TypedNode):
    """A plugin that outputs noise."""

    PLUGIN_KIND = 'com.nativeformat.plugin.noise.noise'

    def __init__(self,
                 when=0,
                 duration=0,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            when: Tells the plugin when to start producing noise.
            duration: Tells the plugin for how long to produce noise.
        """

        super().__init__(NoiseNode.PLUGIN_KIND, id, loading_policy)

        self.when = when
        self.duration = duration

    def config(self):
        return {'when': self.when, 'duration': self.duration}

    def params(self):
        return {}

    def inputs(self):
        return {}

    def outputs(self):
        return {'audio': ContentType.AUDIO}

    def validate(self):
        util.assert_time(self.when, 'when')
        util.assert_time(self.duration, 'duration')


class SilenceNode(TypedNode):
    """A plugin that outputs silence."""

    PLUGIN_KIND = 'com.nativeformat.plugin.noise.silence'

    def __init__(self,
                 when=0,
                 duration=0,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            when: Tells the plugin when to start producing silence.
            duration: Tells the plugin for how long to produce silence.
        """

        super().__init__(SilenceNode.PLUGIN_KIND, id, loading_policy)

        self.when = when
        self.duration = duration

    def config(self):
        return {'when': self.when, 'duration': self.duration}

    def params(self):
        return {}

    def inputs(self):
        return {}

    def outputs(self):
        return {'audio': ContentType.AUDIO}

    def validate(self):
        util.assert_time(self.when, 'when')
        util.assert_time(self.duration, 'duration')


class LoopNode(TypedNode):
    """A plugin that loops an audio stream."""

    PLUGIN_KIND = 'com.nativeformat.plugin.time.loop'

    def __init__(self,
                 when,
                 duration,
                 loop_count=-1,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            when: Describes when the plugin should begin looping.
            duration: Describes the duration of the loop.
            loop_count: Describes the total number of loops. -1 loops infinitely.
        """

        super().__init__(LoopNode.PLUGIN_KIND, id, loading_policy)

        self.when = when
        self.duration = duration
        self.loop_count = loop_count

    def config(self):
        return {
            'when': self.when,
            'duration': self.duration,
            'loopCount': self.loop_count
        }

    def params(self):
        return {}

    def inputs(self):
        return {'audio': ContentType.AUDIO}

    def outputs(self):
        return {'audio': ContentType.AUDIO}

    def validate(self):
        util.assert_time(self.when, 'when')
        util.assert_time(self.duration, 'duration')
        util.assert_int(self.loop_count, 'loopCount')


class StretchNode(TypedNode):
    """A plugin that can independently stretch time and shift the pitch of an audio stream."""

    PLUGIN_KIND = 'com.nativeformat.plugin.time.stretch'

    def __init__(self,
                 pitch_ratio=None,
                 stretch=None,
                 formant_ratio=None,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            pitch_ratio: An audio parameter specifying the pitch multiplier. For example, a pitchRatio value of 2.0 will double the original audio frequencies. 
            stretch: An audio parameter specifying the time stretch multiplier. For example, a stretch value of 2.0 will make audio play at half the original speed.
            formant_ratio: An audio parameter specifying the formant envelope multiplier. If the formantRatio is equal to the pitchRatio, formant-preserving pitch shifting will be performed.
        """

        super().__init__(StretchNode.PLUGIN_KIND, id, loading_policy)
        self.pitch_ratio = pitch_ratio or AudioParam(1)
        self.stretch = stretch or AudioParam(1)
        self.formant_ratio = formant_ratio or AudioParam(1)

    def config(self):
        return {}

    def params(self):
        return {
            'pitchRatio': self.pitch_ratio.commands,
            'stretch': self.stretch.commands,
            'formantRatio': self.formant_ratio.commands
        }

    def inputs(self):
        return {'audio': ContentType.AUDIO}

    def outputs(self):
        return {'audio': ContentType.AUDIO}


class DelayNode(TypedNode):
    """A plugin that controls delay time."""

    PLUGIN_KIND = 'com.nativeformat.plugin.waa.delay'

    def __init__(self,
                 delay_time=None,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            delay_time: An audio parameter controlling the current delay time on the node.
        """

        super().__init__(DelayNode.PLUGIN_KIND, id, loading_policy)
        self.delay_time = delay_time or AudioParam(0)

    def config(self):
        return {}

    def params(self):
        return {'delayTime': self.delay_time.commands}

    def inputs(self):
        return {'audio': ContentType.AUDIO}

    def outputs(self):
        return {'audio': ContentType.AUDIO}


class GainNode(TypedNode):
    """A plugin that manipulates the volume of an audio stream."""

    PLUGIN_KIND = 'com.nativeformat.plugin.waa.gain'

    def __init__(self,
                 gain=None,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            gain: An audio parameter specifying the amplitude multiplier for the input signal.
        """

        super().__init__(GainNode.PLUGIN_KIND, id, loading_policy)
        self.gain = gain or AudioParam(1)

    def config(self):
        return {}

    def params(self):
        return {'gain': self.gain.commands}

    def inputs(self):
        return {'audio': ContentType.AUDIO}

    def outputs(self):
        return {'audio': ContentType.AUDIO}


class SineNode(TypedNode):
    """A plugin that generates sine wave signals."""

    PLUGIN_KIND = 'com.nativeformat.plugin.wave.sine'

    def __init__(self,
                 frequency=0,
                 when=0,
                 duration=0,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            frequency: The frequency to generate the sine wave at.
            when: When to start playing the wave.
            duration: The total duration of playback.
        """

        super().__init__(SineNode.PLUGIN_KIND, id, loading_policy)

        self.frequency = frequency
        self.when = when
        self.duration = duration

    def config(self):
        return {
            'frequency': self.frequency,
            'when': self.when,
            'duration': self.duration
        }

    def params(self):
        return {}

    def inputs(self):
        return {}

    def outputs(self):
        return {'audio': ContentType.AUDIO}

    def validate(self):
        util.assert_float(self.frequency, 'frequency')
        util.assert_time(self.when, 'when')
        util.assert_time(self.duration, 'duration')


class FilterNode(TypedNode):
    """A filter that attenuates low and/or high frequencies"""

    class FilterType:
        LOW_PASS = 'lowPass'
        HIGH_PASS = 'highPass'
        BAND_PASS = 'bandPass'

    PLUGIN_KIND = 'com.nativeformat.plugin.eq.filter'

    def __init__(self,
                 filter_type=FilterType.BAND_PASS,
                 low_cutoff=None,
                 high_cutoff=None,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            filter_type: The type of filter to create. A lowPass filter attenuates frequencies above highCutoff. A highPass filter attenuates frequencies below lowCutoff. A bandPass filter does both.
            low_cutoff: An audio parameter specifying the low cutoff frequency (Hz). Only used for high-pass and band-pass filters.
            high_cutoff: An audio parameter specifying the high cutoff frequency (Hz). Only used for low-pass and band-pass filters.
        """

        super().__init__(FilterNode.PLUGIN_KIND, id, loading_policy)
        self.low_cutoff = low_cutoff or AudioParam(0)
        self.high_cutoff = high_cutoff or AudioParam(22050)
        self.filter_type = filter_type

    def config(self):
        return {'filterType': self.filter_type}

    def params(self):
        return {
            'lowCutoff': self.low_cutoff.commands,
            'highCutoff': self.high_cutoff.commands
        }

    def inputs(self):
        return {'audio': ContentType.AUDIO}

    def outputs(self):
        return {'audio': ContentType.AUDIO}

    def validate(self):
        util.assert_string(self.filter_type, 'filterType')


class CompressorNode(TypedNode):
    """A plugin that performs dynamic range compression on an audio stream."""

    class DetectionMode:
        MAX = 'max'
        RMS = 'rms'

    class KneeMode:
        HARD = 'hard'
        SOFT = 'soft'

    PLUGIN_KIND = 'com.nativeformat.plugin.compressor.compressor'

    def __init__(self,
                 detection_mode=DetectionMode.MAX,
                 knee_mode=KneeMode.HARD,
                 cutoffs=[],
                 threshold_db=None,
                 knee_db=None,
                 ratio_db=None,
                 attack=None,
                 release=None,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            detection_mode: The signal level detection algorithm to use. Possible values are 'max' and 'rms' (root mean square). This configuration is case-sensitive. Any specified configuration not matching 'max' or 'rms' will be automatically set to 'max'.
            knee_mode: The shape of the knee in the compression function. Possible values are hard and soft. This configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will be automatically set to 'hard'.
            cutoffs: A list of cutoff frequencies in Hz for multiband compression. If the list is empty, no band splitting will be performed.
            threshold_db: An audio parameter specifying the threshold (in dB) at which compression will start.
            knee_db: An audio parameter specifying the range (in dB) above the threshold at which point the compression curve transitions to the ratio portion.
            ratio_db: An audio parameter specifying the amount of dB change from input to 1 dB of output.
            attack: An audio parameter specifying the amount time till the compressor starts reducing the gain.
            release: An audio parameter specifying the amount time till the compressor starts increasing the gain.
        """

        super().__init__(CompressorNode.PLUGIN_KIND, id, loading_policy)
        self.threshold_db = threshold_db or AudioParam(-24)
        self.knee_db = knee_db or AudioParam(30)
        self.ratio_db = ratio_db or AudioParam(12)
        self.attack = attack or AudioParam(0.0003)
        self.release = release or AudioParam(0.25)
        self.detection_mode = detection_mode
        self.knee_mode = knee_mode
        self.cutoffs = cutoffs

    def config(self):
        return {
            'detectionMode': self.detection_mode,
            'kneeMode': self.knee_mode,
            'cutoffs': self.cutoffs
        }

    def params(self):
        return {
            'thresholdDb': self.threshold_db.commands,
            'kneeDb': self.knee_db.commands,
            'ratioDb': self.ratio_db.commands,
            'attack': self.attack.commands,
            'release': self.release.commands
        }

    def inputs(self):
        return {'audio': ContentType.AUDIO, 'sidechain': ContentType.AUDIO}

    def outputs(self):
        return {'audio': ContentType.AUDIO}

    def validate(self):
        util.assert_string(self.detection_mode, 'detectionMode')
        util.assert_string(self.knee_mode, 'kneeMode')
        util.assert_list_float(self.cutoffs, 'cutoffs')


class ExpanderNode(TypedNode):
    """A plugin that performs dynamic range expansion on an audio stream."""

    class DetectionMode:
        MAX = 'max'
        RMS = 'rms'

    class KneeMode:
        HARD = 'hard'
        SOFT = 'soft'

    PLUGIN_KIND = 'com.nativeformat.plugin.compressor.expander'

    def __init__(self,
                 detection_mode=DetectionMode.MAX,
                 knee_mode=KneeMode.HARD,
                 cutoffs=[],
                 threshold_db=None,
                 knee_db=None,
                 ratio_db=None,
                 attack=None,
                 release=None,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            detection_mode: The signal level detection algorithm to use. Possible values are 'max' and 'rms' (root mean square). This configuration is case-sensitive. Any specified configuration not matching 'max' or 'rms' will be automatically set to 'max'.
            knee_mode: The shape of the knee in the expansion function. Possible values are hard and soft. This configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will be automatically set to 'hard'.
            cutoffs: A list of cutoff frequencies in Hz for multiband expansion. If the list is empty, no band splitting will be performed.
            threshold_db: An audio parameter specifying the threshold (in dB) at which expansion will start.
            knee_db: An audio parameter specifying the range (in dB) above the threshold at which point the expansion curve transitions to the ratio portion.
            ratio_db: An audio parameter specifying the amount of dB change from input to 1 dB of output.
            attack: An audio parameter specifying the amount time till the expander starts reducing the gain.
            release: An audio parameter specifying the amount time till the expander starts increasing the gain.
        """

        super().__init__(ExpanderNode.PLUGIN_KIND, id, loading_policy)
        self.threshold_db = threshold_db or AudioParam(-24)
        self.knee_db = knee_db or AudioParam(30)
        self.ratio_db = ratio_db or AudioParam(12)
        self.attack = attack or AudioParam(0.0003)
        self.release = release or AudioParam(0.25)
        self.detection_mode = detection_mode
        self.knee_mode = knee_mode
        self.cutoffs = cutoffs

    def config(self):
        return {
            'detectionMode': self.detection_mode,
            'kneeMode': self.knee_mode,
            'cutoffs': self.cutoffs
        }

    def params(self):
        return {
            'thresholdDb': self.threshold_db.commands,
            'kneeDb': self.knee_db.commands,
            'ratioDb': self.ratio_db.commands,
            'attack': self.attack.commands,
            'release': self.release.commands
        }

    def inputs(self):
        return {'audio': ContentType.AUDIO, 'sidechain': ContentType.AUDIO}

    def outputs(self):
        return {'audio': ContentType.AUDIO}

    def validate(self):
        util.assert_string(self.detection_mode, 'detectionMode')
        util.assert_string(self.knee_mode, 'kneeMode')
        util.assert_list_float(self.cutoffs, 'cutoffs')


class CompanderNode(TypedNode):
    """A plugin that performs dynamic range compansion (compression + expansion) on an audio stream."""

    class DetectionMode:
        MAX = 'max'
        RMS = 'rms'

    class KneeMode:
        HARD = 'hard'
        SOFT = 'soft'

    PLUGIN_KIND = 'com.nativeformat.plugin.compressor.compander'

    def __init__(self,
                 detection_mode=DetectionMode.MAX,
                 knee_mode=KneeMode.HARD,
                 cutoffs=[],
                 compressor_threshold_db=None,
                 compressor_knee_db=None,
                 compressor_ratio_db=None,
                 expander_threshold_db=None,
                 expander_knee_db=None,
                 expander_ratio_db=None,
                 attack=None,
                 release=None,
                 id=None,
                 loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        """
        Args:
            detection_mode: The signal level detection algorithm to use. Possible values are 'max' and 'rms' (root mean square). This configuration is case-sensitive. Any specified configuration not matching 'max' or 'rms' will be automatically set to 'max'.
            knee_mode: The shape of the knee in the compression function. Possible values are hard and soft. This configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will be automatically set to 'hard'.
            cutoffs: A list of cutoff frequencies in Hz for multiband compression. If the list is empty, no band splitting will be performed.
            compressor_threshold_db: An audio parameter specifying the threshold (in dB) at which compression will start.
            compressor_knee_db: An audio parameter specifying the range (in dB) above the threshold at which point the compression curve transitions to the ratio portion.
            compressor_ratio_db: An audio parameter specifying the amount of dB change from input to 1 dB of output in the compressor.
            expander_threshold_db: An audio parameter specifying the threshold (in dB) at which expansion will start.
            expander_knee_db: An audio parameter specifying the range (in dB) above the threshold at which point the expansion curve transitions to the ratio portion.
            expander_ratio_db: An audio parameter specifying the amount of dB change from input to 1 dB of output in the expander.
            attack: An audio parameter specifying the amount time till the compander starts reducing the gain.
            release: An audio parameter specifying the amount time till the compander starts increasing the gain.
        """

        super().__init__(CompanderNode.PLUGIN_KIND, id, loading_policy)
        self.compressor_threshold_db = compressor_threshold_db or AudioParam(
            -24)
        self.compressor_knee_db = compressor_knee_db or AudioParam(30)
        self.compressor_ratio_db = compressor_ratio_db or AudioParam(12)
        self.expander_threshold_db = expander_threshold_db or AudioParam(-24)
        self.expander_knee_db = expander_knee_db or AudioParam(30)
        self.expander_ratio_db = expander_ratio_db or AudioParam(12)
        self.attack = attack or AudioParam(0.0003)
        self.release = release or AudioParam(0.25)
        self.detection_mode = detection_mode
        self.knee_mode = knee_mode
        self.cutoffs = cutoffs

    def config(self):
        return {
            'detectionMode': self.detection_mode,
            'kneeMode': self.knee_mode,
            'cutoffs': self.cutoffs
        }

    def params(self):
        return {
            'compressorThresholdDb': self.compressor_threshold_db.commands,
            'compressorKneeDb': self.compressor_knee_db.commands,
            'compressorRatioDb': self.compressor_ratio_db.commands,
            'expanderThresholdDb': self.expander_threshold_db.commands,
            'expanderKneeDb': self.expander_knee_db.commands,
            'expanderRatioDb': self.expander_ratio_db.commands,
            'attack': self.attack.commands,
            'release': self.release.commands
        }

    def inputs(self):
        return {'audio': ContentType.AUDIO, 'sidechain': ContentType.AUDIO}

    def outputs(self):
        return {'audio': ContentType.AUDIO}

    def validate(self):
        util.assert_string(self.detection_mode, 'detectionMode')
        util.assert_string(self.knee_mode, 'kneeMode')
        util.assert_list_float(self.cutoffs, 'cutoffs')
