document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('successMsg');
    const errorMsg = document.getElementById('errorMsg');
    const sendAnotherBtn = document.getElementById('sendAnotherBtn');

    if (!form) return;

    // Validation helpers
    function showError(input, message) {
        clearError(input);
        input.style.borderColor = '#ef4444';
        const err = document.createElement('span');
        err.className = 'form-error';
        err.style.cssText = 'color:#ef4444;font-size:.8rem;margin-top:4px;display:block';
        err.textContent = message;
        input.parentElement.appendChild(err);
    }

    function clearError(input) {
        input.style.borderColor = '';
        const existing = input.parentElement.querySelector('.form-error');
        if (existing) existing.remove();
    }

    function validatePhone(phone) {
        return /^[\+]?[\d\s\-]{10,15}$/.test(phone.replace(/\s/g, ''));
    }

    function validateEmail(email) {
        if (!email) return true; // Email is optional
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');

        // Clear all errors
        [name, phone, email].forEach(clearError);

        // Validate name
        if (!name.value.trim() || name.value.trim().length < 2) {
            showError(name, 'Please enter your full name');
            isValid = false;
        }

        // Validate phone
        if (!phone.value.trim() || !validatePhone(phone.value)) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate email (optional but must be valid if provided)
        if (email && email.value && !validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        if (!isValid) return;

        // Start Submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;

        // Hide previous error message
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }

        // Disable button & Show loading spinner
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

        // Prepare data & endpoint
        const formData = new FormData(form);
        const formSubmitUrl = 'https://formsubmit.co/ajax/5abbd267851dff77ed0b553e29badc25';

        fetch(formSubmitUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;

            // Success action: reset form, show success, hide form
            form.reset();
            form.style.display = 'none';
            if (successMsg) {
                successMsg.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Submission error:', error);
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;

            // Show error message
            if (errorMsg) {
                errorMsg.style.display = 'block';
            }
        });
    });

    // Reset Form visibility on Send Another Click (without reloading page)
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', () => {
            if (successMsg) successMsg.style.display = 'none';
            form.style.display = 'block';
        });
    }

    // Clear errors on input
    form.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
});
