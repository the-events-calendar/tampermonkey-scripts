# WP.org Scripts

## `canned-replies.json`

Content file for canned replies. It is used by `dotorg-canned-replies.user.js`. No need to install separately.

## `dotorg-canned-replies.user.js`

**Deprecated** at the moment. Provides a dropdown for selecting canned replies that are pasted in the response text area. It works only with the "classic" interface of the .org forums, which have been replaced by the block editor in 2023.

## `dotorg-helper.user.js`

In runs in the .org forums for The Events Calendar plugins. It colors the resolved threads green, and the threads which have the last voice from a team member to light yellow. Don't use it together with `dotorg-hider.user.js`.
Check out also `dotorg-topic-highlighter.user.js`, which is slightly more advanced.

### Sample screenshot of dotorg-helper

![image](https://dl.dropbox.com/s/cr3sqlwd04s9dnq/shot_210910_182623.jpg)

## `dotorg-hider.user.js`

A twin to .org Helper. The script runs in the .org forums for The Events Calendar plugins. It hides threads that don't need attention: resolved threads and threads where last voice is a team member. Don't use it together with `dotorg-helper.user.js`.

## `dotorg-last-voice-highlighter.js`

The script marks support threads where our support team has the last voice with a right orange border. The script is helpful on the .org reviews pages.

### Sample screenshot of dotorg-last-voice-highlighter

![image](https://dl.dropbox.com/s/e3u2vrnbd3obwtu/shot_230314_110256.jpg)

## `dotorg-open-links-new-tab.js`

This causes all links you click on to open in a new tab.

## `dotorg-review-collector.user.js`

The script is used for creating the bi-weekly status report about .org reviews.
The script puts a text box on top of the reviews page. Clicking on the textbox will copy its content.

## `dotorg-topic-highlighter.user.js`

A more advanced version than `dotorg-helper.user.js` with more visual details. Resoled topics are green, topics that need attention are yellow, topics that can be closed are orange, old and closed topics are purple. Topics not needing attention are white.

### Sample screenshot of dotorg-topic-highlighter

![image](https://dl.dropboxusercontent.com/s/0vj43p7rmgo65z8/shot_230314_125557.jpg)

## `dotorg-topic-updater.user.js`

## `options.html`

The options file used by dotorg-topic-highlighter.user.js
