// ==UserScript==
// @name         TEC: WordPress.org Helpers
// @namespace    https://theeventscalendar.com/
// @version      0.1.0
// @description  Tweaks to improve WordPress.org experience.
// @author       bordoni
// @match        https://wordpress.org/support/*
// @match        https://*.wordpress.org/support/*
// @exclude      https://wordpress.org/support/view/pending*
// @exclude      https://*.wordpress.org/support/view/pending*
// @exclude      https://wordpress.org/support/view/spam*
// @exclude      https://*.wordpress.org/support/view/spam*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-topic-updater.user.js
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-topic-updater.user.js
// @grant        none
// ==/UserScript==

( function( $, obj ) {
    'use strict';

    /**
     * Set timeout until account has been fetched successfully.
     */
    obj.init = () => {
        $( document ).on( 'keydown', obj.onKeyDownResolve );
    };

    obj.onKeyDownResolve = ( event ) => {
        // Not the R key.
        if ( event.originalEvent.keyCode !== 82 ) {
            return;
        }

        if ( true !== event.originalEvent.metaKey ) {
            return;
        }

        if ( true !== event.originalEvent.altKey ) {
            return;
        }

        console.log( 'Resolving this Topic.' );

        const $field = $( '#topic-resolved' );

        if ( 'yes' === $field.val() ) {
            console.log( 'Topic was already resolved.' );
            event.preventDefault();
            return;
        }

        if ( 'mu' === $field.val() ) {
            console.log( 'Topic is not a support thread.' );
            event.preventDefault();
            return;
        }

        $field.val( 'yes' );
        $field.parent( 'form' ).find( 'input[type="submit"]' ).trigger( 'click' );
    };

    $( function() {
        obj.init();
    } );

    // Identify bug tickets
    let bugTicket = $( document ).text().search( /internal bug ticket reference | ticket number | bug report | bug ticket/i );

    if ( bugTicket > 0 ) {
        $( '.bbp-lead-topic .topic' ).append(`
            <div class="tamper-bug-ticket" style="background-color: #3D54FF; color: #fff; position: absolute;  padding: 4px 12px 4px 10px; right: -1px; top: 10px; border-top-left-radius: 6px; border-bottom-left-radius: 6px;">
                With Bug Ticket
            </div>
        `).css( 'border', '1px solid #3D54FF' );
    }
})( jQuery, {} );