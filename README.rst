==============
reST Previewer
==============

What is this?
=============
reST Previewer is preview tool for reStructuredText.

Installation
============

Local Machine
-------------
Download the source code::

    git clone git://github.com/lanius/restpreviewer.git
    cd restpreviewer

Install required libraries::

    cd restpreviewer/
    pip install -r requirements.txt

Run reST Previewer server::

    python wsgi.py

Host name and port number can be specified by arguments::

    python wsgi.py --host localhost --port 8080

Dotcloud
--------
Download the source code::

    git clone git://github.com/lanius/restpreviewer.git
    cd restpreviewer

Install dotcloud command and push reST Previewer::

    pip install dotcloud
    dotcloud
    dotcloud create restpreviewer
    dotcloud push restpreviewer .

