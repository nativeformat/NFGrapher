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

def assert_kind(value, kind, kind_name, property_name=None):
    if not isinstance(value, kind):
        raise Exception('expected {} to be a {} kind'.format(property_name or 'value', kind_name))


def assert_list_kind(value, kind, kind_name, property_name=None):
    kind_name = 'list({})'.format(kind_name)
    assert_kind(value, list, kind_name, property_name)
    for v in value:
        assert_kind(v, kind, kind_name, property_name)


def assert_string(value, property_name=None):
    assert_kind(value, str, 'string', property_name)


def assert_int(value, property_name=None):
    assert_kind(value, int, 'int', property_name)


def assert_float(value, property_name=None):
    assert_kind(value, float, 'float', property_name)


def assert_bool(value, property_name=None):
    assert_kind(value, bool, 'bool', property_name)


def assert_time(value, property_name=None):
    assert_kind(value, float, 'time', property_name)


def assert_list_string(value, property_name=None):
    assert_list_kind(value, str, 'string', property_name)


def assert_list_int(value, property_name=None):
    assert_list_kind(value, int, 'int', property_name)


def assert_list_float(value, property_name=None):
    assert_list_kind(value, float, 'float', property_name)


def assert_list_bool(value, property_name=None):
    assert_list_kind(value, bool, 'bool', property_name)


def assert_list_time(value, property_name=None):
    assert_list_kind(value, float, 'time', property_name)
