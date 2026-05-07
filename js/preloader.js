// ===== PRELOADER =====
(function () {
  const preloader = document.getElementById('preloader');
  const percentEl = document.getElementById('preloader-percent');
  const fillCircle = document.getElementById('preloader-fill-circle');

  if (!preloader) return;

  const circumference = 2 * Math.PI * 48; // r=48 from SVG
  let progress = 0;
  const duration = 1800; // ms
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const percent = Math.floor(eased * 100);

    if (percentEl) percentEl.textContent = percent + '%';
    if (fillCircle) {
      fillCircle.style.strokeDashoffset = circumference - (circumference * eased);
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      // Preloader done — fade out
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('preloader-active');
      }, 300);
    }
  }

  requestAnimationFrame(tick);
})();
