/* ═══════════════════════════════════════════════════════════
   NAF — Quote Form  (js/quoteForm.js)
   Form logic mirrors the proven old script exactly:
     • Proper validate() with min-length, digit, format checks
     • setFieldError / clearFieldError (is-invalid + error div)
     • refreshButtonState() watches only REQUIRED fields
     • resetForm() clears ALL field errors — called on success only
     • onError() keeps form values intact
     • Live watchers on ALL fields (clears errors on every change)
     • 3-second no-cors fallback
   Plus new features:
     • Live manpower cost calculator (Role / Hours / Headcount)
     • Silent ref number generated on submit
     • PDF proposal generated client-side via jsPDF
     • Success modal with PDF download
═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* ── Apps Script URL ── */
    var SHEET_URL =
      "https://script.google.com/macros/s/AKfycbzlI6xN4kLIT1sA0hmN3gu2v0rohFcdLJkk-nbrUOF_ikXY-GmdgJWpkIZjraLmk4x_/exec";

    /* ── Salary data — Zone A grand total per person/month ── */
    var SD = {
      Housekeeping: { "8 HRS": 20287, "12 HRS": 29987 },
      "Security Officer": { "8 HRS": 35818, "12 HRS": 53927 },
      "Asst. Security Officer": { "8 HRS": 33604, "12 HRS": 50505 },
      "Security Supervisor": { "8 HRS": 31942, "12 HRS": 47935 },
      "Chief Watchman / Elite": { "8 HRS": 31390, "12 HRS": 47082 },
      "Security Guard": { "8 HRS": 28069, "12 HRS": 41947 },
    };

    /* ── Service → ref code map ── */
    var SVC_CODE = {
      "Hard Services \u2013 Electrical": "FM",
      "Hard Services \u2013 HVAC / AC": "FM",
      "Hard Services \u2013 Mechanical": "FM",
      "Hard Services \u2013 Technical Maintenance": "FM",
      "Soft Services \u2013 Security Guards": "SS",
      "Soft Services \u2013 Housekeeping": "FM",
      "Soft Services \u2013 Concierge": "FM",
      "Other \u2013 Manpower Supply": "FM",
      "Other \u2013 CCTV Monitoring": "SS",
      "Other \u2013 Access Control": "SS",
      "Other \u2013 Visitor Management": "FM",
      "Complete Facility Package": "FM",
    };

    /* ── Field lists ── */
    var REQUIRED = [
      "qf_name",
      "qf_phone",
      "qf_role",
      "qf_hours",
      "qf_headcount",
      "qf_company",
    ];
    var ALL_FIELDS = [
      "qf_name",
      "qf_company",
      "qf_phone",
      "qf_email",
      "qf_service",
      "qf_property",
      "qf_city",
      "qf_area",
      "qf_role",
      "qf_hours",
      "qf_headcount",
      "qf_message",
    ];

    /* ── DOM refs ── */
    var form = document.getElementById("quoteForm");
    var btn = document.getElementById("qf_btn");
    var btnText = document.getElementById("qf_btn_text");
    var btnIcon = document.getElementById("qf_btn_icon");
    var spinner = document.getElementById("qf_btn_spinner");
    if (!form) return;

    /* ── Calc state ── */
    var calcData = null; /* { role, hrs, hc, perPerson, monthly, annual } */

    /* ── Helpers ── */
    function $id(id) {
      return document.getElementById(id);
    }
    function gval(id) {
      var el = $id(id);
      return el ? el.value : "";
    }
    function inr(n) {
      if (!n || n <= 0) return "--";
      /* Exact value — no rounding. Indian grouping: last 3, then groups of 2. */
      var s = String(Math.trunc(n));
      if (s.length <= 3) return "Rs." + s;
      var last3 = s.slice(-3);
      var rest = s.slice(0, -3);
      var parts = [];
      while (rest.length > 0) {
        parts.unshift(rest.slice(-2));
        rest = rest.slice(0, -2);
      }
      return "Rs." + parts.join(",") + "," + last3;
    }

    /* ══════════════════════════════════════
       BUTTON STATE  (same as old script)
    ══════════════════════════════════════ */
    function setLoading(on) {
      btn.disabled = on;
      btn.style.opacity = on ? "0.8" : "1";
      btn.style.cursor = on ? "not-allowed" : "pointer";
      if (btnText)
        btnText.innerHTML = on
          ? "Submitting&hellip;"
          : "Submit &amp; Request Free Site Survey";
      if (btnIcon) btnIcon.style.display = on ? "none" : "inline";
      if (spinner) spinner.style.display = on ? "inline-block" : "none";
    }

    function refreshButtonState() {
      var allFilled = REQUIRED.every(function (id) {
        return ($id(id) || { value: "" }).value.trim() !== "";
      });
      btn.disabled = !allFilled;
      btn.style.opacity = allFilled ? "1" : "0.5";
      btn.style.cursor = allFilled ? "pointer" : "not-allowed";
    }

    /* ══════════════════════════════════════
       TOAST  (same as old script)
    ══════════════════════════════════════ */
    function showToast(msg, type) {
      var toast = $id("toastMsg");
      if (!toast) return;
      toast.innerHTML =
        type === "error"
          ? '<i class="bi bi-exclamation-circle-fill me-2"></i>' + msg
          : '<i class="bi bi-check-circle-fill me-2"></i>' + msg;
      toast.style.background =
        type === "error"
          ? "linear-gradient(135deg,#e74c3c,#c0392b)"
          : "linear-gradient(135deg,#00ADAA,#007a78)";
      toast.classList.add("show");
      setTimeout(function () {
        toast.classList.remove("show");
      }, 4000);
    }

    /* ══════════════════════════════════════
       FIELD ERROR HELPERS  (same as old script)
    ══════════════════════════════════════ */
    function setFieldError(el, msg) {
      el.classList.add("is-invalid");
      /* support both .naf-field-error divs (contact page) */
      var errDiv = el.parentElement
        ? el.parentElement.querySelector(".naf-field-error")
        : null;
      if (errDiv) {
        errDiv.textContent = msg;
        errDiv.style.display = "block";
      }
    }

    function clearFieldError(el) {
      if (!el) return;
      el.classList.remove("is-invalid");
      el.classList.remove("error");
      var errDiv = el.parentElement
        ? el.parentElement.querySelector(".naf-field-error")
        : null;
      if (errDiv) errDiv.style.display = "none";
    }

    /* ══════════════════════════════════════
       VALIDATE  (same rules as old script)
    ══════════════════════════════════════ */
    function validate() {
      var valid = true;
      var firstInvalid = null;

      /* Name — required, min 3 chars, letters only */
      var nameEl = $id("qf_name");
      var nameVal = nameEl ? nameEl.value.trim() : "";
      if (!nameVal) {
        setFieldError(nameEl, "Full name is required.");
        if (!firstInvalid) firstInvalid = nameEl;
        valid = false;
      } else if (nameVal.length < 3) {
        setFieldError(nameEl, "Name must be at least 3 characters.");
        if (!firstInvalid) firstInvalid = nameEl;
        valid = false;
      } else if (!/^[a-zA-Z\s.'"-]+$/.test(nameVal)) {
        setFieldError(nameEl, "Name should contain letters only.");
        if (!firstInvalid) firstInvalid = nameEl;
        valid = false;
      } else {
        clearFieldError(nameEl);
      }

      /* Phone — required, 10–12 digits */
      var phoneEl = $id("qf_phone");
      var phoneRaw = phoneEl ? phoneEl.value.trim() : "";
      var digits = phoneRaw.replace(/\D/g, "");
      if (!phoneRaw) {
        setFieldError(phoneEl, "Phone number is required.");
        if (!firstInvalid) firstInvalid = phoneEl;
        valid = false;
      } else if (digits.length < 10) {
        setFieldError(phoneEl, "Enter a valid 10-digit phone number.");
        if (!firstInvalid) firstInvalid = phoneEl;
        valid = false;
      } else if (digits.length > 12) {
        setFieldError(phoneEl, "Phone number seems too long.");
        if (!firstInvalid) firstInvalid = phoneEl;
        valid = false;
      } else {
        clearFieldError(phoneEl);
      }

      /* Email — optional, validate format if filled */
      var emailEl = $id("qf_email");
      var emailVal = emailEl ? emailEl.value.trim() : "";
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setFieldError(emailEl, "Enter a valid email (e.g. you@company.com).");
        if (!firstInvalid) firstInvalid = emailEl;
        valid = false;
      } else {
        clearFieldError(emailEl);
      }

      if (!valid) {
        showToast(
          "Please fix the highlighted fields before submitting.",
          "error",
        );
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return valid;
    }

    /* ══════════════════════════════════════
       RESET — called on SUCCESS only
       (clears all field errors, same as old)
    ══════════════════════════════════════ */
    function resetForm() {
      form.reset();
      ALL_FIELDS.forEach(function (id) {
        clearFieldError($id(id));
      });
      /* also clear calc panel */
      var panel = $id("qfCalcResult");
      if (panel) panel.style.display = "none";
      calcData = null;
      refreshButtonState();
    }

    /* ══════════════════════════════════════
       LIVE SALARY CALCULATOR
    ══════════════════════════════════════ */
    function runCalc() {
      var role = gval("qf_role");
      var hrs = gval("qf_hours");
      var hc = parseInt(gval("qf_headcount") || "0", 10);
      var panel = $id("qfCalcResult");

      if (!role || !hrs || !hc || hc < 1) {
        if (panel) panel.style.display = "none";
        calcData = null;
        refreshButtonState();
        return;
      }

      var grandPerPerson = SD[role] && SD[role][hrs];
      if (!grandPerPerson) {
        if (panel) panel.style.display = "none";
        return;
      }

      var monthly = grandPerPerson * hc;
      var annual = monthly * 12;
      calcData = {
        role: role,
        hrs: hrs,
        hc: hc,
        perPerson: grandPerPerson,
        monthly: monthly,
        annual: annual,
      };

      var rl = $id("calcRoleLabel");
      if (rl) rl.textContent = role;
      var sb = $id("calcShiftBadge");
      if (sb) sb.textContent = hrs;
      var hd = $id("calcHeadcountDisplay");
      if (hd) hd.textContent = hc + " person" + (hc > 1 ? "s" : "");
      var md = $id("calcMonthlyDisplay");
      if (md) md.textContent = inr(monthly) + " / month";

      if (panel) panel.style.display = "";
      refreshButtonState();
    }

    /* ══════════════════════════════════════
       REF NUMBER — silent, on submit only
    ══════════════════════════════════════ */
    function buildRef() {
      var svcEl = $id("qf_service");
      var svcTxt = svcEl
        ? (svcEl.options[svcEl.selectedIndex] || {}).text || ""
        : "";
      var code = SVC_CODE[svcTxt] || "FM";
      var now = new Date();
      var seq = String(100 + Math.floor(Math.random() * 900));
      var dd = String(now.getDate()).padStart(2, "0");
      var mm = String(now.getMonth() + 1).padStart(2, "0");
      return (
        "NAF/" + seq + "-" + dd + mm + "/" + code + "/" + now.getFullYear()
      );
    }

    /* ══════════════════════════════════════
       PDF GENERATION
       Format follows Q_NO_110 document exactly.
       Logo loaded from logo/logopdf.png at runtime.
    ══════════════════════════════════════ */
    function buildPDF(fv, logoDataUrl) {
      var jsPDF = window.jspdf && window.jspdf.jsPDF;
      if (!jsPDF) {
        console.warn("jsPDF not loaded");
        return null;
      }

      var doc = new jsPDF({ unit: "mm", format: "a4" });
      var PW = doc.internal.pageSize.getWidth(); /* 210mm */
      var PH = doc.internal.pageSize.getHeight(); /* 297mm */
      var ML = 20;
      var MR = 20;
      var TW = PW - ML - MR; /* 170mm */
      var y = 12;

      /* ── Brand colours ── */
      var TEAL = [0, 173, 170]; /* #00ADAA */
      var NAVY = [15, 23, 42]; /* #0F172A */
      var BLACK = [0, 0, 0];
      var DGREY = [60, 60, 60];
      var LGREY = [100, 100, 100];

      /* ── Helpers ── */
      function wrapText(text, x, yPos, maxW, lineH) {
        var lines = doc.splitTextToSize(text, maxW);
        doc.text(lines, x, yPos);
        return yPos + lines.length * lineH;
      }
      function tealRule(yPos) {
        doc.setDrawColor(TEAL[0], TEAL[1], TEAL[2]);
        doc.setLineWidth(0.5);
        doc.line(ML, yPos, PW - MR, yPos);
      }
      function greyRule(yPos) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(ML, yPos, PW - MR, yPos);
      }
      function newPageIfNeeded(needed) {
        if (y + needed > PH - 22) {
          doc.addPage();
          y = 18;
        }
      }

      /* ════════════════════════════════
         SECTION 1 — LOGO
         Loaded from logo/logopdf.png
         Ratio 1328×197 → rendered 150mm wide
      ════════════════════════════════ */
      if (logoDataUrl) {
        var logoW = 150;
        var logoH = Math.round((logoW * 197) / 1328); /* ~22mm */
        var logoX = (PW - logoW) / 2;
        doc.addImage(logoDataUrl, "PNG", logoX, y, logoW, logoH);
        y += logoH + 2;
      } else {
        /* Fallback: text header */
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(TEAL[0], TEAL[1], TEAL[2]);
        doc.text(
          "NAF FACILITY MANAGEMENT & SECURITY SERVICES PVT. LTD.",
          PW / 2,
          y + 7,
          { align: "center" },
        );
        y += 14;
      }
      tealRule(y);
      y += 6;

      /* ════════════════════════════════
         SECTION 2 — REF + DATE
         Bold, same line left/right
         Ref: NAF/BD-110/SG/JANUARY/2026        10th January 2026.
      ════════════════════════════════ */
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(BLACK[0], BLACK[1], BLACK[2]);
      doc.text("Ref: " + fv.refNum, ML, y);
      var now = new Date();
      var day = now.getDate();
      var suffix =
        day === 1 || day === 21 || day === 31
          ? "st"
          : day === 2 || day === 22
            ? "nd"
            : day === 3 || day === 23
              ? "rd"
              : "th";
      var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      var dateStr =
        day +
        suffix +
        " " +
        months[now.getMonth()].toUpperCase() +
        " " +
        now.getFullYear() +
        ".";
      doc.text(dateStr, PW - MR, y, { align: "right" });
      y += 9;

      /* ════════════════════════════════
         SECTION 3 — TO BLOCK
         To:
         Company Name,
         Address line(s),
         (blank line)
         Kind Attn: Name – Phone.
      ════════════════════════════════ */
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(BLACK[0], BLACK[1], BLACK[2]);
      doc.text("To:", ML, y);
      y += 6;

      /* Company name — bold */
      if (fv.company) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(BLACK[0], BLACK[1], BLACK[2]);
        doc.text(fv.company + ",", ML, y);
        y += 6;
      }

      /* Street / area address — normal */
      if (fv.address) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(DGREY[0], DGREY[1], DGREY[2]);
        doc.text(fv.address + ",", ML, y);
        y += 6;
      }

      /* City — normal, ends with full stop */
      if (fv.city) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(DGREY[0], DGREY[1], DGREY[2]);
        doc.text(fv.city + ".", ML, y);
        y += 6;
      }

      y += 3; /* blank-line gap before Kind Attn */

      /* Kind Attn — bold */
      var kindAttn = "Kind Attn: " + fv.name + " \u2013 " + (fv.phone || "");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(BLACK[0], BLACK[1], BLACK[2]);
      doc.text(kindAttn, ML, y);
      y += 8;

      /* ════════════════════════════════
         SECTION 4 — WARM GREETING
      ════════════════════════════════ */
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(DGREY[0], DGREY[1], DGREY[2]);
      doc.text(
        "Warm Greetings from NAF FM & SECURITY PRIVATE LIMITED.,",
        ML,
        y,
      );
      y += 8;

      /* ════════════════════════════════
         SECTION 5 — INTRO PARAGRAPH
         References service + property + city
      ════════════════════════════════ */
      var introPara =
        "This has reference towards the requirement for providing " +
        (fv.service || "Security Services") +
        " for your " +
        (fv.property ? fv.property.toLowerCase() + " premises" : "premises") +
        (fv.city ? " located at " + fv.city : "") +
        ". Further to your request, we are pleased to submit our quotation" +
        " for the proposed manpower deployment, along with applicable terms" +
        " and conditions, for your kind perusal and consideration.";
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(DGREY[0], DGREY[1], DGREY[2]);
      y = wrapText(introPara, ML, y, TW, 5.5);
      y += 8;

      /* ════════════════════════════════
         SECTION 6 — COST TABLE
         S.No | Manpower Proposed | No. of Persons
         Rate per unit | Total Rate | Shift Duration
         NAF teal #00ADAA header, navy grand-total row
      ════════════════════════════════ */
      if (fv.calc) {
        var c = fv.calc;
        newPageIfNeeded(60);

        /* Build table rows */
        var tableBody = [];
        tableBody.push([
          "1",
          c.role + (fv.property ? " \u2013 " + fv.property : ""),
          String(c.hc),
          inr(c.perPerson),
          inr(c.monthly),
          c.hrs + " / 24*7",
        ]);
        /* Grand Total row spans cols 1-3, amount in col 4 */
        tableBody.push([
          { content: "", styles: { fillColor: [245, 245, 245] } },
          {
            content: "Grand Total (Per Month)",
            colSpan: 3,
            styles: {
              fontStyle: "bold",
              halign: "right",
              fillColor: [245, 245, 245],
              textColor: NAVY,
            },
          },
          {
            content: inr(c.monthly) + "/-",
            styles: {
              fontStyle: "bold",
              halign: "center",
              fillColor: [245, 245, 245],
              textColor: NAVY,
            },
          },
          { content: "", styles: { fillColor: [245, 245, 245] } },
        ]);

        doc.autoTable({
          startY: y,
          head: [
            [
              "S. No",
              "Manpower Proposed",
              "No. of Persons",
              "Rate per unit",
              "Total Rate",
              "Shift Duration",
            ],
          ],
          body: tableBody,
          headStyles: {
            fillColor: TEAL,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            valign: "middle",
            lineColor: [255, 255, 255],
            lineWidth: 0.4,
          },
          bodyStyles: {
            fontSize: 9.5,
            textColor: DGREY,
            halign: "center",
            valign: "middle",
            lineColor: [200, 200, 200],
            lineWidth: 0.3,
          },
          columnStyles: {
            0: { cellWidth: 12, halign: "center" },
            1: { cellWidth: 54, halign: "left" },
            2: { cellWidth: 22, halign: "center" },
            3: { cellWidth: 24, halign: "center" },
            4: { cellWidth: 30, halign: "center" },
            5: { cellWidth: 30, halign: "center" },
          },
          alternateRowStyles: { fillColor: [248, 253, 253] },
          margin: { left: ML, right: MR },
          styles: { cellPadding: 4, font: "helvetica" },
          theme: "grid",
        });

        y = doc.lastAutoTable.finalY + 10;
      }

      /* ════════════════════════════════
         SECTION 7 — NOTE
         NOTE: label in teal, bullet list
      ════════════════════════════════ */
      newPageIfNeeded(70);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(TEAL[0], TEAL[1], TEAL[2]);
      doc.text("NOTE:", ML, y);
      y += 7;

      var notes = [
        "The above rates are inclusive of Uniform, Consultancy charges and exclusive of Cleaning Materials.",
        "For GST Billing, 18% will be charged extra.",
        "Beyond working hours if any, OT will be charged on pro data basis.",
        "The bills will be submitted on 1st of every month for which the payment to be made on or before 7th of every month.",
        "Payment should be made by the way of NEFT to M/s. NAF FM & Security Pvt. Ltd. within 7 days of receipt of our invoice.",
        "On confirmation of Work Order the manpower will be deployed complete within 7 to 10 working days.",
        "The above Proposal is valid for 7 days only on the above date.",
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(DGREY[0], DGREY[1], DGREY[2]);
      notes.forEach(function (note) {
        var lines = doc.splitTextToSize("\u2022  " + note, TW - 6);
        newPageIfNeeded(lines.length * 5.5 + 3);
        doc.text(lines, ML + 2, y);
        y += lines.length * 5.5 + 2;
      });
      y += 8;

      /* ════════════════════════════════
         SECTION 8 — SIGNATURE
         Thanks & Regards,
         [blank line]
         Sathya Gopi R
         General Manager - India
         T / M / E / W
      ════════════════════════════════ */
      newPageIfNeeded(45);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(BLACK[0], BLACK[1], BLACK[2]);
      doc.text("Thanks & Regards,", ML, y);
      y += 9;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(BLACK[0], BLACK[1], BLACK[2]);
      doc.text("Sathya Gopi R", ML, y);
      y += 5.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(LGREY[0], LGREY[1], LGREY[2]);
      [
        "General Manager - India",
        "T: 44-42109251. EXT:303",
        "M: 7397772202",
        "E: gmindia@alfareedagroupintl.com",
        "W: www.alfareedagroupintl.com",
      ].forEach(function (line) {
        doc.text(line, ML, y);
        y += 5.5;
      });

      /* ════════════════════════════════
         SECTION 9 — TEAL FOOTER BAR
      ════════════════════════════════ */
      doc.setFillColor(TEAL[0], TEAL[1], TEAL[2]);
      doc.rect(0, PH - 11, PW, 11, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(
        "NAF Facility Management & Security Services Pvt. Ltd.  \u2022  nafindia@alfareedagroupintl.com  \u2022  044-4351 0001  \u2022  www.alfareedagroupintl.com",
        PW / 2,
        PH - 4.5,
        { align: "center" },
      );

      return doc;
    }

    /* ── Wrapper: fetch logo then build PDF ── */
    function generatePDFWithLogo(fv, callback) {
      fetch("logo/logopdf.png")
        .then(function (res) {
          return res.blob();
        })
        .then(function (blob) {
          var reader = new FileReader();
          reader.onloadend = function () {
            callback(buildPDF(fv, reader.result));
          };
          reader.onerror = function () {
            callback(buildPDF(fv, null)); /* logo failed — use text fallback */
          };
          reader.readAsDataURL(blob);
        })
        .catch(function () {
          callback(buildPDF(fv, null));
        });
    }

    /* ══════════════════════════════════════
       PDF MODAL
    ══════════════════════════════════════ */
    function injectModal() {
      if ($id("pdfModal")) return;
      var div = document.createElement("div");
      div.innerHTML =
        '<div class="qf-pdf-modal-backdrop" id="pdfModal">' +
        '<div class="qf-pdf-modal">' +
        '<div class="qf-pdf-modal-icon"><i class="bi bi-file-earmark-check-fill"></i></div>' +
        "<h3>Submitted Successfully!</h3>" +
        "<p>Your enquiry has been received. Your reference number is:</p>" +
        '<div class="qf-pdf-ref" id="modalRefNum">\u2014</div>' +
        "<p>Your proposal PDF has been generated. Download it below.</p>" +
        '<a id="pdfDownloadBtn" href="#" class="btn-pdf-download">' +
        '<i class="bi bi-download"></i> Download Proposal PDF</a>' +
        '<button class="btn-pdf-close" id="pdfModalClose">Close &amp; Return</button>' +
        "</div>" +
        "</div>";
      document.body.appendChild(div.firstChild);
      var closeBtn = $id("pdfModalClose");
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      var backdrop = $id("pdfModal");
      if (backdrop)
        backdrop.addEventListener("click", function (ev) {
          if (ev.target === backdrop) closeModal();
        });
    }

    function openModal(refNum, pdfUrl) {
      var modal = $id("pdfModal");
      var refEl = $id("modalRefNum");
      var dlBtn = $id("pdfDownloadBtn");
      if (refEl) refEl.textContent = refNum;
      if (dlBtn && pdfUrl) {
        dlBtn.href = pdfUrl;
        dlBtn.download = "NAF_Proposal_" + refNum.replace(/\//g, "-") + ".pdf";
        dlBtn.style.display = "inline-flex";
      } else if (dlBtn) {
        dlBtn.style.display = "none";
      }
      if (modal) modal.classList.add("open");
    }

    function closeModal() {
      var modal = $id("pdfModal");
      if (modal) modal.classList.remove("open");
    }

    function loadPdfScripts(cb) {
      if (window.jspdf && window.jspdf.jsPDF) {
        cb();
        return;
      }
      var s1 = document.createElement("script");
      s1.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s1.onload = function () {
        var s2 = document.createElement("script");
        s2.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
        s2.onload = cb;
        document.head.appendChild(s2);
      };
      document.head.appendChild(s1);
    }

    /* ══════════════════════════════════════
       BOOT
    ══════════════════════════════════════ */
    injectModal();
    loadPdfScripts(function () {});

    /* Live calc triggers */
    ["qf_role", "qf_hours", "qf_headcount"].forEach(function (id) {
      var el = $id(id);
      if (!el) return;
      el.addEventListener("change", runCalc);
      if (el.tagName === "INPUT") el.addEventListener("input", runCalc);
    });

    /* ── SUBMIT ── */
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      /* 1. Validate — if fails, keep values, show errors */
      if (!validate()) return;

      /* 2. Generate ref number silently */
      var refNum = buildRef();

      /* 3. Collect all values */
      var svcEl = $id("qf_service");
      var svcTxt = svcEl
        ? (svcEl.options[svcEl.selectedIndex] || {}).text || ""
        : "";

      var fv = {
        refNum: refNum,
        name: ($id("qf_name") || { value: "" }).value.trim(),
        company: ($id("qf_company") || { value: "" }).value.trim(),
        address: ($id("qf_address") || { value: "" }).value.trim(),
        phone: ($id("qf_phone") || { value: "" }).value.trim(),
        email: ($id("qf_email") || { value: "" }).value.trim(),
        service: svcTxt !== "Select a Service" ? svcTxt : "",
        property: ($id("qf_property") || { value: "" }).value.trim(),
        city: ($id("qf_city") || { value: "" }).value.trim(),
        area: ($id("qf_area") || { value: "" }).value.trim(),
        message: ($id("qf_message") || { value: "" }).value.trim(),
        calc: calcData,
      };

      /* 4. Build sheet payload — all fields including new calc fields */
      var payload = {
        formType: "quote" /* routes to handleQuoteForm → Quotes tab */,
        refNum: refNum,
        name: fv.name,
        company: fv.company,
        phone: fv.phone,
        email: fv.email,
        service: fv.service,
        property: fv.property,
        city: fv.city,
        area: fv.area,
        role: calcData ? calcData.role : "",
        hours: calcData ? calcData.hrs : "",
        headcount: calcData ? String(calcData.hc) : "",
        totalCost: calcData ? inr(calcData.monthly) : "",
        message: fv.message,
      };

      /* 5. Send */
      setLoading(true);
      var sent = false;

      fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload),
      })
        .then(function () {
          if (!sent) {
            sent = true;
            setLoading(false);
            resetForm(); /* reset ONLY on success */
            showToast(
              "Request submitted! We\u2019ll contact you within 24 hours.",
              "success",
            );
            loadPdfScripts(function () {
              generatePDFWithLogo(fv, function (pdfDoc) {
                var pdfUrl = pdfDoc
                  ? URL.createObjectURL(pdfDoc.output("blob"))
                  : null;
                openModal(refNum, pdfUrl);
              });
            });
          }
        })
        .catch(function () {
          if (!sent) {
            sent = true;
            setLoading(false);
            /* do NOT resetForm() — keep entered values on error */
            showToast(
              "Something went wrong. Please call 044-4351 0001.",
              "error",
            );
          }
        });

      /* 3-second no-cors fallback */
      setTimeout(function () {
        if (!sent) {
          sent = true;
          setLoading(false);
          resetForm();
          showToast(
            "Request submitted! We\u2019ll contact you within 24 hours.",
            "success",
          );
          loadPdfScripts(function () {
            generatePDFWithLogo(fv, function (pdfDoc) {
              var pdfUrl = pdfDoc
                ? URL.createObjectURL(pdfDoc.output("blob"))
                : null;
              openModal(refNum, pdfUrl);
            });
          });
        }
      }, 3000);
    });

    /* ── Live watchers — clear errors on every field change (same as old) ── */
    ALL_FIELDS.forEach(function (id) {
      var el = $id(id);
      if (!el) return;
      var evt = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(evt, function () {
        clearFieldError(this);
        refreshButtonState();
      });
    });

    refreshButtonState();
  }); /* end DOMContentLoaded */
})();
