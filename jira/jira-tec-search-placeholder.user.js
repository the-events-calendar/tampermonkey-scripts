// ==UserScript==
// @name         Change Jira Search Bar
// @namespace    http://theeventscalendar.com/
// @version      0.1
// @description  Update Jira status bar placeholder color to match with the theme of TEC.
// @author       Crisoforo Gaspar
// @match        https://theeventscalendar.atlassian.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your CSS as text
    var styles = `header[role="banner"] input::placeholder { color: #FFF;}`

    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
})();
