// ============================================================
// MAKE GLOBAL VARIABLES
// ============================================================
let forgotBox;
let forgotEmail;

// ============================================================
// GLOBAL FUNCTIONS (FIX FOR YOUR ERROR)
// ============================================================
function toggleForgot() {
    if (!forgotBox) return;

    forgotBox.style.display =
        (forgotBox.style.display === "block") ? "none" : "block";
}

function sendReset() {
    if (!forgotEmail) return;

    const email = forgotEmail.value.trim();

    if (email === "") {
        alert("Enter email first");
        return;
    }

    alert("Reset link sent to: " + email);

    forgotEmail.value = "";
    forgotBox.style.display = "none";
}

// 👇 MAKE THEM ACCESSIBLE TO HTML
window.toggleForgot = toggleForgot;
window.sendReset = sendReset;


// ============================================================
// MAIN SCRIPT
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

    // ================= ELEMENTS =================
    const wrapper = document.getElementById('wrapper');
    const overlayContent = document.getElementById('overlayContent');
    const goToSignup = document.getElementById('goToSignup');
    const goToLogin = document.getElementById('goToLogin');
    const signupForm = document.getElementById('signupForm');
    const signupError = document.getElementById('signupError');

    const forgotLink = document.getElementById("forgotLink");
    forgotBox = document.getElementById("forgotBox");
    forgotEmail = document.getElementById("forgotEmail");
    const sendResetBtn = document.getElementById("sendResetBtn");

    // ================= OVERLAY =================
    const loginOverlayHTML = `
        <h2>Hello, Friend!</h2>
        <button id="overlaySignupBtn">Sign Up</button>
    `;

    const signupOverlayHTML = `
        <h2>Welcome Back!</h2>
        <button id="overlayLoginBtn">Sign In</button>
    `;

    overlayContent.innerHTML = loginOverlayHTML;
    bindOverlayButtons();

    function switchToSignup() {
        wrapper.classList.add('signup-mode');
        overlayContent.innerHTML = signupOverlayHTML;
        bindOverlayButtons();
    }

    function switchToLogin() {
        wrapper.classList.remove('signup-mode');
        overlayContent.innerHTML = loginOverlayHTML;
        bindOverlayButtons();
    }

    function bindOverlayButtons() {
        const btnSignup = document.getElementById('overlaySignupBtn');
        const btnLogin = document.getElementById('overlayLoginBtn');

        if (btnSignup) btnSignup.onclick = switchToSignup;
        if (btnLogin) btnLogin.onclick = switchToLogin;
    }

    // ================= SWITCH LINKS =================
    if (goToSignup)
        goToSignup.onclick = (e) => { e.preventDefault(); switchToSignup(); };

    if (goToLogin)
        goToLogin.onclick = (e) => { e.preventDefault(); switchToLogin(); };

    // ================= VALIDATION =================
    if (signupForm)
        signupForm.addEventListener('submit', function (e) {
            const pw = this.password.value;
            const cpw = this.confirmPassword.value;

            if (pw !== cpw) {
                e.preventDefault();
                signupError.innerText = "Passwords do not match!";
            }
        });

    // ================= FORGOT PASSWORD =================
    if (forgotLink)
        forgotLink.addEventListener("click", function (e) {
            e.preventDefault();
            toggleForgot();
        });

    if (sendResetBtn)
        sendResetBtn.addEventListener("click", sendReset);

});