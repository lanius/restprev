# -*- coding: utf-8 -*-
"""
    restpreviewer.ext_directive
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Docutils directives for blockdiag.

    :copyright: (c) 2011 lanius
    :license: MIT, see LICENSE for more details.
"""

from docutils import nodes
from docutils.parsers.rst import directives
from docutils.parsers.rst import Directive
from blockdiag_sphinxhelper import diagparser, builder, DiagramDraw

class BlockDiag(Directive):

    has_content = True

    def run(self):
        content = '\n'.join(self.content)
        draw = self.create(content, 'svg')
        draw.draw()
        svg = draw.save()
        raw = nodes.raw('', svg, format = 'html')
        return [raw]

    def create(self, code, format, filename=None,
               options={}, prefix='blockdiag'):
        draw = None
        fontpath = options.get('fontpath', '')
        try:
            tree = diagparser.parse(diagparser.tokenize(code))
            screen = builder.ScreenNodeBuilder.build(tree)
            antialias = True
            draw = DiagramDraw.DiagramDraw(format, screen, filename,
                                           font=fontpath, antialias=antialias)
        except Exception, e:
            raise Exception('blockdiag error:\n%s\n' % e)
        return draw


directives.register_directive('blockdiag', BlockDiag)
