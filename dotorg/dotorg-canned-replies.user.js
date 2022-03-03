// ==UserScript==
// @name         TEC: WordPress.org Canned Replies
// @namespace    https://theeventscalendar.com/
// @version      0.1.1
// @description  Add canned replies to WordPress.org support forums.
// @author       lelandf
// @match        https://wordpress.org/support/*
// @match        https://*.wordpress.org/support/*
// @exclude      https://wordpress.org/support/view/pending*
// @exclude      https://*.wordpress.org/support/view/pending*
// @exclude      https://wordpress.org/support/view/spam*
// @exclude      https://*.wordpress.org/support/view/spam*
// @resource     cannedReplies https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/canned-replies.json
// @require      https://raw.githubusercontent.com/lodash/lodash/4.17.15-npm/lodash.min.js
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-canned-replies.user.js
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-canned-replies.user.js
// @grant        GM_getResourceText
// ==/UserScript==

( function( obj, _, $ ) {
    'use strict';
    // Configure the LoDash Template
    _.templateSettings.interpolate = /{{ *([\s\S]+?) *}}/g;

    obj.data = JSON.parse( GM_getResourceText( 'cannedReplies' ) );


    /**
     * Initialize the script.
     */
    obj.init = () => {
        obj.insertHTML();
        obj.changeListener();
    };

    obj.getCannedReplies = () => {
        return obj.data.replies;
    }

    obj.insertHTML = () => {
        const form = document.getElementById( 'new-post' );
        const replies = obj.getCannedReplies();

        let HTML;

        HTML = '<select id="canned-replies"><option value="">Select a canned reply</option>';

        replies.forEach( ( { title, content, id } ) => {
            HTML += `<option value="${id}">${title}</option>`;
        } );

        HTML += '</select>';

        form.insertAdjacentHTML( 'afterbegin', HTML );
    };

    obj.changeListener = () => {
        const select = document.getElementById( 'canned-replies' );
        const textarea = document.getElementById( 'bbp_reply_content' );

        select.addEventListener( 'change', ( event ) => {
            event.preventDefault();
            const reply = _.find( obj.getCannedReplies(), { id: event.target.value } );
            const insertedText = obj.processVariables( reply );

            textarea.setRangeText( insertedText, textarea.selectionStart, textarea.selectionEnd, 'select' );
        } );
    };

    obj.processVariables = ( reply ) => {
        const context = {
            'name': $( '.bbp-lead-topic .bbp-user-nicename' ).text().replace( '(', '' ).replace( '}', '' ),
            'plugin_url': $( '.entry-meta.sidebar .plugin-meta-icon' ).next( 'li' ).find( 'a' ).attr( 'href' ),
        };

        let compiledTemplate;
        let content = reply.content;
        let hasError = false;
        let html = '';

        do {
            hasError = false;
            try {
                compiledTemplate = _.template( content );
                html = compiledTemplate( context )
            } catch ( error ) {
                hasError = true;
                let varName = error.message.replace( ' is not defined', '' );
                let regexVarName = new RegExp( '{{ *' + varName + ' *}}', 'gi' )
                content = content.replaceAll( regexVarName, `<!-- Undefined Variable: ${varName} -->` );
            }
        } while( true === hasError );

        return html;
    };

    obj.init();
})( {}, _, jQuery );
