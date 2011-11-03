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
from blockdiag import diagparser as blockdiagparser
from blockdiag import builder as blockdiagbuilder
from blockdiag import DiagramDraw as BlockDiagramDraw
from seqdiag import diagparser as seqdiagparser
from seqdiag import builder as seqdiagbuilder
from seqdiag import DiagramDraw as SeqDiagramDraw
from actdiag import diagparser as actdiagparser
from actdiag import builder as actdiagbuilder
from actdiag import DiagramDraw as ActDiagramDraw
from nwdiag import diagparser as nwdiagparser
from nwdiag import builder as nwdiagbuilder
from nwdiag import DiagramDraw as NwDiagramDraw


class BaseDiag(Directive):

    has_content = True

    def run(self):
        content = '\n'.join(self.content)

        if not content.strip():
            raise self.warning(
                'Ignoring "{0}" directive without content.'.format(self.name))

        draw = self.create(content, 'svg')
        draw.draw()
        svg = draw.save()
        raw = nodes.raw('', svg, format='html')
        return [raw]

    def create(self, code, format, filename=None, options={}):
        draw = None
        fontpath = options.get('fontpath', '')
        antialias = options.get('antialias', False)

        conponents = self.components()
        diagparser = conponents['diagparser']
        builder = conponents['builder']
        DiagramDraw = conponents['diagramdraw']
        try:
            tree = diagparser.parse(diagparser.tokenize(code))
            screen = builder.ScreenNodeBuilder.build(tree)
            draw = DiagramDraw.DiagramDraw(format, screen, filename,
                                           font=fontpath, antialias=antialias)
        except Exception, e:
            raise self.error('{0} error:\n{1}\n'.format(self.name, e))
        return draw


class BlockDiag(BaseDiag):

    def components(self):
        return {'diagparser': blockdiagparser,
                'builder': blockdiagbuilder,
                'diagramdraw': BlockDiagramDraw}


class SeqDiag(BaseDiag):

    def components(self):
        return {'diagparser': seqdiagparser,
                'builder': seqdiagbuilder,
                'diagramdraw': SeqDiagramDraw}


class ActDiag(BaseDiag):

    def components(self):
        return {'diagparser': actdiagparser,
                'builder': actdiagbuilder,
                'diagramdraw': ActDiagramDraw}


class NwDiag(BaseDiag):

    def components(self):
        return {'diagparser': nwdiagparser,
                'builder': nwdiagbuilder,
                'diagramdraw': NwDiagramDraw}


directives.register_directive('blockdiag', BlockDiag)
directives.register_directive('seqdiag', SeqDiag)
directives.register_directive('actdiag', ActDiag)
directives.register_directive('nwdiag', NwDiag)
