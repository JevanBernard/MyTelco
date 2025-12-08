// ========================================
// CONTACT FORM VALIDATION & SUBMISSION
// File: contact-form.js
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    // Form elements
    const phoneInput = document.getElementById('phone');
    const categorySelect = document.getElementById('category');
    const subjectInput = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');

    // Error message elements
    const phoneError = document.getElementById('phone-error');
    const categoryError = document.getElementById('category-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    // Validation functions
    function validatePhone(phone) {
        // Indonesian phone number validation (flexible format)
        const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
        return phoneRegex.test(phone.replace(/[\s-]/g, ''));
    }

    function validateRequired(value) {
        return value.trim() !== '';
    }

    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            element.previousElementSibling.setAttribute('aria-invalid', 'true');
        }
    }

    function clearError(element) {
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
            element.previousElementSibling.setAttribute('aria-invalid', 'false');
        }
    }

    // Real-time validation
    phoneInput.addEventListener('blur', function() {
        if (!validateRequired(this.value)) {
            showError(phoneError, 'Nomor telepon wajib diisi');
        } else if (!validatePhone(this.value)) {
            showError(phoneError, 'Format nomor telepon tidak valid');
        } else {
            clearError(phoneError);
        }
    });

    phoneInput.addEventListener('input', function() {
        if (this.value.trim() !== '' && phoneError.textContent) {
            clearError(phoneError);
        }
    });

    categorySelect.addEventListener('change', function() {
        if (!validateRequired(this.value)) {
            showError(categoryError, 'Kategori masalah wajib dipilih');
        } else {
            clearError(categoryError);
        }
    });

    subjectInput.addEventListener('blur', function() {
        if (!validateRequired(this.value)) {
            showError(subjectError, 'Judul laporan wajib diisi');
        } else if (this.value.trim().length < 5) {
            showError(subjectError, 'Judul laporan minimal 5 karakter');
        } else {
            clearError(subjectError);
        }
    });

    subjectInput.addEventListener('input', function() {
        if (this.value.trim() !== '' && subjectError.textContent) {
            clearError(subjectError);
        }
    });

    messageTextarea.addEventListener('blur', function() {
        if (!validateRequired(this.value)) {
            showError(messageError, 'Detail kendala wajib diisi');
        } else if (this.value.trim().length < 10) {
            showError(messageError, 'Detail kendala minimal 10 karakter');
        } else {
            clearError(messageError);
        }
    });

    messageTextarea.addEventListener('input', function() {
        if (this.value.trim() !== '' && messageError.textContent) {
            clearError(messageError);
        }
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear all previous errors
        clearError(phoneError);
        clearError(categoryError);
        clearError(subjectError);
        clearError(messageError);

        let isValid = true;

        // Validate phone
        if (!validateRequired(phoneInput.value)) {
            showError(phoneError, 'Nomor telepon wajib diisi');
            isValid = false;
        } else if (!validatePhone(phoneInput.value)) {
            showError(phoneError, 'Format nomor telepon tidak valid');
            isValid = false;
        }

        // Validate category
        if (!validateRequired(categorySelect.value)) {
            showError(categoryError, 'Kategori masalah wajib dipilih');
            isValid = false;
        }

        // Validate subject
        if (!validateRequired(subjectInput.value)) {
            showError(subjectError, 'Judul laporan wajib diisi');
            isValid = false;
        } else if (subjectInput.value.trim().length < 5) {
            showError(subjectError, 'Judul laporan minimal 5 karakter');
            isValid = false;
        }

        // Validate message
        if (!validateRequired(messageTextarea.value)) {
            showError(messageError, 'Detail kendala wajib diisi');
            isValid = false;
        } else if (messageTextarea.value.trim().length < 10) {
            showError(messageError, 'Detail kendala minimal 10 karakter');
            isValid = false;
        }

        // If form is valid, submit
        if (isValid) {
            submitForm();
        } else {
            // Focus on first error
            const firstError = document.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
            }
        }
    });

    // Submit form function
    function submitForm() {
        // Collect form data
        const formData = {
            phone: phoneInput.value.trim(),
            category: categorySelect.value,
            subject: subjectInput.value.trim(),
            message: messageTextarea.value.trim(),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Mengirim...</span>';

        // Simulate API call (replace with actual API endpoint)
        setTimeout(function() {
            console.log('Form Data:', formData);

            // Success message
            alert('✓ Terima kasih! Laporan Anda telah dikirim.\n\nTim kami akan segera menghubungi Anda melalui nomor yang terdaftar.');

            // Reset form
            contactForm.reset();

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            // Optional: Redirect after success
            // window.location.href = 'thank-you.html';

        }, 1500);

        // For production, use actual API call:
        /*
        fetch('https://api.mytelco.com/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('✓ Terima kasih! Laporan Anda telah dikirim.');
                contactForm.reset();
            } else {
                alert('✗ Maaf, terjadi kesalahan. Silakan coba lagi.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('✗ Terjadi kesalahan koneksi. Silakan coba lagi.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
        */
    }

    // Phone number formatting (optional)
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.startsWith('0')) {
                // Format: 0812-3456-7890
                if (value.length <= 4) {
                    value = value;
                } else if (value.length <= 8) {
                    value = value.slice(0, 4) + '-' + value.slice(4);
                } else {
                    value = value.slice(0, 4) + '-' + value.slice(4, 8) + '-' + value.slice(8, 12);
                }
            }
        }
        
        e.target.value = value;
    });
});