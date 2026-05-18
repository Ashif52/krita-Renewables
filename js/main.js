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
        const navClose = document.getElementById('navClose');
        if (navClose) {
            navClose.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.classList.remove('active');
            });
        }
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

    // ===== 6. FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ===== 7. LIGHTBOX GALLERY =====
    const galleryTriggers = document.querySelectorAll('.project-gallery-trigger');
    const modal = document.getElementById('projectModal');
    
    if (modal) {
        const modalClose = modal.querySelector('.modal-close');
        const sliderContainer = modal.querySelector('.slider-container');
        const dotsContainer = modal.querySelector('.slider-dots');
        const prevBtn = modal.querySelector('.prev');
        const nextBtn = modal.querySelector('.next');
        const modalTitle = modal.querySelector('.modal-info h3');
        const modalDesc = modal.querySelector('.modal-info p');
        
        let currentSlide = 0;
        let images = [];

        galleryTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const projectTitle = trigger.getAttribute('data-project');
                const projectDesc = trigger.getAttribute('data-desc');
                const projectImages = trigger.getAttribute('data-images').split(',');
                
                images = projectImages;
                modalTitle.textContent = projectTitle;
                modalDesc.textContent = projectDesc;
                
                // Build slides and dots
                sliderContainer.innerHTML = images.map((img, index) => `
                    <div class="slide ${index === 0 ? 'active' : ''}">
                        <img src="${img.trim()}" alt="${projectTitle} ${index + 1}">
                    </div>
                `).join('') + `
                    <button class="slider-nav prev" aria-label="Previous slide">❮</button>
                    <button class="slider-nav next" aria-label="Next slide">❯</button>
                `;
                
                dotsContainer.innerHTML = images.map((_, index) => `
                    <div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
                `).join('');
                
                currentSlide = 0;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Re-bind nav buttons (since they were just created)
                modal.querySelector('.prev').onclick = () => changeSlide(-1);
                modal.querySelector('.next').onclick = () => changeSlide(1);
                modal.querySelectorAll('.dot').forEach(dot => {
                    dot.onclick = () => goToSlide(parseInt(dot.getAttribute('data-index')));
                });
            });
        });

        function changeSlide(direction) {
            currentSlide = (currentSlide + direction + images.length) % images.length;
            updateSlider();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }

        function updateSlider() {
            const slides = modal.querySelectorAll('.slide');
            const dots = modal.querySelectorAll('.dot');
            
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentSlide);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        modalClose.onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        modal.onclick = (e) => {
            if (e.target === modal) modalClose.onclick();
        };

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'ArrowLeft') changeSlide(-1);
            if (e.key === 'ArrowRight') changeSlide(1);
            if (e.key === 'Escape') modalClose.onclick();
        });
    }
});
