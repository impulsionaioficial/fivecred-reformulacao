/* Content disclosure only. Does not read or change any form. */
(function () {
  function initialize() {
    var panels = Array.from(document.querySelectorAll('[data-reading-panel]'));
    if (!panels.length) return;
    var compact = window.matchMedia('(max-width: 1279px)');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function configure() {
      panels.forEach(function (panel) {
        var summary = panel.querySelector('summary');
        panel.open = !compact.matches || panel.contains(document.activeElement);
        if (compact.matches) {
          summary.removeAttribute('tabindex');
          summary.removeAttribute('aria-disabled');
        } else {
          summary.setAttribute('tabindex', '-1');
          summary.setAttribute('aria-disabled', 'true');
        }
      });
    }
    panels.forEach(function (panel) {
      panel.querySelector('summary').addEventListener('click', function (event) {
        if (!compact.matches) event.preventDefault();
      });
      panel.addEventListener('toggle', function () {
        if (!compact.matches || !panel.open) return;
        panels.forEach(function (other) {
          if (other !== panel && other.closest('ul,ol,[data-reading-group]') === panel.closest('ul,ol,[data-reading-group]')) other.open = false;
        });
        requestAnimationFrame(function () {
          var header = document.querySelector('.header');
          var top = header ? header.getBoundingClientRect().bottom : 0;
          var group = panel.closest('ul,ol,[data-reading-group]');
          var target = group && group.getBoundingClientRect().height <= innerHeight - top - 32 ? group : panel;
          var rect = target.getBoundingClientRect();
          if (rect.bottom > innerHeight - 16 || rect.top < top + 16) {
            target.scrollIntoView({block:'start', behavior:reducedMotion.matches ? 'instant' : 'smooth'});
          }
        });
      });
    });
    configure();
    compact.addEventListener('change', configure);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();
})();
