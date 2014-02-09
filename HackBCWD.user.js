// ==UserScript==
// @name          HackBCWD
// @namespace     https://github.com/abusalam/HackBCWD/
// @description   Auto Approval for SDO: http://castcertificatewb.gov.in/
// @include       http://castcertificatewb.gov.in/*
// @grant         GM_getValue
// @grant         GM_setValue
// @version       1.0
// @icon          http://www.example.net/icon.png
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

}

// load jQuery and execute the main function
addJQuery(main);
