import { showAlert } from '../helpers/helper_functions.js';

const setLoading = (loading) => {
    const registerBtn = document.getElementById('register-btn');
    const registerText = document.getElementById('register-text');
    const registerSpinner = document.getElementById('register-spinner');

    if (loading) {
        registerBtn.disabled = true;
        registerSpinner.classList.remove('d-none');
    } else {
        registerBtn.disabled = false;
        registerSpinner.classList.add('d-none');
    }
};

const checkPasswordStrength = (password) => {
    const strengthDiv = document.getElementById('password-strength');
    if (password.length === 0) {
        strengthDiv.textContent = '';
        return;
    }

    if (password.length < 6) {
        strengthDiv.textContent = 'Password must be at least 6 characters';
        strengthDiv.className = 'password-strength strength-weak';
    } else if (password.length < 10) {
        strengthDiv.textContent = 'Medium strength';
        strengthDiv.className = 'password-strength strength-medium';
    } else {
        strengthDiv.textContent = 'Strong password';
        strengthDiv.className = 'password-strength strength-strong';
    }
};

const checkPasswordMatch = () => {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const matchDiv = document.getElementById('password-match');

    if (confirmPassword.length === 0) {
        matchDiv.textContent = '';
        return;
    }

    if (password === confirmPassword) {
        matchDiv.textContent = 'Passwords match ✓';
        matchDiv.style.color = '#198754';
    } else {
        matchDiv.textContent = 'Passwords do not match';
        matchDiv.style.color = '#dc3545';
    }
};

document.getElementById('password').addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
    checkPasswordMatch();
});

document.getElementById('confirm_password').addEventListener('input', checkPasswordMatch);

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (!username || !password || !confirmPassword) {
        showAlert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match.');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters.');
        return;
    }

    setLoading(true);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                confirm_password: confirmPassword
            })
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = '/profile';
        } else {
            showAlert(result.detail || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('An error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
});
