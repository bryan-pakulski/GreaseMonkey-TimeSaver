// ==UserScript==
// @name         Block YouTube Shorts
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Redirects Shorts to Home and force-deletes the Shorts shelf from the homepage
// @author       Assistant
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Redirect any Shorts URL to the YouTube Homepage
    if (window.location.pathname.startsWith('/shorts/')) {
        window.location.replace('https://www.youtube.com/');
    }

    const cleanHomePage = () => {
        // Find the specific renderer for shorts panel
        const shortsShelf = document.querySelector('ytd-rich-shelf-renderer[is-shorts]');

        if (shortsShelf) {
            // Find the parent section (the whole row) and delete it
            const parentRow = shortsShelf.closest('ytd-rich-section-renderer');
            if (parentRow) {
                parentRow.remove();
            } else {
                shortsShelf.remove();
            }
        }

        // Also hide the Shorts button in the sidebar (standard & mini)
        const sidebarLink = document.querySelector('ytd-guide-entry-renderer:has(a[href="/shorts/"])');
        if (sidebarLink) sidebarLink.remove();

        const miniSidebarLink = document.querySelector('ytd-mini-guide-entry-renderer[aria-label="Shorts"]');
        if (miniSidebarLink) miniSidebarLink.remove();
    };

    // Start Polling once the DOM is ready
    window.addEventListener('load', () => {
        // Check every 500ms to catch it when it lazy-loads
        setInterval(cleanHomePage, 500);
    });

    // Handle SPA navigation within YouTube
    window.addEventListener('yt-navigate-finish', cleanHomePage);
})();
