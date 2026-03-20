/* ═══════════════════════════════════════════════════════════
   NAF Facility Management & Security Services
   Main JavaScript — script.js  (Optimised v2)
   ═══════════════════════════════════════════════════════════ */

"use strict";

/* ─── Init on DOM ready ─── */
document.addEventListener("DOMContentLoaded", function () {
  initAOS();
  initAnnouncementBar();
  initNavbar();
  initNavDropdownMobile(); /* NEW: robust mobile dropdown */
  initHeroSwiper();
  initTestiSwiper();
  initCounters();
  initBackToTop();
  initContactForm();
  initCareerForm();
  initSmoothScroll();
  setHeroSlideBackgrounds();
  closeNavOnLinkClick();
  initClientMarquee();
  initGalleryMarquee(); /* NEW: gallery marquee rows */
  initJobAccordion();
});

window.addEventListener("load", function () {
  if (typeof AOS !== "undefined") AOS.refresh();
  initServiceCardTilt();
  initGenericCounters();
});

/* ═══════════════════════════════════════════════════════════
   AOS — lightweight config
═══════════════════════════════════════════════════════════ */
function initAOS() {
  if (typeof AOS === "undefined") return;
  AOS.init({
    duration: 500 /* was 720 — snappier, less laggy */,
    easing: "ease-out" /* simpler easing = less CPU */,
    once: true /* animate only once */,
    offset: 60,
    mirror: false,
    anchorPlacement: "top-bottom",
  });
}

/* ═══════════════════════════════════════════════════════════
   ANNOUNCEMENT BAR
═══════════════════════════════════════════════════════════ */
function initAnnouncementBar() {
  var bar = document.getElementById("announcementBar");
  var closeBtn = document.getElementById("annClose");
  if (!bar || !closeBtn) return;

  closeBtn.addEventListener("click", function () {
    bar.style.transition = "max-height .35s ease, opacity .35s ease";
    bar.style.maxHeight = bar.offsetHeight + "px";
    requestAnimationFrame(function () {
      bar.style.maxHeight = "0";
      bar.style.opacity = "0";
      bar.style.overflow = "hidden";
    });
    setTimeout(function () {
      bar.remove();
    }, 380);
  });
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR — scroll state  (throttled for perf)
═══════════════════════════════════════════════════════════ */
function initNavbar() {
  var nav = document.getElementById("mainNav");
  if (!nav) return;

  var ticking = false;
  function updateNav() {
    nav.classList.toggle("scrolled", window.scrollY > 60);
    ticking = false;
  }
  updateNav();
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true },
  );
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR MOBILE DROPDOWN — fully reliable
   Problem: dynamically-injected nav means Bootstrap's
   dropdown init may run before the element exists.
   Solution: manual toggle on mobile.
═══════════════════════════════════════════════════════════ */
function initNavDropdownMobile() {
  /* Wait a tick to ensure Bootstrap has registered its own handlers */
  setTimeout(function () {
    var dropdownToggles = document.querySelectorAll(
      ".navbar-nav .dropdown-toggle",
    );
    dropdownToggles.forEach(function (toggle) {
      /* Remove href so click doesn't navigate on mobile */
      toggle.setAttribute("href", "#");

      toggle.addEventListener("click", function (e) {
        /* Only intercept on mobile / collapsed navbar */
        var navMenu = document.getElementById("navMenu");
        var isCollapsed =
          navMenu && window.getComputedStyle(navMenu).display === "none"
            ? false
            : navMenu && !navMenu.classList.contains("show")
              ? window.innerWidth < 992
              : false;

        /* Always intercept on small screens */
        if (window.innerWidth < 992) {
          e.preventDefault();
          e.stopPropagation();
          var parentLi = toggle.closest(".dropdown");
          var menu = parentLi ? parentLi.querySelector(".dropdown-menu") : null;
          if (!menu) return;

          var isOpen = parentLi.classList.contains("show");

          /* Close all open dropdowns first */
          document
            .querySelectorAll(".navbar-nav .dropdown.show")
            .forEach(function (d) {
              d.classList.remove("show");
              var dm = d.querySelector(".dropdown-menu");
              if (dm) {
                dm.classList.remove("show");
                dm.style.display = "";
              }
              var dt = d.querySelector(".dropdown-toggle");
              if (dt) dt.setAttribute("aria-expanded", "false");
            });

          /* Toggle clicked one */
          if (!isOpen) {
            parentLi.classList.add("show");
            menu.classList.add("show");
            menu.style.display = "block";
            toggle.setAttribute("aria-expanded", "true");
          }
        }
      });
    });

    /* Close mobile dropdown when clicking outside */
    document.addEventListener("click", function (e) {
      if (window.innerWidth >= 992) return;
      if (!e.target.closest(".navbar-nav .dropdown")) {
        document
          .querySelectorAll(".navbar-nav .dropdown.show")
          .forEach(function (d) {
            d.classList.remove("show");
            var dm = d.querySelector(".dropdown-menu");
            if (dm) {
              dm.classList.remove("show");
              dm.style.display = "";
            }
            var dt = d.querySelector(".dropdown-toggle");
            if (dt) dt.setAttribute("aria-expanded", "false");
          });
      }
    });
  }, 0);
}

/* ═══════════════════════════════════════════════════════════
   CLOSE NAV ON LINK CLICK (mobile)
═══════════════════════════════════════════════════════════ */
function closeNavOnLinkClick() {
  var navMenu = document.getElementById("navMenu");
  if (!navMenu) return;

  /* Track collapse events to update toggler aria-expanded for CSS hamburger→X animation */
  navMenu.addEventListener("show.bs.collapse", function () {
    var toggler = document.querySelector(".navbar-toggler");
    if (toggler) toggler.setAttribute("aria-expanded", "true");
  });
  navMenu.addEventListener("hide.bs.collapse", function () {
    var toggler = document.querySelector(".navbar-toggler");
    if (toggler) toggler.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll(".navbar-nav .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth >= 992) return;
      /* Only close if it's not a dropdown toggle */
      if (link.classList.contains("dropdown-toggle")) return;
      if (navMenu.classList.contains("show")) {
        if (typeof bootstrap !== "undefined") {
          var bsCollapse = bootstrap.Collapse.getOrCreateInstance(navMenu);
          bsCollapse.hide();
        } else {
          navMenu.classList.remove("show");
        }
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   HERO SLIDE BACKGROUNDS
═══════════════════════════════════════════════════════════ */
function setHeroSlideBackgrounds() {
  document.querySelectorAll(".hero-slide[data-bg]").forEach(function (slide) {
    slide.style.backgroundImage = "url('" + slide.dataset.bg + "')";
  });
}

/* ═══════════════════════════════════════════════════════════
   HERO SWIPER
═══════════════════════════════════════════════════════════ */
function initHeroSwiper() {
  var el = document.querySelector(".heroSwiper");
  if (!el || typeof Swiper === "undefined") return;

  var progressFill = document.getElementById("heroProgress");
  var SLIDE_DURATION = 6000;

  new Swiper(".heroSwiper", {
    loop: true,
    speed: 800,
    effect: "fade",
    fadeEffect: { crossFade: true },
    autoplay: { delay: SLIDE_DURATION, disableOnInteraction: false },
    navigation: { prevEl: ".hero-prev", nextEl: ".hero-next" },
    pagination: { el: ".hero-pagination", clickable: true },
    on: {
      init: function () {
        resetProgress(progressFill, SLIDE_DURATION);
      },
      slideChangeTransitionStart: function () {
        resetProgress(progressFill, SLIDE_DURATION);
      },
    },
  });
}

function resetProgress(el, duration) {
  if (!el) return;
  el.style.transition = "none";
  el.style.width = "0%";
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      el.style.transition = "width " + duration + "ms linear";
      el.style.width = "100%";
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS SWIPER
═══════════════════════════════════════════════════════════ */
function initTestiSwiper() {
  if (!document.querySelector(".testiSwiper") || typeof Swiper === "undefined")
    return;
  new Swiper(".testiSwiper", {
    loop: true,
    speed: 650,
    autoplay: { delay: 5000, disableOnInteraction: false },
    spaceBetween: 24,
    grabCursor: true,
    pagination: { el: ".testi-pagination", clickable: true },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 1 },
      992: { slidesPerView: 2 },
      1200: { slidesPerView: 3 },
    },
  });
}

/* ═══════════════════════════════════════════════════════════
   COUNTERS — IntersectionObserver trigger
═══════════════════════════════════════════════════════════ */
function initCounters() {
  var counters = document.querySelectorAll(".counter-num");
  if (!counters.length) return;
  var triggered = false;
  var section = document.querySelector(".counters-section");
  if (!section) return;

  function animateCount(el) {
    var target = +el.getAttribute("data-target");
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      el.textContent = Math.ceil(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting && !triggered) {
        triggered = true;
        counters.forEach(animateCount);
      }
    },
    { threshold: 0.3 },
  ).observe(section);
}

function initGenericCounters() {
  var els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  var done = false;
  var section = els[0].closest("section");
  if (!section) return;

  new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting && !done) {
        done = true;
        els.forEach(function (el) {
          var target = +el.getAttribute("data-count");
          var start = null;
          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / 1600, 1);
            el.textContent = Math.ceil(p * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          requestAnimationFrame(step);
        });
      }
    },
    { threshold: 0.4 },
  ).observe(section);
}

/* ═══════════════════════════════════════════════════════════
   BACK TO TOP + FLOAT CHAT VISIBILITY (throttled)
═══════════════════════════════════════════════════════════ */
function initBackToTop() {
  var topBtn = document.getElementById("backToTop");
  var floatChat = document.getElementById("floatChat");
  var ticking = false;

  function updateVisibility() {
    var show = window.scrollY > 300;
    /* Back-to-top: only show after scrolling */
    if (topBtn) topBtn.classList.toggle("visible", show);
    /* Float chat bubble: only show after scrolling (chatbot widget is always visible) */
    if (floatChat) floatChat.classList.toggle("visible", show);
    ticking = false;
  }

  /* Run immediately so initial state is correct */
  updateVisibility();

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    },
    { passive: true },
  );

  if (topBtn) {
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   SMOOTH SCROLL (hash links with nav offset)
═══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href");
      if (href === "#") return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var navH = (document.getElementById("mainNav") || {}).offsetHeight || 80;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: "smooth",
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  /* Find all slides with data-bg and apply as background-image */
  var slides = document.querySelectorAll("[data-bg]");
  slides.forEach(function (slide) {
    var bg = slide.getAttribute("data-bg");
    if (bg) {
      slide.style.backgroundImage = "url('" + bg + "')";
      slide.style.backgroundSize = "cover";
      slide.style.backgroundPosition = "relative";
      slide.style.backgroundRepeat = "no-repeat";
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   SERVICE CARD TILT (desktop only, GPU-friendly)
═══════════════════════════════════════════════════════════ */
function initServiceCardTilt() {
  if (window.innerWidth < 992) return;
  document.querySelectorAll(".service-card").forEach(function (card) {
    card.style.willChange = "transform";
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var tX = ((e.clientY - r.top - r.height / 2) / r.height) * 5;
      var tY = -((e.clientX - r.left - r.width / 2) / r.width) * 5;
      card.style.transform =
        "perspective(900px) rotateX(" +
        tX +
        "deg) rotateY(" +
        tY +
        "deg) translateY(-8px)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   CLIENT MARQUEE — pause on hover / touch
═══════════════════════════════════════════════════════════ */
function initClientMarquee() {
  var tracks = document.querySelectorAll(".marquee-track");
  if (!tracks.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tracks.forEach(function (t) {
      t.style.animationPlayState = "paused";
    });
    return;
  }

  document.querySelectorAll(".marquee-wrapper").forEach(function (wrapper) {
    wrapper.addEventListener("mouseenter", function () {
      wrapper.querySelectorAll(".marquee-track").forEach(function (t) {
        t.style.animationPlayState = "paused";
      });
    });
    wrapper.addEventListener("mouseleave", function () {
      wrapper.querySelectorAll(".marquee-track").forEach(function (t) {
        t.style.animationPlayState = "running";
      });
    });
    wrapper.addEventListener(
      "touchstart",
      function () {
        wrapper.querySelectorAll(".marquee-track").forEach(function (t) {
          t.style.animationPlayState = "paused";
        });
      },
      { passive: true },
    );
    wrapper.addEventListener(
      "touchend",
      function () {
        setTimeout(function () {
          wrapper.querySelectorAll(".marquee-track").forEach(function (t) {
            t.style.animationPlayState = "running";
          });
        }, 600);
      },
      { passive: true },
    );
  });
}

/* ═══════════════════════════════════════════════════════════
   GALLERY MARQUEE — pause on hover / touch
   Works for .gallery-row tracks on about.html
═══════════════════════════════════════════════════════════ */
function initGalleryMarquee() {
  var rows = document.querySelectorAll(".gallery-marquee-row");
  if (!rows.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    rows.forEach(function (r) {
      r.style.animationPlayState = "paused";
    });
    return;
  }

  rows.forEach(function (row) {
    row.addEventListener("mouseenter", function () {
      row.style.animationPlayState = "paused";
    });
    row.addEventListener("mouseleave", function () {
      row.style.animationPlayState = "running";
    });
    row.addEventListener(
      "touchstart",
      function () {
        row.style.animationPlayState = "paused";
      },
      { passive: true },
    );
    row.addEventListener(
      "touchend",
      function () {
        setTimeout(function () {
          row.style.animationPlayState = "running";
        }, 600);
      },
      { passive: true },
    );
  });
}

/* ═══════════════════════════════════════════════════════════
   JOB ACCORDION (careers.html)
═══════════════════════════════════════════════════════════ */
function initJobAccordion() {
  document.querySelectorAll(".job-card-header").forEach(function (header) {
    header.addEventListener("click", function () {
      var card = header.closest(".job-card");
      var body = card.querySelector(".job-card-body");
      var isOpen = card.classList.contains("open");
      document.querySelectorAll(".job-card").forEach(function (c) {
        c.classList.remove("open");
        var b = c.querySelector(".job-card-body");
        if (b) b.style.maxHeight = "0";
      });
      if (!isOpen) {
        card.classList.add("open");
        if (body) body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", initJobAccordion);

/* ═══════════════════════════════════════════════════════════
   INDUSTRY CARD HOVER
═══════════════════════════════════════════════════════════ */
function initIndustryCardHover() {
  document.querySelectorAll(".industry-card").forEach(function (card) {
    var label = card.querySelector(".industry-label");
    card.addEventListener("mouseenter", function () {
      if (label) label.style.color = "var(--primary)";
    });
    card.addEventListener("mouseleave", function () {
      if (label) label.style.color = "";
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   CONTACT TESTIMONIAL CAROUSEL (index.html)
═══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {
  initContactTestiCarousel();
});

function initContactTestiCarousel() {
  var track = document.getElementById("cntTestiTrack");
  var dots = document.querySelectorAll(".cnt-dot");
  if (!track || !dots.length) return;

  var total = dots.length;
  var current = 0;
  var autoPlay = null;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });
  }

  function startAuto() {
    autoPlay = setInterval(function () {
      goTo(current + 1);
    }, 5000);
  }
  function stopAuto() {
    clearInterval(autoPlay);
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      stopAuto();
      goTo(+dot.getAttribute("data-idx"));
      startAuto();
    });
  });

  /* Touch/swipe support */
  var startX = 0;
  track.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
      stopAuto();
    },
    { passive: true },
  );
  track.addEventListener(
    "touchend",
    function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
      startAuto();
    },
    { passive: true },
  );

  startAuto();
}
