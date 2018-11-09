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

import setuptools
from nf_grapher import VERSION

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="nf_grapher",
    version=VERSION,
    author="The Native Format Team",
    description="A library for building Native Format Scores.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://ghe.spotify.net/NativeFormat/nf-grapher",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "Operating System :: OS Independent",
    ],
    install_requires=['marshmallow==3.0.0b11'],
    python_requires=">=3.3",
)

