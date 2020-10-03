cmake_minimum_required(VERSION 3.5)

project(NFGrapher)

set(CMAKE_CXX_STANDARD 11)

set(
  CMAKE_CXX_FLAGS
  "${CMAKE_CXX_FLAGS} \
  -Wno-deprecated-declarations \
  -Wno-unused-local-typedefs")

if(LLVM_STDLIB)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} \
  -Wno-tautological-undefined-compare \
  -Wno-shorten-64-to-32 \
  -stdlib=libc++ \
  -std=c++11")
else()
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++11")
endif()

set(CMAKE_MODULE_PATH
  ${CMAKE_MODULE_PATH}
  ${CMAKE_CURRENT_SOURCE_DIR}/cmake-modules)

# Set CMAKE_BUILD_TYPE before calling project()
# Use existing cache string if present
if(DEFINED  CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE ${CMAKE_BUILD_TYPE} CACHE STRING
    "Choose the type of build: None, Debug, or Release"
    FORCE)
else()
  set(CMAKE_BUILD_TYPE Debug CACHE STRING
    "Choose the type of build: None, Debug, or Release"
    FORCE)
endif()

enable_testing(true)  # Enables unit-testing.

add_subdirectory(cpp)
