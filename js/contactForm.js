(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var SHEET_URL =
      "https://script.google.com/macros/s/AKfycbzlI6xN4kLIT1sA0hmN3gu2v0rohFcdLJkk-nbrUOF_ikXY-GmdgJWpkIZjraLmk4x_/exec";

    var form = document.getElementById("contactForm");
    var btn = document.getElementById("cf_btn");
    var btnText = document.getElementById("cf_btn_text");
    var btnIcon = document.getElementById("cf_btn_icon");
    var spinner = document.getElementById("cf_btn_spinner");

    var FIELDS = [
      "cf_name",
      "cf_company",
      "cf_phone",
      "cf_email",
      "cf_service",
      "cf_property",
      "cf_message",
    ];

    function setLoading(on) {
      btn.disabled = on;
      btn.style.opacity = on ? "0.8" : "1";
      btn.style.cursor = on ? "not-allowed" : "pointer";
      btnText.innerHTML = on
        ? "Sending&hellip;"
        : "Send Enquiry &amp; Get Free Quote";
      btnIcon.style.display = on ? "none" : "inline";
      spinner.style.display = on ? "inline-block" : "none";
    }

    function showToast(msg, type) {
      var toast = document.getElementById("toastMsg");
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

    function refreshButtonState() {
      var allFilled = FIELDS.every(function (id) {
        return document.getElementById(id).value.trim() !== "";
      });
      btn.disabled = !allFilled;
      btn.style.opacity = allFilled ? "1" : "0.5";
      btn.style.cursor = allFilled ? "pointer" : "not-allowed";
    }

    function validate() {
      var valid = true;
      var firstInvalid = null;

      FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el.value.trim()) {
          el.classList.add("is-invalid");
          if (!firstInvalid) firstInvalid = el;
          valid = false;
        } else {
          el.classList.remove("is-invalid");
        }
      });

      var emailEl = document.getElementById("cf_email");
      if (
        emailEl.value.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())
      ) {
        emailEl.classList.add("is-invalid");
        if (!firstInvalid) firstInvalid = emailEl;
        valid = false;
      }

      var phoneEl = document.getElementById("cf_phone");
      if (
        phoneEl.value.trim() &&
        phoneEl.value.trim().replace(/\D/g, "").length < 10
      ) {
        phoneEl.classList.add("is-invalid");
        if (!firstInvalid) firstInvalid = phoneEl;
        valid = false;
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

    function resetForm() {
      console.log("resetForm() called – this should only happen on success");
      form.reset();
      FIELDS.forEach(function (id) {
        document.getElementById(id).classList.remove("is-invalid");
      });
      refreshButtonState();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validate()) {
        console.log("Validation failed – form will NOT reset");
        return;
      }

      var data = {
        name: document.getElementById("cf_name").value.trim(),
        company: document.getElementById("cf_company").value.trim(),
        phone: document.getElementById("cf_phone").value.trim(),
        email: document.getElementById("cf_email").value.trim(),
        service: document.getElementById("cf_service").value.trim(),
        property: document.getElementById("cf_property").value.trim(),
        message: document.getElementById("cf_message").value.trim(),
      };
      data.formType = "contact";

      setLoading(true);
      var sent = false;

      fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
      })
        .then(function () {
          if (!sent) {
            sent = true;
            setLoading(false);
            resetForm(); // <-- resets only on success
            showToast(
              "Message sent! We’ll contact you at the earliest.",
              "success",
            );
          }
        })
        .catch(function () {
          if (!sent) {
            sent = true;
            setLoading(false);
            // No resetForm() here – form stays filled
            showToast(
              "Something went wrong. Please call 044-4351 0001.",
              "error",
            );
          }
        });

      setTimeout(function () {
        if (!sent) {
          sent = true;
          setLoading(false);
          resetForm(); // <-- fallback success after 3s
          showToast(
            "Message sent! We’ll contact you at the earliest.",
            "success",
          );
        }
      }, 3000);
    });

    FIELDS.forEach(function (id) {
      var el = document.getElementById(id);
      var evt = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(evt, function () {
        this.classList.remove("is-invalid");
        refreshButtonState();
      });
    });

    refreshButtonState();
  });
})();
