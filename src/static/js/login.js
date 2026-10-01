import { showAlert } from '../helpers/helper_functions.js';

const setLoading = (loading) => {
    const loginBtn = document.getElementById('login-btn');
    const loginText = document.getElementById('login-text');
    const loginSpinner = document.getElementById('login-spinner');

    if (loading) {
        loginBtn.disabled = true;
        loginSpinner.classList.remove('d-none');
    } else {
        loginBtn.disabled = false;
        loginSpinner.classList.add('d-none');
    }
};

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showAlert('Please fill in all fields.');
        return;
    }

    setLoading(true);

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await response.json();

        if (response.ok) {
            // Immediate redirect - no delay
            window.location.href = '/profile';
        } else {
            showAlert(result.detail || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('An error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
});