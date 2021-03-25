// ==UserScript==
// @name         Loxi tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a user link below the site name on the site list admin page
// @author       You
// @include      https://loxi.io/wp-admin/network/sites.php*
// @include      https://loxi.io/wp-admin/network/users.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //var editLinks;
    console.log('starting');


    if ( document.URL.search('sites.php') > 0 ) {
        //var links = document.getElementsByClassName('edit');
        var links = document.querySelectorAll('.edit')
        var patt = /\?/;
        // console.log(links);
        for ( var i = 0; i < links.length; i++ ) {

            var inner = links[i].innerHTML;
            // console.log(inner);
            if ( inner.search(patt) >= 0) {
                // console.log(i + ' - ' + inner.search(patt));
                links[i].innerHTML += '<a href="https://loxi.io/wp-admin/network/site-users.php' + document.querySelectorAll('.edit')[i-1].search + '" target="_blank">Users <span class="dashicons dashicons-external"></span></a> | ';
            }

        }

        var dash = document.getElementsByClassName('backend');
        for( var j=0; j < dash.length; j++) {
            console.log(j, dash[j].innerHTML);
            dash[j].innerHTML = dash[j].innerHTML.replace('class="edit"', 'class="edit" target="_blank"');
            dash[j].innerHTML = dash[j].innerHTML.replace('</a>', ' <span class="dashicons dashicons-external"></span></a>');
        }
    }

    if ( document.URL.search('users.php') > 0 ) {
        var links2 = document.querySelectorAll('.site-1 > a')[1].innerHTML;
        console.log('starting 2');
        if ( links2 != 'loxi.io' ) {
            console.log('inside if');
            document.querySelectorAll('.site-1 > a')[1].href = 'https://' + document.querySelectorAll('.site-1 > a')[1].innerHTML + '.loxi.io/wp-admin/';
            document.querySelectorAll('.site-1 > a')[1].innerHTML += ' <span class="dashicons dashicons-external"></span>';
            document.querySelectorAll('.site-1 > a')[1].target = '_blank';
        }
    }

})();
