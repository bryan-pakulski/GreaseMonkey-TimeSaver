// ==UserScript==
// Created by Bryan Pakulski
// @name        Hotmail-hideAdBlock
// @namespace   default
// @description Hides the "Adblocker detected" in outlook.com
// @exclude     https://outlook.office365*
// @include     https://outlook.live*
// @version     2.0.2
// @grant       none
// ==/UserScript==

var adblocking = 'GssDD'; 										// On right hand side
var mail_entry_child = 'm9Rge' 									// Ads directly within mail list
var mail_entry_parents = ['.EeHm8', '.fGEFC'] 	                // Top level parent for mail items

let max_retries = 50
let retries = 0;
let success = false;

// Initial watcher that waits for page to load, once we've kicked off start another watcher that polls for ads inserted into mail entries
const intervalID = setInterval(_ => {
    var div_hide = document.getElementsByClassName(adblocking);

    if (div_hide.length >= 2) {
        for (var i = 0; i < div_hide.length; i++) {
            div_hide[i].style.visibility = "hidden";
            div_hide[i].style.width = "0px";
        }

        success = true;
    }

    retries++;

    if (success) {
        clearInterval(intervalID);
        console.log("Cleaned up adblock elements in ", retries, " attempts");
        console.log("Starting watcher for embedded ads in mail list...");
        block_mail_entry_ads();
    }

    if (retries == max_retries) {
        clearInterval(intervalID);
        console.log("Max retries hit, adblock elements not found!", adblocking);
    }
}, 100);


// Watch for advertisment mail entries
function block_mail_entry_ads() {
    const recheck_intervalID = setInterval(_ => {
        let ad_elements = document.getElementsByClassName(mail_entry_child);

        for (let ad_entry of ad_elements) {
          	
          	for (let p of mail_entry_parents) {
              let parent = ad_entry.closest(p);
              if (parent) {
                  parent.remove();
                	console.log("Blocked mail list advertisement...");
              }
            }
        }
    }, 500);

}
