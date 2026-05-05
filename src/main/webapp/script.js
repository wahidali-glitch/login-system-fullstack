// ── AUTO CONTEXT PATH ─────────────────────────────────────────────────────────
const ctx = window.location.pathname
    .replace(/\/(index\.html.*|#.*)$/, '')
    .replace(/\/$/, '');

// ── INITIAL MODE ──────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    setMode('login-mode');
});

// ── FORM SWITCHING ────────────────────────────────────────────────────────────
const FORM_ORDER = ['loginForm', 'signupForm', 'forgotForm'];

function showSignup()        { switchForm('signupForm',  'signup-mode'); }
function showLogin()         { switchForm('loginForm',   'login-mode'); }
function showForgotPassword(){ switchForm('forgotForm',  'forgot-mode'); }

// ── CORE SWITCH FUNCTION ──────────────────────────────────────────────────────
function switchForm(targetId, mode) {
    const current = document.querySelector('.form-container.active');
    const target  = document.getElementById(targetId);

    if (!target || current === target) return;

    // Determine slide direction based on form order
    const currentIdx = FORM_ORDER.indexOf(current.id);
    const targetIdx  = FORM_ORDER.indexOf(targetId);
    const forward    = targetIdx > currentIdx;

    // --- Outgoing form ---
    current.classList.remove('active');
    current.classList.add(forward ? 'slide-out' : 'slide-out-reverse');

    // Clean up outgoing form after transition
    current.addEventListener('transitionend', function cleanup(e) {
        if (e.propertyName !== 'transform') return;
        current.classList.remove('slide-out', 'slide-out-reverse');
        current.removeEventListener('transitionend', cleanup);
    });

    // --- Incoming form: start off-screen, then slide to center ---
    target.classList.add(forward ? 'slide-in' : 'slide-in-reverse');

    // Force a reflow so the start position is painted before we remove the class
    target.getBoundingClientRect();

    target.classList.remove('slide-in', 'slide-in-reverse');
    target.classList.add('active');

    // Update mode (right panel)
    setMode(mode);
}

// ── MODE CONTROL ──────────────────────────────────────────────────────────────
function setMode(mode) {
    const container = document.querySelector('.container');
    container.classList.remove('login-mode', 'signup-mode', 'forgot-mode');
    container.classList.add(mode);
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
document.getElementById('signupFormSubmit').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name            = this.querySelector('input[type="text"]').value.trim();
    const email           = this.querySelector('input[type="email"]').value.trim();
    const passwordInputs  = this.querySelectorAll('input[type="password"]');
    const password        = passwordInputs[0].value;
    const confirmPassword = passwordInputs[1].value;

    if (!name || !email || !password) {
        showToast('All fields are required!', 'error'); return;
    }
    if (password.length < 8) {
        showToast('Password must be at least 8 characters.', 'error'); return;
    }
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error'); return;
    }

    setButtonLoading(this, true, 'Creating account...');

    try {
        const res = await fetch(`${ctx}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ name, email, password, confirmPassword }),
            redirect: 'follow'
        });

        if (res.redirected && res.url.includes('register-success')) {
            showToast('Account created! Please sign in.', 'success');
            this.reset();
            setTimeout(showLogin, 1800);
        } else if (res.ok === false) {
            const text = (await res.text()).replace(/<[^>]*>/g, '').trim();
            showToast(text || 'Registration failed.', 'error');
        } else {
            showToast('Registration failed.', 'error');
        }
    } catch {
        showToast('Server error. Please try again.', 'error');
    } finally {
        setButtonLoading(this, false);
    }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
document.getElementById('loginFormSubmit').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email    = this.querySelector('input[type="email"]').value.trim();
    const password = this.querySelector('input[type="password"]').value;

    if (!email || !password) {
        showToast('Email and password are required.', 'error'); return;
    }

    setButtonLoading(this, true, 'Signing in...');

    try {
        const res = await fetch(`${ctx}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email, password }),
            redirect: 'follow'
        });

        if (res.redirected && res.url.includes('dashboard.html')) {
            showToast('Login successful!', 'success');
            setTimeout(() => window.location.href = res.url, 1000);
        } else if (res.status === 401 || res.status === 400) {
            const msg = await res.text();
            showToast(msg || 'Invalid email or password.', 'error');
        } else {
            showToast('Invalid email or password.', 'error');
        }
    } catch {
        showToast('Server error. Please try again.', 'error');
    } finally {
        setButtonLoading(this, false);
    }
});

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
document.getElementById('forgotFormSubmit').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = this.querySelector('input[type="email"]').value.trim();

    if (!email) {
        showToast('Please enter your email.', 'error'); return;
    }

    setButtonLoading(this, true, 'Sending...');

    try {
        await fetch(`${ctx}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email })
        });
    } catch { /* swallow — always show success for security */ }

    setButtonLoading(this, false);
    showToast('If that email exists, a reset link has been sent.', 'success');
    this.reset();
});

// ── HELPERS ───────────────────────────────────────────────────────────────────
function setButtonLoading(form, isLoading, text = '') {
    const btn     = form.querySelector('.btn-primary');
    const spinner = btn.querySelector('.loading');
    const btnText = btn.querySelector('.btn-text');

    if (isLoading) {
        btn._originalText = btnText.textContent;
        spinner.classList.add('show');
        btnText.textContent = text;
        btn.disabled = true;
    } else {
        spinner.classList.remove('show');
        btnText.textContent = btn._originalText || btnText.textContent;
        btn.disabled = false;
    }
}

function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.4s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3600);
}

function socialLogin(provider) {
    showToast(`${provider} login coming soon!`, 'success');
}

// ── INPUT FOCUS EFFECTS ───────────────────────────────────────────────────────
document.querySelectorAll('.form-control').forEach(input => {

    input.addEventListener('focus', function () {
        const icon = this.parentNode.querySelector('i');
        if (icon) icon.style.color = '#3b82f6';
    });

    input.addEventListener('blur', function () {
        const icon = this.parentNode.querySelector('i');

        if (!this.value && icon) {
            icon.style.color = '#94a3b8';
        }

        if (this.type === 'email' && this.value) {
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
            this.classList.toggle('success', valid);
            this.classList.toggle('error', !valid);
        }

        if (!this.value) {
            this.classList.remove('success', 'error');
        }
    });
});

// ── KEYBOARD SHORTCUTS ────────────────────────────────────────────────────────
document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key === 's') { e.preventDefault(); showSignup(); }
    if (e.altKey && e.key === 'l') { e.preventDefault(); showLogin(); }
});