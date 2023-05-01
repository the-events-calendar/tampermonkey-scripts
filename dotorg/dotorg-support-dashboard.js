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

/** Last Voice Start */
(function() {
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

    var i, j;
    var lastVoiceColor = '#E58000';

    // Check every line
    for( i = 0; i < x.length; i++ ) {

        for( j = 0; j < tecteam.length; j++ ) {

            // If not resolved, check if tha last voice is a team member
            var n = x[i].innerHTML.search( 'href="https://wordpress.org/support/users/' + tecteam[j] + '/"' );

            if ( n > 0 ) {
                x[i].style.borderRight = "4px solid " + lastVoiceColor;
                x[i].classList.add( 'tamper-last-voice' );
            }
        }
    }
    // Thread Status Identifier 
    var i, j;
    var resolvedColor  = '#98fb98';
    var lastVoiceColor = '#edf7ff';
    var closeColor     = '#ffe463';

    // Check every line
    for( i = 0; i < x.length; i++ ) {

        // Check if the line is resolved
        for( j = 0; j < tecteam.length; j++ ) {

            // If not resolved, check if tha last voice is a team member
            var n = x[i].innerHTML.search( 'href="https://wordpress.org/support/users/' + tecteam[j] + '/"' );
            if ( n > 0 ) {
                x[i].style.backgroundColor = lastVoiceColor;
            
                // Check if logged in user is the last voice
                if ( tecteam[j] == String(document.getElementsByClassName( 'username' )[0].innerHTML) ) {
                    x[i].classList.add( 'tamper-logged-in-ticket' );
                }

                continue;
            }

            // Check resolved Threads
            var m = x[i].innerHTML.search( 'class="resolved"' );
            if( m > 0 ) {
                x[i].style.backgroundColor = resolvedColor;
                x[i].classList.add('tamper-resolved');

                // If resolved then skip
                continue;
            }

            // Check tickets to resolve 
            // Inactive threads > 1 month
            var toStale = x[i].innerHTML.search( /[1-9] (month[s]?)/ );
            if ( toStale > 0 ) {
                x[i].classList.add( 'tamper-stale' );
                continue;
            }
            // Inactive threads > 2 weeks
            var toResolve = x[i].innerHTML.search( /[2-9] (week[s]?)/ );
            if ( toResolve > 0 ) {
                x[i].classList.add( 'tamper-inactive' );
                continue;
            }
        }
    }

})();

/** Highlighter */
jQuery(document).ready(function( $ ) {
    dayjs.extend( window.dayjs_plugin_customParseFormat );

	/*
	 * The rules here are cascading, later rules will overwrite earlier ones.
	 * This is done to ensure the right priority is applied, as some states are more important than others.
	 */

	var text, $topics, $permalink,
		icons = {
			old: '<span class="dashicons dashicons-clock" style="font-size: 18px;margin-right: 3px;top: 2px; position: relative;" aria-label="Old topic:"></span>',
			oldClosed: '<span class="dashicons dashicons-dismiss" style="font-size: 18px;margin-right: 3px;top: 2px; position: relative;" aria-label="Old and closed topic:"></span>',
			unattended: '<span class="dashicons dashicons-warning" style="font-size: 18px;margin-right: 3px;top: 2px; position: relative;" aria-label="Unattended topic:"></span>'
		},
		settings = {
			color: {
				resolved: {
					background: '#d4fcd7',
					text: 'inherit'
				},
				new: {
					background: '#faf6cf',
					text: 'inherit'
				},
				old: {
					background: '#fcedd9',
					text: 'inherit'
				},
				oldClosed: {
					background: '#eae3fc',
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

		$topics = $( '.bbp-body > ul' );
		$topics.each(function() {
            const $topic = $( this );
            const id = $topic.attr( 'id' ).replace( 'bbp-topic-', '' );
			let $permalink = $( this ).find( 'a.bbp-topic-permalink' );
			let voicecount = $( this ).find( '.bbp-topic-voice-count' ).text();
			let freshness  = $( this ).find( '.bbp-topic-freshness' ).text();
			let resolved   = $permalink.find('.resolved').length > 0;

            $topic.find( '.bbp-topic-title .bbp-topic-meta' ).prepend( `<input id="tec-select-${id}" type="checkbox" name="topics[]" value="${id}" class="tec-select-topic">` );

			/* Highlight resolved threads.
			* Resolved topics on the forums already get prepended with a check-mark tick, so we don't
			* need to add any other indicators our selves.
			*/
			if ( resolved ) {
				$( this ).css( 'background-color', settings.color.resolved.background );
				$( this ).find( 'a' ).css( 'color', settings.color.resolved.text );
			} else {
                const dateString = $( this ).find( '.bbp-topic-freshness a' ).attr( 'title' );
                const dateParts = dateString.split( ' at ' );
                const date = dayjs( dateParts[0], 'MMMM D, YYYY' );
                const isOlder6Months = date.isBefore( dayjs().subtract( 6, 'month' ) );
                const isOverdue = date.isBefore( dayjs().subtract( 2, 'days' ) );

                if ( isOlder6Months ) {
					$( this ).css( 'background-color', settings.color.oldClosed.background );
					$( this ).find( 'a' ).css( 'color', settings.color.oldClosed.text );

					$permalink.find( '.dashicons' ).not( '.wporg-ratings .dashicons' ).remove();
					$permalink.prepend( icons.oldClosed );
                    return;
                }

                if ( isOverdue ) {    
                    if( !$( '#bbp-topic-' + id ).hasClass( 'tamper-last-voice' ) ) {
                        $( this ).addClass( 'tamper-overdue' ).css( { 'background-color': '#fce4e3' } );
                    }
                    return;
                }

				/* Highlight topics that are more than a week old.
				* Prepends an icon to indicate this topic is getting old.
				*/
				if ( freshness.includes( 'week' ) || freshness.includes( 'month' ) || freshness.includes( 'year' ) ) {
					$( this ).css( 'background-color', settings.color.old.background );
					$( this ).find( 'a' ).css( 'color', settings.color.old.text );

					$permalink.find( '.dashicons' ).not('.wporg-ratings .dashicons').remove();
					$permalink.prepend( icons.old );
                }

				/* Highlight topics not yet replied to.
				* Prepends an icon to indicate this topic has gone unattended.
				*/
				if ( '1' === voicecount ) {
					$( this ).css( 'background-color', settings.color.new.background );
					$( this ).find( 'a' ).css( 'color', settings.color.new.text );
                    $( this ).addClass( 'tamper-new-ticket' );

					$permalink.find( '.dashicons' ).not('.wporg-ratings .dashicons').remove();
					$permalink.prepend( icons.unattended );
				}
			}
		});
	}

	// Run processer.
	process_topics();

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
        var totalMyPendingThreads = $( '.tamper-logged-in-ticket' ).length;
        var totalOpenThreads = $( '.tamper-new-ticket' ).length;
        var totalStaleThreads = $( '.tamper-stale' ).length;
        var totalInActiveThreads = $( '.tamper-inactive' ).length;
        var totalOverdue = $( '.tamper-overdue' ).length;
        var totalInactiveStaleThreads = Math.abs( totalInActiveThreads ) + Math.abs( totalStaleThreads );
        var totalPendingThreads = Math.abs( totalNonLastVoiceThreads );

        $( '#tec-select-all' ).on( 'change', ( event ) => {
            $( '.tec-select-topic:visible' ).prop( 'checked', $( event.target ).is( ':checked' ) );
        } );

        $( '#tec-open-in-new-tab' ).on( 'click', ( event ) => {
            event.preventDefault();
            $( '.tec-select-topic:checked' ).each(( k, topic ) => {
                GM_openInTab( $( topic ).parents( '.topic' ).eq( 0 ).find( '.bbp-topic-permalink' ).attr( 'href' ) );
            } );
        } );

        // Page Status Filter
        $( '#bbpress-forums .bbp-pagination:first' ).before( `
			<div class="support-dashboard-filter-status custom-topic-header plugin-support bbp-pagination">
                <div class="bbp-pagination-links" style="width: 100%;">
                    <a href="#toggle-all" class="support-dashboard-filter-btn page-numbers" id="tec-all">All (<b>${totalOnPageThreads}</b>)</a>
                    <a href="#toggle-my-pending" class="support-dashboard-filter-btn page-numbers" id="tec-my-pending">My Threads (<b>${totalMyPendingThreads}</b>)</a>
                    <a href="#toggle-all-pending" class="support-dashboard-filter-btn page-numbers" id="tec-all-pending">All Pending (<b>${totalPendingThreads}</b>)</a>
                    <a href="#toggle-open" class="support-dashboard-filter-btn page-numbers" id="tec-open">Open (<b>${totalOpenThreads}</b>)</a>
                    <a href="#toggle-overdue" class="support-dashboard-filter-btn page-numbers" id="tec-overdue">Overdue (<b>${totalOverdue})</a>
                    <a href="#toggle-inactive" class="support-dashboard-filter-btn page-numbers" id="tec-inactive">Inactive (<b>${totalInactiveStaleThreads}</b>)</a>
                </div>
			</div>
        ` );

        // $( '#bbpress-forums .bbp-pagination:first' ).after( `
		// 	<div class="custom-topic-header plugin-support" style="margin: 10px 5px; float: left;">
		// 		<label for="tec-select-all">
        //             <small> <input id="tec-select-all" type="checkbox"> Select Topics </small>
		// 		</label>
        //         <a href="#toggle-open" class="button button-secondary" id="tec-open-in-new-tab">Open</a>
		// 	</div>
        // ` );

		// All
		$( '#tec-all' ).click( function() {
			$( '.topic' ).show();
		});

		// My Threads
		$( '#tec-my-pending' ).click( function() {
			$( '.topic' ).not('.tamper-logged-in-ticket').toggle();
		});

		// All Pending
		$( '#tec-all-pending' ).click( function() {
			$( '.topic' ).not( '.topic:not(.tamper-last-voice)' ).toggle();
		});

		// Open
		$( '#tec-open' ).click( function() {
			$( '.topic' ).not( '.tamper-new-ticket' ).toggle();
		});

		// Overdue
		$( '#tec-overdue' ).click( function() {
			$( '.topic' ).not( '.tamper-overdue' ).toggle();
		});

		// Inactive
		$( '#tec-inactive' ).click( function() {
			$( '.topic' ).not( '.tamper-inactive, .tamper-stale' ).toggle();
		});

        // Refresh Threads
        function refreshThreads() {
			$( '.topic' ).show();
        }
    }
});

/** Highlighter End */