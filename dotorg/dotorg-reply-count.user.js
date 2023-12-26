// ==UserScript==
// @name         TEC: WordPress.org Reply Count
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match        https://profiles.wordpress.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordpress.org
// @resource     tecTeam https://raw.githubusercontent.com/the-events-calendar/tampermonkey-scripts/dotorg-team-extended-json/dotorg/team-extended.json
// @grant        GM_getResourceText
// @grant        GM_openInTab
// ==/UserScript==

(function() {
    'use strict';

    // Loglevel
    // 0 = none; 1 = info; 2 = troubleshooting;
    var loglevel = 0;

    // Get necessary nodes.
    const postsNodeList = document.querySelectorAll('.wporgactivity');
    const posts = Array.from(postsNodeList);

    // Initialize the markup.
    var html = '<p>';

    // Get from resource team.json then covert it to array()
    var jsonTECTeam = GM_getResourceText( 'tecTeam' );
    if (loglevel == 2) console.log(jsonTECTeam);

    // Parse the modified JSON data.
    var data = JSON.parse(jsonTECTeam);
    if (loglevel == 2) console.log(data);

    const activeUsers = data.team.filter(user => user.active === "1");
    if (loglevel == 1) console.log(activeUsers);

    // Sort the array by the "name" property.
    activeUsers.sort((a, b) => a.name.localeCompare(b.name));

    // Loop through users.
    for (let i = 0; i < activeUsers.length; i++) {
        if ( activeUsers[i].username != undefined ) {
            html += '<a href="https://profiles.wordpress.org/' + activeUsers[i].username + ' ">' + activeUsers[i].name + '</a><br>' ;
            if (loglevel == 2) console.log(i + "-" + activeUsers[i].username);
        }
    }
    // Close the markup.
    html += '</p>';

    // Function to count posts in the past week.
    function countPostsInPastWeek(posts) {
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (loglevel == 2) console.log('CPW: One week ago - ' + oneWeekAgo);
        // Filter posts within the past week
        const postsInPastWeek = posts.filter(post => {
            const postDate = new Date(post.querySelector('time').getAttribute('datetime'));
            if (loglevel == 2) console.log('CPW: postDate - ' + postDate);
            return postDate > oneWeekAgo;
        });

        return postsInPastWeek.length;
    }

    // Function to count posts on the given day.
    function countPostsXDaysAgo(posts, daysAgo) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const xDaysAgoDate = new Date(currentDate);
        xDaysAgoDate.setDate(currentDate.getDate() - daysAgo);
        const xDaysAgoDatePlusOne = new Date(xDaysAgoDate);
        xDaysAgoDatePlusOne.setDate(xDaysAgoDate.getDate() + 1);

        if (loglevel == 1) {
            console.log( "CPW: currentDate - " + currentDate);
            console.log( "CPW: xDaysAgoDate - " + xDaysAgoDate);
            console.log( "CPW: xDaysAgoDatePlusOne - " + xDaysAgoDatePlusOne);
        }

        if (loglevel == 2) console.log('CPW: ' + daysAgo + ' days ago - ' + xDaysAgoDate);
        // Filter posts.
        const postsXDaysAgo = posts.filter(post => {
            const postDate = new Date(post.querySelector('time').getAttribute('datetime'));
            postDate.setHours(0, 0, 0, 0);
            if (loglevel == 1) console.log('CPW: postDate - ' + postDate);

            return postDate >= xDaysAgoDate && postDate < xDaysAgoDatePlusOne;
        });

        return postsXDaysAgo.length;
    }

    // Create full markup.
    const countDisplay = document.createElement('div');
    countDisplay.id = 'countDisplay';
    document.getElementById('container').appendChild(countDisplay);
    countDisplay.style.backgroundColor = 'lightblue';
    countDisplay.style.padding = '10px';
    countDisplay.style.position = 'fixed';
    countDisplay.style.top = '60px';
    countDisplay.style.left = '0';
    countDisplay.style.fontSize = '1em';
    countDisplay.style.lineHeight = '1.2em';
    countDisplay.style.zIndex = '999';
    const countDisplayP = document.createElement('p');
    countDisplayP.style.marginBottom = '1em';
    countDisplay.appendChild(countDisplayP);

    // Update count display
    function updateCountDisplay() {
        const countWeek = countPostsInPastWeek(posts);
        const count0 = countPostsXDaysAgo(posts, 0);
        const count1 = countPostsXDaysAgo(posts, 1);
        const count2 = countPostsXDaysAgo(posts, 2);
        const count3 = countPostsXDaysAgo(posts, 3);
        const count4 = countPostsXDaysAgo(posts, 4);
        const count5 = countPostsXDaysAgo(posts, 5);
        const count6 = countPostsXDaysAgo(posts, 6);
        const count7 = countPostsXDaysAgo(posts, 7);

        countDisplayP.innerHTML += `Number of posts last 7 days: ${countWeek}<br>`;
        countDisplayP.innerHTML += `Today: ${count0}<br>`;
        countDisplayP.innerHTML += `1 ago: ${count1}<br>`;
        countDisplayP.innerHTML += `2 ago: ${count2}<br>`;
        countDisplayP.innerHTML += `3 ago: ${count3}<br>`;
        countDisplayP.innerHTML += `4 ago: ${count4}<br>`;
        countDisplayP.innerHTML += `5 ago: ${count5}<br>`;
        countDisplayP.innerHTML += `6 ago: ${count6}<br>`;
        countDisplayP.innerHTML += `7 ago: ${count7}<br>`;
        countDisplay.innerHTML += html;
    }

    // Initial update
    updateCountDisplay();
})();
