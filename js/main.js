document.addEventListener('DOMContentLoaded', () => {
    // ===== 1. STICKY HEADER =====
    const header = document.getElementById('header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ===== 2. MOBILE MENU =====
    const toggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('navMenu');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('active')) {
                toggle.classList.remove('active');
                nav.classList.remove('active');
            }
        });
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // ===== 3. SMOOTH SCROLL =====
    document.querySelectorAll('.js-scroll').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id && id.startsWith('#')) {
                const el = document.querySelector(id);
                if (el) {
                    const offset = el.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }
        });
    });

    // ===== 4. SCROLL REVEAL =====
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ===== 5. COUNT-UP ANIMATION =====
    const countElements = document.querySelectorAll('[data-count]');
    if (countElements.length) {
        const countObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    const suffix = '+';
                    const duration = 2000;
                    const start = performance.now();

                    function animate(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * target);
                        el.textContent = current + suffix;
                        if (progress < 1) requestAnimationFrame(animate);
                    }
                    requestAnimationFrame(animate);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        countElements.forEach(el => countObserver.observe(el));
    }

    // ===== 6. TESTIMONIAL AUTO-SLIDE (optional) =====
    // Simple horizontal scroll for mobile if needed in future
});
