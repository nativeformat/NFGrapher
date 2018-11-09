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

from uuid import uuid4
from . import VERSION
from marshmallow import Schema, fields, post_load, pre_dump


class LoadingPolicy:
    SOME_CONTENT_PLAYTHROUGH = "someContentPlaythrough"
    ALL_CONTENT_PLAYTHROUGH = "allContentPlaythrough"


class ContentType:
    AUDIO = "com.nativeformate.content.audio"

class Script:
    def __init__(self, name, code):
        self.name = name
        self.code = code


class ScriptSchema(Schema):
    name = fields.String(required=True)
    code = fields.String(required=True)

    @post_load
    def make_script(self, data):
        return Script(**data)


class Edge:
    def __init__(self, source, target, source_port=None, target_port=None, id=None):
        self.id = id or str(uuid4())
        self.source = source
        self.target = target
        self.source_port = source_port
        self.target_port = target_port

class EdgeSchema(Schema):
    id = fields.String(required=True)
    source = fields.String(required=True)
    target = fields.String(required=True)
    source_port = fields.String(data_key='sourcePort')
    target_port = fields.String(data_key='targetPort')
    
    @post_load
    def make_edge(self, data):
        return Edge(**data)


class Command:
    def __init__(self, name, args):
        self.name = name
        self.args = args


class CommandSchema(Schema):
    name = fields.String(required=True)
    args = fields.Dict()

    @post_load
    def make_command(self, data):
        return Command(**data)


class Node:
    def __init__(self, kind, config, params, id=None, loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        self.id = id or str(uuid4())
        self.kind = kind
        self.config = config
        self.params = params
        self.loading_policy = loading_policy

    def connect(self, target):
        """Creates an Edge with this Node's id set as the source and the given Node's id set as the edge target"""
        return Edge(self.id, target.id)


class NodeSchema(Schema):
    id = fields.String(required=True)
    kind = fields.String(required=True)
    config = fields.Dict()
    params = fields.Dict(values=fields.List(fields.Nested(CommandSchema)))
    loading_policy = fields.String(data_key='loadingPolicy')

    @post_load
    def make_node(self, data):
        return Node(**data)


class Graph:
    def __init__(self, nodes=None, edges=None, scripts=None, id=None, loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        self.id = id or str(uuid4())
        self.nodes = nodes or []
        self.edges = edges or []
        self.scripts = scripts or []
        self.loading_policy = loading_policy


class GraphSchema(Schema):
    id = fields.String(required=True)
    nodes = fields.List(fields.Nested(NodeSchema))
    edges = fields.List(fields.Nested(EdgeSchema))
    scripts = fields.List(fields.Nested(ScriptSchema))
    loading_policy = fields.String(data_key='loadingPolicy')

    @post_load
    def make_graph(self, data):
        return Graph(**data)

    @pre_dump
    def convert_typed_nodes(self, graph):
        def convert(n):
            if hasattr(n, 'to_node'):
                return n.to_node()
            return n

        nodes = list(map(convert, graph.nodes))
        graph.nodes = nodes


class Score:
    def __init__(self, graph, version=VERSION):
        self.graph = graph
        self.version = version


class ScoreSchema(Schema):
    graph = fields.Nested(GraphSchema, required=True)
    version = fields.String(required=True)

    @post_load
    def make_score(self, data):
        return Score(**data)
