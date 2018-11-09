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

import unittest
import json
from nf_grapher.typed import FileNode, TypedNode, GainNode
from nf_grapher.score import Graph, LoadingPolicy, ContentType, Score
from nf_grapher.encoder import decode, encode
from marshmallow.exceptions import ValidationError


class TestScoreEncoding(unittest.TestCase):

    def setUp(self):
        self.score = Score(Graph(loading_policy=LoadingPolicy.ALL_CONTENT_PLAYTHROUGH))

    def test_encodes_loading_policy_in_camel(self):
        s = encode(self.score)
        j = json.loads(s)
        self.assertIn('loadingPolicy', j['graph'])
        self.assertNotIn('loading_policy', j['graph'])
        self.assertEqual(LoadingPolicy.ALL_CONTENT_PLAYTHROUGH, j['graph']['loadingPolicy'])

    def test_encode_fails_when_string_expected(self):
        file_node = FileNode(1234) # should be string
        self.score = Score(Graph(nodes=[file_node]))
        self.assertRaises(Exception, encode, self.score)

    def test_encode_fails_when_time_expected(self):
        file_node = FileNode('http://example.org', when=1234.4) # should be time
        self.score = Score(Graph(nodes=[file_node]))
        self.assertRaises(Exception, encode, self.score)


class TestScoreDecoding(unittest.TestCase):

    def test_decodes_loading_policy_in_camel(self):
        j = '''
        {
          "version": "0.5.0",
          "graph": {
            "id": "3f0461c7-70d5-4769-af93-776619cecafc",
            "loadingPolicy": "allContentPlaythrough",
            "nodes": [],
            "edges": [],
            "scripts": []
          }
        }    
        '''
        s = decode(j)
        self.assertEqual(LoadingPolicy.ALL_CONTENT_PLAYTHROUGH, s.graph.loading_policy)

    def test_fails_on_invalid_node(self):
        with open('../fixtures/invalid-node.json') as f:
            self.assertRaises(ValidationError, decode, f.read())

    def test_fails_on_invalid_score(self):
        with open('../fixtures/invalid-score.json') as f:
            self.assertRaises(ValidationError, decode, f.read())

    def test_can_read_kitchen_sink(self):
        with open('../fixtures/kitchen-sink.json') as f:
            s = decode(f.read())
            self.assertTrue(len(s.graph.nodes) > 0)


class TestNodeConnections(unittest.TestCase):

    def test_producer_to_producer_connection_fails(self):
        file_node = FileNode('1234')
        self.assertRaises(Exception, TypedNode.connect, file_node, file_node)

    def test_consumer_to_producer_connection_fails(self):
        file_node = FileNode('1234')
        gain_node = GainNode()
        self.assertRaises(Exception, TypedNode.connect, gain_node, file_node)

    def test_producer_to_consumer_connection_succeeds(self):
        file_node = FileNode('1234')
        gain_node = GainNode()
        
        try:
            file_node.connect(gain_node)
        except ExceptionType:
            self.fail("Connections a producer to a consumer should succeed!")

if __name__ == '__main__':
    unittest.main()
