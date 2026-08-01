// UConnect — Authentication & User Management

document.addEventListener('DOMContentLoaded', () => {
  initRoleTabs();
  initPasswordToggle();
  initLoginForm();
  initSignupForm();
  initUrlRole();
  initForgotFlow();
});

const ROLE_LABELS = {
  student: 'Student',
  teacher: 'Teacher',
  recruiter: 'Recruiter',
  admin: 'Admin'
};

function initRoleTabs() {
  const tabs = document.querySelectorAll('.role-tab');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const companyField = document.getElementById('companyField');
  const departmentField = document.getElementById('departmentField');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const role = tab.dataset.role;

      if (loginBtn) {
        loginBtn.textContent = `Sign In as ${ROLE_LABELS[role]}`;
      }
      if (signupBtn) {
        signupBtn.textContent = `Create ${ROLE_LABELS[role]} Account`;
      }
      if (companyField) {
        companyField.classList.toggle('hidden', role !== 'recruiter');
        const companyInput = companyField.querySelector('input');
        if (companyInput) companyInput.required = role === 'recruiter';
      }
      if (departmentField) {
        departmentField.classList.toggle('hidden', role !== 'teacher');
        const deptInput = departmentField.querySelector('input');
        if (deptInput) deptInput.required = role === 'teacher';
      }
    });
  });
}

function initUrlRole() {
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  if (!role) return;

  const tab = document.querySelector(`.role-tab[data-role="${role}"]`);
  if (tab) tab.click();
}

function initPasswordToggle() {
  const toggle = document.getElementById('passwordToggle');
  const password = document.getElementById('password');
  if (!toggle || !password) return;

  toggle.addEventListener('click', () => {
    const isPassword = password.type === 'password';
    password.type = isPassword ? 'text' : 'password';
    toggle.textContent = isPassword ? '🙈' : '👁';
  });
}

function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const twoFactorModal = document.getElementById('twoFactorModal');
  const close2FA = document.getElementById('close2FAModal');
  const twoFactorForm = document.getElementById('twoFactorForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const role = document.querySelector('.role-tab.active')?.dataset.role || 'student';
    const email = form.email.value;

    // Show Two Factor Modal
    if (twoFactorModal) {
      twoFactorModal.style.display = 'flex';
      
      close2FA.onclick = () => {
        twoFactorModal.style.display = 'none';
      };

      twoFactorForm.onsubmit = (evt) => {
        evt.preventDefault();
        const code = document.getElementById('twoFactorCode').value;

        if (code === '123456') {
          twoFactorModal.style.display = 'none';
          const btn = document.getElementById('loginBtn');
          btn.textContent = 'Signing in...';
          btn.disabled = true;

          setTimeout(() => {
            // Find or insert user in dynamic state
            const db = window.UConnect.getDb();
            let userInDb = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (!userInDb) {
              // Add a default entry
              userInDb = {
                id: 'usr_' + Date.now(),
                email: email,
                name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                role: role,
                dept: role === 'student' ? 'Computer Science' : 'CSE Department',
                year: '3rd Year',
                points: 10,
                badges: [],
                verified: true
              };
              db.users.push(userInDb);
              window.UConnect.saveDb(db);
            }

            sessionStorage.setItem('uconnect_user', JSON.stringify({
              role: userInDb.role,
              email: userInDb.email,
              name: userInDb.name
            }));

            const dashboards = {
              student: 'dashboard/student.html',
              teacher: 'dashboard/teacher.html',
              recruiter: 'dashboard/recruiter.html',
              admin: 'dashboard/admin.html'
            };

            window.location.href = dashboards[userInDb.role] || dashboards.student;
          }, 800);
        } else {
          showToast('Invalid 2FA code. Please use 123456.', true);
        }
      };
    }
  });
}

function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const verifyModal = document.getElementById('emailVerifyModal');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    if (password !== confirm) {
      showToast('Passwords do not match', true);
      return;
    }

    const role = document.querySelector('.role-tab.active')?.dataset.role || 'student';
    const email = form.email.value;
    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const company = form.company?.value || '';
    const department = form.department?.value || '';

    // Show Email Verification Modal
    if (verifyModal) {
      verifyModal.style.display = 'flex';
      
      const verifyForm = document.getElementById('emailVerifyForm');
      const closeVerify = document.getElementById('closeVerifyModal');
      
      closeVerify.onclick = () => {
        verifyModal.style.display = 'none';
      };
      
      verifyForm.onsubmit = (evt) => {
        evt.preventDefault();
        const code = document.getElementById('emailVerifyCode').value;

        if (code === '123456') {
          verifyModal.style.display = 'none';
          const btn = document.getElementById('signupBtn');
          btn.textContent = 'Creating account...';
          btn.disabled = true;

          setTimeout(() => {
            const db = window.UConnect.getDb();
            
            // Add user to state
            const newUser = {
              id: 'usr_' + Date.now(),
              email: email,
              name: `${firstName} ${lastName}`,
              role: role,
              dept: role === 'teacher' ? department : (role === 'recruiter' ? '' : 'Computer Science'),
              company: role === 'recruiter' ? company : '',
              year: role === 'student' ? '1st Year' : '',
              points: 10,
              badges: [],
              verified: false // Admins will need to verify them later
            };

            db.users.push(newUser);
            window.UConnect.saveDb(db);

            showToast('Account verified! Please check your email to verify.');
            setTimeout(() => {
              window.location.href = `login.html?role=${role}`;
            }, 1000);
          }, 1000);
        } else {
          showToast('Invalid verification code. Please use 123456.', true);
        }
      };
    }
  });
}

function initForgotFlow() {
  const forgotLink = document.getElementById('forgotPasswordLink');
  const forgotModal = document.getElementById('forgotPasswordModal');
  const closeForgot = document.getElementById('closeForgotModal');
  const forgotForm = document.getElementById('forgotPasswordForm');

  if (forgotLink && forgotModal) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      forgotModal.style.display = 'flex';
    });

    closeForgot.addEventListener('click', () => {
      forgotModal.style.display = 'none';
    });

    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      forgotModal.style.display = 'none';
      showToast('A simulation password reset link has been sent to your email.');
      forgotForm.reset();
    });
  }
}

function showToast(message, isError = false) {
  let toast = document.querySelector('.auth-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'auth-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.toggle('auth-toast--error', isError);
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 3000);
}
