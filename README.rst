=========
reST Prev
=========

What is this?
=============
Web app that previews reStructuredText.

Live Demo
=========

You can see demo running at http://restprev.nirvake.org/.

Installation
============

Local Machine
-------------
Download the source code:

.. code-block:: bash

    $ git clone git://github.com/lanius/restprev.git

Install required libraries:

.. code-block:: bash

    $ cd restprev/restprev
    $ pip install -r requirements.txt

You may need to install  python-imaging:

.. code-block:: bash

    $ yum install python-imaging

Run reST Prev server:

.. code-block:: bash

     $ python wsgi.py

Host name and port number can be specified by arguments:

.. code-block:: bash

    $ python wsgi.py --host localhost --port 8080
