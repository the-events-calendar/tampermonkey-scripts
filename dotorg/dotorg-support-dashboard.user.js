// ==UserScript==
// @name         TEC: WordPress.org Support Dashboard
// @namespace    https://theeventscalendar.com/
// @version      1.0.0
// @description  Support Dashboard Script
// @author       abzdmachinist
// @match        https://wordpress.org/support/*
// @match        https://*.wordpress.org/support/*
// @match        https://wordpress.org/support/plugin/the-events-calendar/*
// @match        https://wordpress.org/support/plugin/event-tickets/*
// @match        https://wordpress.org/support/plugin/gigpress/*
// @match        https://wordpress.org/support/plugin/advanced-post-manager/*
// @match        https://wordpress.org/support/plugin/image-widget/*
// @exclude      https://wordpress.org/support/view/pending*
// @exclude      https://*.wordpress.org/support/view/pending*
// @exclude      https://wordpress.org/support/view/spam*
// @exclude      https://*.wordpress.org/support/view/spam*
// @exclude      https://wordpress.org/support/view/*
// @require      https://raw.githubusercontent.com/lodash/lodash/4.17.15-npm/lodash.min.js
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @require      https://unpkg.com/dayjs@1.8.21/plugin/customParseFormat.js
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-support-dashboard.user.js
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-support-dashboard.user.js
// @resource     tecTeam https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/team.json
// @grant        GM_getResourceText
// @grant        GM_openInTab
// ==/UserScript==

// Thread Status Identifier
var i, j;
var lastVoiceColor = '#E58000';
var resolvedColor = '#379200';
var resolvedFollowUpColor = '#BE39E3';
var closeColor = '#FFE463';
var openColor = '#73BADC';
var newColor = '#EECB44';
var overdueColor = '#D63F36';
var inactiveColor = '#3D54FF';

// Initialize Script
jQuery( document ).ready( function( $ ) {
	'use strict';

	// Get all lines in an array
	var x = document.getElementsByClassName( 'type-topic' );

	// Get from resource team.json then covert it to array()
	var jsonString = GM_getResourceText( 'tecTeam' );

	// Remove single-line comments (//)
	var jsonTECTeam = jsonString.replace(/\/\/.*$/gm, '');

	// Remove multi-line comments (/* ... */)
	jsonTECTeam = jsonTECTeam.replace(/\/\*[\s\S]*?\*\//g, '');

	// Parse the modified JSON data
	var data = JSON.parse(jsonTECTeam);

	// Access the team array
	var tecteam = data.team;

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

					// There are new users that did not complete the registration and name, showing a bug that username is not avaiable and using display name
					var username = document.getElementsByClassName( 'username' ).length > 0 ? document.getElementsByClassName( 'username' )[0].innerHTML : null;
					var display_name = document.getElementsByClassName( 'display-name' ).length > 0 ? document.getElementsByClassName( 'display-name' )[0].innerHTML : null;

					// Check if logged in user is the last voice
					if ( tecteam[j] == username || tecteam[j] == display_name ) {
						x[i].classList.add( 'tamper-logged-in' );
						continue;
					}
				}

				// Inactive threads > 2 weeks
				var toResolve = x[i].innerHTML.search( /[2-4] (week[s]?)/ );
				if ( toResolve > 0 ) {
					x[i].classList.add( 'tamper-inactive' );
					continue;
				}

				// Check resolved Threads
				var m = x[i].innerHTML.search( 'class="resolved"' );
				if ( m > 0 ) {
					x[i].classList.add( 'tamper-resolved' );
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
				const isOverdue = date.isBefore( dayjs().subtract( 3, 'day' ) );

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
	* All Open - Open threads needed response
	* New - New and Unassigned
	* Overdue - Tickets for more than 2 days
	* Inactive - Stale tickets for 2 weeks
	*/
	if ( $( 'body' ).is( '.bbp-view.archive' ) ) {
		var totalOnPageThreads = $( '.topic' ).length;
		var totalNonLastVoiceThreads = $( '.topic:not(.tamper-last-voice, .tamper-new)' ).length;
		var totalMyOpenThreads = $( '.tamper-logged-in' ).length;
		var totalNewThreads = $( '.tamper-new' ).length;
		var totalOverdue = $( '.tamper-overdue' ).length;
		var totalInactiveStaleThreads = $( '.tamper-inactive, .tamper-stale' ).length;
		var totalOpenThreads = Math.abs( totalNonLastVoiceThreads  );
		// Label Status
		$( '.tamper-label-container' ).css({ 'margin': '10px 0 5px' });
		$( '.tamper-label' ).css({ 'background-color': 'none', 'padding': '5px 15px', 'border-radius': '17px', 'text-transform': 'uppercase', 'font-weight': 'bold' });
		// Follow Up
		$( '.topic:not(.tamper-last-voice, .tamper-new, .tamper-overdue)' ).addClass( 'tamper-open' );
		// Label Status Filter
		$( '.tamper-new' ).find( '.tamper-label' ).html( 'new' ).css({ 'background-color': newColor });
		$( '.tamper-open' ).find( '.tamper-label' ).html( 'open' ).css({ 'background-color': openColor, 'border': '1px solid ' + openColor, 'color': '#FFF' });
		$( '.tamper-overdue' ).find( '.tamper-label' ).html( 'overdue' ).css({ 'background-color': 'inherit', 'border': '1px solid ' + overdueColor, 'color': overdueColor });
		$( '.tamper-last-voice' ).find( '.tamper-label' ).html( 'answered' ).css({ 'background-color': lastVoiceColor, 'border': '1px solid ' + lastVoiceColor, 'color': '#FFF' });
		$( '.tamper-inactive' ).find( '.tamper-label' ).html( 'inactive' ).css({ 'background-color': inactiveColor, 'border': '1px solid ' + inactiveColor, 'color': '#FFF' });
		$( '.tamper-stale' ).find( '.tamper-label' ).html( 'stale' ).css({ 'background-color': '#FFF', 'border': '1px solid ' + inactiveColor, 'color': inactiveColor });
		$( '.tamper-resolved' ).find( '.tamper-label ').html( 'resolved' ).css({ 'background-color': resolvedColor, 'border': '1px solid ' + resolvedColor, 'color': '#FFF' });
		$( '.tamper-resolved.tamper-open' ).find( '.tamper-label ').html( 'resolved with follow up' ).css({ 'background-color': resolvedFollowUpColor, 'border': '1px solid ' + resolvedFollowUpColor, 'color': '#FFF' });

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
		<a href="#toggle-my-open" class="support-dashboard-filter-btn page-numbers" id="tec-my-open"><span class="support-filter-label" style="background-color:${openColor}"></span> My Threads (${totalMyOpenThreads})</a>
		<a href="#toggle-all-open" class="support-dashboard-filter-btn page-numbers" id="tec-all-open"><span class="support-filter-label" style="background-color:${openColor}"></span> Open (${totalOpenThreads})</a>
		<a href="#toggle-new" class="support-dashboard-filter-btn page-numbers" id="tec-new"><span class="support-filter-label" style="background-color:${newColor}"></span> New (${totalNewThreads})</a>
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
		$( '#tec-my-open' ).click( function() {
			$( '.topic' ).show().not('.tamper-logged-in').toggle();
		});

		// All Open
		$( '#tec-all-open' ).click( function() {
			$( '.topic' ).show().not( '.topic:not(.tamper-last-voice, .tamper-new)' ).toggle();
		});

		// New
		$( '#tec-new' ).click( function() {
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
* === Changelog ===
* [1.0.0] 2023-06-12
* Initial release
* [1.0.1] 2023-09-05
* Add label for "Resolved" with "Follow Up"
* Add to "Open" available under "Active Topics"
* Move the user list to an external file
*/

/**
* === To Do ===
* Create a feature for canned replies via blocks or a reference link/URL.
*/