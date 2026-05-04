document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const formContainer = document.getElementById('formContainer');
    const successMsg = document.getElementById('successMsg');

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

        // Simulate submission
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Show success
            formContainer.querySelector('h3').style.display = 'none';
            form.style.display = 'none';
            successMsg.style.display = 'block';
        }, 1500);
    });

    // Clear errors on input
    form.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
});
