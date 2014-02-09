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

      jQ("#CmdClear").click(function() {
        jQ.each(GM_listValues(), function(index, value) {
          GM_deleteValue(value);
        });
      });

      /**
       * Load Stored AppIDs
       */

      var LoadStoredAppIDs = function() {

        console.log(GM_listValues());
        var Status = [];
        var LastIndex = GM_getValue("LastIndex");
        var IsProcessed, AppIDs = [], AppID;

        for (i = 1; i < LastIndex; i++) {
          IsProcessed = GM_getValue("AppID_" + i + "_Status");
          AppID = GM_getValue("AppID_" + i);
          if (AppID.length > 0) {
            AppIDs.push(AppID);
            Status.push(AppID + " : " + IsProcessed);
          }
        }

        if (jQ("#AppIDs").val().length === 0) {
          jQ("#AppIDs").val(AppIDs.join(","));
        }
        return Status;
      };

      /**
       * Click : [Start Processing]
       *
       * Batch Process Applications
       */
      jQ("#CmdAppIDs").click(function() {

        var AppIDs = "" + jQ("#AppIDs").val();
        var AllIDs = AppIDs.replace(/\r\n+|\r+|\n+|\s+/gm, '').split(",");

        // Store All AppIDs
        var AppIndex = 1;
        jQ.each(AllIDs, function(index, value) {
          if (value.length > 0) {
            GM_setValue("AppID_" + AppIndex, value);
            GM_setValue("AppID_" + AppIndex + "_Status", "Pending");
            GM_setValue("LastIndex", AppIndex);
            AppIndex++;
          }
        });

        // Function to Process to Next Step

        var StoreAppDetails = function() {
          var AppName = jQ("#nameValue").html();
          if (AppName.length > 5) {
            var AppIndex = GM_getValue("CurrentIndex");
            var AppName = jQ("#nameValue").html();
            GM_setValue("AppID_" + AppIndex + "_Name", AppName);
            jQ("#btn").click();
          } else {
            setTimeout(StoreAppDetails, 2000);
            return;
          }
        };

        // Function to Process First Non-Processed AppID

        var ProcessFirstAppID = function() {
          var LastIndex = GM_getValue("LastIndex");
          for (i = 1; i < LastIndex; i++) {
            var IsProcessed = GM_getValue("AppID_" + i + "_Status");
            if (IsProcessed === "Pending") {
              var AppID = GM_getValue("AppID_" + i);
              jQ("#appid").val(AppID).blur();
              GM_setValue("CurrentIndex", i);
              GM_setValue("AppID", AppID);
              break;
            }
          }
          StoreAppDetails();
        };

        ProcessFirstAppID();
      });

      jQ("#CmdStatus").click(function() {

        if (jQ("#CmdStatus").val() === "Show Status") {

          jQ("#CmdStatus").val("Hide Status");
          jQ("#AppIDs").hide();

          var vals = LoadStoredAppIDs();
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

  jQ("#appid").hide(); //.val("<AppID>").blur();
  jQ("#process font").html("Please enter all the Application IDs separated"
          + " by comma: ','");
  var formElem = '<textarea id="AppIDs" rows="20" cols="60"></textarea><br/>'
          + '<input type="button" id="CmdAppIDs" value="Start Processing"/>'
          + '<input type="button" id="CmdStatus" value="Show Status"/>'
          + '<input type="button" id="CmdClear" value="Clear Status"/>';

  jQ("#appid").parent().append(formElem);

  if (jQ("#action").is(":visible")) {
    jQ("#action").val("A06");
    jQ("#comment").val("Auto-Approved");
    jQ("#comsubmit").delay(10000).trigger("submit");
  }
}

// load jQuery and execute the main function
addJQuery(main);
