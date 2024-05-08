// ==UserScript==
// @name         TEC Zendesk - Support Workflow Checklist
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds a sticky note to the bottom of the page with the support workflow as a checklist
// @author       Sam Dokus
// @match        https://ithemeshelp.zendesk.com/agent/tickets*
// @grant        GM_addStyle
// ==/UserScript==

( function () {
	'use strict';

	// Create a div element for the sticky note
	const stickyNote = document.createElement( 'div' );
	stickyNote.id = 'sticky-note';

	// Template for the sticky note content
	const stickyNoteContent = `
        <div id="content">
            <h3>Support Checklist</h3>
        </div>
        <div class="hider-cell" id="hider">⚡️ Hide ⚡️</div>
    `;

	// Set innerHTML using template
	stickyNote.innerHTML = stickyNoteContent;

	// Create an unordered list for the checklist
	const checklist = document.createElement( 'ul' );

	// Add checklist items with checkboxes
	const checklistItems = [
		"Defined the experienced versus expected behavior",
		"Searched JIRA, ZD, and Slack for existing threads",
		"Completed conflict test",
		"Attempted to recreate on a sandbox",
		"Got sandbox from customer, could recreate issue",
		"Got a db dump - attempted to recreate locally",
	];

	// Template for checklist items
	const checklistItemTemplate = ( item ) => `
        <li>
            <input type="checkbox" id="${item.toLowerCase().replace( /\s/g, '-' )}" />
            <label for="${item.toLowerCase().replace( /\s/g, '-' )}">${item}</label>
        </li>
    `;

	// Populate checklist using template
	checklistItems.forEach( ( item ) => {
		checklist.innerHTML += checklistItemTemplate( item );
	} );

	// Variable to track the toggled state
	var isHidden = false;

	// Action to hide/show sticky note
	function toggleSticky() {
		const contentDiv = document.getElementById( 'content' );
		const hiderButton = document.getElementById( 'hider' );
		if ( ! isHidden ) {
			// The note is visible, switch it to hidden
			contentDiv.classList.add( 'hidden' );
			hiderButton.textContent = '⚡️ Checklist ⚡️'; // Change button text to just be small emoji
			isHidden = true;
		} else {
			// The note is hidden, switch it to visible
			contentDiv.classList.remove( 'hidden' );
			hiderButton.textContent = '⚡️ Hide ⚡️'; // Change button text to "Hide"
			isHidden = false;
		}
	}

	// Style the sticky note
	GM_addStyle( `
    #sticky-note {
        position: fixed;
        bottom: 50px;
        right: 0;
        width: 200px;
        background-color: #9FA392;
        color: #efebe9;
        padding: 10px;
        z-index: 9999;
        overflow-y: scroll;
        transition: top 1s ease;
        border-radius: 6px;
    }

    #sticky-note ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    #sticky-note li {
        margin-bottom: 20px;
        display: flex;
        align-items: flex-start;
    }

    #sticky-note input[type="checkbox"] {
        margin-right: 10px;
    }

    #sticky-note label {
        margin: 0;
        color: #efebe9;
    }

    .hider-cell {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20px;
        background: rgb(47, 57, 65);
        font-weight: bold;
        text-align: center;
        cursor: pointer;
        border-radius: 6px;
    }
    ` );

	// Add the sticky note to the document body
	document.body.appendChild( stickyNote );

	// Add the checklist to the sticky note
	document.getElementById( 'content' ).appendChild( checklist );
	toggleSticky();

	// Add event listener for toggling action
	document.getElementById( 'hider' ).addEventListener( 'click', toggleSticky );

} )();
