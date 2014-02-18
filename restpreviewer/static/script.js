$(function(){
  'use strict';

  var helper = {

    getPaneHeightPx: function () {
      return ($('.container').height() - 230) + 'px';
    },

    getKeyInputHandler: function (name) {
      var frameContents = $('#frame-' + name).contents();
      return function keyInputHandler (editor) {
        var data = editor.getValue();
        localStorage.setItem(name, data);
        $.ajax({
          url: '/rst',
          type: 'POST',
          data: data,
          contentType: 'application/json',
        }).then(function (data) {
          var html = frameContents.get(0);
          html.open();
          html.write(data);
          html.close();

          var iframeStyle = $('<link rel="stylesheet" href="/static/iframe.css"></link>');
          frameContents.find('head').append(iframeStyle);
        });
      };
    },

    registerResizeFunction: (function () {
      var resizeFunctions = [];
      window.onresize = function () {
        resizeFunctions.forEach(function (func) {
          func();
        });
      };
      return function (func) {
        resizeFunctions.push(func);
        func(); // call on first time
      };
    })()

  };


  var editors = {
    alternate: null,
    realtime: null
  };

  var frames = {
    alternate: null,
    realtime: null,
    quickref: null,
    cheatsheet: null
  };

  var setup = { // setup functions
    editor: function (name) {
      var editor = editors[name];

      if (!editor) {
        var el = $('#textarea-' + name).get(0);
        editor = CodeMirror.fromTextArea(el, {
          mode: 'text',
          lineNumbers: true,
          indentUnit: 4,
          extraKeys: {
            Tab: function(cm) {
              var spaces = new Array(cm.getOption('indentUnit') + 1).join(' ');
              cm.replaceSelection(spaces, 'end', '+input');
            }
          },
          theme: 'pastel-on-dark'
        });
        editor.on('change', $.debounce(250, helper.getKeyInputHandler(name)));

        helper.registerResizeFunction(function () {
          editor.getWrapperElement().style.height = helper.getPaneHeightPx();
          editor.refresh();
        });

        var storedData = localStorage.getItem(name);
        if (storedData !== null) {
          editor.setValue(storedData);
        }

        editors[name] = editor;
      }
      
      editor.focus();
    },

    preview: function (name) {
      this.frame(name);
    },

    frame: function (name) {
      var frame = frames[name];

      if (!frame) {
        helper.registerResizeFunction(function () {
          $('#frame-' + name).height(helper.getPaneHeightPx());
        });
      }
    }

  };

  var show = (function () {
    var funcs = {
      source: function () {
        setup.editor('alternate');
      },
      preview: function () {
        setup.preview('alternate');
      },
      realtime: function () {
        setup.editor('realtime');
        setup.preview('realtime');
      },
      quickref: function () {
        setup.frame('quickref');
      },
      cheatsheet: function () {
        setup.frame('cheatsheet');
      }
    };
    return function (name) {
      funcs[name]();
    };
  }());


  // application bootstrap

  (function () {
    var localStorage;
    if (typeof window.localStorage === 'undefined') {
        console.log('localStorage is not supported');
        localStorage = { setItem: function () {}, getItem: function () {} };
    } else {
        localStorage = window.localStorage;
    }
  }());

  (function () {
    $('#menu a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    $('#menu a').on('shown.bs.tab', function (e) {
      var name = $(e.target).data('tab');
      show(name);
    });

    $('#menu a:first').tab('show');
  }());

});
