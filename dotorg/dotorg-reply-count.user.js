// ==UserScript==
// @name         TEC: WordPress.org Reply Count Past Week
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://profiles.wordpress.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordpress.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    const postsNodeList = document.querySelectorAll('.wporgactivity');
    const posts = Array.from(postsNodeList);

    // Function to count posts in the past week
    function countPostsInPastWeek(posts) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        console.log('CPW: One week ago - ' + oneWeekAgo);
        // Filter posts within the past week
        const postsInPastWeek = posts.filter(post => {
            const postDate = new Date(post.querySelector('time').getAttribute('datetime'));
            console.log('CPW: postDate - ' + postDate);
            return postDate > oneWeekAgo;
        });

        return postsInPastWeek.length;
    }

    const countDisplay = document.createElement('div');
    countDisplay.id = 'countDisplay';
    document.getElementById('container').appendChild(countDisplay);
    countDisplay.style.backgroundColor = 'lightblue';
    countDisplay.style.padding = '10px';
    countDisplay.style.position = 'fixed';
    countDisplay.style.top = '150px';
    countDisplay.style.left = '0';
    countDisplay.style.fontSize = '2em';
    countDisplay.style.zIndex = '999';

    // Update count display
    function updateCountDisplay() {
        const count = countPostsInPastWeek(posts);
        countDisplay.textContent = `Number of posts in the past week: ${count}`;
        console.log(`Number of posts in the past week: ${count}`);
    }

    // Initial update
    updateCountDisplay();
})();
