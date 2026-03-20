(function () {
  var FAVICON = "logo/logo.png";
  var SITE_URL =
    "https://www.naffmservices.com"; /* ← update to your live domain */
  var SITE_NAME = "NAF Facility Management & Security Services Pvt Ltd";
  var SITE_PHONE = "+91-44-43510001";
  var SITE_EMAIL = "info@naffmservices.com"; /* ← update if different */
  var SITE_GEO_LAT = "13.0827";
  var SITE_GEO_LNG = "80.2707";
  function tag(type, attrs) {
    var el = document.createElement(type);
    Object.keys(attrs).forEach(function (k) {
      if (k === "crossorigin") {
        el.crossOrigin = "";
      } else {
        el.setAttribute(k, attrs[k]);
      }
    });
    document.head.appendChild(el);
  }

  function injectHead(config) {
    /* ── Favicon ── */
    tag("link", {
      rel: "icon",
      type: "image/png",
      sizes: "180x180",
      href: FAVICON,
    });
    tag("link", { rel: "apple-touch-icon", sizes: "180x180", href: FAVICON });

    /* ── Page title ── */
    var suffix = " | NAF Facility Management & Security Services";
    var fullTitle = config.titleFull ? config.titleFull : config.title + suffix;
    document.title = fullTitle;

    /* ── Basic meta ── */
    tag("meta", {
      "http-equiv": "Content-Type",
      content: "text/html; charset=UTF-8",
    });
    tag("meta", { name: "language", content: "English" });
    tag("meta", { name: "revisit-after", content: "7 days" });
    tag("meta", {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    });
    tag("meta", { name: "googlebot", content: "index, follow" });
    tag("meta", { name: "author", content: SITE_NAME });
    tag("meta", { name: "copyright", content: SITE_NAME });
    tag("meta", { name: "rating", content: "general" });

    /* ── Meta description ── */
    if (config.description) {
      tag("meta", { name: "description", content: config.description });
    }

    /* ── Keywords – global Chennai base + optional per-page extras ── */
    var baseKeywords = [
      "facility management Chennai",
      "security services Chennai",
      "FM services Tamil Nadu",
      "facility management company Chennai",
      "security guard services Chennai",
      "housekeeping services Chennai",
      "soft services Chennai",
      "hard services Chennai",
      "NAF facility management",
      "NAF security services",
      "corporate facility management Chennai",
      "IT park facility management Chennai",
      "hospital facility management Chennai",
      "industrial facility management Chennai",
      "office maintenance Chennai",
      "building maintenance services Chennai",
      "integrated facility management Chennai",
      "HVAC maintenance Chennai",
      "electrical maintenance Chennai",
      "manpower supply Chennai",
      "cleaning services Chennai",
      "pest control Chennai",
      "CCTV surveillance Chennai",
      "access control systems Chennai",
      "visitor management Chennai",
      "facility management Guindy",
      "facility management OMR Chennai",
      "facility management Ambattur",
      "facility management Perungudi",
      "facility management Anna Nagar",
      "facility management Adyar",
      "security services Tamil Nadu",
      "facility services South India",
    ];
    var pageKeywords = config.keywords ? config.keywords : [];
    tag("meta", {
      name: "keywords",
      content: baseKeywords.concat(pageKeywords).join(", "),
    });

    /* ── Geo / location ── */
    tag("meta", { name: "geo.region", content: "IN-TN" });
    tag("meta", {
      name: "geo.placename",
      content: "Chennai, Tamil Nadu, India",
    });
    tag("meta", {
      name: "geo.position",
      content: SITE_GEO_LAT + ";" + SITE_GEO_LNG,
    });
    tag("meta", { name: "ICBM", content: SITE_GEO_LAT + ", " + SITE_GEO_LNG });

    /* ── Open Graph ── */
    var pageUrl =
      SITE_URL + "/" + (window.location.pathname.split("/").pop() || "");
    tag("meta", { property: "og:type", content: "website" });
    tag("meta", { property: "og:site_name", content: SITE_NAME });
    tag("meta", { property: "og:title", content: fullTitle });
    tag("meta", {
      property: "og:description",
      content:
        config.description ||
        "Premium facility management and security services across Chennai, Tamil Nadu.",
    });
    tag("meta", { property: "og:url", content: pageUrl });
    tag("meta", {
      property: "og:image",
      content: SITE_URL + "/images/logo.png",
    });
    tag("meta", { property: "og:image:width", content: "180" });
    tag("meta", { property: "og:image:height", content: "180" });
    tag("meta", { property: "og:locale", content: "en_IN" });

    /* ── Twitter Card ── */
    tag("meta", { name: "twitter:card", content: "summary" });
    tag("meta", { name: "twitter:title", content: fullTitle });
    tag("meta", {
      name: "twitter:description",
      content:
        config.description ||
        "Premium facility management and security services across Chennai, Tamil Nadu.",
    });
    tag("meta", {
      name: "twitter:image",
      content: SITE_URL + "/images/logo.png",
    });

    /* ── Canonical URL ── */
    tag("link", { rel: "canonical", href: pageUrl });

    /* ── JSON-LD Local Business Schema ── */
    var schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: SITE_NAME,
      image: SITE_URL + "/images/logo.png",
      url: SITE_URL,
      telephone: SITE_PHONE,
      email: SITE_EMAIL,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: SITE_GEO_LAT,
        longitude: SITE_GEO_LNG,
      },
      areaServed: [
        { "@type": "City", name: "Chennai" },
        { "@type": "State", name: "Tamil Nadu" },
      ],
      serviceType: [
        "Facility Management",
        "Security Services",
        "Housekeeping",
        "Hard Services",
        "Soft Services",
        "HVAC Maintenance",
        "Electrical Maintenance",
        "Manpower Supply",
      ],
      openingHours: "Mo-Su 00:00-23:59",
      sameAs: [],
    };
    var schemaEl = document.createElement("script");
    schemaEl.type = "application/ld+json";
    schemaEl.text = JSON.stringify(schema);
    document.head.appendChild(schemaEl);

    /* ── Google Fonts ── */
    tag("link", { rel: "preconnect", href: "https://fonts.googleapis.com" });
    tag("link", {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "",
    });
    tag("link", {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap",
    });

    /* ── Bootstrap CSS ── */
    tag("link", {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
    });

    /* ── Bootstrap Icons ── */
    tag("link", {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
    });

    /* ── AOS ── */
    tag("link", {
      rel: "stylesheet",
      href: "https://unpkg.com/aos@2.3.4/dist/aos.css",
    });

    /* ── Swiper (opt-in) ── */
    if (config.swiper) {
      tag("link", {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
      });
    }

    /* ── Main stylesheet ── */
    tag("link", { rel: "stylesheet", href: "css/style.css" });

    /* ── Page-specific stylesheet (opt-in) ── */
    if (config.pageCss) {
      tag("link", { rel: "stylesheet", href: "css/" + config.pageCss });
    }
  }

  window.NAFHead = { init: injectHead };
})();
