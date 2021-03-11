// ==UserScript==
// @name         LiveAgent - Clickafy URLs
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Make the Jira issue tracker IDs, the user ID, the user's website, the url, and the sandbox site URL clickable in LiveAgent.
// @author       Andras Guseo
// @include      https://support.theeventscalendar.com/agent/*
// @include      https://theeventscalendar.ladesk.com/agent/*
// @include      https://help.loxi.io/agent/*
// @include      https://loxi.ladesk.com/agent/*
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/liveagent/liveagent-clickafy-urls.user.js
// @grant        none
// ==/UserScript==

(function() {
		'use strict';

		// If you set this to true you will see log messages in the console
		var log = false;

		console.log( 'Starting Clickafy Script' );

		// Run the script every 5 seconds. This is necessary due to the dynamic nature of LiveAgent
		var startScript = window.setInterval( clickableScript, 5000 );

		// Variables
		var fields = [ "Central ID", "Issue Tracker ID", "Site's URL", "WordPress ID", "Sandbox URL", "url", "braintree_url" ];
		var field = "",
			url = "",
			alreadyDone = false,
			countingRuns = 0,
			maxRuns = 15;

		// Script to run
		function clickableScript() {

			// Get the rows is an object
			var rows = document.getElementsByClassName( 'gwt-TextBox' );

			// Walk the object
			for( var i = 0; i < rows.length; i++ ) {
				var exists = false;

				// Get the HTML from the row
				field = rows[ i ].name;

				// If it's not a field we're looking for, then skip.
				if ( fields.indexOf( field ) < 0 ) {
					if ( log ) console.log( 'Skipped. Field not in array: ' + field );
					countingRuns++;
					if ( log ) console.log( 'Script ran ' + countingRuns + ' times so far. (Non-matching field.)' );
					continue;
				}

				// Create the id for the field
				var id = field.toLowerCase().replace( ' ', '-' ).replace( "'", '' );
				if ( log ) console.log( 'ID: ' + id );

				// Check if the ID exists. If it exists it means we already created it, so skip.
				if ( null != document.getElementById( id ) ) {
					if ( log ) console.log( 'Skipped at ID: ' + id );
					exists = true;
				}

				// If the icon doesn't exist yet, then create.
				if ( false === exists ) {
					if ( log ) console.log( 'Creating icon' );

					// Now we can start creating...

					// Get the value of the field
					var val = rows[ i ].value;
					if ( log ) console.log( field + ': ' + val );

					// If they are URLs, then use the value
					if ( val.search( 'http' ) >= 0 ) {
						if ( log ) console.log( "Found 'http', using value as URL. . " + val );
						url = val;
					} else if ( field == "Site's URL" || field == 'url' ) {
						if ( log ) console.log( "Found Site's URL - " + val );
						url = 'https://' + val;
					} else if ( field == "WordPress ID" ) {
						if ( log ) console.log( "Found WordPress ID - " + val );
						url = 'https://theeventscalendar.com/wp-admin/user-edit.php?user_id=' + val;
					} else if ( field == "Issue Tracker ID" || field == "Central ID" ) {
						if ( log ) console.log( "Found Issue Tracker ID - " + val );
						/* If it doesn't contain a dash, then it's Central */
						if ( val.search( '-' ) < 0 ) {
							if ( log ) console.log( "Found Central - " + val );
							url = 'https://central.tri.be/issues/';
						}
						/* Otherwise it is Jira */
						else {
							if ( log ) console.log( "Found Jira - " + val );
							url = 'https://theeventscalendar.atlassian.net/browse/';
						}
						url = url + val;
					}

					// Creating the container.
					var linkContainer = document.createElement( 'span' );
					linkContainer.id = id;
					linkContainer.innerHTML = '<a href="' + url + '" target="_blank" title="Open link in new window">👁️</a>';
					linkContainer.style = 'position: absolute; right: 10px; z-index: 9;';
					rows[ i ].parentNode.insertBefore( linkContainer, rows[ i ] );

					alreadyDone = true;
					if ( log ) console.log( "Script ran. Setting variable true." );

					countingRuns++;
					if ( log ) console.log( "Script ran " + countingRuns + " times so far." );

				} // for ( var i=0; i<rows.length; i++ )
			}

		} // function clickableScript
	}
	/**
	 * Changelog
	 *
	 * 2.3 - 2021-03-05
	 * - Adjusted script to run when needed and only when needed.
	 * - Added Braintree URL field to be recognized.
	 * - Script now also runs on Loxi LiveAgent.
	 *
	 * 2.2 - 2021-02-28
	 * - Script now doesn't stop after finding the first field.
	 * - The 'url' field is also recognized.
	 * - Script stops if it already has found results.
	 * - Script stops if it ran a defined max number of times without success.
	 *
	 * 2.1 - 2021-01-11
	 * - The URL is now pointing to the new Jira instance.
	 * - The download URL is now pointing to the new GitHub repo.
	 *
	 * 2.0 - 2020-09-23
	 * - Re-wrote the script to make it work with updated LiveAgent fields
	 *
	 * 1.1 - 2020-01-14
	 * - Fixed a glitch where the user's site URL was added to the Jira Issue Tracker URL
	 *
	 * 1.0 - 2020-01-07
	 * - Adjusted to make it work with both Central and Jira ticket IDs
	 * - Renamed file and updated download URL
	 *
	 * 0.5 - 2019-09-26
	 * - The script now handles Sandbox URL as well
	 *
	 * 0.4 - 2019-09-06
	 * - The script now correctly handles central tickets with full URL
	 */


)();
