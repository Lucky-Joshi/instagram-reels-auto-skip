//This is a userscript for Instagram Reels that automatically moves to the next reel after replaying the current one twice. It uses MutationObserver to detect when a new video is loaded and listens for the 'ended' event on the video element. If the video ends twice, it simulates a click on the "Next" button or scrolls down to load the next reel.

/*
// ==UserScript==
// @name         Instagram Reel Auto Next

(function () {
    let currentVideo = null;
    let replayCount = 0;
  
    const observer = new MutationObserver(() => {
      const video = document.querySelector('video');
  
      if (video && video !== currentVideo) {
        currentVideo = video;
        replayCount = 0;
  
        video.addEventListener('ended', () => {
          replayCount++;
          console.log(`Reel replayed ${replayCount} times.`);
  
          if (replayCount >= 2) {
            moveToNextReel();
          }
        });
      }
    });
  
    function moveToNextReel() {
      const nextButton = document.querySelector('[aria-label="Next"]') || 
                         document.querySelector('div[role="button"] svg[aria-label="Next"]')?.closest('div[role="button"]');
  
      if (nextButton) {
        nextButton.click();
        console.log("Moved to next reel.");
      } else {
        // fallback: simulate 'ArrowDown' key to scroll
        window.scrollBy(0, window.innerHeight);
        console.log("Scrolled down as fallback.");
      }
  
      replayCount = 0;
    }
  
    observer.observe(document.body, { childList: true, subtree: true });
  })();
*/

/*
// ==UserScript==
// @name         Instagram Reel Auto Scroller

(function () {
    let currentVideo = null;
    let replayCount = 0;
  
    const waitForVideo = () => {
      const videos = document.querySelectorAll('video');
  
      for (const video of videos) {
        if (video.readyState >= 2 && !video.dataset.reelWatcherAttached) {
          video.dataset.reelWatcherAttached = 'true';
          setupVideoListener(video);
        }
      }
    };
  
    const setupVideoListener = (video) => {
      currentVideo = video;
      replayCount = 0;
  
      video.addEventListener('ended', () => {
        replayCount++;
        console.log(`Video replayed: ${replayCount} times`);
  
        if (replayCount >= 2) {
          moveToNextReel();
          replayCount = 0; // reset
        }
      });
    };
  
    const moveToNextReel = () => {
      // Scroll the page to load the next reel (usually works for full-screen reels)
      console.log("Scrolling to next reel...");
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    };
  
    // Continuously check for new videos (as Instagram loads dynamically)
    setInterval(waitForVideo, 1000);
  })();
*/  

(function() {
    'use strict';
  
    let currentVideo = null;
    let replayCount = 0;
    let observer = null;
  
    // Helper: Check if current URL is a Reels page or specific reel
    function isReelsPage() {
      const path = window.location.pathname;
      return path.includes('/reel/') || path.includes('/reels/');
    }
  
    // Inject script into page context to override history.pushState/replaceState 
    // so we can detect SPA navigation events
    function injectHistoryPatch() {
      const script = document.createElement('script');
      script.textContent = '(' + function() {
        const origPush = history.pushState;
        history.pushState = function(...args) {
          origPush.apply(this, args);
          window.dispatchEvent(new Event('pushstate'));
        };
        const origReplace = history.replaceState;
        history.replaceState = function(...args) {
          origReplace.apply(this, args);
          window.dispatchEvent(new Event('replacestate'));
        };
      } + ')();';
      document.documentElement.appendChild(script);
      script.remove();
    }
  
    // Find the main visible video element (Instagram reel) on the page
    function findVideoElement() {
      const videos = document.querySelectorAll('video');
      for (const v of videos) {
        const rect = v.getBoundingClientRect();
        // Filter out very small or hidden videos
        if (rect.width > 100 && rect.height > 100) {
          return v;
        }
      }
      return null;
    }
  
    // Called whenever we think the current reel may have changed
    function setupVideoListener() {
      if (!isReelsPage()) return;
      const video = findVideoElement();
      if (video && video !== currentVideo) {
        // New video detected: reset counter and listeners
        if (currentVideo) {
          currentVideo.removeEventListener('ended', onVideoEnded);
        }
        currentVideo = video;
        replayCount = 0;
        currentVideo.addEventListener('ended', onVideoEnded);
      }
    }
  
    // Handle the video 'ended' event: count loops and skip after two ends
    function onVideoEnded(event) {
      // Ensure the event is for our tracked video
      if (!currentVideo || event.target !== currentVideo) return;
      replayCount++;
      if (replayCount >= 2) {
        // Simulate "next reel" via ArrowRight keypress
        const nextEvent = new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          code: 'ArrowRight',
          keyCode: 39,
          which: 39,
          bubbles: true,
          cancelable: true
        });
        document.dispatchEvent(nextEvent);
        // (After this, Instagram will load the next reel, and our observer will pick it up)
      }
    }
  
    // Observe DOM changes to detect when a new video element is inserted
    function initObserver() {
      if (observer) return;
      observer = new MutationObserver(() => {
        setupVideoListener();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  
    // Clean up listeners and observer when navigation happens
    function cleanup() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (currentVideo) {
        currentVideo.removeEventListener('ended', onVideoEnded);
      }
      currentVideo = null;
      replayCount = 0;
    }
  
    // Handle SPA navigation events (pushState/popstate/etc.)
    function handleNavigation() {
      cleanup();
      if (isReelsPage()) {
        initObserver();
        setupVideoListener();
      }
    }
  
    // Listen for navigation changes (including our injected events)
    function addEventListeners() {
      window.addEventListener('pushstate', handleNavigation);
      window.addEventListener('replacestate', handleNavigation);
      window.addEventListener('popstate', handleNavigation);
    }
  
    // Initialize extension logic once DOM is ready
    function initialize() {
      injectHistoryPatch();
      addEventListeners();
      handleNavigation();
    }
  
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', initialize);
    } else {
      initialize();
    }
  })();
  