/* ═══════════════════════════════════════════════════════════
   NAF — Shared Footer Component
   Mirrors the same pattern as nav.js.
   Load this script BEFORE bootstrap.bundle so the DOM
   elements exist when Bootstrap / script.js initialise.
   ═══════════════════════════════════════════════════════════ */
(function () {
  /* ── Canonical footer HTML ── */
  var FOOTER_HTML =
    '<footer class="site-footer" id="footer-root">' +
    '<div class="footer-top-gradient"></div>' +
    '<div class="container">' +
    '<div class="footer-main row g-5 pt-5 pb-4">' +
    /* Col 1 — Brand */
    '<div class="col-lg-4">' +
    '<div class="footer-brand">' +
    '<div class="logo-mark footer-logo-mark"><img src="logo/logo.png" alt="NAF Logo" class="logo-mark" /></div>' +
    '<div class="ms-3">' +
    '<div class="brand-name">NAF</div>' +
    '<div class="brand-tagline">Facility Management & Security Services Pvt Ltd</div>' +
    "</div>" +
    "</div>" +
    '<p class="footer-about mt-4">NAF Facility Management &amp; Security Services Pvt Ltd — a fully owned subsidiary of Al Najma Al Fareeda International Group, UAE. Chennai\'s trusted partner for comprehensive FM &amp; security solutions, serving 100+ organisations across Tamil Nadu.</p>' +
    '<div class="footer-cert-badges mt-3">' +
    '<span class="cert-badge"><i class="bi bi-patch-check-fill me-1"></i>PSARA Licensed</span>' +
    '<span class="cert-badge"><i class="bi bi-award-fill me-1"></i>ISO 9001:2015</span>' +
    '<span class="cert-badge"><i class="bi bi-shield-fill-check me-1"></i>TUV NORD</span>' +
    "</div>" +
    '<div class="footer-socials mt-4">' +
    '<a href="#" class="social-btn social-fa" aria-label="Facebook"><i class="bi bi-facebook"></i></a>' +
    '<a href="#" class="social-btn social-li" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>' +
    '<a href="#" class="social-btn social-x" aria-label="Twitter/X"><i class="bi bi-twitter-x"></i></a>' +
    '<a href="#" class="social-btn social-in" aria-label="Instagram"><i class="bi bi-instagram"></i></a>' +
    '<a href="https://wa.me/917397772205" class="social-btn social-wa" aria-label="WhatsApp" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i></a>' +
    "</div>" +
    "</div>" +
    /* Col 2 — Services */
    '<div class="col-6 col-lg-2">' +
    '<h6 class="footer-heading">Our Services</h6>' +
    '<ul class="footer-links">' +
    '<li><a href="hard-services.html">Hard Services</a></li>' +
    '<li><a href="soft-services.html">Soft Services</a></li>' +
    '<li><a href="other-services.html">Other Services</a></li>' +
    '<li><a href="soft-services.html#security">Security Guards</a></li>' +
    '<li><a href="soft-services.html#housekeeping">Housekeeping</a></li>' +
    '<li><a href="other-services.html#cctv">CCTV Monitoring</a></li>' +
    '<li><a href="other-services.html#access">Access Control</a></li>' +
    '<li><a href="hard-services.html#electrical">Electrical &amp; Plumbing</a></li>' +
    "</ul>" +
    "</div>" +
    /* Col 3 — Quick Links */
    '<div class="col-6 col-lg-2">' +
    '<h6 class="footer-heading">Quick Links</h6>' +
    '<ul class="footer-links">' +
    '<li><a href="index.html">Home</a></li>' +
    '<li><a href="about.html">About Us</a></li>' +
    '<li><a href="company-profile.html">Company Profile</a></li>' +
    '<li><a href="industries.html">Industries</a></li>' +
    '<li><a href="clients.html">Our Clients</a></li>' +
    '<li><a href="careers.html">Careers</a></li>' +
    '<li><a href="contact.html">Contact Us</a></li>' +
    "</ul>" +
    "</div>" +
    /* Col 4 — Contact */
    '<div class="col-lg-4">' +
    '<h6 class="footer-heading">Get In Touch</h6>' +
    '<div class="footer-contact-list">' +
    '<div class="fc-item"><i class="bi bi-geo-alt-fill"></i><span>Chennai, Tamil Nadu, India – 600030</span></div>' +
    '<div class="fc-item"><i class="bi bi-headset"></i><span><a href="tel:04443510001">044 - 4351 0001</a> <small class="fc-sub">Help Desk</small></span></div>' +
    '<div class="fc-item"><i class="bi bi-telephone-fill"></i><span><a href="tel:+917397772205">+91 73977 72205</a></span></div>' +
    '<div class="fc-item"><i class="bi bi-whatsapp"></i><span><a href="https://wa.me/917397772205" target="_blank" rel="noopener">WhatsApp Us</a></span></div>' +
    '<div class="fc-item"><i class="bi bi-envelope-fill"></i><span><a href="mailto:nafindia@alfareedagroupintl.com">nafindia@alfareedagroupintl.com</a></span></div>' +
    '<div class="fc-item"><i class="bi bi-clock-fill"></i><span>Mon – Sat: 9:00 AM – 6:00 PM</span></div>' +
    "</div>" +
    '<a href="contact.html" class="btn btn-footer-cta mt-4">Request Free Quote <i class="bi bi-arrow-right-short"></i></a>' +
    "</div>" +
    "</div>" /* end footer-main */ +
    /* Footer bottom bar */
    '<div class="footer-bottom">' +
    '<div class="row align-items-center">' +
    '<div class="col-md-6">' +
    '<p class="footer-copy">&copy; ' +
    new Date().getFullYear() +
    " NAF Facility Management &amp; Security Services Pvt Ltd. All rights reserved.</p>" +
    "</div>" +
    '<div class="col-md-6 text-md-end">' +
    '<p class="footer-legal">' +
    '<a href="#">Privacy Policy</a> &middot; ' +
    '<a href="#">Terms of Service</a> &middot; ' +
    '<a href="#">Sitemap</a>' +
    "</p>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" /* end container */ +
    "</footer>" +
    /* ── Floating buttons ── */
    '<div class="float-right-stack" id="floatRightStack">' +
    '<a href="https://wa.me/917397772205" class="float-btn-wa" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' +
    '<i class="bi bi-whatsapp"></i>' +
    '<div class="wa-pulse-ring"></div>' +
    "</a>" +
    '<button class="float-btn-top" id="backToTop" aria-label="Back to top">' +
    '<i class="bi bi-chevron-up"></i>' +
    "</button>" +
    "</div>";

  /* ── Inject into #footer-root placeholder ── */
  var root = document.getElementById("footer-root");
  if (root) {
    root.outerHTML = FOOTER_HTML;
  } else {
    /* Fallback: append before </body> */
    document.body.insertAdjacentHTML("beforeend", FOOTER_HTML);
  }

  /* ── Auto-highlight active nav page in footer links ── */
  var page = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();
  var footerLinks = document.querySelectorAll(".footer-links a[href]");
  footerLinks.forEach(function (a) {
    var href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
    if (href && href === page) {
      a.style.color = "var(--primary-light)";
    }
  });
})();
