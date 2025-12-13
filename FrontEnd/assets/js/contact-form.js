document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return;

  // Form elements
  const phoneInput = document.getElementById("phone");
  const categorySelect = document.getElementById("category");
  const subjectInput = document.getElementById("subject");
  const messageTextarea = document.getElementById("message");

  // Error message elements
  const phoneError = document.getElementById("phone-error");
  const categoryError = document.getElementById("category-error");
  const subjectError = document.getElementById("subject-error");
  const messageError = document.getElementById("message-error");

  // Validation functions (Tetap Sama)
  function validatePhone(phone) {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ""));
  }

  function validateRequired(value) {
    return value.trim() !== "";
  }

  function showError(element, message) {
    if (element) {
      element.textContent = message;
      element.style.display = "block";
      element.previousElementSibling.setAttribute("aria-invalid", "true");
    }
  }

  function clearError(element) {
    if (element) {
      element.textContent = "";
      element.style.display = "none";
      element.previousElementSibling.setAttribute("aria-invalid", "false");
    }
  }

  // Real-time validation listeners (Tetap Sama - Saya ringkas)
  phoneInput.addEventListener("input", () => clearError(phoneError));
  categorySelect.addEventListener("change", () => clearError(categoryError));
  subjectInput.addEventListener("input", () => clearError(subjectError));
  messageTextarea.addEventListener("input", () => clearError(messageError));

  // Form submission
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    clearError(phoneError);
    clearError(categoryError);
    clearError(subjectError);
    clearError(messageError);

    let isValid = true;

    if (!validateRequired(phoneInput.value)) { showError(phoneError, "Nomor telepon wajib diisi"); isValid = false; }
    else if (!validatePhone(phoneInput.value)) { showError(phoneError, "Format nomor telepon tidak valid"); isValid = false; }

    if (!validateRequired(categorySelect.value)) { showError(categoryError, "Kategori wajib dipilih"); isValid = false; }
    if (!validateRequired(subjectInput.value)) { showError(subjectError, "Judul wajib diisi"); isValid = false; }
    if (!validateRequired(messageTextarea.value)) { showError(messageError, "Detail kendala wajib diisi"); isValid = false; }

    if (isValid) {
      submitToBackend();
    }
  });

  // --- FUNGSI BARU: KIRIM KE BACKEND NODE.JS ---
  async function submitToBackend() {
    const submitBtn = contactForm.querySelector(".submit-btn");
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span>Mengirim...</span>";

    const payload = {
      phone: phoneInput.value.trim(),
      category: categorySelect.value,
      subject: subjectInput.value.trim(),
      message: messageTextarea.value.trim()
    };

    try {
      // Tembak ke Node.js (Port 3000)
      const response = await fetch('http://localhost:3000/api/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("✓ Terima kasih! Laporan Anda telah dikirim.\n\nTim kami akan segera menindaklanjuti.");
        contactForm.reset();
      } else {
        throw new Error(result.message || "Gagal mengirim laporan.");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("✗ " + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }

  // Phone formatting (Tetap Sama)
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("0")) {
      if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4);
      if (value.length > 9) value = value.slice(0, 9) + "-" + value.slice(9);
    }
    e.target.value = value;
  });
});