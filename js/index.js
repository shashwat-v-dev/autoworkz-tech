/* ── Navbar scroll ── */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

/* ── Hero entrance ── */
const heroEls = [
    { el: document.getElementById('hEye'), d: 0 },
    { el: document.getElementById('hHead'), d: 120 },
    { el: document.getElementById('hSub'), d: 220 },
    { el: document.getElementById('hBtns'), d: 320 },
    { el: document.getElementById('hStats'), d: 430 },
    { el: document.getElementById('heroImg'), d: 180 },
];
window.addEventListener('load', () => {
    heroEls.forEach(({ el, d }) => setTimeout(() => { if (el) el.classList.add('visible'); }, 100 + d));
});

/* ── Scroll-reveal (IntersectionObserver) ── */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const delay = e.target.dataset.delay || 0;
            setTimeout(() => e.target.classList.add('visible'), +delay);
        }
    });
}, { threshold: 0.12 });

/* Assign stagger delays to service cards */
document.querySelectorAll('.svc-card').forEach((c, i) => {
    c.dataset.delay = i * 60;
    observer.observe(c);
});
/* Reveal elements */
document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = i * 50;
    observer.observe(el);
});

/* ── Hamburger + mobile nav ── */
const hbg = document.getElementById('hbg');
const navMobile = document.getElementById('navMobile');
hbg.addEventListener('click', function () {
    const isOpen = navMobile.classList.toggle('open');
    hbg.classList.toggle('open', isOpen);
});
// Close on mobile link tap
navMobile.querySelectorAll('.nav-m-link').forEach(function (link) {
    link.addEventListener('click', function () {
        navMobile.classList.remove('open');
        hbg.classList.remove('open');
    });
});

/* ── Theme toggle ── */
document.getElementById('themeToggle').addEventListener('click', function () {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('awt-theme', next);
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('awt-theme'))
        document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
});

/* ── Contact form → Formspree ── */
// ⬇️  Replace 'YOUR_FORM_ID' with the ID from https://formspree.io/
// (sign up free → New Form → paste service@autoworkztech.com → copy the 8-char ID)
var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

async function handleForm(e) {
    e.preventDefault();
    var form = e.target;
    var btn = form.querySelector('button[type=submit]');
    var origText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    var data = {
        name: form.querySelector('#fc-name').value,
        email: form.querySelector('#fc-email').value,
        phone: form.querySelector('#fc-phone').value,
        vehicle: form.querySelector('#fc-vehicle').value,
        message: form.querySelector('#fc-msg').value,
        _subject: 'New Enquiry — Autoworkz Tech'
    };

    try {
        var res = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            btn.textContent = 'Sent! ✓';
            btn.style.background = '#00a89e';
            form.reset();
            setTimeout(function () { btn.textContent = origText; btn.style.background = ''; btn.disabled = false; }, 4000);
        } else {
            throw new Error('Server error');
        }
    } catch (err) {
        btn.textContent = 'Failed — try again';
        btn.style.background = '#c0392b';
        setTimeout(function () { btn.textContent = origText; btn.style.background = ''; btn.disabled = false; }, 3500);
    }
}
