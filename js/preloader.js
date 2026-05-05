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
  var circleFill = document.getElementById('preloader-fill-circle');
  var percentText = document.getElementById('preloader-percent');
  var content = document.getElementById('preloader-content');
  
  var progress = 0;
  var targetProgress = 0;
  var isLoaded = false;
  var circleLength = 301.6; // 2 * PI * 48

  // 1. Interactive 3D mouse move tilt
  window.addEventListener('mousemove', function(e) {
    if(dismissed || !content) return;
    var x = (e.clientX / window.innerWidth - 0.5) * 20; 
    var y = (e.clientY / window.innerHeight - 0.5) * -20;
    content.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  // 2. Simulated loading progress
  var interval = setInterval(function() {
    targetProgress += Math.random() * 10;
    if(targetProgress > 95 && !isLoaded) {
      targetProgress = 95;
    }
  }, 100);

  function updateVisuals() {
    if (progress < targetProgress) {
      progress += (targetProgress - progress) * 0.1;
    }
    
    if (progress > 99.8) progress = 100;

    if (circleFill) {
      var offset = circleLength - (progress / 100) * circleLength;
      circleFill.style.strokeDashoffset = offset;
    }
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
