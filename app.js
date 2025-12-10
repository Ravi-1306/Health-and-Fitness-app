const modal = document.getElementById('loginModal');
const providerLabel = modal.querySelector('[data-provider-label]');
const authButtons = document.querySelectorAll('[data-provider]');
const closeTargets = modal.querySelectorAll('[data-close]');
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const statusMessage = document.getElementById('statusMessage');
const togglePasswordBtn = modal.querySelector('.toggle-password');
const submitBtn = form.querySelector('.primary-btn');

const providerMeta = {
    google: {
        label: 'Google',
        success: 'Google account connected successfully. Syncing your health data now...'
    },
    apple: {
        label: 'Apple',
        success: 'Apple ID verified. Loading your fitness dashboard...'
    }
};

let activeProvider = 'google';
let authTimer = null;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function openModal(provider) {
    activeProvider = providerMeta[provider] ? provider : 'google';
    providerLabel.textContent = providerMeta[activeProvider].label;
    statusMessage.textContent = '';
    statusMessage.className = 'status';
    form.reset();
    rememberCheckbox.checked = true;
    passwordInput.type = 'password';
    togglePasswordBtn.textContent = 'Show';
    document.body.classList.add('modal-open');
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => emailInput.focus(), 150);
}

function closeModal() {
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (authTimer) {
        clearTimeout(authTimer);
        authTimer = null;
    }
    resetLoadingState();
}

function resetLoadingState() {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Continue';
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status ${type}`.trim();
}

function simulateAuth(payload) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Connecting...';
    showStatus('Authenticating with secure servers...', 'info');

    const record = {
        email: payload.email,
        provider: activeProvider,
        remember: payload.remember,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('dole-sholay-auth', JSON.stringify(record));

    authTimer = setTimeout(() => {
        showStatus(providerMeta[activeProvider].success, 'success');
        submitBtn.textContent = 'Success';
        setTimeout(() => {
            closeModal();
            showToast(`Welcome back, ${payload.email.split('@')[0]}!`);
        }, 1200);
    }, 1400);
}

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 2800);
}

function validateForm() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const remember = rememberCheckbox.checked;

    const errors = [];
    if (!emailPattern.test(email)) {
        errors.push('Enter a valid email address.');
    }
    if (password.length < 6) {
        errors.push('Password must be at least 6 characters.');
    }

    if (errors.length) {
        showStatus(errors.join(' '), 'error');
        return null;
    }

    return { email, password, remember };
}

authButtons.forEach(button => {
    button.addEventListener('click', () => openModal(button.dataset.provider));
});

closeTargets.forEach(target => target.addEventListener('click', closeModal));

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('visible')) {
        closeModal();
    }
});

form.addEventListener('submit', event => {
    event.preventDefault();
    const payload = validateForm();
    if (!payload) {
        return;
    }
    simulateAuth(payload);
});

togglePasswordBtn.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePasswordBtn.textContent = isHidden ? 'Hide' : 'Show';
});

const storedAuth = localStorage.getItem('dole-sholay-auth');
if (storedAuth) {
    try {
        const parsed = JSON.parse(storedAuth);
        showToast(`Last signed in with ${providerMeta[parsed.provider]?.label || 'your account'} on ${new Date(parsed.timestamp).toLocaleDateString()}`);
    } catch (error) {
        localStorage.removeItem('dole-sholay-auth');
    }
}
*** End of File