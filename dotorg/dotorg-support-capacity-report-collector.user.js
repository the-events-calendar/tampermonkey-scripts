// ==UserScript==
// @name         TEC: .org Weekly Support Capacity Tracking Threads and Reviews
// @namespace    https://theeventscalendar.com/
// @version      1.0.2
// @description  Analyzes the weekly count of tickets for a WordPress.org plugin support forum and adds labels for new reviews and threads
// @author       abzdmachinist
// @match        https://wordpress.org/support/*
// @match        https://*.wordpress.org/support/*
// @exclude      https://wordpress.org/support/view/pending*
// @exclude      https://*.wordpress.org/support/view/pending*
// @exclude      https://wordpress.org/support/view/spam*
// @exclude      https://*.wordpress.org/support/view/spam*
// @exclude      https://wordpress.org/support/topic/*
// @require      https://raw.githubusercontent.com/lodash/lodash/4.17.15-npm/lodash.min.js
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @require      https://unpkg.com/dayjs@1.8.21/plugin/customParseFormat.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-support-capacity-report-collector.user.js
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-support-capacity-report-collector.user.js
// @resource     tecTeam https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/team.json
// @grant        GM_getResourceText
// @grant        GM_openInTab
// ==/UserScript==

(function() {
    'use strict';

    // Function to calculate the weekly ticket count
    function thread_weekly_count() {
        var ticketElements = document.querySelectorAll('.topic');
        $( '.site-main' ).prepend( '<table class="support-capacity-threads" border="1" style="font-size:12px;"><tr><td style="padding: 5px;"><b>ID</b></td><td style="padding: 5px;"><b>Status</b></td><td style="padding: 5px;"><b>Date</b></td><td style="padding: 5px;"><b>Week</b></td><td style="padding: 5px;"><b>URL</b></td><td style="padding: 5px;"><b>Plugin</b></td><td style="padding: 5px;"><b>Author</b></td><td style="padding: 5px;"><b>Last Reply</b></td></tr></table>' );

        for ( var i = 0; i < ticketElements.length; i++ ) {
            var threadDate = ticketElements[i].querySelector( '.bbp-topic-freshness a' ).title;
            var threadStatus = ticketElements[i].querySelector( '.bbp-topic-title .bbp-topic-meta .tamper-label-container label.tamper-label' ).innerText;
            var threadID = ticketElements[i].id.replace( /^bbp-topic-/ , "");
            var threadURL = ticketElements[i].querySelector( '.bbp-topic-permalink' ).href;
            var threadAuthor = ticketElements[i].querySelector( '.bbp-author-name' ).innerText;
            var threadLastReply = ticketElements[i].querySelector( '.bbp-topic-freshness-author .bbp-author-name' ).innerText;
            var messageLog = '#' + threadID + ' ' + threadStatus.toLowerCase()  + ' — ' + threadDate + ' / Week #' + convert_to_week_number(threadDate.replace(/\sat\s\d{1,2}:\d{2}\s(AM|PM)$/i, "")) + ' ' + threadURL;
            var threadPluginText = $('#bbpress-forums h1').text().match(/\[(.*?)\]/)[1];
            var threadPlugin = threadPluginText.toLowerCase().replace(/\s+/g, '-');

            if (threadPlugin == 'event-tickets-and-registration') {
                threadPlugin = 'event-tickets';
            }

            var htmlLog = `<tr>
                <td style="padding: 5px;"> ${threadID} </td>
                <td style="padding: 5px;"> ${threadStatus.toLowerCase()} </td>
                <td style="padding: 5px;"> ${threadDate} </td>
                <td style="padding: 5px;"> ${convert_to_week_number(threadDate.replace(/\sat\s\d{1,2}:\d{2}\s(AM|PM)$/i, ""))} </td>
                <td style="padding: 5px; width: 50px;"> ${threadURL} </td>
                <td style="padding: 5px; width: 50px;"> ${threadPlugin} </td>
                <td style="padding: 5px; width: 50px;"> ${threadAuthor} </td>
                <td style="padding: 5px; width: 50px;"> ${threadLastReply} </td>
            </tr>`;

            $( '.support-capacity-threads' ).append(htmlLog);
            console.log(messageLog);
        }
    }

    function reviews_weekly_count() {
        var ticketElements = document.querySelectorAll('.topic');
        $( '.site-main' ).prepend( '<table class="support-capacity-reviews" border="1" style="font-size:12px;"><tr><td style="padding: 5px;"><b>ID</b></td><td style="padding: 5px;"><b>Status</b></td><td style="padding: 5px;"><b>Date</b></td><td style="padding: 5px;"><b>Week</b></td><td style="padding: 5px;"><b>Review</b></td><td style="padding: 5px;"><b>Stars</b></td><td style="padding: 5px;"><b>URL</b></td><td style="padding: 5px;"><b>Plugin</b></td><td style="padding: 5px;"><b>Author</b></td><td style="padding: 5px;"><b>Last Reply</b></td></tr></table>' );

        for ( var i = 0; i < ticketElements.length; i++ ) {
            var threadDate = ticketElements[i].querySelector( '.bbp-topic-freshness a' ).title;
            var threadStatus = ticketElements[i].querySelector( '.bbp-topic-title .bbp-topic-meta .tamper-label-container label.tamper-label' ).innerText;
            var threadID = ticketElements[i].id.replace( /^bbp-topic-/ , "");
            var threadURL = ticketElements[i].querySelector( '.bbp-topic-permalink' ).href;
            var threadReview = ticketElements[i].querySelector( '.bbp-topic-title a' ).innerText;
            var threadAuthor = ticketElements[i].querySelector( '.bbp-author-name' ).innerText;
            var threadLastReply = ticketElements[i].querySelector( '.bbp-topic-freshness-author .bbp-author-name' ).innerText;

            var threadStars = ticketElements[i].querySelector( '.wporg-ratings' ).title;
            var messageLog = '#' + threadID + ' ' + threadStatus.toLowerCase()  + ' — ' + threadDate + ' / Week #' + convert_to_week_number(threadDate.replace(/\sat\s\d{1,2}:\d{2}\s(AM|PM)$/i, "")) + ' ' + threadURL;
            var threadPluginText = $('#bbpress-forums h1').text().match(/\[(.*?)\]/)[1];
            var threadPlugin = threadPluginText.toLowerCase().replace(/\s+/g, '-');

            if (threadPlugin == 'event-tickets-and-registration') {
                threadPlugin = 'event-tickets';
            }

            var htmlLog = `<tr>
                <td style="padding: 5px;"> ${threadID} </td>
                <td style="padding: 5px;"> ${threadStatus.toLowerCase()} </td>
                <td style="padding: 5px;"> ${threadDate} </td>
                <td style="padding: 5px;"> ${convert_to_week_number(threadDate.replace(/\sat\s\d{1,2}:\d{2}\s(AM|PM)$/i, ""))} </td>
                <td style="padding: 5px;"> ${threadReview} </td>
                <td style="padding: 5px;"> ${threadStars.replace(/\sout\s+of\s+5\s+stars$/i, "")} </td>
                <td style="padding: 5px; width: 50px;"> ${threadURL} </td>
                <td style="padding: 5px; width: 50px;"> ${threadPlugin} </td>
                <td style="padding: 5px; width: 50px;"> ${threadAuthor} </td>
                <td style="padding: 5px; width: 50px;"> ${threadLastReply} </td>
                </tr>`;

            $( '.support-capacity-reviews' ).append( htmlLog );
            console.log( messageLog);
        }
    }

    // Function to convert date to week number
    function convert_to_week_number(date) {
        return moment(date).isoWeek();
    }

    // Wait for the support dashboard script to load

    var supportTamperMonkeyLoad = document.getElementsByClassName( 'tamper-label' );

    setTimeout(function() {
        if (supportTamperMonkeyLoad) {
            // Show Support Threads URL only
            if($( '.bbp-view-plugin' ).length > 0) {
                thread_weekly_count();
            }
            // Show Reviews URL only
            if( $( '.bbp-view-reviews' ).length > 0 ) {
                reviews_weekly_count();
            }
        }
    }, 2000);

})();

/**
* === Changelog ===
* [1.0.0] 2024-01-02
* Fixes: Update and Download URL
* [1.0.1] 2024-04-23
* Updates: Last Replies + Author
* [1.0.2] 2024-07-08
* Updates: Add column for plugin name + Delay on load to get data
*/
