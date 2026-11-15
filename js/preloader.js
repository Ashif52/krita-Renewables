// ===== PRELOADER WITH FAIL-SAFE & PROGRESSIVE ENHANCEMENT =====
(function () {
  const preloader = document.getElementById('preloader');
  const percentEl = document.getElementById('preloader-percent');
  const fillCircle = document.getElementById('preloader-fill-circle');

  if (!preloader) return;

  // Add active lock only when JavaScript is running
  document.body.classList.add('preloader-active');

  function dismissPreloader() {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      document.body.classList.remove('preloader-active');
    }
  }

  // Hard safety timeout: Never allow preloader to trap users or crawlers
  const safetyTimeout = setTimeout(dismissPreloader, 2500);

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
      clearTimeout(safetyTimeout);
      setTimeout(dismissPreloader, 300);
    }
  }

  requestAnimationFrame(tick);
})();
