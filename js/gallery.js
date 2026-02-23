/* ── Navbar scroll ── */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

/* ── Hamburger + mobile nav ── */
const hbg = document.getElementById('hbg');
const navMobile = document.getElementById('navMobile');
hbg.addEventListener('click', function () {
    const isOpen = navMobile.classList.toggle('open');
    hbg.classList.toggle('open', isOpen);
});
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


// ── Reveal on scroll ──────────────────────
const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 70);
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.gallery-item').forEach(el => io.observe(el));

// ── Filter Tabs ───────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
                // Re-trigger reveal
                setTimeout(() => item.classList.add('visible'), 30);
            } else {
                item.classList.add('hidden');
                item.classList.remove('visible');
            }
        });
    });
});

// ── Lightbox ──────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbTag = document.getElementById('lbTag');
const lbTitle = document.getElementById('lbTitle');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let currentIndex = 0;
let visibleItems = [];

function openLightbox(index) {
    visibleItems = [...galleryItems].filter(i => !i.classList.contains('hidden'));
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbTag.textContent = item.dataset.tag;
    lbTitle.textContent = item.dataset.title;
}

galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
        visibleItems = [...galleryItems].filter(el => !el.classList.contains('hidden'));
        const visibleIndex = visibleItems.indexOf(item);
        openLightbox(visibleIndex);
    });
});

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

lbPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightbox();
});

lbNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; updateLightbox(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % visibleItems.length; updateLightbox(); }
});
