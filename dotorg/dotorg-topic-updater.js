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
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-topic-updater.js
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-topic-updater.js
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
})( jQuery, {} );

