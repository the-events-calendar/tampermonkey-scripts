// ==UserScript==
// @name         Merge warning
// @namespace    https://theeventscalendar.com/
// @version      2024-01-15
// @description  Provides a merge warning if merging into main or master
// @author       borkweb
// @match        https://github.com/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addWarning() {
        var commitRefElement = document.querySelector('.gh-header-meta .commit-ref a');
        var commitRefElementSpan = document.querySelector('.gh-header-meta .commit-ref a span');

        if ( ! commitRefElement ) {
            return;
        }

        if (
            commitRefElementSpan.innerHTML != 'main'
            && commitRefElementSpan.innerHTML != 'master'
        ) {
            return;
        }

        let warning = document.createElement('div');
        warning.innerHTML = 'This PR will be merged into <strong>' + commitRefElementSpan.innerHTML + '</span>.';
        warning.style.padding = '10px';
        warning.style.border = '1px dotted #cf222e';
        warning.style.borderBottomLeftRadius = '4px';
        warning.style.borderBottomRightRadius = '4px';
        warning.style.borderTopLeftRadius = '4px';
        warning.style.borderTopRightRadius = '4px';
        warning.style.backgroundColor = '#ffebe9';
        warning.style.marginTop = '10px';
        warning.className = 'tampermonkey-merge-warning';

        document.querySelector('.merge-message').appendChild(warning);
    }


        // Create an observer instance
    var observer = new MutationObserver(function(mutations, obs) {
        var mergeMessageElement = document.querySelector('.merge-message');
        if (mergeMessageElement) {
            addWarning();
            obs.disconnect(); // Stop observing after the warning is added
        }
    });

    // Configuration of the observer
    var config = { childList: true, subtree: true };

    // Start observing the body for changes
    observer.observe(document.body, config);
})();
