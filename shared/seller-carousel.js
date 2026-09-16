/* Local artwork rotation. No controls, requests, storage or form changes. */
(() => {
  'use strict';
  function init() {
    document.querySelectorAll('[data-seller-carousel]').forEach(root => {
      if (root.dataset.ready) return;
      root.dataset.ready = 'true';
      const slides = Array.from(root.querySelectorAll('[data-banner-slide]'));
      slides.forEach((slide, i) => { slide.hidden = i !== 0; });
      if (slides.length < 2) return;
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      const interval = Math.max(5000, Number(root.dataset.interval) || 8000);
      let index = 0, timer = null, formStarted = false, hovering = false, inView = true;
      function stop() {
        if (timer !== null) window.clearTimeout(timer);
        timer = null;
      }
      function schedule() {
        stop();
        if (media.matches || formStarted || hovering || !inView || document.hidden) return;
        timer = window.setTimeout(() => {
          index = (index + 1) % slides.length;
          slides.forEach((slide, i) => { slide.hidden = i !== index; });
          schedule();
        }, interval);
      }
      // Keep the artwork still once the visitor begins the request.
      document.addEventListener('focusin', event => {
        if (event.target.closest('[data-journey]')) { formStarted = true; stop(); }
      });
      root.addEventListener('mouseenter', () => { hovering = true; stop(); });
      root.addEventListener('mouseleave', () => { hovering = false; schedule(); });
      document.addEventListener('visibilitychange', schedule);
      window.addEventListener('pagehide', stop);
      window.addEventListener('pageshow', schedule);
      media.addEventListener('change', schedule);
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          inView = entries[0].isIntersecting;
          schedule();
        });
        observer.observe(root);
      }
      schedule();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
