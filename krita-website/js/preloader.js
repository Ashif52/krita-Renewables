/**
 * KRITA Renewables — Premium Interactive Preloader
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'krita_splash_shown';
  
  var preloader = document.getElementById('preloader');
  if (!preloader) return;

  var alreadyShown = false;
  try {
    alreadyShown = sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) {}

  if (alreadyShown) {
    preloader.remove();
    document.body.classList.remove('preloader-active');
    return;
  }

  document.body.classList.add('preloader-active');

  var dismissed = false;
  var fill = document.getElementById('preloader-fill');
  var percentText = document.getElementById('preloader-percent');
  var content = document.getElementById('preloader-content');
  
  var progress = 0;
  var targetProgress = 0;
  var isLoaded = false;

  // 1. Interactive 3D mouse move tilt
  window.addEventListener('mousemove', function(e) {
    if(dismissed || !content) return;
    // Calculate tilt: mapped from screen coordinates to degrees (-15 to 15)
    var x = (e.clientX / window.innerWidth - 0.5) * 30; 
    var y = (e.clientY / window.innerHeight - 0.5) * -30;
    content.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  // 2. Simulated loading progress
  var interval = setInterval(function() {
    // Random jumps for realism
    targetProgress += Math.random() * 12;
    if(targetProgress > 90 && !isLoaded) {
      targetProgress = 90; // Wait for real load at 90%
    }
  }, 100);

  function updateVisuals() {
    if (progress < targetProgress) {
      // Easing approach
      progress += (targetProgress - progress) * 0.15;
    }
    
    // Snap to 100 if very close
    if (progress > 99.5) progress = 100;

    if (fill) fill.style.width = progress + '%';
    if (percentText) percentText.innerText = Math.round(progress) + '%';
    
    if (!dismissed) {
      requestAnimationFrame(updateVisuals);
    }
  }
  requestAnimationFrame(updateVisuals);

  // 3. Dismiss sequence
  function dismissPreloader() {
    if (dismissed) return;
    isLoaded = true;
    targetProgress = 100;
    
    // Wait until visually near 100 before pulling curtain
    var checkFinish = setInterval(function() {
      if (progress >= 99) {
        clearInterval(checkFinish);
        clearInterval(interval);
        
        // Brief pause at 100% so user registers it
        setTimeout(function() {
          dismissed = true;
          preloader.classList.add('preloader-done');
          document.body.classList.remove('preloader-active');
          
          // Cleanup DOM after slide up finishes (0.8s css transition)
          setTimeout(function () {
            if (preloader.parentNode) preloader.remove();
          }, 900);
          
          try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
        }, 300);
      }
    }, 50);
  }

  // Trigger: page loaded
  window.addEventListener('load', function () {
    // small artificial delay to show off the splash
    setTimeout(dismissPreloader, 600); 
  });

  // Fallback: Max 3 seconds to avoid hanging
  setTimeout(dismissPreloader, 3000);
})();
