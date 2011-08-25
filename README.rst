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
Download the source code and extract it::

     wget https://github.com/lanius/restpreviewer/tarball/master
     mv master restpreviewer.tar.gz
     tar zxvf restpreviewer.tar.gz
     cd lanius-restpreviewer-*

Install required libraries::

    cd restpreviewer/
    pip install -r requirements.txt

Run reST Previewer server::

    python wsgi.py

Host name and port number can be specified by arguments::

    python wsgi.py --host localhost --port 8080

Dotcloud
--------
Download the source code and extract it::

     wget https://github.com/lanius/restpreviewer/tarball/master
     mv master restpreviewer.tar.gz
     tar zxvf restpreviewer.tar.gz
     cd lanius-restpreviewer-*

Install dotcloud command and push reST Previewer::

    pip install dotcloud
    dotcloud
    dotcloud create restpreviewer
    dotcloud push restpreviewer .

