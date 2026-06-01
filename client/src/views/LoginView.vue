<template>
  <div class="lp">

    <!-- Subtle background orbs -->
    <div class="lp-orb lp-orb1"></div>
    <div class="lp-orb lp-orb2"></div>

    <div class="lp-card">

      <!-- Brand — matches sidebar exactly -->
      <div class="lp-brand">
        <img src="/agentix-logo.png" class="lp-logo-img" alt="Agentix" />
        <div class="lp-brand-meta">
          <span class="lp-b1">Hệ thống</span>
          <span class="lp-b2">Quản lý đại lý</span>
        </div>
      </div>

      <!-- ── LOGIN FORM ── -->
      <div class="lp-form-hd">
        <h2 class="lp-form-title">Chào mừng trở lại</h2>
        <p class="lp-form-sub">Đăng nhập bằng tài khoản được quản trị viên cấp</p>
      </div>

      <form @submit.prevent="handleLogin" class="lp-form" novalidate>

        <div class="lf-group">
          <label class="lf-label">Tên đăng nhập</label>
          <div class="lf-field" :class="{ focused: uFocus, err: errors.tenDangNhap }">
            <User :size="14" class="lf-ico"/>
            <input v-model="form.tenDangNhap" type="text" class="lf-inp"
              placeholder="Nhập tên đăng nhập" autocomplete="username"
              @focus="uFocus=true; clearError('tenDangNhap')" @blur="uFocus=false"/>
          </div>
          <span class="lf-err" v-if="errors.tenDangNhap"><AlertCircle :size="11"/>{{ errors.tenDangNhap }}</span>
        </div>

        <div class="lf-group">
          <div class="lf-label-row">
            <label class="lf-label">Mật khẩu</label>
            <a class="lf-forgot" @click.prevent="showForgotModal=true">Quên mật khẩu?</a>
          </div>
          <div class="lf-field" :class="{ focused: pFocus, err: errors.matKhau }">
            <Lock :size="14" class="lf-ico"/>
            <input v-model="form.matKhau" :type="showPass ? 'text' : 'password'" class="lf-inp"
              placeholder="••••••••" autocomplete="current-password"
              @focus="pFocus=true; clearError('matKhau')" @blur="pFocus=false"/>
            <button type="button" class="lf-eye" @click="showPass=!showPass" tabindex="-1">
              <Eye v-if="!showPass" :size="14"/><EyeOff v-else :size="14"/>
            </button>
          </div>
          <span class="lf-err" v-if="errors.matKhau"><AlertCircle :size="11"/>{{ errors.matKhau }}</span>
        </div>

        <label class="lf-check">
          <input v-model="form.ghiNho" type="checkbox" class="lf-check-inp"/>
          <span class="lf-check-box" :class="{ on: form.ghiNho }">
            <Check v-if="form.ghiNho" :size="10"/>
          </span>
          <span class="lf-check-lbl">Ghi nhớ đăng nhập</span>
        </label>

        <div class="lf-login-err" v-if="loginError">
          <AlertCircle :size="14"/>{{ loginError }}
        </div>

        <button type="submit" class="lf-submit" :disabled="isLoading">
          <Loader2 v-if="isLoading" :size="15" class="lf-spin"/>
          <span>{{ isLoading ? 'Đang xử lý…' : 'Đăng nhập' }}</span>
          <ArrowRight v-if="!isLoading" :size="15" class="lf-arrow"/>
        </button>

        <p class="lf-switch-hint">
          Chưa có tài khoản? Liên hệ quản trị viên để được cấp quyền truy cập.
        </p>
      </form>

      <p class="lp-card-foot">© 2026 Agentix · SE104 · Nhập môn Công nghệ Phần mềm</p>
    </div>
  </div>

  <!-- ── Forgot modal ── -->
  <Teleport to="body">
    <div v-if="showForgotModal" class="fm-bg" @click.self="showForgotModal=false">
      <div class="fm-box">
        <div class="fm-ico"><Lock :size="20"/></div>
        <h4 class="fm-title">Quên mật khẩu?</h4>
        <p class="fm-desc">Vui lòng liên hệ quản trị viên để đặt lại mật khẩu cho tài khoản của bạn.</p>
        <div class="fm-email"><Mail :size="13"/> admin@agentix.vn</div>
        <button class="lf-submit" style="margin-top:18px;width:100%" @click="showForgotModal=false">Đã hiểu</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import {
  User, Lock, Eye, EyeOff, Check, AlertCircle,
  ArrowRight, Loader2, Mail,
} from 'lucide-vue-next';

const router    = useRouter();
const authStore = useAuthStore();

/* ── Login form ── */
const form     = reactive({ tenDangNhap: '', matKhau: '', ghiNho: false });
const errors   = reactive({ tenDangNhap: '', matKhau: '' });
const showPass = ref(false);
const isLoading = ref(false);
const loginError = ref('');
const showForgotModal = ref(false);
const uFocus = ref(false);
const pFocus = ref(false);

const clearError = (f) => { errors[f] = ''; loginError.value = ''; };

const validate = () => {
  let ok = true;
  if (!form.tenDangNhap.trim()) { errors.tenDangNhap = 'Vui lòng nhập tên đăng nhập'; ok = false; }
  if (!form.matKhau)            { errors.matKhau    = 'Vui lòng nhập mật khẩu';       ok = false; }
  return ok;
};

const handleLogin = async () => {
  if (!validate()) return;
  isLoading.value = true; loginError.value = '';
  try {
    await authStore.login({ tenDangNhap: form.tenDangNhap, matKhau: form.matKhau });
    if (form.ghiNho) localStorage.setItem('rememberedUser', form.tenDangNhap);
    router.push('/dashboard');
  } catch (e) {
    loginError.value = e.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
  } finally { isLoading.value = false; }
};

const remembered = localStorage.getItem('rememberedUser');
if (remembered) { form.tenDangNhap = remembered; form.ghiNho = true; }
</script>

<style scoped>
/* ══ ROOT ══ */
.lp {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--s-bg, #f5f7f9);
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
  font-family: 'Outfit', 'Inter', ui-sans-serif, system-ui, sans-serif;
}

/* ── Decorative orbs (very subtle) ── */
.lp-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.lp-orb1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(16,185,129,.07) 0%, transparent 65%);
  top: -260px; right: -160px;
}
.lp-orb2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(5,150,105,.05) 0%, transparent 65%);
  bottom: -200px; left: -100px;
}

/* ══ CARD — matches sidebar glass morphism ══ */
.lp-card {
  position: relative; z-index: 1;
  width: 100%; max-width: 480px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 36px 38px 28px;
  box-sizing: border-box;
  animation: cardIn .35s cubic-bezier(.4,0,.2,1);
}
@keyframes cardIn { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }

/* Green top stripe */
.lp-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, #34d399 25%, #059669 50%, #34d399 75%, transparent);
  border-radius: 24px 24px 0 0;
}

/* ── Brand block — mirrors Sidebar .brand-unit ── */
.lp-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.lp-logo-img {
  width: 80px;
  height: auto;
  object-fit: contain;
  flex-shrink: 0;
}
.lp-brand-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.lp-b1 {
  font-size: .7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: .8px;
  line-height: 1.3;
}
.lp-b2 {
  font-size: .88rem;
  font-weight: 800;
  color: #059669;
  letter-spacing: -.3px;
  line-height: 1.3;
}

/* ── Form heading ── */
.lp-form-hd { margin-bottom: 18px; }
.lp-form-title { font-size: 1.18rem; font-weight: 800; color: #0f172a; margin: 0 0 4px; letter-spacing: -.45px; }
.lp-form-sub   { font-size: .82rem; color: #64748b; margin: 0; }

/* ── Form layout ── */
.lp-form { display: flex; flex-direction: column; gap: 13px; }
.lf-group { display: flex; flex-direction: column; gap: 5px; }
.lf-label-row { display: flex; justify-content: space-between; align-items: center; }
.lf-label { font-size: 11.5px; font-weight: 700; color: #374151; }
.lf-forgot { font-size: 11px; color: #059669; font-weight: 600; text-decoration: none; cursor: pointer; }
.lf-forgot:hover { color: #047857; text-decoration: underline; }

/* Input field */
.lf-field {
  display: flex; align-items: center; gap: 9px;
  border: 1.5px solid rgba(15,23,42,.1); border-radius: 10px;
  padding: 0 12px; background: #f8fafc;
  transition: border-color .14s, background .14s, box-shadow .14s;
  height: 42px;
}
.lf-field.focused { border-color: #059669; background: #fff; box-shadow: 0 0 0 3px rgba(5,150,105,.1); }
.lf-field.err     { border-color: #ef4444; background: #fef2f2; }
.lf-ico { color: #94a3b8; flex-shrink: 0; transition: color .14s; }
.lf-field.focused .lf-ico { color: #059669; }
.lf-inp { flex: 1; border: none; background: transparent; outline: none; font-size: 13.5px; color: #0f172a; padding: 0; font-family: inherit; }
.lf-inp::placeholder { color: #cbd5e1; }
.lf-eye { border: none; background: transparent; cursor: pointer; color: #94a3b8; padding: 4px; display: flex; align-items: center; transition: color .14s; flex-shrink: 0; }
.lf-eye:hover { color: #475569; }
.lf-err { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #ef4444; font-weight: 500; }

/* Checkbox */
.lf-check { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.lf-check-inp { display: none; }
.lf-check-box {
  width: 16px; height: 16px; border-radius: 5px;
  border: 1.5px solid rgba(15,23,42,.14);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all .14s; background: white; color: white;
}
.lf-check-box.on { background: #059669; border-color: #059669; }
.lf-check-lbl { font-size: 12.5px; color: #475569; font-weight: 500; }

/* Login error */
.lf-login-err {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 13px; background: #fef2f2;
  border: 1px solid rgba(239,68,68,.18); border-radius: 8px;
  color: #dc2626; font-size: 13px; font-weight: 500;
  animation: errIn .18s ease;
}
@keyframes errIn { from { opacity:0; transform: translateY(-3px); } to { opacity:1; transform: translateY(0); } }

/* Submit */
.lf-submit {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 13px 20px;
  background: linear-gradient(135deg, #059669, #10b981);
  color: white; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
  box-shadow: 0 4px 16px rgba(5,150,105,.28);
  transition: transform .13s, box-shadow .13s;
}
.lf-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(5,150,105,.38); }
.lf-submit:active:not(:disabled) { transform: translateY(0); }
.lf-submit:disabled { opacity: .62; cursor: not-allowed; }
.lf-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.lf-arrow { transition: transform .18s; }
.lf-submit:hover .lf-arrow { transform: translateX(3px); }

/* Switch hint */
.lf-switch-hint { text-align: center; font-size: 12.5px; color: #94a3b8; margin: 0; font-weight: 500; }

/* Card footer */
.lp-card-foot {
  text-align: center; margin-top: 20px; padding-top: 14px;
  border-top: 1px solid rgba(15,23,42,.06);
  font-size: 10.5px; color: #94a3b8; font-weight: 500;
}

/* ── Forgot modal ── */
.fm-bg {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(15,23,42,.4); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.fm-box {
  background: white; border-radius: 16px;
  border: 1px solid rgba(15,23,42,.08);
  box-shadow: 0 20px 60px rgba(15,23,42,.18);
  padding: 32px 28px; width: min(380px,100%);
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;
  animation: cardIn .22s ease;
}
.fm-ico   { width: 48px; height: 48px; border-radius: 50%; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; }
.fm-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; }
.fm-desc  { font-size: 13px; color: #64748b; margin: 0; line-height: 1.55; }
.fm-email { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; color: #059669; background: #ecfdf5; border: 1px solid rgba(5,150,105,.15); border-radius: 8px; padding: 8px 16px; }

/* ══ RESPONSIVE ══ */
@media (max-width: 520px) {
  .lp { padding: 24px 16px; align-items: flex-start; padding-top: 40px; }
  .lp-card { border-radius: 18px; padding: 28px 22px 22px; }
}
</style>
