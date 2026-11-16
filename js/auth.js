/**
 * مساري | MASARI - Authentication Logic (Login & Register)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Login Form Handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Pre-fill remembered email if exists
    const rememberedEmail = localStorage.getItem('masari_remembered_email');
    if (rememberedEmail && emailInput) {
      emailInput.value = rememberedEmail;
      if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !email.includes('@')) {
        document.getElementById('emailGroup').classList.add('has-error');
        isValid = false;
      }

      if (!password || password.length < 4) {
        document.getElementById('passwordGroup').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        MasariApp.toast('يرجى التأكد من صحة البيانات المدخلة', 'error');
        return;
      }

      // Handle Remember Me
      if (rememberMeCheckbox && rememberMeCheckbox.checked) {
        localStorage.setItem('masari_remembered_email', email);
      } else {
        localStorage.removeItem('masari_remembered_email');
      }

      // Check against stored user or accept login
      let user = MasariApp.getCurrentUser();
      if (!user) {
        user = {
          name: email.split('@')[0],
          email: email,
          avatar: email.charAt(0).toUpperCase()
        };
        localStorage.setItem('masari_user', JSON.stringify(user));
      }

      localStorage.setItem('masari_user_logged', 'true');
      MasariApp.toast('أهلاً بك مجدداً في مساري! جاري التحويل...', 'success');

      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1000);
    });
  }

  // Register Form Handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;

      if (!name) {
        document.getElementById('nameGroup').classList.add('has-error');
        isValid = false;
      }

      if (!email || !email.includes('@')) {
        document.getElementById('emailGroup').classList.add('has-error');
        isValid = false;
      }

      if (!phone || phone.length < 8) {
        document.getElementById('phoneGroup').classList.add('has-error');
        isValid = false;
      }

      if (!password || password.length < 6) {
        document.getElementById('passwordGroup').classList.add('has-error');
        isValid = false;
      }

      if (password !== confirmPassword) {
        document.getElementById('confirmPasswordGroup').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        MasariApp.toast('يرجى تصحيح الأخطاء في النموذج قبل المتابعة', 'error');
        return;
      }

      // Save new user profile
      const newUser = {
        name: name,
        email: email,
        phone: phone,
        avatar: name.charAt(0)
      };

      localStorage.setItem('masari_user', JSON.stringify(newUser));
      localStorage.setItem('masari_user_logged', 'true');

      MasariApp.toast('تم إنشاء حسابك بنجاح! مرحباً بك في مساري 🎉', 'success');

      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1200);
    });
  }

  // Password Visibility Toggle
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
      }
    });
  });

  // Social Login Mock
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const provider = btn.getAttribute('data-provider') || 'الحساب';
      MasariApp.toast(`جاري تسجيل الدخول عبر ${provider}...`, 'info');
      setTimeout(() => {
        localStorage.setItem('masari_user_logged', 'true');
        window.location.href = 'home.html';
      }, 1000);
    });
  });
});
