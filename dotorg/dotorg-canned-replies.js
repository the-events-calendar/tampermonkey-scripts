// ==UserScript==
// @name         TEC: WordPress.org Canned Replies
// @namespace    https://theeventscalendar.com/
// @version      0.1.0
// @description  Add canned replies to WordPress.org support forums.
// @author       lelandf
// @match        https://wordpress.org/support/*
// @match        https://*.wordpress.org/support/*
// @exclude      https://wordpress.org/support/view/pending*
// @exclude      https://*.wordpress.org/support/view/pending*
// @exclude      https://wordpress.org/support/view/spam*
// @exclude      https://*.wordpress.org/support/view/spam*
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-canned-replies.js
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-canned-replies.js
// @grant        none
// ==/UserScript==

( function( obj ) {
    'use strict';

    /**
     * Initialize the script.
     */
    obj.init = () => {
        obj.insertHTML();
        obj.changeListener();
    };

    // @todo: get this from a json file
    obj.getCannedReplies = () => {
        return [
            {
                title: 'Premium product',
                content: 'Hey! This is a premium product. So go submit a support ticket.'
            },
            {
                title: 'Conflict test',
                content: 'Hey! This sounds like a conflict with another plugin. Do a conflict test and let us know how it goes.'
            }
        ];
    }

    obj.insertHTML = () => {
        const form = document.getElementById( 'new-post' );
        const replies = obj.getCannedReplies();

        let HTML;

        HTML = '<select id="canned-replies"><option value="">Select a canned reply</option>';

        replies.forEach( ( { title, content } ) => {
            HTML += `<option value="${content}">${title}</option>`;
        } );

        HTML += '</select>';

        form.insertAdjacentHTML( 'afterbegin', HTML );
    };

    obj.changeListener = () => {
        const select = document.getElementById( 'canned-replies' );
        const textarea = document.getElementById( 'bbp_reply_content' );

        select.addEventListener( 'change', ( event ) => {
            event.preventDefault();

            textarea.setRangeText( event.target.value, textarea.selectionStart, textarea.selectionEnd, 'select' );
        } );
    };

    obj.init();
})( {} );
