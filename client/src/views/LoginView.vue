<template>
  <div class="login-page">
    <!-- Animated Background -->
    <div class="login-bg">
      <div class="login-bg-circle circle-1"></div>
      <div class="login-bg-circle circle-2"></div>
      <div class="login-bg-circle circle-3"></div>
      <div class="login-bg-circle circle-4"></div>
    </div>

    <div class="login-container">
      <!-- Robot Mascot -->
      <div class="login-mascot">
        <img src="../assets/robot-mascot.png" alt="Robot Mascot" class="mascot-img" />
      </div>

      <!-- Login Card -->
      <div class="login-card glass">
        <div class="login-header">
          <div class="login-logo">
            <div class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span class="logo-text">Quản Lý Đại Lý</span>
          </div>
          <h1 class="login-title">Chào mừng trở lại! 👋</h1>
          <p class="login-subtitle">Đăng nhập để quản lý hệ thống đại lý của bạn</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Username -->
          <div class="form-group">
            <label class="form-label" for="username">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Tên đăng nhập
            </label>
            <div class="input-wrapper">
              <input
                id="username"
                v-model="form.tenDangNhap"
                type="text"
                class="form-input"
                :class="{ error: errors.tenDangNhap }"
                placeholder="Nhập tên đăng nhập"
                autocomplete="username"
                @focus="clearError('tenDangNhap')"
              />
            </div>
            <span v-if="errors.tenDangNhap" class="form-error">{{ errors.tenDangNhap }}</span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label" for="password">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Mật khẩu
            </label>
            <div class="input-wrapper">
              <input
                id="password"
                v-model="form.matKhau"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ error: errors.matKhau }"
                placeholder="Nhập mật khẩu"
                autocomplete="current-password"
                @focus="clearError('matKhau')"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <span v-if="errors.matKhau" class="form-error">{{ errors.matKhau }}</span>
          </div>

          <!-- Remember & Forgot -->
          <div class="login-options">
            <label class="checkbox-label">
              <input v-model="form.ghiNho" type="checkbox" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" class="forgot-link" @click.prevent="showForgotModal = true">Quên mật khẩu?</a>
          </div>

          <!-- Error Message -->
          <div v-if="loginError" class="login-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ loginError }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="btn btn-primary btn-block btn-lg login-btn"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.3"></circle>
              <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg>
            <span v-if="!isLoading">Đăng nhập</span>
            <span v-else>Đang xử lý...</span>
          </button>
        </form>

        <div class="login-footer">
          <p>SE104 - Nhập môn Công nghệ Phần mềm</p>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotModal" class="modal-overlay" @click.self="showForgotModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Quên mật khẩu</h3>
          <button class="modal-close" @click="showForgotModal = false">✕</button>
        </div>
        <div class="modal-body">
          <p style="color: var(--gray-500); margin-bottom: 16px;">
            Vui lòng liên hệ quản trị viên để đặt lại mật khẩu.
          </p>
          <div class="form-group">
            <label class="form-label">Email liên hệ admin</label>
            <input type="text" class="form-input" value="admin@quanlydaily.com" readonly />
          </div>
          <button class="btn btn-primary btn-block" @click="showForgotModal = false">Đã hiểu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  tenDangNhap: '',
  matKhau: '',
  ghiNho: false,
});

const errors = reactive({
  tenDangNhap: '',
  matKhau: '',
});

const showPassword = ref(false);
const isLoading = ref(false);
const loginError = ref('');
const showForgotModal = ref(false);

const clearError = (field) => {
  errors[field] = '';
  loginError.value = '';
};

const validate = () => {
  let valid = true;
  if (!form.tenDangNhap.trim()) {
    errors.tenDangNhap = 'Vui lòng nhập tên đăng nhập';
    valid = false;
  }
  if (!form.matKhau) {
    errors.matKhau = 'Vui lòng nhập mật khẩu';
    valid = false;
  }
  return valid;
};

const handleLogin = async () => {
  if (!validate()) return;

  isLoading.value = true;
  loginError.value = '';

  try {
    await authStore.login({
      tenDangNhap: form.tenDangNhap,
      matKhau: form.matKhau,
    });

    if (form.ghiNho) {
      localStorage.setItem('rememberedUser', form.tenDangNhap);
    }

    router.push('/dashboard');
  } catch (error) {
    loginError.value = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
  } finally {
    isLoading.value = false;
  }
};

// Restore remembered user
const remembered = localStorage.getItem('rememberedUser');
if (remembered) {
  form.tenDangNhap = remembered;
  form.ghiNho = true;
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #1e3a5f 60%, #0f172a 100%);
}

/* Animated background circles */
.login-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.login-bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.circle-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  top: -120px;
  right: -80px;
  animation: float 8s ease-in-out infinite;
}

.circle-2 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  bottom: -60px;
  left: -60px;
  animation: float 10s ease-in-out infinite 2s;
}

.circle-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  top: 50%;
  left: 20%;
  animation: float 12s ease-in-out infinite 4s;
}

.circle-4 {
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, #10b981, #06b6d4);
  bottom: 30%;
  right: 15%;
  animation: float 9s ease-in-out infinite 1s;
}

.login-container {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  max-width: 900px;
  width: 100%;
}

/* Robot Mascot */
.login-mascot {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 4s ease-in-out infinite;
}

.mascot-img {
  width: 320px;
  height: 320px;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
}

/* Login Card */
.login-card {
  flex: 1;
  max-width: 440px;
  border-radius: var(--radius-xl);
  padding: 40px 36px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
}

.login-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: white;
  margin-bottom: 6px;
}

.login-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Form in dark mode */
.login-form .form-label {
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 6px;
}

.login-form .form-label svg {
  opacity: 0.7;
}

.login-form .form-input {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  color: white;
  padding: 13px 16px;
}

.login-form .form-input:focus {
  border-color: var(--primary-400);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.login-form .form-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 4px;
  transition: color var(--transition-fast);
}

.toggle-password:hover {
  color: rgba(255, 255, 255, 0.8);
}

/* Options row */
.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 11px;
  font-weight: 700;
}

.forgot-link {
  font-size: 0.85rem;
  color: var(--primary-400);
  transition: color var(--transition-fast);
}

.forgot-link:hover {
  color: var(--primary-300);
}

/* Error message */
.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
  color: #fca5a5;
  font-size: 0.85rem;
  margin-bottom: 20px;
  animation: slideUp 0.3s ease;
}

/* Login button */
.login-btn {
  font-size: 1rem;
  padding: 14px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
  letter-spacing: 0.3px;
}

.login-btn:hover:not(:disabled) {
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
  transform: translateY(-2px);
}

/* Spinner */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Footer */
.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.login-footer p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    gap: 0;
  }

  .login-mascot {
    margin-bottom: -30px;
  }

  .mascot-img {
    width: 200px;
    height: 200px;
  }

  .login-card {
    max-width: 100%;
    padding: 32px 24px;
  }

  .login-title {
    font-size: 1.3rem;
  }
}
</style>
