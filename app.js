/* ============================================================
   ANIL.DEV PORTFOLIO — APP.JS
   Custom cursor, dual-layer masking, GSAP animations, Lenis
   ============================================================ */

(function () {
  'use strict';

  // ── DOM References ──────────────────────────────────────
  const cursor   = document.getElementById('cursor');
  const masker   = document.getElementById('layer-red');
  const revealBtn = document.getElementById('js-btn_clipPath');
  const page     = document.getElementById('page');

  // ── State ───────────────────────────────────────────────
  let mouseX = -200, mouseY = -200;
  let cursorX = -200, cursorY = -200;
  let isRevealing = false;
  let maskSize = { inner: 50, outer: 70 };
  let targetMask = { inner: 50, outer: 70 };

  // Mask sizes for cursor states
  const MASK = {
    default:  { inner: 50,  outer: 70  },
    extend:   { inner: 140, outer: 170 },
    contract: { inner: 6,   outer: 12  },
  };

  let snapTarget = null;
  let isSnapping = false;

  // ── Mobile / Touch Detection ────────────────────────────
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    document.body.classList.add('is-touch');
    // On touch, set a small default reveal so content is slightly hinted
    masker.style.setProperty('--mask-inner', '0px');
    masker.style.setProperty('--mask-outer', '0px');
  }

  // ── Lenis Smooth Scroll ─────────────────────────────────
  let lenis;
  try {
    lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } catch (e) {
    console.warn('Lenis init failed:', e);
  }

  // ── Custom Cursor + Mask Position ───────────────────────
  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Main animation loop via GSAP ticker
    gsap.ticker.add(() => {
      // Lerp cursor position
      if (snapTarget) {
        const rect = snapTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Add a slight magnetic pull towards the mouse (so it moves a bit inside the button)
        const magneticX = centerX + (mouseX - centerX) * 0.1;
        const magneticY = centerY + (mouseY - centerY) * 0.1;
        
        cursorX += (magneticX - cursorX) * 0.3;
        cursorY += (magneticY - cursorY) * 0.3;
      } else {
        cursorX += (mouseX - cursorX) * 0.22;
        cursorY += (mouseY - cursorY) * 0.22;
      }

      // Update cursor element
      cursor.style.left = cursorX + 'px';
      cursor.style.top  = cursorY + 'px';

      // Update mask position (convert viewport → page coords)
      const pageY = cursorY + window.scrollY;
      masker.style.setProperty('--x', cursorX + 'px');
      masker.style.setProperty('--y', pageY + 'px');

      // Lerp mask size (for smooth transitions)
      if (!isRevealing) {
        maskSize.inner += (targetMask.inner - maskSize.inner) * 0.15;
        maskSize.outer += (targetMask.outer - maskSize.outer) * 0.15;
        masker.style.setProperty('--mask-inner', maskSize.inner + 'px');
        masker.style.setProperty('--mask-outer', maskSize.outer + 'px');
      }
    });
  }

  // ── Cursor States (extend / contract) ───────────────────
  function setupCursorStates() {
    if (isTouchDevice) return;

    // Elements that extend the cursor (large text / headings)
    document.querySelectorAll('.layer__dark .js-cursor-extend').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-extended');
        cursor.classList.remove('is-contracted');
        targetMask.inner = MASK.extend.inner;
        targetMask.outer = MASK.extend.outer;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-extended');
        targetMask.inner = MASK.default.inner;
        targetMask.outer = MASK.default.outer;
      });
    });

    // Elements that contract the cursor (links, buttons)
    document.querySelectorAll('.layer__dark .js-cursor-contract').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-contracted');
        cursor.classList.remove('is-extended');
        targetMask.inner = MASK.contract.inner;
        targetMask.outer = MASK.contract.outer;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-contracted');
        targetMask.inner = MASK.default.inner;
        targetMask.outer = MASK.default.outer;
      });
    });

    // Elements that snap the cursor (buttons, specific links)
    document.querySelectorAll('.layer__dark .js-cursor-snap').forEach(el => {
      el.addEventListener('mouseenter', () => {
        isSnapping = true;
        snapTarget = el;
        cursor.classList.add('is-snapped');
        
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        cursor.style.setProperty('--snap-w', rect.width + 'px');
        cursor.style.setProperty('--snap-h', rect.height + 'px');
        cursor.style.setProperty('--snap-r', style.borderRadius);
        
        // Button magnetic pull
        gsap.killTweensOf(el);
      });
      
      el.addEventListener('mousemove', (e) => {
        if (!isSnapping) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        
        gsap.to(el, {
          x: distX * 0.3,
          y: distY * 0.3,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      el.addEventListener('mouseleave', () => {
        isSnapping = false;
        snapTarget = null;
        cursor.classList.remove('is-snapped');
        
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  // ── Reveal Button ───────────────────────────────────────
  function setupRevealButton() {
    if (!revealBtn) return;

    const expandSize = Math.max(window.innerWidth, window.innerHeight) * 1.5;
    let revealTween = null;

    function startReveal(cx, cy) {
      isRevealing = true;

      // Set mask center to button position (page-relative)
      const btnRect = revealBtn.getBoundingClientRect();
      const centerX = cx || (btnRect.left + btnRect.width / 2);
      const centerY = cy || (btnRect.top + btnRect.height / 2);
      const pageCenterY = centerY + window.scrollY;

      masker.style.setProperty('--x', centerX + 'px');
      masker.style.setProperty('--y', pageCenterY + 'px');

      if (revealTween) revealTween.kill();
      revealTween = gsap.to(maskSize, {
        inner: expandSize,
        outer: expandSize,
        duration: 0.9,
        ease: 'power3.out',
        onUpdate: () => {
          masker.style.setProperty('--mask-inner', maskSize.inner + 'px');
          masker.style.setProperty('--mask-outer', maskSize.outer + 'px');
        },
      });
    }

    function stopReveal() {
      if (revealTween) revealTween.kill();
      revealTween = gsap.to(maskSize, {
        inner: MASK.default.inner,
        outer: MASK.default.outer,
        duration: 0.5,
        ease: 'power2.in',
        onUpdate: () => {
          masker.style.setProperty('--mask-inner', maskSize.inner + 'px');
          masker.style.setProperty('--mask-outer', maskSize.outer + 'px');
        },
        onComplete: () => {
          isRevealing = false;
          targetMask.inner = MASK.default.inner;
          targetMask.outer = MASK.default.outer;
        },
      });
    }

    // Mouse events
    revealBtn.addEventListener('mousedown', (e) => {
      startReveal(e.clientX, e.clientY);
    });
    revealBtn.addEventListener('mouseup', stopReveal);
    revealBtn.addEventListener('mouseleave', () => {
      if (isRevealing) stopReveal();
    });

    // Touch events
    revealBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      startReveal(touch.clientX, touch.clientY);
    }, { passive: false });
    revealBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      stopReveal();
    });
    revealBtn.addEventListener('touchcancel', stopReveal);

    // Keyboard Shortcut (Hold Ctrl + Shift)
    let ctrlShiftActive = false;
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
        if (!ctrlShiftActive && (e.key === 'Control' || e.key === 'Shift')) {
          e.preventDefault();
          ctrlShiftActive = true;
          startReveal();
        }
      }
    });
    
    document.addEventListener('keyup', (e) => {
      if (ctrlShiftActive && (!e.ctrlKey || !e.shiftKey)) {
        ctrlShiftActive = false;
        stopReveal();
      }
    });

    // Cursor hover on reveal button
    if (!isTouchDevice) {
      revealBtn.addEventListener('mouseenter', () => {
        cursor.classList.add('is-extended');
        targetMask.inner = 60;
        targetMask.outer = 80;
      });
      revealBtn.addEventListener('mouseleave', () => {
        if (!isRevealing) {
          cursor.classList.remove('is-extended');
          targetMask.inner = MASK.default.inner;
          targetMask.outer = MASK.default.outer;
        }
      });
    }
  }

  // ── Character Slide-Up Animations ───────────────────────
  function setupCharAnimations() {
    const targets = document.querySelectorAll('.layer__dark .js-anim--chars');
    if (!targets.length || typeof SplitType === 'undefined') return;

    targets.forEach((el, idx) => {
      const split = new SplitType(el, { types: 'chars' });

      // Set initial state
      gsap.set(split.chars, { y: '110%' });

      // Animate on load for hero, on scroll for others
      const isHero = el.closest('.hero');
      if (isHero) {
        gsap.to(split.chars, {
          y: '0%',
          duration: 1,
          ease: 'power4.out',
          stagger: 0.03,
          delay: 0.3 + idx * 0.15,
        });
      } else {
        gsap.to(split.chars, {
          y: '0%',
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.02,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    });
  }

  // ── Line Reveal Animations ──────────────────────────────
  function setupLineAnimations() {
    const targets = document.querySelectorAll('.layer__dark .js-anim--lines--sim');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger delay based on siblings
            const siblings = entry.target.parentElement.querySelectorAll('.js-anim--lines--sim');
            let index = 0;
            siblings.forEach((sib, i) => {
              if (sib === entry.target) index = i;
            });

            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, index * 100);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  // ── Scroll Paragraph Mask ───────────────────────────────
  function setupScrollParagraphMask() {
    const paragraphs = document.querySelectorAll('.layer__dark .js-scroll-paragraph-mask');
    if (!paragraphs.length || typeof SplitType === 'undefined') return;

    paragraphs.forEach((p) => {
      const split = new SplitType(p, { types: 'words' });

      split.words.forEach((word) => {
        word.classList.add('word');
      });

      // Animate word opacity based on scroll position
      gsap.to(split.words, {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: p,
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });
    });
  }

  // ── Parallax Floating Elements ──────────────────────────
  function setupParallax() {
    const floats = document.querySelectorAll('.layer__dark [data-parallax-speed]');
    if (!floats.length) return;

    floats.forEach((el) => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0;
      const is3D = el.hasAttribute('data-parallax-3d');
      
      const animProps = {
        yPercent: speed * 200,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      };

      if (is3D) {
        animProps.rotationY = speed * 360;
        animProps.rotationX = speed * 180;
        animProps.rotationZ = speed * 90;
      }

      gsap.to(el, animProps);
    });
  }

  // ── Section Height Sync ─────────────────────────────────
  // Ensures red layer sections match dark layer section heights
  function syncLayerHeights() {
    const darkLayer = document.getElementById('layer-dark');
    const redLayer  = document.getElementById('layer-red');
    if (!darkLayer || !redLayer) return;

    const darkChildren = darkLayer.children;
    const redChildren  = redLayer.children;
    const count = Math.min(darkChildren.length, redChildren.length);

    for (let i = 0; i < count; i++) {
      // Reset first
      redChildren[i].style.minHeight = '';
      // Then match
      const darkH = darkChildren[i].offsetHeight;
      redChildren[i].style.minHeight = darkH + 'px';
    }
  }

  // ── Nav Smooth Scroll ───────────────────────────────────
  function setupNavScroll() {
    document.querySelectorAll('.layer__dark .nav__link[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target && lenis) {
          lenis.scrollTo(target, { offset: -80 });
        } else if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ── Init ────────────────────────────────────────────────
  function init() {
    gsap.registerPlugin(ScrollTrigger);

    setupCursorStates();
    setupRevealButton();
    setupCharAnimations();
    setupLineAnimations();
    setupScrollParagraphMask();
    setupParallax();
    setupNavScroll();
    setupProjectTilt();

    // Sync heights after fonts load and layout settles
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        syncLayerHeights();
        ScrollTrigger.refresh();
      });
    } else {
      setTimeout(() => {
        syncLayerHeights();
        ScrollTrigger.refresh();
      }, 500);
    }

    // Re-sync on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        syncLayerHeights();
        ScrollTrigger.refresh();
      }, 250);
    });
  }

  // ── 3D Tilt on Project Cards ────────────────────────────
  function setupProjectTilt() {
    if (isTouchDevice) return;
    const projects = document.querySelectorAll('.layer__dark .project[data-tilt]');

    projects.forEach(project => {
      project.addEventListener('mousemove', (e) => {
        const rect = project.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(project, {
          rotateY: x * 8,
          rotateX: -y * 5,
          x: x * 15,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
        });
      });

      project.addEventListener('mouseleave', () => {
        gsap.to(project, {
          rotateY: 0,
          rotateX: 0,
          x: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
