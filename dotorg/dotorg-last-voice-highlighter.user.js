// ==UserScript==
// @name         TEC: WordPress.org Last Voice Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  The script runs in the .org forums for The Events Calendar plugins. It adds a dark brown right border to threads where last voice is a team member.
// @author       Andras Guseo
// @include      https://wordpress.org/support/plugin/pardot*
// @include      https://wordpress.org/support/plugin/the-events-calendar*
// @include      https://wordpress.org/support/plugin/event-tickets*
// @include      https://wordpress.org/support/plugin/gigpress*
// @include      https://wordpress.org/support/plugin/image-widget*
// @include      https://wordpress.org/support/plugin/advanced-post-manager*
// @downloadURL  https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-helper.user.js
// @updateURL    https://github.com/the-events-calendar/tampermonkey-scripts/raw/main/dotorg/dotorg-helper.user.js
// @grant        none
// ==/UserScript==

/**
 * Marks resolved threads green.
 * Marks threads blue where The Events Calendar is the last voice. (No action needed.)
 * Marks threads yellow that are more than a month old.
 */

(function() {
    'use strict';

    // Get all lines in an array
    var x = document.getElementsByClassName( 'type-topic' );

    // TEC team members
    var tecteam = [
        'abzlevelup',                   // Abz Abdul                    - 2021-07-19
        'aguseo',                       // Andras Guseo                 - 2016-04-25
        'alaasalama',                   // Alaa Salama                  - 2018-11-19 to 2020-08-31
        'allenzamora',                  // Allen Zamora                 - 2021-08-23
        'barryhughes-1',                // Barry Hughes                 - xxxx-xx-xx to 2020-07-31
        'bordoni',                      // Gustavo Bordoni
        'bskousen3',                    // Brendan Skousen              - 2017-10-23 to 2021
        'brianjessee',                  // Brian Jessee
        'borkweb',                      // Mattew Batchelder            - 2020-03-30
        'brook-tribe',                  // Brook                        - xxxx-xx-xx to 2017-xx-xx
        'camwynsp',                     // Stephen Page
        'cmccullough1967',              // Chad McCollough              - 2021-08-23
        'chikaibeneme',                 // Chika Ibeneme                - 2020-02-10
        'cliffpaulick',                 // Clifford Paulick             - 2015 to 2020
        'cliffseal',                    // Cliff Seal - Pardot
        'cswebd3v',                     // Chris Swenson                - 2020-09-01 to 2021-12-31
        'courane01',                    // Courtney Robertson           - 2017-02-22 to 2020
        'd0153',                        // Darian Baldazotes            - 2022-01-17
        'deblynprado',                  // Deblyn Prado                 - 2019-04-11
        'djbramer',                     // Dan Bramer
        'eeide',                        // Erica Eide                   - 2021-05-24
        'erishel',                      // Edward Rishel                - 2018-03-12 to 2018-12-31
        'eugenekyale',                  // Eugene Kyale                 - 2020-09-01
        'eugenetribe',                  // Eugene Kyale                 - 2020-09-01
        'geoffbel',                     // Geoffroy 'LeGeoff' Belanger  - 2016-01-20
        'geoffgraham',                  // Geoff Graham                 - 2014 (?)
        'ggwicz',                       // George Gecewicz              - xxxx-xx-xx to 2017-xx-xx
        'gugaalves',                    // Gustavo "Guga" Alves         - 2021-08-23
        'highprrrr',                    // James Welbes                 - 2021-02-01
        'iammarta',                     // Marta Kozak                  - 2020-09-01
        'jaimemarchwinski',             // Jaime Marchwinski            - 2017-08-31
        'jdbeacham',                    // John Beacham                 - 2022-03-08
        'jeankhladynstefanie',          // Jean Abarquez                - 2022-03-22
        'jentheo',                      // Jennifer Theodore            - 2017-05-08
        'jeremy80',                     // Jeremy Marchandeau           - 2018-03-26 to 2020
        'joshlevelupsupport2021',       // Joshua Cagasan               - 2021-07-19
        'juanfra',                      // Juan Francisco Aldasoro
        'koriashton',                   // Kori Ashton                  - 2020-09-01 to 2020
        'kutatishh',                    // Kudzai
        'lelandf',                      // Leland Fliegel
        'lucasbustamante',              // Lucas Bustamante             - 2020-03-30 to 2020
        'mandraagora',                  // Wolf Bishop                  - 2020-03-04
        'masoodak',                     // Masood Khan                  - 2020-09-01
        'matumu',                       // Marho Atumu                  - 2020-09-01
        'mitogh',                       // Crisoforo Hernandez          - 2018 (?)
        'neillmcshea',                  // Neill McShae
        'nicosantos',                   // Nico Santos                  - 2015-xx-xx to 2019-xx-xx
        'nikrosales',                   // Nik Rosales                  - 2020-02-24 to 2020-12-31
        'patriciahillebrandt',          // Patricia Hillebrandt         - 2017-06-09 to 2021-08-15
        'rafsuntaskin',                 // Rafsun Chowdhury             - 2020-03-30
        'robelemental',                 // Rob Liy                      - 2021-05-24
        'sdenike',                      // Shelby DeNike                - 2018-10-08 to 2019-08-31
        'shatterdorn1',                 // Truman Dorn                  - 2021-03-01
        'sjaure',                       // Santiago Jaureguiberry       - 2019-05-26
        'skyshab',                      // Jason 'Sky' Shabatura        - 2018-01-02
        'tdorn',                        // Truman Dorn (2)              - 2021-03-01
        'tecphil',                      // Phil Hodges (Community Mgr)  - 2021-04 to 2021-08
        'theeventscalendar',            // The Events Calendar          - 2020-12-18
        'tokyobiyori',                  // Ali Darwich                  - 2018-11-19
        'tribalmike',                   // Mike Cotton                  - 2018-10-11
        'tribecari',                    // Caroline                     - 2016-05-16 to 2017-12-31
        'tristan083',                   // Tristan Pepito               - 2022-01-17
        'translationsbymoderntribe',    // Modern Tribe Translations    - 2020-03-30
        'vicskf',                       // Victor Zarranz               - 2017-xx-xx
        'zbtirrell',                    // Zach Tirrell                 -
    ];

    var i, j;
    var lastVoiceColor = '#E58000';

    // Check every line
    for( i = 0; i < x.length; i++ ) {

        for( j = 0; j < tecteam.length; j++ ) {

            // If not resolved, check if tha last voice is a team member
            var n = x[i].innerHTML.search( 'href="https://wordpress.org/support/users/' + tecteam[j] + '/"' );

            if ( n > 0 ) {
                x[i].style.borderRight = "4px solid " + lastVoiceColor;
            }
        }
    }

})();
