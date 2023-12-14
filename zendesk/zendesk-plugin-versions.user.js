// ==UserScript==
// @name         Zendesk - Latest plugin versions (TEC)
// @namespace    https://theeventscalendar.com/
// @version      6.2.0
// @description  Display the latest version numbers of The Events Calendar plugins.
// @author       Andras Guseo
// @match        https://ithemeshelp.zendesk.com/agent*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zendesk.com
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/zendesk/zendesk-plugin-versions.user.js
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/zendesk/zendesk-plugin-versions.user.js
// @resource     pluginHistory https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/zendesk/plugin-versions.json
// @grant        GM_getResourceText
// @noframes
// ==/UserScript==

/**
 * When a new release is out then:
 * 1. Update script version number in the header based on the versioning info below.
 * 2. Go to the 'plugin-versions.js' file and make a copy of the last line.
 * 3. Increase the starting number of the row by one.
 * 4. Add the release name, date, and plugin version numbers.
 * 5a. If it is a new version compared to last release, add 'x' at the end, like '4.6.19x'. Note: Woo and EDD do not get tagged with 'x'.
 * 5b. If it is a hotfix (4th digit increase), then creating a new line is not needed, just update the version number in the last line (See Event Tickets (eti) in line 12).
 * 6. Create a pull request and ping Andras or Abz to check and approve.
 *
 * Versioning:
 * First digit:  only changes when year changes. 2 = 2019; 3 = 2020; 4 = 2021; 5 = 2022;
 * Second digit: increment when a bugfix or feature for the script.
 * Third digit:  increment when updating the script with plugin versions.
 */
(function() {
    'use strict';

//== SETUP ==//
/*
 * Here are the settings that you can change.
 */
    // Enable logging for debugging.
    const log = false;

    // Start hidden? When set to true, the bar will be
    // hidden at the right edge of the screen on load.
    const startHidden = true;

    // Constants to define whether a set of plugins should be shown or not.
    const showBlue = true;
    const showGreen = true;
    const showCharcoal = true;
    const showThirdParty = true;

    // Vertical offset
    // Set to 0 - The tab with the eye icon is visible when closed.
    // Set to 55 - The first column is visible when closed.
    const verticalOffset = 0;

    // The starting position of the container.
    // The distance from the right edge of the screen.
    // Set to 600 to not cover the search field.
    const startRight = '350';

    // The width of the first 2 columns (in pixels).
    const firstColumnWidth = 70;
    const secondColumnWidth = 120;

    // Define how many rows should be shown on load and when table is collapsed.
    const initialRows = 1;

    // Define whether table should scroll to the last (most actual) row on collapse.
    const scrollOnCollapse = true;

    // Height of the table (in pixels) when expanded.
    const expandedHeight = 300;

    // Check for the zoom level of the browser.
    const zoomlevel = (( window.outerWidth - 10 ) / window.innerWidth);

    // The body tag. Used to check where to add the markup.
    const bodyTag = document.getElementsByTagName("body")[0];

//== START ==//
    if ( log ) console.log ( alreadydone );
    if ( log ) console.log ( typeof alreadydone );
    if ( log ) console.log ( 'The <body> tag has ' + bodyTag.classList.length + ' classes' );

    // Only run if it wasn't executed before
    if ( typeof alreadydone == 'undefined' && bodyTag.classList.length >= 0 ) {
        if ( log ) console.log ( "Plugin versions has not run before." );

        var alreadydone = true;

        var initialRowsHeight = initialRows * 20;

        if ( log ) console.log ( typeof alreadydone );

        /**
         * j - counter
         */
        var j;

        // Get from resource team.json then covert it to array()
        var jsonString = GM_getResourceText( 'pluginHistory' );
        var pluginHistory = JSON.parse(jsonString);

        // The number of releases (the length of the object)
        var rowNumber = Object.keys(pluginHistory).length;


        // Plugin abbreviations
        const bluePlugins = ['tec', 'pro', 'vev', 'eva', 'esm', 'fib', 'ebt'];
        const greenPlugins = ['eti', 'etp', 'wap', 'cev', 'ctx'];
        const charcoalPlugins = ['apm', 'iwp'];
        const thirdPartyPlugins = ['woo', 'edd'];

        //var pluginNames = [].concat(bluePlugins, greenPlugins, charcoalPlugins, thirdPartyPlugins);
        var pluginNames = [];

        var numPlugins = 0;

        if ( showBlue ) {
            numPlugins = bluePlugins.length;
            pluginNames.push(...bluePlugins);
        }
        if ( showGreen ) {
            numPlugins += greenPlugins.length;
            pluginNames.push(...greenPlugins);
        }
        if ( showCharcoal ) {
            numPlugins += charcoalPlugins.length;
            pluginNames.push(...charcoalPlugins);
        }
        if ( showThirdParty ) {
            numPlugins += thirdPartyPlugins.length;
            pluginNames.push(...thirdPartyPlugins);
        }
        //= bluePlugins.length + greenPlugins.length + charcoalPlugins.length + thirdPartyPlugins.length;
        if ( log ) console.log('Number of plugins: ' + numPlugins);
        if ( log ) console.log('Plugins: ' + pluginNames);
        const tableMinWidth = (numPlugins * 51) + firstColumnWidth + secondColumnWidth + 10;  // 10 = scrollbar width

        /**
         * Table of the plugin versions
         */
        var htmlMarkup = document.createElement('div');
        htmlMarkup.id = 'plugin-versions';

        var htmlstring = '';

        htmlstring += '<style>' +
            '#plugin-versions, #plugin-versions * {	box-sizing: border-box; }' +
            '#plugin-versions { z-index: 15; position: fixed; top: 0; background-color: rgb(62, 72, 73); color: rgb(242, 241, 240); transition-duration: 1000ms; transition-timing-function: ease-in-out; right: ' + startRight + 'px; min-width: ' + tableMinWidth + 'px; }' +
            '#plugin-versions table { width: 100%; font-size: 12px; }' +
            '.versions td { padding: 0 5px !important; border-right: 1px solid white; line-height: 1.5em !important; font-size: 110% !important; }' +
            '.versions td img { width: 30px !important; }' +
            '.versions tr.first-row td { text-align: center; }' +
            '.alwayson { text-align: center; }' +
            '.versions td { line-height: 1.5em !important; }' +
            '.versions td.blue { background-color: #157f9d; }' +
            '.versions td.blue.new-version { background-color: #1ca8c7; }' +
            '.versions td.green { background-color: #078e87; }' +
            '.versions td.green.new-version { background-color: #2dd39c; }' +
            '.versions td.yellow { background-color: #ebe463; color: #666; }' +
            '.versions td.yellow.new-version { background-color: #ebc863; }' +
            '.row td.blue.last, .row td.green.last { border-right-width: 3px; }' +
            '.row { text-align: center; }' +
            '#hider, #more { cursor: pointer; }' +
            '.hider-cell, .more-cell { vertical-align: top; }' +
            '.hider-cell-2 { position: absolute; left: -22px; width: 22px; height: 20px; background: #bbb; font-weight: bold; text-align: center; cursor: pointer; border-radius: 6px 0 0 6px;}' +
            '#plugin-versions thead, #plugin-versions tbody, #plugin-versions tr, #plugin-versions td { display: block; }' +
            '#plugin-versions tr:after { display: block; visibility: hidden; clear: both; content: " "; }' +
            '#plugin-versions thead td { height: 34px; }' +
            '#plugin-versions tbody { height: ' + initialRowsHeight + 'px; overflow-y: scroll; scrollbar-width: thin; scrollbar-color: orange rgb(62, 72, 73); transition-property: height; transition-duration: 0.5s; transition-timing-function: ease-in-out; }' +
            '#plugin-versions thead::-webkit-scrollbar, #plugin-versions tbody::-webkit-scrollbar { width: 8px; }' +
            '#plugin-versions thead::-webkit-scrollbar-track, #plugin-versions tbody::-webkit-scrollbar-track { background: rgb(62, 72, 73); }' +
            '#plugin-versions thead::-webkit-scrollbar-thumb, #plugin-versions tbody::-webkit-scrollbar-thumb { background-color: orange ; border: 1px solid rgb(62, 72, 73); }' +
            '#plugin-versions thead { overflow-y: scroll; scrollbar-width: thin; scrollbar-color: rgb(62, 72, 73) rgb(62, 72, 73); }' +
            '#plugin-versions tr { margin-left: 0; }' +
            '#plugin-versions td { float: left; white-space: nowrap; }' +
            '#plugin-versions td:nth-child(1) { width: ' + firstColumnWidth + 'px; }' +
            '#plugin-versions td:nth-child(2) { width: ' + secondColumnWidth + 'px; text-align: left; }' +
            '#plugin-versions td:nth-child(n+3) { width: calc((100% - ' + (firstColumnWidth+secondColumnWidth) + 'px) / ' + numPlugins + '); }' +
            '#plugin-versions .update-icon { float: right; }' +
            '</style>';
        htmlstring += '<div class="hider-cell-2" id="hider-2">👁️</div>';
        htmlstring += '<table width="100%" class="versions" id="versions-table" cellpadding="0" cellspacing="0">';

        // Header row
        htmlstring += '<thead><tr class="row first-row alwayson">' +
            '<td class="hider-cell"><span id="hider">[';
        htmlstring += startHidden ? 'show' : 'hide';
        htmlstring += ']</span></td>' +
            '<td class="more-cell" id="more">' +
                '<span id="mmore">[more]</span>' +
                '<a href="https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/zendesk/zendesk-plugin-versions.user.js" target="_blank" class="update-icon" title="Check for updates">🔄</a>' +
            '</td>';

        if ( showBlue ) {
            htmlstring +=
                '<td class="blue"><img src="https://andrasguseo.com/images/new-tec-icon.svg" title="The Events Calendar" alt="The Events Calendar icon" /></td>' +
                '<td class="blue"><img src="https://andrasguseo.com/images/new-ecp-icon.svg" title="Events Calendar Pro" alt="Events Calendar Pro icon" /></td>' +
                '<td class="blue"><img src="https://andrasguseo.com/images/new-ve-icon.svg" title="Virtual Events" alt="The Events Calendar: Virtual Events icon" /></td>' +
                '<td class="blue"><img src="https://andrasguseo.com/images/EventAutomator-icon.svg" title="Event Automator" alt="The Events Calendar: Event Automator icon" /></td>' +
                '<td class="blue"><img src="https://andrasguseo.com/images/EventScheduleManager-icon.svg" title="Event Schedule Manager" alt="Event Schedule Manager icon" /></td>' +
                '<td class="blue"><img src="https://andrasguseo.com/images/new-fb-icon.svg" title="Filter Bar" alt="The Events Calendar: Filter Bar icon" /></td>' +
                '<td class="blue last"><img src="https://andrasguseo.com/images/new-eb-icon.svg" title="Eventbrite Tickets" alt="Eventbrite Tickets icon" /></td>';
        }
        if ( showGreen ) {
            htmlstring +=
                '<td class="green"><img src="https://andrasguseo.com/images/new-et-icon.svg" title="Event Tickets" alt="Event Tickets icon" /></td>' +
                '<td class="green"><img src="https://andrasguseo.com/images/new-etp-icon.svg" title="Event Tickets Plus" alt="Event Tickets Plus icon" /></td>' +
                '<td class="green"><img src="https://andrasguseo.com/images/new-wap-icon.svg" title="Wallet Plus" alt="Wallet Plus icon" /></td>' +
                '<td class="green"><img src="https://andrasguseo.com/images/new-ce-icon.svg" title="Community Events" alt="Community Events icon" /></td>' +
                '<td class="green last" style="padding-top: 7px !important;"><img src="https://andrasguseo.com/images/new-ct-icon.svg" title="Community Tickets" alt="Community Tickets icon" /></td>';
        }
        if ( showCharcoal ) {
            htmlstring +=
                '<td class="charcoal" style="padding-top: 7px !important;">APM</td>' +
                '<td class="charcoal" style="padding-top: 7px !important;">IW+</td>';
        }

        // eCommerce in Header
        if ( showThirdParty ) {
            htmlstring += '<td><img src="https://andrasguseo.com/images/woo-icon.png" title="WooCommerce" alt="WooCommerce icon" /></td>';
            htmlstring += '<td><img src="https://andrasguseo.com/images/edd-headshot.png" title="Easy Digital Downloads" alt="Easy Digital Downloads icon" /></td>';
        }

        htmlstring += '</tr></thead>';

        htmlstring += '<tbody id="pluginversions-tbody">';

        // Go through the plugin history row by row

        for( var number in pluginHistory ) {

            if ( log ) console.log('Number: ' + number + ' ' + rowNumber );

            htmlstring += '<tr class="row';
            // For the last row add additional classes

            // Show last 3 rows on hover
            if ( number >= rowNumber-3 && number < rowNumber-1 ) htmlstring += ' show';

            // Always show last row
            if (  number == rowNumber-1 ) {
                htmlstring += ' last last-row alwayson';
            }
            htmlstring += '">';
            htmlstring += '<td>' + pluginHistory[number].date + '</td>';
            htmlstring += '<td>' + pluginHistory[number].name + '</td>';

            /**
             * Go through all the plugins
             * pN = stores the plugin name, so we can refer to it
             */
            for ( j = 0; j < pluginNames.length; j++ ) {
                var pN = pluginNames[j];

                // Open the cell
                htmlstring += '<td class="';

                // Add class based on team
                if ( 0 <= j && j < bluePlugins.length ) {
                    htmlstring += 'blue';
                    if ( j == bluePlugins.length - 1 ) {
                        htmlstring += ' last';
                    }
                }
                else if ( bluePlugins.length <= j && j < bluePlugins.length + greenPlugins.length ) {
                    htmlstring += 'green'
                    if ( j == bluePlugins.length + greenPlugins.length - 1 ) {
                        htmlstring += ' last';
                    }
                }

                if( log ) console.log( 'this: ' + number + '-' + pN );

                // If plugin version number has 'x', then it's a new release, so add extra class
                if( pluginHistory[number][pN].includes( "x" ) ) {
                    htmlstring += ' new-version';
                }

                // Closing quote
                htmlstring += '"';

                // Print the version number and close the cell
                htmlstring += '>' + pluginHistory[number][pN].replace( 'x', '' ) + '</td>';

            } // end for ( j = 0; j < pluginNames.length; j++ )

            // Close the row
            htmlstring += '</tr>';

        } // end for( var number in pluginHistory )

        htmlstring += '</tbody>';

        // Close the table and the container
        htmlstring += '</table>';

        if ( log ) console.log( htmlstring );

        // Add content to element
        htmlMarkup.innerHTML = htmlstring;

        // Adding to markup
        console.log('Adding plugin versions to markup');
        document.getElementsByTagName("body")[0].appendChild( htmlMarkup );

        /**
         * Expand / collapse table
         */
        function moreLess() {
            var tbody = document.getElementById('pluginversions-tbody');
            var more = document.getElementById( 'mmore' );
            var bodyHeight = tbody.clientHeight;

            if ( bodyHeight >= expandedHeight ) {
                tbody.style.height = initialRowsHeight + 'px';
                more.innerHTML = '[more]';
                if ( scrollOnCollapse ) scrollToBottom();
            }
            else {
                tbody.style.height = expandedHeight + 'px';
                more.innerHTML = '[less]';
            }
        }

        /**
         * Hide / show table
         */
        function hideBlock() {
            var pluginVersions = document.getElementById( 'plugin-versions' );

            var block = document.getElementById( 'plugin-versions' );
            var str   = document.getElementById( 'hider' );
            var right = window.outerWidth-block.offsetLeft;
            var hideRight = -block.offsetWidth + verticalOffset;
            if ( log ) console.log( 'block.offsetLeft: ' + block.offsetLeft );
            if ( log ) console.log( 'block.offsetWidth: ' + block.offsetWidth );
            if ( log ) console.log( 'window.outerWidth: ' + window.outerWidth );
            if ( log ) console.log( 'right: ' + right );
            if ( log ) console.log( 'hideRight: ' + hideRight );
            if ( log ) console.log( 'startRight: ' + startRight );
            if ( log ) console.log( 'zoom level: ' + zoomlevel );

            if ( block.offsetLeft * zoomlevel > window.outerWidth - 150 ) {
                if ( log ) console.log( 'showing' );
                pluginVersions.style.right = startRight + 'px';
                str.innerHTML = '[hide]';
            }
            else {
                if ( log ) console.log( 'hiding' );
                pluginVersions.style.right = hideRight + 'px';
                str.innerHTML = '[show]';
            }
        }

        /**
         * Scroll to the bottom of the version numbers on collapse
         */
        function scrollToBottom() {
            var bodyHeight = document.getElementById('pluginversions-tbody').clientHeight;
            if ( bodyHeight > initialRowsHeight ) {
                scrollToBottomAction();
                setTimeout( scrollToBottom, 1);
            }
        }

        function scrollToBottomAction() {
            document.getElementById('pluginversions-tbody').scrollTop=document.getElementById('pluginversions-tbody').scrollHeight;
        }

        //using closure to cache all child elements
        var parent = document.getElementById( 'plugin-versions' );

        // Scrolling to bottom on load
        scrollToBottomAction();

        if ( startHidden ) {
            var startHiddenRight = -parent.offsetWidth + verticalOffset;
            parent.style.right = startHiddenRight + 'px';

        }

        // Handle actions
        if ( document.getElementById( 'plugin-versions' ) != null ) {
            document.getElementById( 'hider' ).addEventListener( 'click', hideBlock );
            document.getElementById( 'hider-2' ).addEventListener( 'click', hideBlock );
            document.getElementById( 'more' ).addEventListener( 'click', moreLess );
        }

    } // if ( typeof alreadydone == 'undefined')

    /**
     * === Changelog ===
     * 6.2.0 - 2023-07-04
     * Moved the plugin versions object to an external file.
     * Added new plugin versions (171-174).
     * Added Zendesk favicon.
     *
     * 6.1.4 - 2023-06-05
     * Added new plugin versions (167-170).
     *
     * 6.1.3 - 2023-04-03
     * Added new plugin versions (162-166).
     *
     * 6.1.2 - 2023-02-27
     * Added new plugin versions (161).
     *
     * 6.1.1 - 2023-02-09
     * [Feature] Added an update button for easier updates.
     * Added new plugin versions (160).
     * Fixed past Filter Bar version numbers.
     *
     * 6.1.0 - 2023-01-28
     * [Feature] The design automatically adjusts when new products are added.
     * [Feature] Added the possibility to hide certain plugin groups.
     * [Feature] Added new hider tab and the bar full hides on hide.
     * Added Event Automator.
     * Added new plugin versions (158-159).
     *
     * 6.0.0 - 2023-01-22
     * Added new plugin versions (154-157)
     * Changed the script to start hidden
     *
     * 5.0.9 - 2022-11-30
     * Added new plugin versions (149-153)
     *
     * 5.0.8 - 2022-10-05
     * Added new plugin versions (144-148)
     *
     * 5.0.7 - 2022-07-28
     * Added new plugin versions (136-143)
     * Fixed past Community Tickets version numbers
     *
     * 5.0.6 - 2022-05-26
     * Added new plugin versions (134-135)
     * Fixed name of line 133 release
     *
     * 5.0.5 - 2022-05-02
     * Added new plugin versions (130-133)
     *
     * 5.0.4 - 2022-04-04
     * Added new plugin versions (129)
     *
     * 5.0.3 - 2022-03-17
     * Added new plugin versions (128)
     * Fixed version of tec for Jan release (5.14.0.4 instead of 5.14.4)
     * Adjusted indentation
     *
     *  5.0.2 - 2022-03-15
     * Added new plugin versions (127)
     *
     * 5.0.1 - 2022-03-07
     * Added new plugin versions (120-126)
     *
     * 5.0.0 - 2022-01-14
     * Fixed CSS for Zendesk
     * Added new plugin versions (111-119)
     * Renamed and moved script to Zendesk
     *
     * 4.2.6 - 2021-10-13
     * Added new plugin versions (108-110)
     * Fixed past Woo and EDD versions
     *
     * 4.2.5 - 2021-09-10
     * Added new plugin versions (100-107)
     *
     * 4.2.4 - 2021-06-28
     * Added new plugin versions (97-99)
     *
     * 4.2.3 - 2021-05-28
     * Added new plugin versions (96)
     *
     * 4.2.2 - 2021-05-17
     * Added new plugin versions (91-95)
     *
     * 4.2.1 - 2021-04-14
     * Added new plugin versions (89-90)
     *
     * 4.2.0 - 2021-03-05
     * Added new plugin versions (86-88)
     * Replaced jQuery code with vanilla JavaScript
     * Made adjustments to show/hide to account for browser zoom level
     * Adjusted code so it only runs when necessary
     *
     * 4.1.1 - 2021-02-22
     * Added new plugin versions (85)
     *
     * 4.1.0 - 2021-02-05
     * Fixed plugin order
     *
     * 4.0.1 - 2021-02-02
     * Added new plugin versions (83-84)
     *
     * 4.0.0 - 2021-01-07
     * Added new plugin versions (82)
     * Fixed bug where if the script started hidden it could not be unhidden
     * Added scrollbar styling for webkit browsers
     * Reordered plugins based on new teams
     *
     * 3.9.1 - 2020-12-08
     * Usability improvements & code cleanup
     * The version numbers table can now be scrolled
     * Setup can be customized with variables
     *
     * 3.9.0 - 2020-12-07
     * Added new plugin versions (80-81)
     *
     * 3.8.0 - 2020-10-26
     * Added new plugin versions (77-79)
     *
     * 3.7.0 - 2020-09-29
     * Added new plugin versions (75-76)
     *
     * 3.6.0 - 2020-09-07
     * Added new plugin versions (71-74)
     * Adjusted spacing to align columns in the main object
     *
     * 3.5.0 - 2020-06-24
     * Added new plugin versions (70)
     *
     * 3.4.0 - 2020-06-22
     * Updated version numbers up to this date (66-69)
     * Added Virtual Events
     *
     * 3.3.1 - 2020-04-29
     * Updated version numbers up to this date (63-65)
     * Updated product icons
     * Added product icons for Woo and EDD
     * Added the option to start the bar in a hidden stated
     * Restructured the code a bit
     *
     * 3.2.0 - 2020-03-04
     * Updated version numbers up to this date (62)
     *
     * 3.1.0 - 2020-02-25
     * Simplified versioning practice
     * Updated version numbers up to this date (59-61)
     *
     * 3.0.0.0 - 2020-02-09
     * Updated version numbers up to this date
     * Reordered plugins to separate Eventbrite Tickets / Yellow and adjusted code
     *
     * 2.28.2.0 - 2019-12-13
     * Added version numbers for B19.15
     * Added version numbers for AR Modal and hotfixes
     *
     * 2.26.1.0 - 2019-11-19
     * Adjusted version numbers for B19.14
     * Adjusted version numbers for G19.14 and hotfix
     * Did a whole bunch of code cleanup
     * Adjusted version numbers for G19.13
     * Removed duplicate column of Eventbrite Tickets
     *
     * 2.25.0.0 - 2019-10-29
     * Adjusted version numbers for B19.14
     * Adjusted version numbers for G19.13.1 Hotfix
     * Adjusted version numbers for G19.13
     * Removed duplicate column of Eventbrite Tickets
     *
     * 2.24.0.0 - 2019-10-10
     * Fixed Blue versioning
     *
     * 2.23.0.0 - 2019-10-06
     * Adjusted version numbers for G19.12
     *
     * 2.22.1.1 - 2019-09-26
     * Removed new markers for Green plugins (Ooops)
     *
     * 2.22.1.0 - 2019-09-26
     * Adjusted version numbers for B19.13 and hotfix
     *
     * 2.21.0.0 - 2019-09-24
     * Adjusted version numbers for G19.11
     *
     * 2.20.0.0 - 2019-09-06
     * Adjusted version number for ET hotfix
     * Adjusted version numbers for B19.12
     *
     * 2.19.2.1 - 2019-08-28
     * Enhanced the script so the 'note' column in the pluginHistory object can be omitted
     *
     * 2.19.2.0 - 2019-08-28
     * Adjusted version numbers for B19.11
     * Adjusted version numbers for Split Payments release
     * Adjusted version numbers for ET hotfix
     *
     * 2.18.0.0 - 2019-08-14
     * Adjusted version numbers for B19.09 and B19.10
     * Skipped a version number
     *
     * 2.16.0.0 - 2019-07-18
     * Adjusted version numbers for B19.08 and G19.09
     * Skipped a version number
     *
     * 2.14.0.0 - 2019-06-24
     * Adjusted version numbers for G19.08 and hotfix before
     *
     * 2.13.1.0 - 2019-06-12
     * Adjusted version numbers for B19.07 and hotfix
     *
     * 2.12.0.0 - 2019-05-27
     * Adjusted version numbers for G19.07
     *
     * 2.11.0.0 - 2019-05-16
     * Double down on G and B19.06
     * Skipped a version number
     *
     * 2.9.1.0 - 2019-05-07
     * TEC hotfix
     *
     * 2.9.0.0 - 2019-05-03
     * Restructured plugin order based on teams
     * Colored plugin columns based on teams
     * Adjusted version numbers for B19.05
     *
     * 2.8.3.0 - 2019-04-30
     * Adjusted version numbers for G19.05
     * Adjusted version numbers for the hotfixes after
     *
     * 2.7.0.0 - 2019-04-22
     * Adjusted version numbers for ORM
     * Adjusted version numbers for Filter Bar security fix
     *
     * 2.6.0.0 - 2019-04-01
     * Adjusted version numbers for G19.04
     *
     * 2.5.2.0 - 2019-03-30
     * Adjusted version numbers based on March hotfixes
     *
     * 2.5.0.0 - 2019-03-04
     * Added B19.03 version numbers
     *
     * 2.4.0.0 - 2019-02-26
     * Added G19.03 version numbers
     * Cleaned up and commented 'view more' related code
     *
     * 2.3.0.1 - 2019-02-23
     * Added a functionality to view more rows on click
     */
})();
