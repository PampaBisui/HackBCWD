// ==UserScript==
// @name          HackBCWD
// @namespace     https://github.com/abusalam/HackBCWD
// @description   Auto Approval for SDO: http://castcertificatewb.gov.in/
// @include       http://castcertificatewb.gov.in/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_listValues
// @version       1.0
// @icon          https://github.com/abusalam
// ==/UserScript==

function CheckActive() {
  if (jQ('#Login').is(":enabled")) {
    jQ("#Login").click();
    jQ("#Login").attr('disabled', 'disabled');

  } else if (jQ('[name="content"]').is(":visible")) {
    var URL = 'http://castcertificatewb.gov.in/jsp/user_module/processApplication.jsp'
    jQ('[name="content"]').attr('src', URL);

  } else {
    setTimeout(CheckActive, 2000);
    return;
  }

}

// a function that loads jQuery and calls a callback function
// when jQuery has finished loading

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src",
          "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");

  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);("
            + callback.toString() + ")();";
    document.body.appendChild(script);
    CheckActive();

    jQ(function() {

      jQ("#CmdAppIDs").click(function() {
        console.log(GM_listValues());
        var vals = [];
        jQ.each(GM_listValues(), function(index, value) {
          vals.push(GM_getValue(value));
          //GM_deleteValue(value);
        });
        if (jQ("#AppIDs").val().length === 0) {
          jQ("#AppIDs").val(vals.join(","));
        }
        var AppIndex = 1;
        var AppIDs = "" + jQ("#AppIDs").val();
        var AllIDs = AppIDs.replace(/\r\n+|\r+|\n+|\s+/gm, '').split(",");
        jQ.each(AllIDs, function(index, value) {
          if (value.length > 0) {
            alert("Index: " + AppIndex + " = " + value);
            GM_setValue("AppID_" + AppIndex++, value);
          }
        });
      });

      jQ("#CmdStatus").click(function() {

        if (jQ("#CmdStatus").val() === "Show Status") {

          jQ("#CmdStatus").val("Hide Status");
          jQ("#AppIDs").hide();

          var vals = [];
          jQ.each(GM_listValues(), function(index, value) {
            vals.push(GM_getValue(value));
          });

          if (jQ("#AppIDs").val().length === 0) {
            jQ("#AppIDs").val(vals.join(","));
          }
          var StatusDiv = document.createElement("div");
          StatusDiv.setAttribute("id", "AppStatus");

          jQ("#appid").parent().append(StatusDiv);

          jQ("#AppStatus").html("<ol><li>" + vals.join("</li><li>") + "</li></ol>");
        } else {

          jQ("#AppStatus").remove();
          jQ("#AppIDs").show();
          jQ("#CmdStatus").val("Show Status");
        }

      });

    });
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  if (window.location.href === "http://castcertificatewb.gov.in/") {
    var URL = "http://castcertificatewb.gov.in/jsp/user_module/user.html";
    window.open(URL, "_self");
  }

  // Note, jQ replaces $ to avoid conflicts.
  jQ("#uid").val("<SDO-UserID>");
  jQ("#pwd").val("<Password>").blur();

  jQ("#appid").val("<AppID>").blur();
  jQ("#process font").html("Please enter all the Application IDs separated"
          + " by comma: ','");
  var formElem = '<textarea id="AppIDs" rows="20" cols="60"></textarea><br/>'
          + '<input type="button" id="CmdAppIDs" value="Start Processing"/>'
          + '<input type="button" id="CmdStatus" value="Show Status"/>';

  jQ("#appid").parent().append(formElem);

  jQ('[src$="login.jsp"]').load(function() {
    console.log("Adding My Content: " + jQ("div").length);
    //.html("<span>My Content</span>");
  });
}

// load jQuery and execute the main function
addJQuery(main);
