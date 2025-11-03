// UConnect landing interactivity
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Close on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target) && getComputedStyle(toggle).display !== 'none') {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 800) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Waitlist form (demo only)
  const form = document.getElementById('waitlist-form');
  const toast = document.getElementById('toast');
  if (form && toast) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = new FormData(form).get('email');
      if (!email || !String(email).includes('@')) {
        showToast('Please enter a valid email.');
        return;
      }
      // In a real app, POST to your backend here.
      await new Promise((r) => setTimeout(r, 500));
      form.reset();
      showToast('Thanks! You\'re on the waitlist.');
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 2500);
  }

  // Year in footer
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
