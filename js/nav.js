// /* ═══════════════════════════════════════════════════════════
//    NAF — Shared Navbar Component
//    Runs SYNCHRONOUSLY during HTML parse (no defer/async)
//    so the navbar renders as part of the initial paint.
//    Script.js handles scroll/mobile behaviour after DOM ready.
// ═══════════════════════════════════════════════════════════ */
// (function () {
//   var NAV_HTML =
//     '<nav class="navbar navbar-expand-lg fixed-top" id="mainNav">' +
//     '<div class="container">' +
//     '<a class="navbar-brand" href="index.html">' +
//     '<div class="brand-logo">' +
//     '<div class="logo-mark-wrap"><img src="logo/logo.png" alt="NAF Logo" class="logo-mark" /></div>' +
//     '<div class="brand-text">' +
//     '<span class="brand-name">Naf</span>' +
//     '<span class="brand-tagline">Facility Management &amp; Security Services Pvt Ltd</span>' +
//     "</div>" +
//     "</div>" +
//     "</a>" +
//     '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">' +
//     '<span class="nav-toggle-icon"><span></span><span></span><span></span></span>' +
//     "</button>" +
//     '<div class="collapse navbar-collapse" id="navMenu">' +
//     '<ul class="navbar-nav mx-auto" id="navLinksList">' +
//     '<li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>' +
//     '<li class="nav-item"><a class="nav-link" href="about.html">About</a></li>' +
//     '<li class="nav-item dropdown">' +
//     '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Services</a>' +
//     '<ul class="dropdown-menu nav-dropdown">' +
//     '<li><a class="dropdown-item" href="hard-services.html"><i class="bi bi-gear-wide-connected"></i>Hard Services</a></li>' +
//     '<li><a class="dropdown-item" href="soft-services.html"><i class="bi bi-people-fill"></i>Soft Services</a></li>' +
//     '<li><a class="dropdown-item" href="other-services.html"><i class="bi bi-grid-3x3-gap-fill"></i>Other Services</a></li>' +
//     "</ul>" +
//     "</li>" +
//     '<li class="nav-item"><a class="nav-link" href="industries.html">Industries</a></li>' +
//     '<li class="nav-item"><a class="nav-link" href="clients.html">Clients</a></li>' +
//     '<li class="nav-item"><a class="nav-link" href="careers.html">Careers</a></li>' +
//     '<li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>' +
//     "</ul>" +
//     '<div class="nav-cta-group">' +
//     '<a href="tel:044-43510001" class="btn btn-nav-call d-none d-xl-inline-flex">' +
//     '<i class="bi bi-telephone-fill me-2"></i>044-4351 0001' +
//     "</a>" +
//     '<a href="contact.html" class="btn btn-quote ms-2">Get Free Quote <i class="bi bi-arrow-right-short"></i></a>' +
//     "</div>" +
//     "</div>" +
//     "</div>" +
//     "</nav>";

//   /* ── Inject HTML ── */
//   var root = document.getElementById("nav-root");
//   if (root) root.innerHTML = NAV_HTML;

//   /* ── Auto-detect active page ── */
//   var page = (
//     window.location.pathname.split("/").pop() || "index.html"
//   ).toLowerCase();
//   if (!page || page === "") page = "index.html";

//   var servicePages = [
//     "hard-services.html",
//     "soft-services.html",
//     "other-services.html",
//   ];

//   var links = document.querySelectorAll("#navLinksList .nav-link[href]");
//   for (var i = 0; i < links.length; i++) {
//     var href = (links[i].getAttribute("href") || "").toLowerCase();
//     if (href === page) {
//       links[i].classList.add("active");
//     }
//   }

//   /* If on a service sub-page, mark the Services toggle as active */
//   if (servicePages.indexOf(page) !== -1) {
//     var toggle = document.querySelector("#navLinksList .dropdown-toggle");
//     if (toggle) toggle.classList.add("active");
//   }
//   document.addEventListener("DOMContentLoaded", function () {
//     if (window.innerWidth >= 992) {
//       var dropdowns = document.querySelectorAll("#navLinksList .dropdown");

//       dropdowns.forEach(function (dropdown) {
//         var toggle = dropdown.querySelector(".dropdown-toggle");
//         var menu = dropdown.querySelector(".dropdown-menu");
//         var instance = bootstrap.Dropdown.getOrCreateInstance(toggle);

//         dropdown.addEventListener("mouseenter", function () {
//           instance.show();
//         });

//         dropdown.addEventListener("mouseleave", function () {
//           instance.hide();
//         });
//       });
//     }
//   });
// })();

/* ═══════════════════════════════════════════════════════════
   NAF — Shared Navbar Component
   Runs SYNCHRONOUSLY during HTML parse (no defer/async)
   so the navbar renders as part of the initial paint.
   Script.js handles scroll/mobile behaviour after DOM ready.
═══════════════════════════════════════════════════════════ */
(function () {
  var NAV_HTML =
    '<nav class="navbar navbar-expand-lg fixed-top" id="mainNav">' +
    '<div class="container">' +
    '<a class="navbar-brand" href="index.html">' +
    '<div class="brand-logo">' +
    '<div class="logo-mark-wrap"><img src="logo/logo.png" alt="NAF Logo" class="logo-mark" /></div>' +
    '<div class="brand-text">' +
    '<span class="brand-name">NAF</span>' +
    '<span class="brand-tagline">Facility Management &amp; Security Services Pvt Ltd</span>' +
    "</div>" +
    "</div>" +
    "</a>" +
    '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">' +
    '<span class="nav-toggle-icon"><span></span><span></span><span></span></span>' +
    "</button>" +
    '<div class="collapse navbar-collapse" id="navMenu">' +
    '<ul class="navbar-nav mx-auto" id="navLinksList">' +
    '<li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>' +
    '<li class="nav-item dropdown">' +
    '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">About</a>' +
    '<ul class="dropdown-menu nav-dropdown">' +
    '<li><a class="dropdown-item" href="about.html"><i class="bi bi-gear-wide-connected"></i>About Us</a></li>' +
    '<li><a class="dropdown-item" href="company-profile.html"><i class="bi bi-people-fill"></i>Company Profile</a></li>' +
    "</ul>" +
    "</li>" +
    '<li class="nav-item dropdown">' +
    '<a class="nav-link dropdown-toggle" href="3" role="button" data-bs-toggle="dropdown">Services</a>' +
    '<ul class="dropdown-menu nav-dropdown">' +
    '<li><a class="dropdown-item" href="hard-services.html"><i class="bi bi-gear-wide-connected"></i>Hard Services</a></li>' +
    '<li><a class="dropdown-item" href="soft-services.html"><i class="bi bi-people-fill"></i>Soft Services</a></li>' +
    '<li><a class="dropdown-item" href="other-services.html"><i class="bi bi-grid-3x3-gap-fill"></i>Other Services</a></li>' +
    "</ul>" +
    "</li>" +
    '<li class="nav-item"><a class="nav-link" href="industries.html">Industries</a></li>' +
    '<li class="nav-item"><a class="nav-link" href="clients.html">Clients</a></li>' +
    '<li class="nav-item"><a class="nav-link" href="careers.html">Careers</a></li>' +
    '<li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>' +
    "</ul>" +
    '<div class="nav-cta-group">' +
    // '<a href="tel:044-43510001" class="btn btn-nav-call d-none d-xl-inline-flex">' +
    // '<i class="bi bi-telephone-fill me-2"></i>044-4351 0001' +
    // "</a>" +
    '<a href="contact.html" class="btn btn-quote ms-2">Get Free Quote <i class="bi bi-arrow-right-short"></i></a>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</nav>";

  /* ── Inject HTML ── */
  var root = document.getElementById("nav-root");
  if (root) root.innerHTML = NAV_HTML;

  /* ── Auto-detect active page ── */
  var page = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();
  if (!page || page === "") page = "index.html";

  var servicePages = [
    "hard-services.html",
    "soft-services.html",
    "other-services.html",
  ];

  var aboutPages = ["about.html", "company-profile.html"];

  var links = document.querySelectorAll("#navLinksList .nav-link[href]");
  for (var i = 0; i < links.length; i++) {
    var href = (links[i].getAttribute("href") || "").toLowerCase();
    if (href === page) {
      links[i].classList.add("active");
    }
  }

  /* If on a service sub-page, mark the Services toggle as active */
  if (servicePages.indexOf(page) !== -1) {
    var toggle = document.querySelector("#navLinksList .dropdown-toggle");
    if (toggle) toggle.classList.add("active");
  }

  /* If on an about sub-page, mark the About toggle as active */
  if (aboutPages.indexOf(page) !== -1) {
    var allToggles = document.querySelectorAll(
      "#navLinksList .dropdown-toggle",
    );
    for (var j = 0; j < allToggles.length; j++) {
      if ((allToggles[j].textContent || "").trim().toLowerCase() === "about") {
        allToggles[j].classList.add("active");
      }
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth >= 992) {
      var dropdowns = document.querySelectorAll("#navLinksList .dropdown");

      dropdowns.forEach(function (dropdown) {
        var toggle = dropdown.querySelector(".dropdown-toggle");
        var menu = dropdown.querySelector(".dropdown-menu");
        var instance = bootstrap.Dropdown.getOrCreateInstance(toggle);

        dropdown.addEventListener("mouseenter", function () {
          instance.show();
        });

        dropdown.addEventListener("mouseleave", function () {
          instance.hide();
        });
      });
    }
  });
})();
