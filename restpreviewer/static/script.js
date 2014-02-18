$(function(){
  'use strict';

  var helper = {

    getPaneHeightPx: function () {
      return ($('.container').height() - 230) + 'px';
    },

    applyStyleToFrame: function (name) {
      var iframeStyle = $('<link rel="stylesheet" href="/static/iframe.css"></link>');
      $('#frame-' + name).contents().find('head').append(iframeStyle);
    },

    getKeyInputHandler: function (name) {
      var html = $('#frame-' + name).contents().get(0);
      return function keyInputHandler (editor) {
        var data = editor.getValue();
        localStorage.setItem(name, data);
        $.ajax({
          url: '/rst',
          type: 'POST',
          data: data,
          contentType: 'application/json',
        }).then(function (data) {
          html.open();
          html.write(data);
          html.close();
          helper.applyStyleToFrame(name);
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
      var preview = frames[name];
      if (!preview) {
        helper.applyStyleToFrame(name);
      }
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
