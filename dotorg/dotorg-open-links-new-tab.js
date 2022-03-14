// ==UserScript==
// @name         Opens all links in new tab
// @namespace    https://theeventscalendar.com
// @version      0.1
// @description  This adds target="_blank" to all <a> tags
// @author       James Welbes
// @include      https://wordpress.org/support/plugin/the-events-calendar*
// @include      https://wordpress.org/support/topic*
// @include      https://wordpress.org/support/plugin/event-tickets*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordpress.org
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-open-links-new-tab.js
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-open-links-new-tab.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const links = document.querySelectorAll("a");

    links.forEach( (link)=> {
        link.target="_blank";
    })

})();
