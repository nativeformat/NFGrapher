nf-grapher-cpp
==============

File Structure Overview
-----------------------

- [/cpp/include/](/cpp/include/): Mix of hand-written and generated Grapher headers. Generated files are marked with `/* Generated */`.
- [/cpp/source/](/cpp/include/): Hand-written Grapher library
- [/cpp/libraries](/cpp/libraries): Libraries required for building or linking
- [/cpp/test](/cpp/test): Tests written as individual executables (for now)

Building
--------

From the root of this repo:

- `git submodule update --init --recursive`
- `mkdir build-debug && cd build-debug`
- `cmake -GXcode ..`
- Then open Xcode, and build the NFGrapher or NFGrapherTest targets

Including as source into another project
----------------------------------------

- Add this repo as a submodule
- Remember to link against NFGrapher via cmake!


Tests
-----

TODO: add test instructions