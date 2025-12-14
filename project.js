/*
 * File: boundaries-meet-portfolio-141845/frontend/public/script.js
 * Description: Implements scroll-driven animations, section tracking, and navigation interactions.
 * Core: IntersectionObserver API, Dynamic Slots, Performance Optimized.
 */

document.addEventListener('DOMContentLoaded', () => {
    // <动态槽位>：预留扩展接口，允许后续注入回调而无需修改核心逻辑
    const APP_SLOTS = {
        onReveal: [],      // Triggered when an element enters viewport
        onSectionChange: [] // Triggered when a new narrative section is active
    };

    /**
     * Initializes Intersection Observers for animations and navigation tracking.
     */
    const initObservers = () => {
        // 1. Reveal Animations Observer
        // Handles .reveal-up and .boundary-drift elements
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Execute dynamic slots
                    APP_SLOTS.onReveal.forEach(fn => fn(entry.target));
                    
                    // Unobserve to ensure animation plays only once for a cleaner journey
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        // Select and observe elements
        const animatedElements = document.querySelectorAll('.reveal-up, .boundary-drift, .chapter-label');
        animatedElements.forEach(el => {
            // Auto-enhance chapter labels with reveal animation if not manually added
            if (el.classList.contains('chapter-label')) el.classList.add('reveal-up');
            revealObserver.observe(el);
        });

        // 2. Section Active State Observer
        // Updates the vertical timeline marker based on scroll position
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Exclusive active state for the timeline effect
                    document.querySelectorAll('.narrative-section').forEach(s => s.classList.remove('active'));
                    entry.target.classList.add('active');
                    
                    APP_SLOTS.onSectionChange.forEach(fn => fn(entry.target));
                }
            });
        }, { threshold: 0.51 }); // Slightly more than half to detect dominant section

        document.querySelectorAll('.narrative-section').forEach(section => {
            sectionObserver.observe(section);
        });
    };

    /**
     * Initializes the "Back to Top" button logic.
     * Handles visibility toggle on scroll and smooth scrolling on click.
     */
    const initBackToTop = () => {
        const backToTopBtn = document.getElementById('back-to-top');
        
        // Guard clause ensuring element exists before attaching listeners
        if (!backToTopBtn) return;

        // Optimize scroll listener with passive option
        window.addEventListener('scroll', () => {
            // Threshold set to 300px to avoid flickering at very top
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        // Smooth scroll implementation
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // Initialize all logic modules
    initObservers();
    initBackToTop();

    // Mark body as loaded for any CSS dependent initial states
    document.body.classList.add('js-ready');
});