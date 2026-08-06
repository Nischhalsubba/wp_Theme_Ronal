
/* Deterministic, accessible mobile navigation. */
(() => {
  const initializeLaunchNavigation = () => {
    const toggle = document.querySelector('.launch-mobile-toggle');
    const drawer = document.getElementById('launch-mobile-drawer');
    const backdrop = document.querySelector('.launch-nav-backdrop');
    if (!toggle || !drawer || !backdrop || toggle.dataset.launchReady === 'true') return;

    toggle.dataset.launchReady = 'true';
    const mobileQuery = window.matchMedia('(max-width: 56.25rem)');
    let lastFocused = null;

    document.querySelectorAll('header button').forEach((candidate) => {
      if (candidate === toggle) return;
      const fingerprint = [candidate.getAttribute('aria-label'), candidate.getAttribute('title'), candidate.className, candidate.textContent]
        .filter(Boolean).join(' ').toLowerCase();
      if (/(menu|navigation|hamburger|nav-toggle)/.test(fingerprint) && !/(theme|dark|light|mode|color)/.test(fingerprint)) {
        candidate.classList.add('launch-original-menu-toggle');
        candidate.setAttribute('aria-hidden', 'true');
        candidate.tabIndex = -1;
      }
    });

    const focusableItems = () => Array.from(drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => !element.hidden && element.getClientRects().length > 0);

    const setOpen = (open, options = {}) => {
      const shouldFocus = options.focus !== false;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      drawer.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('launch-nav-open', open);
      if ('inert' in drawer) drawer.inert = !open;

      if (open) {
        lastFocused = document.activeElement;
        if (shouldFocus) {
          window.requestAnimationFrame(() => {
            const items = focusableItems();
            (items[0] || drawer).focus({ preventScroll: true });
          });
        }
      } else if (shouldFocus && lastFocused instanceof HTMLElement && document.contains(lastFocused)) {
        lastFocused.focus({ preventScroll: true });
      }
    };

    if ('inert' in drawer) drawer.inert = true;

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    }, true);

    backdrop.addEventListener('click', () => setOpen(false));
    drawer.addEventListener('click', (event) => {
      if (event.target.closest('a[href]')) setOpen(false, { focus: false });
    });

    document.addEventListener('keydown', (event) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusableItems();
      if (!items.length) {
        event.preventDefault();
        drawer.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const handleViewportChange = (event) => {
      if (!event.matches) setOpen(false, { focus: false });
    };
    if (typeof mobileQuery.addEventListener === 'function') mobileQuery.addEventListener('change', handleViewportChange);
    else if (typeof mobileQuery.addListener === 'function') mobileQuery.addListener(handleViewportChange);

    window.addEventListener('pageshow', () => setOpen(false, { focus: false }));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLaunchNavigation, { once: true });
  } else {
    initializeLaunchNavigation();
  }
})();
