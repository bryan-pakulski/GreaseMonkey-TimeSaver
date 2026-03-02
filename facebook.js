// ==UserScript==
// @name         Facebook Feed Blocker (Main Role)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Blocks the main content div on the homepage, allows Messenger/Marketplace.
// @author       User
// @match        https://*.facebook.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Inject CSS that hides div[role="main"] ONLY when body has the class 'homepage-blocked'
    const style = document.createElement('style');
    style.textContent = `
        body.homepage-blocked div[role="main"] {
            display: none !important;
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Logic to determine if we are on the specific feed page
    function handleBlocking() {
        const path = window.location.pathname;
        
        // Exact match for root "/" or "/home.php"
        // This ensures we don't block /marketplace, /messages, /groups, etc.
        const isHomePage = path === '/' || path === '/home.php';

        if (isHomePage) {
            document.body.classList.add('homepage-blocked');
        } else {
            document.body.classList.remove('homepage-blocked');
        }
    }

    // 3. Navigation Listeners (Facebook is a Single Page App)
    
    // Check immediately
    new MutationObserver(() => {
        if (document.body) handleBlocking();
    }).observe(document.documentElement, { childList: true, subtree: true });

    // Hook into browser history for URL changes
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        handleBlocking();
    };
    
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        handleBlocking();
    };
    
    window.addEventListener('popstate', handleBlocking);
})();
