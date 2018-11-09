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

from .score import Edge, LoadingPolicy, Node
from uuid import uuid4


class TypedNode:
    def __init__(self, kind, id=None, loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH):
        self.id = id or str(uuid4())
        self.kind = kind
        self.loading_policy = loading_policy

    def config(self):
        return {}

    def params(self):
        return {}

    def inputs(self):
        return {}
    
    def outputs(self):
        return {}
    
    def validate(self):
        pass

    def to_node(self):
        self.validate()
        return Node(self.kind, self.config(), self.params(), self.id, self.loading_policy)

    def connect(self, target):
        """Creates an Edge with this Node's id set as the source and the given Node's id set as the edge target"""
        
        if not self.outputs():
            raise Exception('')

        if not target.inputs():
            raise Exception('')
    
        if self.id == target.id:
            raise Exception('Cannot connect a node to itself')

        return Edge(self.id, target.id)
