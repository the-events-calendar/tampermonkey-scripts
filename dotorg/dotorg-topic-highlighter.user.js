// ==UserScript==
// @name         TEC: WP.org Topic highlighter
// @namespace    https://theeventscalendar.com
// @version      0.1.0
// @description  Highly based on a offical code from WP.org, add status highlights to topics for easy overviews.
// @author       bordoni
// @match        https://wordpress.org/support/*
// @match        https://*.wordpress.org/support/*
// @exclude      https://wordpress.org/support/view/pending*
// @exclude      https://*.wordpress.org/support/view/pending*
// @exclude      https://wordpress.org/support/view/spam*
// @exclude      https://*.wordpress.org/support/view/spam*
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @require      https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @require      https://unpkg.com/dayjs@1.8.21/plugin/customParseFormat.js
// @resource     configHtml https://raw.githubusercontent.com/the-events-calendar/tampermonkey-scripts/main/dotorg/options.html
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-topic-highlighter.user.js
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-topic-highlighter.user.js
// @grant        GM_getResourceText
// @grant        GM_openInTab
// ==/UserScript==

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
					background: 'rgb(203, 255, 181)',
					text: 'inherit'
				},
				new: {
					background: '#ffeb00',
					text: 'inherit'
				},
				old: {
					background: '#ffc173',
					text: 'inherit'
				},
				oldClosed: {
					background: '#b499ff',
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

                if ( isOlder6Months ) {
					$( this ).css( 'background-color', settings.color.oldClosed.background );
					$( this ).find( 'a' ).css( 'color', settings.color.oldClosed.text );

					$permalink.find( '.dashicons' ).not( '.wporg-ratings .dashicons' ).remove();
					$permalink.prepend( icons.oldClosed );
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

					$permalink.find( '.dashicons' ).not('.wporg-ratings .dashicons').remove();
					$permalink.prepend( icons.unattended );
				}
			}
		});
	}

	function set_colors() {
		var stored = localStorage.getItem( 'wp_highlighter' );

		if ( null !== stored ) {
			settings = JSON.parse( stored );
		}
	}

	// Set up color choices.
	set_colors();

	// Run processer.
	process_topics();

    // Trigger options form display
	$(".entry-meta").on( 'click', '#tamper-show-options', function( e ) {
		e.preventDefault();

		$( '#bbpress-forums' ).prepend( GM_getResourceText( 'configHtml' ) );

		$( '#tamper-wp-topic-highlighter-resolved' ).val( settings.color.resolved.background );
		$( '#tamper-wp-topic-highlighter-resolved-text' ).val( settings.color.resolved.text );
		$( '#tamper-wp-topic-highlighter-new' ).val( settings.color.new.background );
		$( '#tamper-wp-topic-highlighter-new-text' ).val( settings.color.new.text );
		$( '#tamper-wp-topic-highlighter-old' ).val( settings.color.old.background );
		$( '#tamper-wp-topic-highlighter-old-text' ).val( settings.color.old.text );
		$( '#tamper-wp-topic-highlighter-old-closed' ).val( settings.color.oldClosed.background );
		$( '#tamper-wp-topic-highlighter-old-closed-text' ).val( settings.color.oldClosed.text );
 		$( '#tamper-wp-topic-highlighter-nonport' ).prop( 'checked', settings.nonPOrT );
	});

    if ( $( 'body' ).is( '.bbp-view.archive' ) ) {
        $( '#bbpress-forums .bbp-pagination:first' ).after( `
        <div class="custom-topic-header">
            <label for="tec-select-all">
                <input id="tec-select-all" type="checkbox">
                Select all Topics
            </label>
            <input type="submit" id="tec-open-in-new-tab" value="Open" />
        </div>
        ` );

        // Add options link to the sidebar.
        $( '.entry-meta.sidebar div:first-of-type ul' ).append( '<li><a href="#" id="tamper-show-options">Highlighter Options</a></li>' );

        $( '#tec-select-all' ).on( 'change', ( event ) => {
            $( '.tec-select-topic' ).prop( 'checked', $( event.target ).is( ':checked' ) );
        } );

        $( '#tec-open-in-new-tab' ).on( 'click', ( event ) => {
            event.preventDefault();
            $( '.tec-select-topic:checked' ).each(( k, topic ) => {
                GM_openInTab( $( topic ).parents( '.topic' ).eq( 0 ).find( '.bbp-topic-permalink' ).attr( 'href' ) );
            } );
        } );
    }

	// Save options
	$( '#page' ).on( 'submit', '#tamper-wp-topic-highlighter', function( e ) {
		e.preventDefault();

		settings.color.resolved.background = $( '#tamper-wp-topic-highlighter-resolved' ).val();
		settings.color.resolved.text = $( '#tamper-wp-topic-highlighter-resolved-text' ).val();
		settings.color.new.background = $( '#tamper-wp-topic-highlighter-new' ).val();
		settings.color.new.text = $( '#tamper-wp-topic-highlighter-new-text' ).val();
		settings.color.old.background = $( '#tamper-wp-topic-highlighter-old' ).val();
		settings.color.old.text = $( '#tamper-wp-topic-highlighter-old-text' ).val();
		settings.color.oldClosed.background = $( '#tamper-wp-topic-highlighter-old-closed' ).val();
		settings.color.oldClosed.text = $( '#tamper-wp-topic-highlighter-old-closed-text' ).val();
		settings.nonPOrT = $( '#tamper-wp-topic-highlighter-nonport' ).is( ':checked');

		localStorage.setItem( 'wp_highlighter', JSON.stringify( settings ) );

		$( this ).remove();

		// Re-process topics after making edits.
		process_topics();
	}).on( 'click', '.cancel', function( e ) {
		e.preventDefault();
		$( this ).closest( 'form' ).remove();
	});
});
