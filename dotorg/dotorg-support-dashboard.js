// ==UserScript==
// @name         TEC: WordPress.org Support Dashboard
// @namespace    https://theeventscalendar.com/
// @version      0.1.0
// @description  Support Dashboard Script
// @author       abzdmachinist
// @match        https://wordpress.org/support/*
// @match        https://*.wordpress.org/support/*
// @exclude      https://wordpress.org/support/view/pending*
// @exclude      https://*.wordpress.org/support/view/pending*
// @exclude      https://wordpress.org/support/view/spam*
// @exclude      https://*.wordpress.org/support/view/spam*
// @require      https://raw.githubusercontent.com/lodash/lodash/4.17.15-npm/lodash.min.js
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @require      https://unpkg.com/dayjs@1.8.21/plugin/customParseFormat.js
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-support-dashboard.js
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-support-dashboard.js
// @grant        GM_getResourceText
// @grant        GM_openInTab
// ==/UserScript==

// Thread Status Identifier 
var i, j;
var lastVoiceColor = '#E58000';
var resolvedColor = '#379200';
var closeColor = '#ffe463';
var pendingColor = '#73BADC';
var openColor = '#EECB44';
var overdueColor = '#D63F36';
var inactiveColor = '#3D54FF';

// Initialize Script
jQuery( document ).ready( function( $ ) {
    'use strict';
    
    // Get all lines in an array
    var x = document.getElementsByClassName( 'type-topic' );
    
    // TEC team members
    var tecteam = [
        'abinders',                     // Aaron Binders                - 2022-06-13
        'abzlevelup',                   // Abz Abdul                    - 2021-07-19
        'aguseo',                       // Andras Guseo                 - 2016-04-25
        'alaasalama',                   // Alaa Salama                  - 2018-11-19 to 2020-08-31
        'allenzamora',                  // Allen Zamora                 - 2021-08-23
        'barryhughes-1',                // Barry Hughes                 - xxxx-xx-xx to 2020-07-31
        'bordoni',                      // Gustavo Bordoni
        'brianjessee',                  // Brian Jessee                 - 2014-xx-xx
        'borkweb',                      // Mattew Batchelder            - 2015-xx-xx
        'brook-tribe',                  // Brook                        - xxxx-xx-xx to 2017-xx-xx
        'bskousen3',                    // Brendan Skousen              - 2017-10-23 to 2021
        'camwynsp',                     // Stephen Page                 - 2018-xx-xx
        'cheskatec',                    // (Fran)Cheska Aguiluz         - 2022-04-18
        'chikaibeneme',                 // Chika Ibeneme                - 2020-02-10
        'cliffpaulick',                 // Clifford Paulick             - 2015 to 2020
        'cliffseal',                    // Cliff Seal - Pardot
        'cmccullough1967',              // Chad McCollough              - 2021-08-23
        'courane01',                    // Courtney Robertson           - 2017-02-22 to 2020
        'cswebd3v',                     // Chris Swenson                - 2020-09-01 to 2021-12-31
        'd0153',                        // Darian Baldazotes            - 2022-01-17
        'deblynprado',                  // Deblyn Prado                 - 2019-04-11
        'djbramer',                     // Dan Bramer
        'eeide',                        // Erica Eide                   - 2021-05-24
        'erishel',                      // Edward Rishel                - 2018-03-12 to 2018-12-31
        'eugenekyale',                  // Eugene Kyale                 - 2020-09-01
        'eugenetribe',                  // Eugene Kyale                 - 2020-09-01
        'geoffbel',                     // Geoffroy 'LeGeoff' Belanger  - 2016-01-20
        'geoffgraham',                  // Geoff Graham                 - 2014 (?)
        'ggwicz',                       // George Gecewicz              - xxxx-xx-xx to 2017-xx-xx
        'greventscalendar',             // Gladys Roldan                - 2022-04-04
        'gugaalves',                    // Gustavo "Guga" Alves         - 2021-08-23
        'highprrrr',                    // James Welbes                 - 2021-02-01
        'iammarta',                     // Marta Kozak                  - 2020-09-01
        'iirvin',                       // Iris Irvin                   - 2022-06-13
        'jaimemarchwinski',             // Jaime Marchwinski            - 2017-08-31
        'jdbeacham',                    // John Beacham                 - 2022-03-08
        'jeanabarquez',                 // Jean Abarquez                - 2022-03-22
        'jentheo',                      // Jennifer Theodore            - 2017-05-08
        'jeremy80',                     // Jeremy Marchandeau           - 2018-03-26 to 2020
        'joshlevelupsupport2021',       // Joshua Cagasan               - 2021-07-19
        'juanfra',                      // Juan Francisco Aldasoro      -
        'kevfortec',                    // Kevin Suson                  - 2022-04-18
        'koriashton',                   // Kori Ashton                  - 2020-09-01 to 2020
        'kutatishh',                    // Kudzai                       -            to 2022-08-18
        'latoyam1',                     // LaToya Murray                - 2017       to 2022-09-09
        'leahkoerper',                  // Leah Koerper                 - since forevah
        'lelandf',                      // Leland Fliegel               - 2021-xx-xx to
        'lucasbustamante',              // Lucas Bustamante             - 2020-03-30 to 2020
        'mandraagora',                  // Wolf Bishop                  - 2020-03-04
        'masoodak',                     // Masood Khan                  - 2020-09-01
        'matumu',                       // Marho Atumu                  - 2020-09-01
        'mitogh',                       // Crisoforo Hernandez          - 2018 (?)
        'neillmcshea',                  // Neill McShae                 - 2015-xx-xx to
        'nicosantos',                   // Nico Santos                  - 2015-xx-xx to 2019-xx-xx
        'nikrosales',                   // Nik Rosales                  - 2020-02-24 to 2020-12-31
        'patriciahillebrandt',          // Patricia Hillebrandt         - 2017-06-09 to 2021-08-15
        'rafsuntaskin',                 // Rafsun Chowdhury             - 2020-03-30
        'robelemental',                 // Rob Liy                      - 2021-05-24
        'sdenike',                      // Shelby DeNike                - 2018-10-08 to 2019-08-31
        'sdokus',                       // Samantha "Sami" Dokus        - 2022-08-08
        'shatterdorn1',                 // Truman Dorn                  - 2021-03-01
        'sjaure',                       // Santiago Jaureguiberry       - 2019-05-26
        'skyshab',                      // Jason 'Sky' Shabatura        - 2018-01-02
        'tdorn',                        // Truman Dorn (2)              - 2021-03-01
        'tecphil',                      // Phil Hodges (Community Mgr)  - 2021-04 to 2021-08
        'theeventscalendar',            // The Events Calendar          - 2020-12-18
        'tokyobiyori',                  // Ali Darwich                  - 2018-11-19
        'translationsbymoderntribe',    // Modern Tribe Translations    - 2020-03-30
        'tribalmike',                   // Mike Cotton                  - 2018-10-11
        'tribecari',                    // Caroline                     - 2016-05-16 to 2017-12-31
        'tristan083',                   // Tristan Pepito               - 2022-01-17
        'vicskf',                       // Victor Zarranz               - 2017-xx-xx
        'zbtirrell',                    // Zach Tirrell                 - 2015-xx-xx to
    ];
    
    /** Highlighter */
    dayjs.extend( window.dayjs_plugin_customParseFormat );
    
    /*
    * The rules here are cascading, later rules will overwrite earlier ones.
    * This is done to ensure the right priority is applied, as some states are more important than others.
    */
    
    var text, $topics, $permalink,
    icons = {
        old: '<span class="dashicons dashicons-clock" style="font-size: 18px;margin-right: 3px;top: 2px; position: relative;" aria-label="Old topic:"></span>',
        oldClosed: '<span class="dashicons dashicons-dismiss" style="font-size: 18px;margin-right: 3px;top: 2px; position: relative;" aria-label="Old and closed topic:"></span>',
        unattended: '<span class="dashicons dashicons-warning" style="font-size: 18px;margin-right: 3px;top: 2px; position: relative;" aria-label="Unattended topic:"></span>',
        overdue: '<span class="dashicons dashicons-clock" style="font-size: 18px;margin-right: 3px;top: 2px; position: relative;" aria-label="Overdue:"></span>',
        lastVoice: '<span class="dashicons dashicons-businessperson" style="font-size: 18px;margin-right: 3px;top: 2px; position: relative;" aria-label="User:"></span>',
    },
    settings = {
        color: {
            resolved: {
                background: 'inherit',
                text: 'inherit'
            },
            new: {
                background: 'inherit',
                text: 'inherit'
            },
            old: {
                background: 'inherit',
                text: 'inherit'
            },
            oldClosed: {
                background: 'inherit',
                text: 'inherit'
            }
        },
        nonPOrT: false // Non-Plugin or Theme highlighting
    };
    
    function should_topics_process() {
        if (settings.nonPOrT) {
            return true;
        }
        
        return window.location.href.match(/\/support\/(theme|plugin)\/*/g);
    }
    
    function process_topics() {
        if ( ! should_topics_process() ) {
            return false;
        }
        
        // Last Voice Checker
        for( i = 0; i < x.length; i++ ) {
            
            // Check if the line is resolved
            for( j = 0; j < tecteam.length; j++ ) {
                
                // If not resolved, check if tha last voice is a team member
                var n = x[i].innerHTML.search( 'href="https://wordpress.org/support/users/' + tecteam[j] + '/"' );
                if ( n > 0 ) {
                    // x[i].style.backgroundColor = lastVoiceColor;
                    // x[i].style.borderRight = "4px solid " + lastVoiceColor;
                    x[i].classList.add( 'tamper-last-voice' );
                    
                    // Check if logged in user is the last voice
                    if ( tecteam[j] == String(document.getElementsByClassName( 'username' )[0].innerHTML) ) {
                        x[i].classList.add( 'tamper-logged-in' );
                    }
                    continue;
                }
                
                // Check resolved Threads
                var m = x[i].innerHTML.search( 'class="resolved"' );
                if( m > 0 ) {
                    x[i].classList.add( 'tamper-resolved' );
                    // If resolved then skip
                    continue;
                }
                
                // Inactive threads > 2 weeks
                var toResolve = x[i].innerHTML.search( /[2-4] (week[s]?)/ );
                if ( toResolve > 0 ) {
                    x[i].classList.add( 'tamper-inactive' );
                    continue;
                }
            }
        }
        
        // Highlighter
        $topics = $( '.bbp-body > ul' );
        $topics.each( function() {
            const $topic = $( this );
            const id = $topic.attr( 'id' ).replace( 'bbp-topic-', '' );
            var $permalink = $( this ).find( 'a.bbp-topic-permalink' );
            var voicecount = $( this ).find( '.bbp-topic-voice-count' ).text();
            var freshness = $( this ).find( '.bbp-topic-freshness' ).text();
            var resolved = $permalink.find( '.resolved' ).length > 0;
            
            $topic.find( '.bbp-topic-title .bbp-topic-meta' ).append( `<div class="tamper-label-container"><label class="tamper-label"></label></div>` );
            
            // Stale Threads Months and Years
            if ( freshness.search( /(month?|year?)/ ) > 0 ) {
                if( $( '#bbp-topic-' + id ).hasClass( 'tamper-last-voice' ) ) {
                    $( this ).addClass( 'tamper-stale' );
                    $permalink.prepend( icons.overdue );
                }
            }
            
            /** 
            * Highlight resolved threads.
            * Resolved topics on the forums already get prepended with a check-mark tick, so we don't
            * need to add any other indicators our selves.
            */
            if ( resolved ) {
                $( this ).find( 'a' ).css( 'color', settings.color.resolved.text );
            } else {
                const dateString = $( this ).find( '.bbp-topic-freshness a' ).attr( 'title' );
                const dateParts = dateString.split( ' at ' );
                const date = dayjs( dateParts[0], 'MMMM D, YYYY' );
                const isOlder6Months = date.isBefore( dayjs().subtract( 6, 'month' ) );
                const isOverdue = date.isBefore( dayjs().subtract( 2, 'day' ) );
                
                // Highlight Stale
                if ( isOlder6Months ) {
                    $( this ).find( 'a' ).css( 'color', settings.color.oldClosed.text );
                    $( this ).addClass( 'tamper-stale' );
                    
                    $permalink.find( '.dashicons' ).not( '.wporg-ratings .dashicons' ).remove();
                    $permalink.prepend( icons.oldClosed );
                    return;
                }
                
                // Highlight Overdue
                if ( isOverdue ) {    
                    if( !$( '#bbp-topic-' + id ).hasClass( 'tamper-last-voice' ) ) {
                        $( this ).addClass( 'tamper-overdue' );
                        $permalink.prepend( icons.overdue );
                    }
                    return;
                }
                
                /** 
                * Highlight topics that are more than a week old.
                * Prepends an icon to indicate this topic is getting old.
                */
                if ( freshness.includes( 'week' ) || freshness.includes( 'month' ) || freshness.includes( 'year' ) ) {
                    // $( this ).find( 'a' ).css( 'color', settings.color.old.text );
                    
                    $permalink.find( '.dashicons' ).not( '.wporg-ratings .dashicons' ).remove();
                    $permalink.prepend( icons.old );
                }
                
                /** 
                * Highlight topics not yet replied to.
                * Prepends an icon to indicate this topic has gone unattended.
                */
                if ( '1' === voicecount ) {
                    // $( this ).find( 'a' ).css( 'color', settings.color.new.text );
                    $( this ).addClass( 'tamper-new' );
                    
                    $permalink.find( '.dashicons' ).not( '.wporg-ratings .dashicons' ).remove();
                    $permalink.prepend( icons.unattended );
                }
            }
        });
    }
    
    // Run processer.
    process_topics();
    
    // Identify bug tickets
    if ( $( 'body' ).is( '.single-topic' ) ) {
        var bugTicket = $( document ).text().search( /\b(?:bug ticket|internal ref|internal bug ticket reference|bug ticket reference)\b/gi );
        
        if ( bugTicket > 0 ) {
            $( '.bbp-lead-topic .topic' ).append(`
            <div class="tamper-bug-ticket" style="background-color: #3D54FF; color: #fff; padding: 4px 12px 4px 10px; right: -1px; top: 10px; border-top-left-radius: 6px; border-bottom-left-radius: 6px; position: absolute;">
            With Bug Ticket
            </div>
            `).css( 'border', '0px solid #3D54FF' );
        }
    }
    
    /**
    * Status Filter per Page
    * All
    * My Threads - Logged in user's threads
    * All Pending - Pending threads needed response
    * Open - New and Unassigned
    * Overdue - Tickets for more than 2 days
    * Inactive - Stale tickets for 2 weeks
    */
    if ( $( 'body' ).is( '.bbp-view.archive' ) ) {
        var totalOnPageThreads = $( '.topic' ).length;
        var totalNonLastVoiceThreads = $( '.topic:not(.tamper-last-voice)' ).length;
        var totalMyPendingThreads = $( '.tamper-logged-in' ).length;
        var totalOpenThreads = $( '.tamper-new' ).length;
        var totalOverdue = $( '.tamper-overdue' ).length;
        var totalInactiveStaleThreads = $( '.tamper-inactive, .tamper-stale' ).length;
        var totalPendingThreads = Math.abs( totalNonLastVoiceThreads  );
        
        // Follow Up
        $( '.topic:not(.tamper-last-voice, .tamper-new, .tamper-resolved, .tamper-overdue)' ).addClass( 'tamper-follow-up' );
        // Label Status
        $( '.tamper-label-container' ).css({ 'margin': '10px 0 5px' });
        $( '.tamper-label' ).css({ 'background-color': 'none', 'padding': '5px 15px', 'border-radius': '17px', 'text-transform': 'uppercase', 'font-weight': 'bold' });
        // Label Status Filter
        $( '.tamper-new' ).find( '.tamper-label' ).html( 'open' ).css({ 'background-color': openColor });
        $( '.tamper-follow-up' ).find( '.tamper-label' ).html( 'pending' ).css({ 'background-color': pendingColor, 'border': '1px solid ' + pendingColor, 'color': '#FFF' });
        $( '.tamper-overdue' ).find( '.tamper-label' ).html( 'overdue' ).css({ 'background-color': 'inherit', 'border': '1px solid ' + overdueColor, 'color': overdueColor });
        $( '.tamper-last-voice' ).find( '.tamper-label' ).html( 'answered' ).css({ 'background-color': lastVoiceColor, 'border': '1px solid ' + lastVoiceColor, 'color': '#FFF' });
        $( '.tamper-resolved' ).find( '.tamper-label ').html( 'resolved' ).css({ 'background-color': resolvedColor, 'border': '1px solid ' + resolvedColor, 'color': '#FFF' });
        $( '.tamper-inactive' ).find( '.tamper-label' ).html( 'inactive' ).css({ 'background-color': inactiveColor, 'border': '1px solid ' + inactiveColor, 'color': '#FFF' });
        $( '.tamper-stale' ).find( '.tamper-label' ).html( 'stale' ).css({ 'background-color': '#FFF', 'border': '1px solid ' + inactiveColor, 'color': inactiveColor });

        
        // Select All Threads
        $( '#tec-select-all' ).on( 'change', ( event ) => {
            $( '.tec-select-topic:visible' ).prop( 'checked', $( event.target ).is( ':checked' ) );
        } );
        
        // Open New Tab Threads
        $( '#tec-open-in-new-tab' ).on( 'click', ( event ) => {
            event.preventDefault();
            $( '.tec-select-topic:checked' ).each(( k, topic ) => {
                GM_openInTab( $( topic ).parents( '.topic' ).eq( 0 ).find( '.bbp-topic-permalink' ).attr( 'href' ) );
            } );
        } );
        
        // Page Status Filter
        $( '#bbpress-forums .bbp-pagination:first' ).after( `
        <div class="support-dashboard-filter-status custom-topic-header plugin-support bbp-pagination">
            <div class="bbp-pagination-links" style="width: 110%; justify-content: right;">
                <a href="#toggle-all" class="support-dashboard-filter-btn page-numbers" id="tec-all">All (${totalOnPageThreads})</a>
                <a href="#toggle-my-pending" class="support-dashboard-filter-btn page-numbers" id="tec-my-pending"><span class="support-filter-label" style="background-color:${pendingColor}"></span> My Threads (${totalMyPendingThreads})</a>
                <a href="#toggle-all-pending" class="support-dashboard-filter-btn page-numbers" id="tec-all-pending"><span class="support-filter-label" style="background-color:${pendingColor}"></span> All Pending (${totalPendingThreads})</a>
                <a href="#toggle-open" class="support-dashboard-filter-btn page-numbers" id="tec-open"><span class="support-filter-label" style="background-color:${openColor}"></span> Open (${totalOpenThreads})</a>
                <a href="#toggle-overdue" class="support-dashboard-filter-btn page-numbers" id="tec-overdue"><span class="support-filter-label" style="background-color:${overdueColor}"></span> Overdue (${totalOverdue})</a>
                <a href="#toggle-inactive" class="support-dashboard-filter-btn page-numbers" id="tec-inactive"> Inactive (${totalInactiveStaleThreads})</a>
            </div>
        </div>
        `);
        
        $( '.support-dashboard-filter-btn' ).click(function () {
            $( '.support-dashboard-filter-btn' ).removeClass( 'current' );
            $( this ).addClass( 'current' );   
        });
        
        $( '.support-filter-label' ).css({
            'border-radius': '50px',
            'width': '8px',
            'height': '8px',
            'display': 'inline-block' 
        });
        
        // All
        $( '#tec-all' ).click( function() {
            $( '.topic' ).show();
        });
        
        // My Threads
        $( '#tec-my-pending' ).click( function() {
            $( '.topic' ).show().not('.tamper-logged-in').toggle();
        });
        
        // All Pending
        $( '#tec-all-pending' ).click( function() {
            $( '.topic' ).show().not( '.topic:not(.tamper-last-voice):not(.tamper-resolved)' ).toggle();
        });
        
        // Open
        $( '#tec-open' ).click( function() {
            $( '.topic' ).show().not( '.tamper-new' ).toggle();
        });
        
        // Overdue
        $( '#tec-overdue' ).click( function() {
            $( '.topic' ).show().not( '.tamper-overdue' ).toggle();
        });
        
        // Inactive
        $( '#tec-inactive' ).click( function() {
            $( '.topic' ).show().not( '.tamper-inactive, .tamper-stale' ).toggle();
        });
        
        // Refresh Threads
        function refreshThreads() {
            $( '.topic' ).show();
        }
    }
});
/**
 * ToDo: Create a feature for canned replies via blocks or a reference link/URL
 */
