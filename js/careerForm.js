(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var SHEET_URL =
      "https://script.google.com/macros/s/AKfycbzlI6xN4kLIT1sA0hmN3gu2v0rohFcdLJkk-nbrUOF_ikXY-GmdgJWpkIZjraLmk4x_/exec";

    var form = document.getElementById("careerForm");
    var btn = document.getElementById("ca_btn");
    var btnText = document.getElementById("ca_btn_text");
    var btnIcon = document.getElementById("ca_btn_icon");
    var spinner = document.getElementById("ca_btn_spinner");

    var REQUIRED = ["ca_name", "ca_phone", "ca_position"];
    var ALL_FIELDS = [
      "ca_name",
      "ca_phone",
      "ca_email",
      "ca_position",
      "ca_qualification",
      "ca_experience",
      "ca_city",
      "ca_message",
    ];

    /* ══════════════════════════════════════
       BUTTON STATE
    ══════════════════════════════════════ */
    function setLoading(on) {
      btn.disabled = on;
      btn.style.opacity = on ? "0.8" : "1";
      btn.style.cursor = on ? "not-allowed" : "pointer";
      btnText.innerHTML = on ? "Submitting&hellip;" : "Submit Application";
      btnIcon.style.display = on ? "none" : "inline";
      spinner.style.display = on ? "inline-block" : "none";
    }

    function refreshButtonState() {
      var allFilled = REQUIRED.every(function (id) {
        return document.getElementById(id).value.trim() !== "";
      });
      btn.disabled = !allFilled;
      btn.style.opacity = allFilled ? "1" : "0.5";
      btn.style.cursor = allFilled ? "pointer" : "not-allowed";
    }

    /* ══════════════════════════════════════
       TOAST
    ══════════════════════════════════════ */
    function showToast(msg, type) {
      var toast = document.getElementById("careerToastMsg");
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
       FIELD ERROR HELPERS
    ══════════════════════════════════════ */
    function setFieldError(el, msg) {
      el.classList.add("is-invalid");
      var errDiv = el.parentElement.querySelector(".naf-field-error");
      if (errDiv) {
        errDiv.textContent = msg;
        errDiv.style.display = "block";
      }
    }

    function clearFieldError(el) {
      el.classList.remove("is-invalid");
      var errDiv = el.parentElement.querySelector(".naf-field-error");
      if (errDiv) errDiv.style.display = "none";
    }

    /* ══════════════════════════════════════
       VALIDATE
    ══════════════════════════════════════ */
    function validate() {
      var valid = true;
      var firstInvalid = null;

      /* Name */
      var nameEl = document.getElementById("ca_name");
      var nameVal = nameEl.value.trim();
      if (!nameVal) {
        setFieldError(nameEl, "Full name is required.");
        if (!firstInvalid) firstInvalid = nameEl;
        valid = false;
      } else if (nameVal.length < 3) {
        setFieldError(nameEl, "Name must be at least 3 characters.");
        if (!firstInvalid) firstInvalid = nameEl;
        valid = false;
      } else if (!/^[a-zA-Z\s.'-]+$/.test(nameVal)) {
        setFieldError(nameEl, "Name should contain letters only.");
        if (!firstInvalid) firstInvalid = nameEl;
        valid = false;
      } else {
        clearFieldError(nameEl);
      }

      /* Phone */
      var phoneEl = document.getElementById("ca_phone");
      var digits = phoneEl.value.trim().replace(/\D/g, "");
      if (!phoneEl.value.trim()) {
        setFieldError(phoneEl, "Mobile number is required.");
        if (!firstInvalid) firstInvalid = phoneEl;
        valid = false;
      } else if (digits.length < 10) {
        setFieldError(phoneEl, "Enter a valid 10-digit mobile number.");
        if (!firstInvalid) firstInvalid = phoneEl;
        valid = false;
      } else if (digits.length > 12) {
        setFieldError(phoneEl, "Mobile number seems too long.");
        if (!firstInvalid) firstInvalid = phoneEl;
        valid = false;
      } else {
        clearFieldError(phoneEl);
      }

      /* Email — optional but validate format if filled */
      var emailEl = document.getElementById("ca_email");
      var emailVal = emailEl.value.trim();
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setFieldError(emailEl, "Enter a valid email (e.g. you@email.com).");
        if (!firstInvalid) firstInvalid = emailEl;
        valid = false;
      } else {
        clearFieldError(emailEl);
      }

      /* Position */
      var posEl = document.getElementById("ca_position");
      if (!posEl.value.trim()) {
        setFieldError(posEl, "Please select a position.");
        if (!firstInvalid) firstInvalid = posEl;
        valid = false;
      } else {
        clearFieldError(posEl);
      }

      /* Resume size */
      var resumeInput = document.getElementById("resumeFile");
      if (resumeInput && resumeInput.files && resumeInput.files[0]) {
        if (resumeInput.files[0].size > 5 * 1024 * 1024) {
          var zone = document.getElementById("resumeDropZone");
          zone.style.borderColor = "#e74c3c";
          showToast("Resume must be under 5MB.", "error");
          if (!firstInvalid) firstInvalid = zone;
          valid = false;
        }
      }

      if (!valid) {
        showToast(
          "Please fix the highlighted fields before submitting.",
          "error",
        );
        if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
        if (firstInvalid)
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return valid;
    }

    /* ══════════════════════════════════════
       RESET
    ══════════════════════════════════════ */
    function resetForm() {
      form.reset();
      ALL_FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) clearFieldError(el);
      });
      var resumeLabel = document.getElementById("resumeFileName");
      if (resumeLabel) {
        resumeLabel.textContent = "Click to upload or drag & drop";
        resumeLabel.style.color = "#0f172a";
      }
      var zone = document.getElementById("resumeDropZone");
      if (zone) zone.style.borderColor = "#cbd5e1";
      refreshButtonState();
    }

    /* ══════════════════════════════════════
       READ FILE AS BASE64
    ══════════════════════════════════════ */
    function readFileAsBase64(file) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (e) {
          /* result is "data:mimetype;base64,XXXX" — strip the prefix */
          var base64 = e.target.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    /* ══════════════════════════════════════
       SUBMIT
    ══════════════════════════════════════ */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      var resumeInput = document.getElementById("resumeFile");
      var hasResume = resumeInput && resumeInput.files && resumeInput.files[0];

      var formData = {
        formType: "career" /* tells Apps Script which sheet to use */,
        name: document.getElementById("ca_name").value.trim(),
        phone: document.getElementById("ca_phone").value.trim(),
        email: document.getElementById("ca_email").value.trim(),
        position: document.getElementById("ca_position").value.trim(),
        qualification: document.getElementById("ca_qualification").value.trim(),
        experience: document.getElementById("ca_experience").value.trim(),
        city: document.getElementById("ca_city").value.trim(),
        message: document.getElementById("ca_message").value.trim(),
      };

      setLoading(true);

      /* Read file as base64 first (if attached), then send everything as JSON */
      var filePromise = hasResume
        ? readFileAsBase64(resumeInput.files[0]).then(function (base64) {
            formData.resumeBase64 = base64;
            formData.resumeName = resumeInput.files[0].name;
            formData.resumeType = resumeInput.files[0].type;
          })
        : Promise.resolve();

      filePromise
        .then(function () {
          /* Fire to Google Sheet — no-cors avoids CORS error, data saves fine */
          fetch(SHEET_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(formData),
          })
            .then(function () {
              /* SUCCESS — reset form and show toast */
              setTimeout(function () {
                setLoading(false);
                resetForm(); /* reset ONLY on success */
                showToast(
                  "Application submitted! We’ll get back to you soon.",
                  "success",
                );
              }, 2000);
            })
            .catch(function () {
              /* ERROR — do NOT reset form, keep entered values */
              setLoading(false);
              showToast(
                "Something went wrong. Please call 044-4351 0001.",
                "error",
              );
            });
        })
        .catch(function () {
          /* File read failed — do NOT reset form, keep entered values */
          setLoading(false);
          showToast("Failed to read resume file. Please try again.", "error");
        });
    });

    /* ══════════════════════════════════════
       LIVE FIELD WATCHERS
    ══════════════════════════════════════ */
    ALL_FIELDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var evt = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(evt, function () {
        clearFieldError(this);
        refreshButtonState();
      });
    });

    /* Resume drag & drop */
    var input = document.getElementById("resumeFile");
    var zone = document.getElementById("resumeDropZone");
    var label = document.getElementById("resumeFileName");

    var ALLOWED_EXT = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    var ALLOWED_MIME = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    function handleFile(file) {
      if (!file) return;

      var fileName = file.name.toLowerCase();
      var extOk = ALLOWED_EXT.some(function (ext) {
        return fileName.endsWith(ext);
      });
      var mimeOk = file.type === "" || ALLOWED_MIME.indexOf(file.type) !== -1;
      /* Note: some Windows systems return empty MIME for .doc/.docx — extOk covers that */

      if (!extOk && !mimeOk) {
        zone.style.borderColor = "#e74c3c";
        label.textContent =
          "\u26A0 Invalid type. Use PDF, Word (.doc/.docx) or Image.";
        label.style.color = "#e74c3c";
        input.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        zone.style.borderColor = "#e74c3c";
        label.textContent = "\u26A0 File too large. Max allowed is 5MB.";
        label.style.color = "#e74c3c";
        input.value = "";
        return;
      }

      /* Valid — assign to input */
      try {
        var dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
      } catch (ex) {
        /* fallback: file already bound via input.change event */
      }

      zone.style.borderColor = "#00ADAA";
      zone.style.background = "#F0FFFE";
      label.textContent = "\u2714 " + file.name;
      label.style.color = "#00ADAA";
    }

    if (input) {
      input.addEventListener("change", function () {
        if (input.files && input.files[0]) handleFile(input.files[0]);
      });
    }
    if (zone) {
      zone.addEventListener("dragover", function (e) {
        e.preventDefault();
        zone.style.borderColor = "#00ADAA";
        zone.style.background = "#F0FFFE";
      });
      zone.addEventListener("dragleave", function () {
        zone.style.borderColor = "#CBD5E1";
        zone.style.background = "#F8FAFC";
      });
      zone.addEventListener("drop", function (e) {
        e.preventDefault();
        zone.style.borderColor = "#CBD5E1";
        zone.style.background = "#F8FAFC";
        handleFile(e.dataTransfer.files[0]);
      });
    }

    refreshButtonState();
  }); /* end DOMContentLoaded */
})();
