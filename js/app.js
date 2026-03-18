// ── Age Gate ──────────────────────────────────────────────────────────────────

(function () {
  const GATE_KEY = 'vp_age_verified';

  // On the age gate page (index.html)
  const btnYes = document.getElementById('btn-yes');
  const btnNo  = document.getElementById('btn-no');

  if (btnYes) {
    btnYes.addEventListener('click', function () {
      sessionStorage.setItem(GATE_KEY, '1');
      window.location.href = 'home.html';
    });
  }

  if (btnNo) {
    btnNo.addEventListener('click', function () {
      window.location.href = 'https://www.google.com';
    });
  }

  // On index.html: if already verified, skip the gate
  if (document.body.id === 'age-gate-page') {
    if (sessionStorage.getItem(GATE_KEY)) {
      window.location.replace('home.html');
    }
  }

  // On all other pages: if not verified, send back to gate
  if (document.body.id === 'inner-page') {
    if (!sessionStorage.getItem(GATE_KEY)) {
      window.location.replace('index.html');
    }
  }
})();

// ── Active Nav Highlighting ───────────────────────────────────────────────────

(function () {
  const page = window.location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
    }
  });
})();
