# -*- coding: utf-8 -*-
"""
    reST Previewer wsgi tests
    ~~~~~~~~~~~~~~~~~~~~~~~~~

    Tests application script of reST Previewer.

    :copyright: (c) 2011 lanius
    :license: MIT, see LICENSE for more details.
"""

import os
import sys
import unittest

script_path = os.path.abspath(os.path.dirname(__file__))
project_home = os.path.join(script_path, '..')
sys.path.append(project_home)

try:
    import restpreviewer.wsgi
except ImportError:
    sys.exit('restpreviewer cannot be imported.\
please check project_home in wsgi_test.py.')

class WsgiTestCase(unittest.TestCase):

    def setUp(self):
        restpreviewer.wsgi.app.config['TESTING'] = True
        self.app = restpreviewer.wsgi.app.test_client()

    def tearDown(self):
        pass

    def test_rst(self):
        rv = self.app.post('/rst', data="title\n=====")
        assert '<h1 class="title">title</h1>' in rv.data
        
if __name__ == "__main__":
    unittest.main()
    
