==============
reST Previewer
==============

What is this?
=============
reST Previewer is preview tool for reStructuredText.

Live Demo
=========

You can see reST Previewer running at http://restpreviewer.nirvake.org/.

Installation
============

Local Machine
-------------
Download the source code::

    git clone git://github.com/lanius/restpreviewer.git

Install required libraries::

    cd restpreviewer/restpreviewer/
    pip install -r requirements.txt

You may need to install  python-imaging::

    yum install python-imaging

Run reST Previewer server::

    python wsgi.py

Host name and port number can be specified by arguments::

    python wsgi.py --host localhost --port 8080
