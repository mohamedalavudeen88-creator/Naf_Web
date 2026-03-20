/* ═══════════════════════════════════════════════════════════
   NAF Chatbot — WhatsApp-style live chat widget
   UPDATED: more intents, white background, blue header, inactivity reset
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ── Detect current page ── */
  var page = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  /* ── CSS (white background, blue header) ── */
  var style = document.createElement("style");
  style.textContent = `
  /* ── Chatbot container ── */
  #naf-chat-widget{position:fixed;bottom:28px;left:24px;z-index:99999;font-family:'Inter',sans-serif;}

  /* Toggle button (teal) */
  #naf-chat-toggle{
    display:flex;align-items:center;gap:10px;
    background:linear-gradient(135deg,#00ADAA,#008F8D);
    color:#fff;border:none;border-radius:50px;
    padding:13px 22px 13px 18px;cursor:pointer;
    box-shadow:0 6px 28px rgba(0,173,170,.52);
    font-family:'Poppins',sans-serif;font-weight:700;font-size:.88rem;
    transition:transform .25s,box-shadow .25s;
    white-space:nowrap;
  }
  #naf-chat-toggle:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(0,173,170,.62);}
  #naf-chat-toggle .toggle-icon{font-size:1.2rem;line-height:1;display:flex;}
  #naf-chat-toggle .toggle-pulse{
    width:9px;height:9px;background:#22c55e;border-radius:50%;
    margin-left:4px;flex-shrink:0;
    animation:chatPulse 2s ease infinite;
  }
  @keyframes chatPulse{0%,100%{box-shadow:0 0 0 0 rgba(2, 154, 255, 0.6);}50%{box-shadow:0 0 0 6px rgba(34,197,94,0);}}

  /* Chat panel */
  #naf-chat-panel{
    position:absolute;bottom:68px;left:0;
    width:340px;max-width:calc(100vw - 32px);
    border-radius:18px;overflow:hidden;
    box-shadow:0 20px 70px rgba(0,0,0,.22);
    transform:scale(.92) translateY(12px);
    transform-origin:bottom left;
    opacity:0;pointer-events:none;
    transition:transform .3s cubic-bezier(.34,1.56,.64,1), opacity .25s ease;
  }
  #naf-chat-panel.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}

  /* Header – blue gradient */
  .naf-chat-header{
        background:linear-gradient(135deg,#00adaa,#008f8d);
    padding:14px 16px;display:flex;align-items:center;gap:12px;
  }
  .naf-chat-avatar{
    width:42px;height:42px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-family:'Poppins',sans-serif;font-weight:900;font-size:.95rem;color:#fff;
    flex-shrink:0;
  }
  .naf-chat-header-info{flex:1;}
  .naf-chat-name{font-family:'Poppins',sans-serif;font-weight:700;font-size:.92rem;color:#fff;line-height:1.2;}
  .naf-chat-status{display:flex;align-items:center;gap:5px;margin-top:2px;}
  .naf-status-dot{width:7px;height:7px;background:#4ade80;border-radius:50%;}
  .naf-chat-status span{font-size:.72rem;color:rgba(255,255,255,.80);}
  .naf-chat-close{
    background:none;border:none;color:rgba(255,255,255,.75);font-size:1.1rem;
    cursor:pointer;padding:4px;border-radius:50%;transition:background .2s;line-height:1;
    display:flex;align-items:center;justify-content:center;
  }
  .naf-chat-close:hover{background:#00
  8f8d;}

  /* Messages area – plain white */
  .naf-chat-body{
    height:360px;overflow-y:auto;
    padding:14px 12px;display:flex;flex-direction:column;gap:10px;
    background:#ffffff;
    scroll-behavior:smooth;
  }
  .naf-chat-body::-webkit-scrollbar{width:4px;}
  .naf-chat-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.2);border-radius:4px;}

  /* Date chip */
  .naf-date-chip{text-align:center;margin:4px 0;}
  .naf-date-chip span{
    background:rgba(0,0,0,.06);color:#555;
    font-size:.68rem;padding:3px 10px;border-radius:10px;
    font-family:'Poppins',sans-serif;font-weight:500;
  }

  /* Bubbles */
  .naf-bubble{
    max-width:88%;padding:9px 12px 7px;
    border-radius:10px;line-height:1.5;font-size:.82rem;
    position:relative;word-break:break-word;
  }
  .naf-bubble.bot{
    background:#f1f3f5;color:#111;
    border-radius:0 10px 10px 10px;
    align-self:flex-start;
    box-shadow:0 1px 3px rgba(0,0,0,.08);
  }
  .naf-bubble.user{
    background:#dcf8c6;color:#111;
    border-radius:10px 10px 0 10px;
    align-self:flex-end;
    box-shadow:0 1px 3px rgba(0,0,0,.08);
  }
  .naf-bubble-time{
    font-size:.62rem;color:rgba(0,0,0,.42);
    float:right;margin-left:8px;margin-top:2px;line-height:1;
  }
  .naf-bubble.user .naf-bubble-time{color:rgb(0, 160, 152);}

  /* Typing indicator */
  .naf-typing{display:flex;align-items:center;gap:4px;padding:10px 12px;background:#f1f3f5;border-radius:0 10px 10px 10px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,.08);}
  .naf-typing span{width:7px;height:7px;background:#aaa;border-radius:50%;animation:dotBounce .9s ease infinite;}
  .naf-typing span:nth-child(2){animation-delay:.18s;}
  .naf-typing span:nth-child(3){animation-delay:.36s;}
  @keyframes dotBounce{0%,80%,100%{transform:scale(.8);opacity:.5;}40%{transform:scale(1.1);opacity:1;}}

  /* Quick reply chips */
  .naf-chips{display:flex;flex-direction:column;gap:6px;align-self:flex-start;max-width:92%;}
  .naf-chip{
    background:#fff;border:1.5px solid #00ADAA;color:#00856f;
    border-radius:20px;padding:7px 14px;font-size:.80rem;font-weight:600;
    cursor:pointer;text-align:left;
    font-family:'Poppins',sans-serif;transition:background .18s,color .18s;
    display:flex;align-items:center;gap:7px;
  }
  .naf-chip:hover{background:#00ADAA;color:#fff;}
  .naf-chip i{font-size:.85rem;flex-shrink:0;}

  /* Footer input area */
  .naf-chat-footer{
    background:#f8fafc;border-top:1px solid #e2e8f0;
    padding:10px 12px;display:flex;align-items:center;gap:8px;
  }
  .naf-chat-input{
    flex:1;border:none;background:#fff;border-radius:24px;
    padding:9px 14px;font-size:.83rem;outline:none;
    font-family:'Inter',sans-serif;resize:none;
    box-shadow:0 1px 4px rgba(0,0,0,.04);
    color:#333;
  }
  .naf-chat-input::placeholder{color:#aaa;}
  .naf-send-btn{
    width:38px;height:38px;border-radius:50%;border:none;
    background:linear-gradient(135deg,#00ADAA,#008F8D);color:#fff;
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;flex-shrink:0;transition:transform .2s;font-size:.95rem;
  }
  .naf-send-btn:hover{transform:scale(1.1);}

  /* Mobile adjustments */
  @media(max-width:767px){
    #naf-chat-widget{bottom:20px !important;left:14px !important;z-index:99999 !important;}
    #naf-chat-toggle{padding:11px 16px 11px 14px;font-size:.82rem;}
    #naf-chat-panel{width:calc(100vw - 28px);bottom:72px;}
 #naf-chat-toggle span:not(.toggle-icon) {
    display: none;
  }
  }
  @media(max-width:480px){
    #naf-chat-panel{width:calc(100vw - 20px);max-height:75vh;}
    .naf-chat-body{height:280px;}
  }
  @media(max-width:360px){
    #naf-chat-toggle .toggle-label{display:none;}
    #naf-chat-toggle{padding:13px;border-radius:50%;width:48px;height:48px;justify-content:center;}
  }
  `;
  document.head.appendChild(style);

  /* ── HTML ── */
  var widgetHTML = `
  <button id="naf-chat-toggle" aria-label="Open NAF Live Chat" aria-expanded="false">
    <span class="toggle-icon"><i class="bi bi-chat-square-dots-fill"></i></span>
    <span>Chat with Us</span>
    <span class="toggle-pulse"></span>
  </button>

  <div id="naf-chat-panel" role="dialog" aria-label="NAF Support Chat">
    <div class="naf-chat-header">
      <div class="naf-chat-avatar"><div class="logo-mark-wrap"><img src="logo/logo.png" alt="NAF Logo" class="logo-mark" /></div></div>
      <div class="naf-chat-header-info">
        <div class="naf-chat-name">NAF Support</div>
        <div class="naf-chat-status">
          <span class="naf-status-dot"></span>
          <span>Online · Typically replies instantly</span>
        </div>
      </div>
      <button class="naf-chat-close" id="naf-chat-close-btn" aria-label="Close chat">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="naf-chat-body" id="naf-chat-body">
      <div class="naf-date-chip"><span>Today</span></div>
    </div>

    <div class="naf-chat-footer">
      <input type="text" class="naf-chat-input" id="naf-chat-input" placeholder="Type a message…" autocomplete="off"/>
      <button class="naf-send-btn" id="naf-send-btn" aria-label="Send message">
        <i class="bi bi-send-fill"></i>
      </button>
    </div>
  </div>
  `;

  /* ── Inject ── */
  var container = document.createElement("div");
  container.id = "naf-chat-widget";
  container.innerHTML = widgetHTML;
  document.body.appendChild(container);

  /* ── References ── */
  var panel = document.getElementById("naf-chat-panel");
  var toggle = document.getElementById("naf-chat-toggle");
  var closeBtn = document.getElementById("naf-chat-close-btn");
  var body = document.getElementById("naf-chat-body");
  var input = document.getElementById("naf-chat-input");
  var sendBtn = document.getElementById("naf-send-btn");
  var isOpen = false;
  var welcomed = false;

  /* ── Inactivity timer (5 minutes) ── */
  var inactivityTimer = null;
  var INACTIVITY_LIMIT = 300000; // 5 minutes

  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(clearChat, INACTIVITY_LIMIT);
  }

  function clearChat() {
    // Remove all messages, typing indicators, chips
    var elements = body.querySelectorAll(
      ".naf-bubble, .naf-typing, .naf-chips",
    );
    elements.forEach(function (el) {
      el.remove();
    });
    // Reset welcomed flag so next open shows welcome
    welcomed = false;
    // Cancel timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  }

  /* ── Helpers ── */
  function nowTime() {
    var d = new Date();
    var h = d.getHours(),
      m = d.getMinutes();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + (m < 10 ? "0" : "") + m + " " + ampm;
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function addBubble(text, side, delay) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var bubble = document.createElement("div");
        bubble.className = "naf-bubble " + side;
        bubble.innerHTML =
          text + '<span class="naf-bubble-time">' + nowTime() + "</span>";
        body.appendChild(bubble);
        scrollToBottom();
        resolve();
      }, delay || 0);
    });
  }

  function showTyping(ms) {
    return new Promise(function (resolve) {
      var t = document.createElement("div");
      t.className = "naf-typing";
      t.innerHTML = "<span></span><span></span><span></span>";
      t.id = "naf-typing-indicator";
      body.appendChild(t);
      scrollToBottom();
      setTimeout(function () {
        var existing = document.getElementById("naf-typing-indicator");
        if (existing) existing.remove();
        resolve();
      }, ms);
    });
  }

  function removeChips() {
    var chips = body.querySelectorAll(".naf-chips");
    chips.forEach(function (c) {
      c.remove();
    });
  }

  function showChips(chips) {
    removeChips();
    var wrap = document.createElement("div");
    wrap.className = "naf-chips";
    chips.forEach(function (chip) {
      var btn = document.createElement("button");
      btn.className = "naf-chip";
      btn.innerHTML = '<i class="bi ' + chip.icon + '"></i>' + chip.label;
      btn.addEventListener("click", function () {
        resetInactivityTimer(); // user clicked chip → reset timer
        handleChip(chip);
      });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollToBottom();
  }

  /* ── INTENT MAPPING ── */
  var intents = [
    {
      keys: ["service", "what do you do", "offer", "provide", "fm", "facility"],
      action: "services",
    },
    {
      keys: ["price", "pricing", "cost", "rate", "quote", "how much", "charge"],
      action: "pricing",
    },
    {
      keys: [
        "contact",
        "reach",
        "location",
        "address",
        "phone",
        "email",
        "office",
        "where",
      ],
      action: "contact",
    },
    {
      keys: [
        "job",
        "career",
        "hiring",
        "vacancy",
        "work",
        "apply",
        "join",
        "employment",
      ],
      action: "careers",
    },
    {
      keys: [
        "emergency",
        "urgent",
        "breakdown",
        "24/7",
        "24 hour",
        "help desk",
        "immediate",
        "crisis",
      ],
      action: "emergency",
    },
    {
      keys: [
        "security",
        "guard",
        "psara",
        "cctv",
        "surveillance",
        "armed",
        "cit",
        "protect",
      ],
      action: "security",
    },
    {
      keys: [
        "housekeep",
        "cleaning",
        "clean",
        "housekeeper",
        "sanitize",
        "mop",
        "sweep",
      ],
      action: "housekeeping",
    },
    {
      keys: [
        "hard",
        "mep",
        "electrical",
        "hvac",
        "ac",
        "plumbing",
        "fire",
        "mechanical",
        "maintenance",
        "bms",
      ],
      action: "hard",
    },
    {
      keys: [
        "soft",
        "housekeeping",
        "concierge",
        "pest",
        "landscaping",
        "janitorial",
      ],
      action: "soft",
    },
    {
      keys: ["about", "who are you", "company", "history", "certif", "iso"],
      action: "about",
    },
    {
      keys: [
        "industry",
        "industries",
        "sector",
        "hospital",
        "it park",
        "factory",
        "hotel",
        "school",
        "mall",
        "residen",
      ],
      action: "industries",
    },
    {
      keys: ["client", "customer", "who.*serve", "partner"],
      action: "clients",
    },
    {
      keys: ["hr", "human resource", "recruit", "manpower", "staff"],
      action: "hr",
    },
  ];

  /* ── RESPONSES with quick replies ── */
  var responses = {
    about: {
      text: "NAF Facility Management & Security Services is a fully owned subsidiary of Al Najma Al Fareeda International Group – UAE. We provide integrated FM solutions with ISO 9001, ISO 14001 & OHSAS 18001 TUV NORD certifications. 🏆",
      qr: [
        {
          label: "Read More About Us",
          icon: "bi-arrow-right-circle-fill",
          action: "nav:about.html",
        },
        { label: "Main Menu", icon: "bi-house-fill", action: "mainmenu" },
      ],
    },
    industries: {
      text: "We serve IT Parks, Hospitals, Residential Complexes, Factories, Hotels, Schools, and Shopping Malls — providing customised FM solutions for each environment. 🏗️",
      qr: [
        {
          label: "View All Industries",
          icon: "bi-arrow-right-circle-fill",
          action: "nav:industries.html",
        },
        { label: "Main Menu", icon: "bi-house-fill", action: "mainmenu" },
      ],
    },
    clients: {
      text: "Trusted by 100+ leading organisations including Amazon, TVS, Spencer's, Vasan Healthcare, Kidzee, and many more across Tamil Nadu! 🌟",
      qr: [
        {
          label: "See Our Clients",
          icon: "bi-arrow-right-circle-fill",
          action: "nav:clients.html",
        },
        { label: "Main Menu", icon: "bi-house-fill", action: "mainmenu" },
      ],
    },
    careers: {
      text: "🎯 NAF is hiring across multiple roles in Chennai:<br><br>• Security Guard (Male/Female)<br>• Housekeeping Supervisor<br>• MEP / Facility Engineer<br>• HVAC Technician<br>• Concierge Executive<br>• Site Manager<br><br>✅ <b>Day 1 benefits:</b> PF, ESI, Gratuity. Uniform provided.",
      qr: [
        {
          label: "View Jobs",
          icon: "bi-briefcase-fill",
          action: "nav:careers.html",
        },
        {
          label: "Walk-in Hours",
          icon: "bi-clock-fill",
          action: "nav:careers.html#walkin",
        },
        {
          label: "Apply Now",
          icon: "bi-send-fill",
          action: "nav:careers.html#apply",
        },
      ],
    },
    contact: {
      text: "📍 <b>Head Office:</b> No. 49, 1st Main Road, Shenoy Nagar West, Anna Nagar, Gajalakshmi Colony, C Block, Shenoy Nagar, Chennai, Tamil Nadu 600030<br>📞 <b>Office:</b> 044-4351 0001 (Mon–Sat, 8AM–7PM)<br>📱 <b>24/7 Help Desk:</b> +91 73977 72205<br>✉️ nafindia@alfareedagroupintl.com",
      qr: [
        {
          label: "WhatsApp",
          icon: "bi-whatsapp",
          action: "nav:https://wa.me/917397772205",
        },
        {
          label: "Call Now",
          icon: "bi-telephone-fill",
          action: "nav:tel:04443510001",
        },
        {
          label: "Get Quote",
          icon: "bi-file-earmark-text-fill",
          action: "quote",
        },
      ],
    },
    quote: {
      text: "Getting a free quote is easy! Fill out our quick enquiry form and our team will send a customised proposal within 4 business hours. ⚡",
      qr: [
        {
          label: "Get Free Quote Now",
          icon: "bi-file-earmark-text-fill",
          action: "nav:contact.html#contact-form",
        },
        { label: "Main Menu", icon: "bi-house-fill", action: "mainmenu" },
      ],
    },
    hr: {
      text: "To speak with our HR team directly:<br>📞 044-4351 0001<br>📱 +91 73977 72205<br>Or visit our Careers page to apply online.",
      qr: [
        {
          label: "Apply on Careers Page",
          icon: "bi-briefcase-fill",
          action: "nav:careers.html",
        },
        { label: "Main Menu", icon: "bi-house-fill", action: "mainmenu" },
      ],
    },
    services: {
      text: "NAF provides fully integrated Facility Management across three pillars:<br><br>🔧 <b>Hard Services</b> — MEP, HVAC, Electrical, Plumbing, Fire Safety, BMS<br>🧹 <b>Soft Services</b> — Housekeeping, Concierge, Pest Control, Landscaping<br>🛡️ <b>Other Services</b> — Security Guards, CCTV, Access Control, Manpower Supply",
      qr: [
        {
          label: "Hard Services",
          icon: "bi-gear-wide-connected",
          action: "hard",
        },
        { label: "Soft Services", icon: "bi-people-fill", action: "soft" },
        { label: "Security", icon: "bi-shield-shaded", action: "security" },
        {
          label: "Get Quote",
          icon: "bi-file-earmark-text-fill",
          action: "quote",
        },
      ],
    },
    pricing: {
      text: "💰 All NAF services are priced on a customised basis — we tailor proposals to your facility size, scope and specific requirements.<br><br>We offer flexible monthly contracts with no hidden charges and transparent MIS reporting. Contact us for a <b>free site audit</b> and detailed quote.",
      qr: [
        {
          label: "Request Quote",
          icon: "bi-file-earmark-text-fill",
          action: "quote",
        },
        {
          label: "Call Us",
          icon: "bi-telephone-fill",
          action: "nav:tel:04443510001",
        },
        {
          label: "WhatsApp",
          icon: "bi-whatsapp",
          action: "nav:https://wa.me/917397772205",
        },
      ],
    },
    emergency: {
      text: "🚨 <b>NAF 24/7 Emergency Help Desk</b><br><br>📱 <b>+91 73977 72205</b><br><br>Our help desk operates round-the-clock. For facility emergencies, security incidents or urgent service breakdowns — call immediately. Response time: <b>2–4 hours</b> for on-site deployment.",
      qr: [
        {
          label: "Call Now",
          icon: "bi-telephone-fill",
          action: "nav:tel:917397772205",
        },
        {
          label: "WhatsApp",
          icon: "bi-whatsapp",
          action: "nav:https://wa.me/917397772205",
        },
      ],
    },
    security: {
      text: "🛡️ <b>NAF Security Services</b> — PSARA Licensed<br><br>Our six-layer framework: <b>Deter → Detect → Delay → Communicate → Respond → Intelligence</b><br><br>Services include: Uniformed security guards, armed CIT, CCTV surveillance, access control, intrusion alarms, executive protection and manpower supply. All guards are police-verified and PSARA trained.",
      qr: [
        {
          label: "Get Security Quote",
          icon: "bi-file-earmark-text-fill",
          action: "quote",
        },
        {
          label: "Learn More",
          icon: "bi-info-circle-fill",
          action: "nav:security.html",
        },
        { label: "Contact", icon: "bi-telephone-fill", action: "contact" },
      ],
    },
    housekeeping: {
      text: "🧹 <b>NAF Housekeeping Services</b><br><br>Professional daily and deep-cleaning for offices, hospitals, malls, factories and residences. Trained in colour-coded protocols, MSDS compliance and infection prevention.<br><br>94% client retention rate in housekeeping.",
      qr: [
        {
          label: "Get Quote",
          icon: "bi-file-earmark-text-fill",
          action: "quote",
        },
        { label: "Soft Services", icon: "bi-people-fill", action: "soft" },
        { label: "Contact", icon: "bi-telephone-fill", action: "contact" },
      ],
    },
    hard: {
      text: "🔧 <b>NAF Hard Services</b> — MEP Engineering<br><br>Comprehensive planned preventive maintenance across:<br>• Electrical: LT/HT panels, DG sets, UPS<br>• HVAC: Split AC, VRF, AHU, chiller plants<br>• Plumbing & STP/ETP<br>• Fire safety systems (NBC compliant)<br>• BMS & building automation<br><br>ISO 9001 & OHSAS 18001 certified.",
      qr: [
        {
          label: "Get Quote",
          icon: "bi-file-earmark-text-fill",
          action: "quote",
        },
        {
          label: "Hard Services Page",
          icon: "bi-gear-wide-connected",
          action: "nav:hard-services.html",
        },
        { label: "Contact", icon: "bi-telephone-fill", action: "contact" },
      ],
    },
    soft: {
      text: "🧼 <b>NAF Soft Services</b><br><br>Professional housekeeping, concierge, pest control, landscaping, and janitorial services tailored to your facility’s needs. Our trained staff follow strict hygiene protocols and use eco-friendly chemicals.",
      qr: [
        {
          label: "Get Quote",
          icon: "bi-file-earmark-text-fill",
          action: "quote",
        },
        {
          label: "Housekeeping",
          icon: "bi-brush-fill",
          action: "housekeeping",
        },
        { label: "Contact", icon: "bi-telephone-fill", action: "contact" },
      ],
    },
  };

  function showResponse(action) {
    var resp = responses[action];
    if (!resp) return;
    showTyping(700).then(function () {
      addBubble(resp.text, "bot");
      setTimeout(function () {
        showChips(resp.qr);
      }, 300);
    });
  }

  /* ── MAIN MENU chips ── */
  var MAIN_MENU = [
    {
      label: "Our Services",
      icon: "bi-grid-3x3-gap-fill",
      action: "services",
    },
    { label: "About NAF", icon: "bi-building-fill", action: "about" },
    {
      label: "Industries We Serve",
      icon: "bi-briefcase-fill",
      action: "industries",
    },
    { label: "Our Clients", icon: "bi-award-fill", action: "clients" },
    {
      label: "Careers / Jobs",
      icon: "bi-person-badge-fill",
      action: "careers",
    },
    { label: "Contact Us", icon: "bi-telephone-fill", action: "contact" },
    {
      label: "Get Free Quote",
      icon: "bi-file-earmark-text-fill",
      action: "quote",
    },
    { label: "Speak to HR", icon: "bi-headset", action: "hr" },
  ];

  var SERVICES_MENU = [
    {
      label: "Hard Services",
      icon: "bi-gear-wide-connected",
      action: "hard",
    },
    { label: "Soft Services", icon: "bi-people-fill", action: "soft" },
    {
      label: "Other Services",
      icon: "bi-stars",
      action: "nav:other-services.html",
    },
    { label: "↩  Main Menu", icon: "bi-house-fill", action: "mainmenu" },
  ];

  /* ── Chip handler ── */
  function handleChip(chip) {
    removeChips();
    addBubble(chip.label, "user");

    var a = chip.action;

    if (a === "mainmenu") {
      showTyping(700).then(function () {
        addBubble("Sure! Here's the main menu 👇", "bot");
        showChips(MAIN_MENU);
      });
      return;
    }

    if (a === "services") {
      showTyping(800).then(function () {
        addBubble(
          "We offer three categories of services. Which would you like to explore?",
          "bot",
        );
        showChips(SERVICES_MENU);
      });
      return;
    }

    if (a.indexOf("nav:") === 0) {
      var dest = a.replace("nav:", "");
      showTyping(600).then(function () {
        addBubble("Taking you there now… 🚀", "bot");
        setTimeout(function () {
          window.location.href = dest;
        }, 800);
      });
      return;
    }

    if (responses[a]) {
      showResponse(a);
    } else {
      showTyping(600).then(function () {
        addBubble(
          "I'm not sure how to handle that, but here's the main menu:",
          "bot",
        );
        showChips(MAIN_MENU);
      });
    }
  }

  /* ── Handle typed input ── */
  function handleInput() {
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    removeChips();
    addBubble(text, "user");

    var lower = text.toLowerCase();

    // Check for exact chip match
    var matchedChip = MAIN_MENU.concat(SERVICES_MENU).find(
      (chip) => chip.label.toLowerCase() === lower,
    );
    if (matchedChip) {
      resetInactivityTimer();
      handleChip(matchedChip);
      return;
    }

    // Check intents
    for (var i = 0; i < intents.length; i++) {
      var intent = intents[i];
      for (var j = 0; j < intent.keys.length; j++) {
        if (lower.includes(intent.keys[j])) {
          resetInactivityTimer();
          showResponse(intent.action);
          return;
        }
      }
    }

    // Greetings
    if (/^(hi|hello|hey|greetings|morning|afternoon|evening)$/i.test(lower)) {
      resetInactivityTimer();
      showTyping(600).then(function () {
        addBubble(
          "Hello! 😊 Great to hear from you. Here's how I can help you today:",
          "bot",
        );
        showChips(MAIN_MENU);
      });
      return;
    }

    // Thanks / bye
    if (/thank|thanks|ok|bye|goodbye/i.test(lower)) {
      resetInactivityTimer();
      showTyping(600).then(function () {
        addBubble(
          "You're welcome! 🙏 Feel free to reach out anytime. Is there anything else I can help with?",
          "bot",
        );
        showChips([
          {
            label: "Back to Main Menu",
            icon: "bi-house-fill",
            action: "mainmenu",
          },
          {
            label: "Call: 044-4351 0001",
            icon: "bi-telephone-fill",
            action: "nav:tel:04443510001",
          },
        ]);
      });
      return;
    }

    // Fallback
    resetInactivityTimer();
    showTyping(800).then(function () {
      addBubble(
        "I'm not sure about that, but I can connect you to the right person! Here's what I can help with:",
        "bot",
      );
      showChips(MAIN_MENU);
    });
  }

  /* ── Welcome flow ── */
  async function showWelcome() {
    if (welcomed) {
      scrollToBottom();
      return;
    }
    welcomed = true;
    await showTyping(900);
    await addBubble(
      "👋 Hello! Welcome to <strong>NAF Facility Management & Security Services</strong>.",
      "bot",
    );
    await showTyping(700);
    await addBubble(
      "I'm your virtual assistant. How can I help you today?",
      "bot",
    );
    showChips(MAIN_MENU);
  }

  /* ── Open / Close ── */
  function openChat() {
    isOpen = true;
    panel.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    showWelcome();
    resetInactivityTimer(); // start/reset timer when chat opens
    setTimeout(function () {
      input.focus();
    }, 350);
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    // Optionally clear timer on close? We'll keep it – clearing while closed is fine.
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (isOpen) closeChat();
    else openChat();
  });

  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    closeChat();
  });

  panel.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function () {
    if (isOpen) closeChat();
  });

  sendBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    resetInactivityTimer(); // user clicked send
    handleInput();
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      resetInactivityTimer(); // user pressed Enter to send
      handleInput();
    }
  });

  // Reset timer on any input (typing)
  input.addEventListener("input", function () {
    resetInactivityTimer();
  });

  /* ESC closes */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closeChat();
  });

  /* ── Show widget after page loads ── */
  window.addEventListener("load", function () {
    container.style.opacity = "0";
    container.style.transform = "translateY(10px)";
    container.style.transition = "opacity .4s ease, transform .4s ease";
    setTimeout(function () {
      container.style.opacity = "1";
      container.style.transform = "translateY(0)";
    }, 800);
  });
})();
