$(function(){
  var localStorage;
  if (typeof window.localStorage === "undefined") {
      console.log("localStorage is not supported");
      localStorage = {};
  } else {
      localStorage = window.localStorage;
  }

  // Menu settings
  $(".menutab").click(function(){
    var element = $(this);
    
    // tabs
    $(".menutab").removeClass("menutab-selected");
    element.addClass("menutab-selected");
    
    // panes
    $(".pane").hide();
    $("#pane" + element.attr("id").match(/-.*/)).show();
    
    if (element.attr("id") === "menutab-quickref" && $("#quickref").attr("data-loaded") !== true) {
      $("#quickref").attr("src", "http://docutils.sourceforge.net/docs/user/rst/quickref.html");
      $("#quickref").attr("data-loaded", true);
    }
    else if (element.attr("id") === "menutab-cheatsheet" && $("#cheatsheet").attr("data-loaded") !== true) {
      $("#cheatsheet").attr("src" ,"http://docutils.sourceforge.net/docs/user/rst/cheatsheet.txt");
      $("#cheatsheet").attr("data-loaded", true);
    }
  });
  
  
  // Translater settings
  var inputHandler = function(){
    var element = $(this);
    var current = element.val();
    var previous = element.attr("data-previous");
    if (previous !== current) {
      var sourceId = element.attr("id");
      var previewId = sourceId.replace("source", "preview");
      localStorage["#" + sourceId] = current;
      translate(element, $("#" + previewId));
      element.attr("data-previous", current);
    }
  };
  
  var translate = function(source, preview){
    $.ajax({
      url: "/rst",
      type: "POST",
      data: source.val(),
      contentType: "application/json",
      dataType: "text",
      success: function(data){
        var contents = preview.contents()[0];
        contents.open();
        contents.write(data);
        contents.close();
      },
    });
  };
  
  var source = $("#source").keyup($.debounce(350, inputHandler));
  var realtime = $("#realtimesource").keyup($.debounce(350, inputHandler));
  
  if (localStorage["#source"] !== null) {
      source.val(localStorage["#source"]);
  }
  if (localStorage["#realtimesource"] !== null) {
      realtime.val(localStorage["#realtimesource"]);
  }
  
  // initialize top contents.
  $("#menutab-realtime").click();
  translate($("#realtimesource"), $("#realtimepreview"));
});
