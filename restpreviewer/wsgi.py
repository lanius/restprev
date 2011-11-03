# -*- coding: utf-8 -*-
"""
    restpreviewer.wsgi
    ~~~~~~~~~~~~~~~~~~

    reST Previewer is preview tool for reStructuredText.

    :copyright: (c) 2011 lanius
    :license: MIT, see LICENSE for more details.
"""

from optparse import OptionParser
from docutils.core import publish_string
from flask import Flask, request, render_template, abort
import ext_directive

MAX_RST_LENGTH = 50000

app = Flask(__name__)

app.debug = False


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/rst', methods=['GET', 'POST'])
def rst():
    if request.method == 'POST':
        rst_data = request.data
        if len(rst_data) > MAX_RST_LENGTH:
            return "Sorry! Text data is too large. \
If necessary, you should consider that \
you install reST Previewer on local system."
        return publish_string(rst_data, writer_name="html4css1")
    else:
        abort(405)


if __name__ == '__main__':
    parser = OptionParser(add_help_option=False)
    parser.add_option('-h', '--host', action='store', dest='host')
    parser.add_option('-p', '--port', action='store', dest='port', type="int")
    (options, args) = parser.parse_args()

    host = options.host if options.host else '127.0.0.1'
    port = options.port if options.port else 8080
    app.run(host=host, port=port)

application = app
