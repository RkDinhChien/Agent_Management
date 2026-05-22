<template>
  <div class="lp">

    <!-- ══ LEFT — Brand panel ══ -->
    <div class="lp-brand">

      <!-- Animated gradient orbs -->
      <div class="lp-orbs">
        <span class="orb o1"></span>
        <span class="orb o2"></span>
        <span class="orb o3"></span>
      </div>

      <!-- Dot grid overlay -->
      <div class="lp-dotgrid" aria-hidden="true"></div>

      <!-- Brand content -->
      <div class="lp-brand-content">
        <!-- Logo -->
        <div class="lp-logo">
          <svg class="lp-mark" viewBox="0 0 26 30" fill="none">
            <path d="M13 2 L24 28" stroke="white" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M13 2 L2 28"  stroke="white" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="6.5" y1="19" x2="19.5" y2="19" stroke="rgba(255,255,255,0.65)" stroke-width="2.4" stroke-linecap="round"/>
            <circle cx="13" cy="2" r="2.2" fill="rgba(255,255,255,0.65)"/>
          </svg>
          <div>
            <span class="lp-wordmark">gentix</span>
            <span class="lp-wsub">Agent Management</span>
          </div>
        </div>

        <!-- Headline -->
        <div class="lp-headline">
          <h2 class="lp-h">Quản lý đại lý<br/><em class="lp-hl">thông minh hơn.</em></h2>
          <p class="lp-p">Công nợ, hàng hóa, báo cáo — quản lý toàn bộ hệ thống phân phối trong một màn hình duy nhất.</p>
        </div>

        <!-- Floating app UI mockup -->
        <div class="lp-mockup">
          <!-- Main agent card -->
          <div class="mk-card">
            <div class="mk-hd">
              <div class="mk-av"></div>
              <div class="mk-info">
                <span class="mk-name">Đại lý Tuấn Phát</span>
                <span class="mk-sub">Quận 1 · Loại 1 · 3 năm</span>
              </div>
              <span class="mk-on"><span class="mk-ondot"></span>Hoạt động</span>
            </div>
            <div class="mk-nums">
              <div><strong>124 Tr</strong><span>Doanh thu</span></div>
              <div class="mk-warn"><strong>32 Tr</strong><span>Công nợ</span></div>
              <div><strong>78%</strong><span>KPI</span></div>
            </div>
            <div class="mk-prog-wrap">
              <div class="mk-prog"><div class="mk-prog-fill"></div></div>
              <span class="mk-prog-lbl">78%</span>
            </div>
          </div>

          <!-- Floating notification toast -->
          <div class="mk-toast">
            <span class="mk-dot"></span>
            Đại lý <b>Lan Anh</b> vừa thanh toán <b>+15 Tr</b>
          </div>

          <!-- Mini floating chart -->
          <div class="mk-chart">
            <div class="mc-b" style="height:40%"></div>
            <div class="mc-b" style="height:62%"></div>
            <div class="mc-b" style="height:48%"></div>
            <div class="mc-b hi" style="height:90%"></div>
            <div class="mc-b" style="height:68%"></div>
            <div class="mc-b" style="height:55%"></div>
          </div>

          <!-- Floating badge -->
          <div class="mk-badge">
            <span>↑</span> 17.5% so tháng trước
          </div>
        </div>

        <!-- Stats glass card -->
        <div class="lp-stats">
          <div class="lp-stat">
            <strong>124<span>+</span></strong>
            <span>Đại lý</span>
          </div>
          <div class="lp-stat-div"></div>
          <div class="lp-stat">
            <strong>₫2.4<span>Tỷ</span></strong>
            <span>Doanh thu</span>
          </div>
          <div class="lp-stat-div"></div>
          <div class="lp-stat">
            <strong>6<span>Quận</span></strong>
            <span>Phân phối</span>
          </div>
        </div>

      </div>

      <!-- Bottom -->
      <div class="lp-brand-foot">
        <span class="lp-secure"><ShieldCheck :size="12"/> Bảo mật SSL · HTTPS · Mã hóa dữ liệu</span>
        <span class="lp-copy">SE104 · UIT 2026</span>
      </div>
    </div>

    <!-- ══ RIGHT — Form panel ══ -->
    <div class="lp-right">
      <div class="lp-right-bg"></div>

      <div class="lp-card">

        <!-- Small logo -->
        <div class="lp-card-logo">
          <svg class="lp-card-mark" viewBox="0 0 26 30" fill="none">
            <path d="M13 2 L24 28" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M13 2 L2 28"  stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="6.5" y1="19" x2="19.5" y2="19" stroke="#059669" stroke-width="2.4" stroke-linecap="round"/>
            <circle cx="13" cy="2" r="2.2" fill="#059669"/>
          </svg>
          <span class="lp-card-brand">gentix</span>
        </div>

        <!-- Tab switcher -->
        <div class="lp-tabs">
          <div class="tabs-track">
            <div class="tabs-pill" :class="activeTab === 'login' ? 'left' : 'right'"></div>
            <button class="tab-btn" :class="{ active: activeTab === 'login' }" @click="switchTab('login')">
              <LogIn :size="13"/> Đăng nhập
            </button>
            <button class="tab-btn" :class="{ active: activeTab === 'register' }" @click="switchTab('register')">
              <UserPlus :size="13"/> Đăng ký
            </button>
          </div>
        </div>

        <!-- ── LOGIN FORM ── -->
        <Transition :name="'tf-' + tabDir" mode="out-in">
          <div v-if="activeTab === 'login'" key="login">

            <div class="lp-form-hd">
              <h1 class="lp-form-title">Chào mừng trở lại 👋</h1>
              <p class="lp-form-sub">Đăng nhập để tiếp tục quản lý hệ thống</p>
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
                Chưa có tài khoản?
                <button type="button" class="lf-switch-btn" @click="switchTab('register')">Đăng ký ngay</button>
              </p>
            </form>
          </div>

          <!-- ── REGISTER FORM ── -->
          <div v-else key="register">

            <!-- Success state -->
            <Transition name="suc-fade" mode="out-in">
              <div v-if="regSuccess" class="reg-success">
                <div class="rs-icon"><CheckCircle2 :size="28"/></div>
                <h3 class="rs-title">Đăng ký thành công!</h3>
                <p class="rs-sub">Tài khoản đã được tạo. Đang chuyển về đăng nhập…</p>
              </div>

              <div v-else key="reg-form">
                <div class="lp-form-hd">
                  <h1 class="lp-form-title">Tạo tài khoản mới</h1>
                  <p class="lp-form-sub">Điền thông tin bên dưới để bắt đầu sử dụng</p>
                </div>

                <form @submit.prevent="handleRegister" class="lp-form" novalidate>

                  <!-- Họ tên + Username side by side -->
                  <div class="lf-row2">
                    <div class="lf-group">
                      <label class="lf-label">Họ và tên <span class="req">*</span></label>
                      <div class="lf-field sm" :class="{ focused: rnFocus, err: regErrors.hoTen }">
                        <UserRound :size="13" class="lf-ico"/>
                        <input v-model="regForm.hoTen" type="text" class="lf-inp"
                          placeholder="Nguyễn Văn A"
                          @focus="rnFocus=true; delete regErrors.hoTen" @blur="rnFocus=false"/>
                      </div>
                      <span class="lf-err" v-if="regErrors.hoTen"><AlertCircle :size="11"/>{{ regErrors.hoTen }}</span>
                    </div>
                    <div class="lf-group">
                      <label class="lf-label">Tên đăng nhập <span class="req">*</span></label>
                      <div class="lf-field sm" :class="{ focused: ruFocus, err: regErrors.tenDangNhap }">
                        <AtSign :size="13" class="lf-ico"/>
                        <input v-model="regForm.tenDangNhap" type="text" class="lf-inp"
                          placeholder="admin123"
                          @focus="ruFocus=true; delete regErrors.tenDangNhap" @blur="ruFocus=false"/>
                      </div>
                      <span class="lf-err" v-if="regErrors.tenDangNhap"><AlertCircle :size="11"/>{{ regErrors.tenDangNhap }}</span>
                    </div>
                  </div>

                  <div class="lf-group">
                    <label class="lf-label">Email <span class="req">*</span></label>
                    <div class="lf-field" :class="{ focused: reFocus, err: regErrors.email }">
                      <Mail :size="14" class="lf-ico"/>
                      <input v-model="regForm.email" type="email" class="lf-inp"
                        placeholder="ten@example.com" autocomplete="email"
                        @focus="reFocus=true; delete regErrors.email" @blur="reFocus=false"/>
                    </div>
                    <span class="lf-err" v-if="regErrors.email"><AlertCircle :size="11"/>{{ regErrors.email }}</span>
                  </div>

                  <div class="lf-group">
                    <label class="lf-label">Mật khẩu <span class="req">*</span></label>
                    <div class="lf-field" :class="{ focused: rpFocus, err: regErrors.matKhau }">
                      <Lock :size="14" class="lf-ico"/>
                      <input v-model="regForm.matKhau" :type="showRegPass ? 'text' : 'password'"
                        class="lf-inp" placeholder="Tối thiểu 6 ký tự"
                        @focus="rpFocus=true; delete regErrors.matKhau" @blur="rpFocus=false"/>
                      <button type="button" class="lf-eye" @click="showRegPass=!showRegPass" tabindex="-1">
                        <Eye v-if="!showRegPass" :size="14"/><EyeOff v-else :size="14"/>
                      </button>
                    </div>
                    <!-- Strength bar -->
                    <div class="str-bar" v-if="regForm.matKhau">
                      <div class="str-track">
                        <div class="str-fill" :style="{ width: (passStrength/4*100)+'%', background: strColor }"></div>
                      </div>
                      <span class="str-lbl" :style="{ color: strColor }">{{ strLabel }}</span>
                    </div>
                    <span class="lf-err" v-if="regErrors.matKhau"><AlertCircle :size="11"/>{{ regErrors.matKhau }}</span>
                  </div>

                  <div class="lf-group">
                    <label class="lf-label">Xác nhận mật khẩu <span class="req">*</span></label>
                    <div class="lf-field" :class="{ focused: rcFocus, err: regErrors.xacNhan }">
                      <Lock :size="14" class="lf-ico"/>
                      <input v-model="regForm.xacNhan" :type="showRegConf ? 'text' : 'password'"
                        class="lf-inp" placeholder="Nhập lại mật khẩu"
                        @focus="rcFocus=true; delete regErrors.xacNhan" @blur="rcFocus=false"/>
                      <button type="button" class="lf-eye" @click="showRegConf=!showRegConf" tabindex="-1">
                        <Eye v-if="!showRegConf" :size="14"/><EyeOff v-else :size="14"/>
                      </button>
                    </div>
                    <span class="lf-err" v-if="regErrors.xacNhan"><AlertCircle :size="11"/>{{ regErrors.xacNhan }}</span>
                  </div>

                  <button type="submit" class="lf-submit" :disabled="isRegLoading">
                    <Loader2 v-if="isRegLoading" :size="15" class="lf-spin"/>
                    <span>{{ isRegLoading ? 'Đang tạo tài khoản…' : 'Tạo tài khoản' }}</span>
                    <Sparkles v-if="!isRegLoading" :size="15" class="lf-arrow"/>
                  </button>

                  <p class="lf-switch-hint">
                    Đã có tài khoản?
                    <button type="button" class="lf-switch-btn" @click="switchTab('login')">Đăng nhập</button>
                  </p>
                </form>
              </div>
            </Transition>
          </div>
        </Transition>

        <p class="lp-card-foot">© 2026 gentix · SE104 · Nhập môn Công nghệ Phần mềm</p>
      </div>
    </div>

  </div>

  <!-- ── Forgot modal ── -->
  <Teleport to="body">
    <div v-if="showForgotModal" class="fm-bg" @click.self="showForgotModal=false">
      <div class="fm-box">
        <div class="fm-ico"><Lock :size="20"/></div>
        <h4 class="fm-title">Quên mật khẩu?</h4>
        <p class="fm-desc">Vui lòng liên hệ quản trị viên để đặt lại mật khẩu cho tài khoản của bạn.</p>
        <div class="fm-email"><Mail :size="13"/> admin@gentix.vn</div>
        <button class="lf-submit" style="margin-top:18px;width:100%" @click="showForgotModal=false">Đã hiểu</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import {
  User, UserRound, Lock, Eye, EyeOff, Check, AlertCircle,
  CheckCircle2, ArrowRight, Loader2, LogIn, UserPlus,
  Mail, AtSign, ShieldCheck, Sparkles,
} from 'lucide-vue-next';

const router    = useRouter();
const authStore = useAuthStore();

/* ── Tab state ── */
const activeTab = ref('login');
const tabDir    = ref('left');
const switchTab = (tab) => {
  tabDir.value = tab === 'register' ? 'left' : 'right';
  activeTab.value = tab;
};

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

/* ── Register form ── */
const regForm    = reactive({ hoTen: '', tenDangNhap: '', email: '', matKhau: '', xacNhan: '' });
const regErrors  = reactive({});
const showRegPass  = ref(false);
const showRegConf  = ref(false);
const isRegLoading = ref(false);
const regSuccess   = ref(false);
const rnFocus = ref(false); const ruFocus = ref(false);
const reFocus = ref(false); const rpFocus = ref(false); const rcFocus = ref(false);

const passStrength = computed(() => {
  const p = regForm.matKhau;
  if (!p) return 0;
  let s = 0;
  if (p.length >= 6)  s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
});
const strColor = computed(() => ['#e2e8f0','#ef4444','#f59e0b','#3b82f6','#10b981'][passStrength.value]);
const strLabel = computed(() => ['','Yếu','Trung bình','Khá','Mạnh'][passStrength.value]);

const validateReg = () => {
  const e = {};
  if (!regForm.hoTen.trim()) e.hoTen = 'Nhập họ và tên';
  if (!regForm.tenDangNhap.trim() || regForm.tenDangNhap.length < 4) e.tenDangNhap = 'Tối thiểu 4 ký tự';
  if (!regForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) e.email = 'Email không hợp lệ';
  if (!regForm.matKhau || regForm.matKhau.length < 6) e.matKhau = 'Tối thiểu 6 ký tự';
  if (regForm.xacNhan !== regForm.matKhau) e.xacNhan = 'Mật khẩu không khớp';
  Object.keys(regErrors).forEach(k => delete regErrors[k]);
  Object.assign(regErrors, e);
  return Object.keys(e).length === 0;
};

const handleRegister = async () => {
  if (!validateReg()) return;
  isRegLoading.value = true;
  await new Promise(r => setTimeout(r, 1400));
  isRegLoading.value = false;
  regSuccess.value = true;
  setTimeout(() => {
    regSuccess.value = false;
    form.tenDangNhap = regForm.tenDangNhap;
    switchTab('login');
  }, 2600);
};
</script>

<style scoped>
/* ══ ROOT ══ */
.lp {
  display: flex; min-height: 100vh;
  font-family: 'Inter','Outfit',ui-sans-serif,system-ui,sans-serif;
}

/* ══ LEFT BRAND PANEL ══ */
.lp-brand {
  width: 44%; min-height: 100vh;
  background: linear-gradient(160deg, #047857, #059669, #10b981, #34d399, #059669, #047857);
  background-size: 300% 300%;
  animation: gradShift 14s ease infinite;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
  padding: 48px 52px; box-sizing: border-box;
}
@keyframes gradShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Floating orbs */
.lp-orbs { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.orb { position: absolute; border-radius: 50%; filter: blur(55px); }
.o1 { width: 340px; height: 340px; top: -120px; right: -100px; background: rgba(255,255,255,.08); animation: orbFloat 9s ease-in-out infinite; }
.o2 { width: 220px; height: 220px; bottom: 8%; left: -70px; background: rgba(255,255,255,.06); animation: orbFloat 11s ease-in-out infinite 2s; }
.o3 { width: 160px; height: 160px; top: 42%; right: 8%; background: rgba(52,211,153,.15); animation: orbFloat 13s ease-in-out infinite 4s; }
@keyframes orbFloat {
  0%,100% { transform: translateY(0) scale(1); }
  33%     { transform: translateY(-22px) scale(1.05); }
  66%     { transform: translateY(12px) scale(.96); }
}

/* Dot grid overlay */
.lp-dotgrid {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image: radial-gradient(rgba(255,255,255,.2) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
}

/* Brand content */
.lp-brand-content {
  position: relative; z-index: 1;
  flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 22px;
}

.lp-logo { display: flex; align-items: center; gap: 12px; }
.lp-mark { width: 30px; height: 36px; flex-shrink: 0; }
.lp-wordmark { display: block; font-size: 1.5rem; font-weight: 800; color: white; letter-spacing: -.6px; line-height: 1.1; }
.lp-wsub    { display: block; font-size: .6rem; color: rgba(255,255,255,.6); font-weight: 700; text-transform: uppercase; letter-spacing: 1.4px; }

.lp-h { font-size: 2rem; font-weight: 800; color: white; line-height: 1.2; letter-spacing: -.7px; margin: 0 0 10px; }
.lp-p { font-size: .88rem; color: rgba(255,255,255,.72); line-height: 1.65; margin: 0; }

/* Stats glass strip */
.lp-stats {
  display: flex; align-items: center;
  background: rgba(255,255,255,.13);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 14px; padding: 16px 20px;
  backdrop-filter: blur(12px);
}
.lp-stat { flex: 1; text-align: center; }
.lp-stat strong { display: block; font-size: 1.35rem; font-weight: 900; color: white; line-height: 1; }
.lp-stat strong span { font-size: .7rem; font-weight: 700; opacity: .8; margin-left: 2px; }
.lp-stat span { display: block; font-size: .68rem; color: rgba(255,255,255,.62); font-weight: 600; margin-top: 4px; }
.lp-stat-div { width: 1px; height: 32px; background: rgba(255,255,255,.2); }

/* Headline highlight */
.lp-hl {
  font-style: normal;
  position: relative;
  display: inline-block;
}
.lp-hl::after {
  content: '';
  position: absolute;
  left: -3px; right: -3px; bottom: 3px;
  height: 10px;
  background: rgba(255,255,255,.22);
  border-radius: 4px;
  z-index: -1;
}

/* ── App UI Mockup ── */
.lp-mockup {
  position: relative;
  height: 196px;
  margin: 0 -6px;
}

.mk-card {
  position: absolute;
  left: 0; right: 52px; top: 4px;
  background: rgba(255,255,255,.96);
  border-radius: 16px;
  padding: 15px 17px;
  box-shadow: 0 16px 48px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.1);
  animation: mkFloat 5s ease-in-out infinite;
  transform: rotate(-1deg);
  z-index: 2;
}
@keyframes mkFloat {
  0%,100% { transform: rotate(-1deg) translateY(0); }
  50%     { transform: rotate(-.4deg) translateY(-9px); }
}

.mk-hd   { display: flex; align-items: center; gap: 9px; margin-bottom: 11px; }
.mk-av   { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; background: linear-gradient(135deg,#059669,#34d399); }
.mk-info { flex: 1; min-width: 0; }
.mk-name { display: block; font-size: 12.5px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mk-sub  { display: block; font-size: 9.5px; color: #64748b; margin-top: 1px; }
.mk-on   { font-size: 9.5px; font-weight: 700; color: #059669; display: flex; align-items: center; gap: 4px; white-space: nowrap; flex-shrink: 0; }
.mk-ondot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: mkPulse 1.8s ease-in-out infinite; display: inline-block; }

.mk-nums { display: flex; margin-bottom: 10px; }
.mk-nums > div { flex: 1; text-align: center; border-right: 1px solid rgba(15,23,42,.06); padding: 0 4px; }
.mk-nums > div:last-child { border-right: none; }
.mk-nums strong { display: block; font-size: 13px; font-weight: 800; color: #0f172a; }
.mk-nums span   { display: block; font-size: 9px; color: #94a3b8; font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: .3px; }
.mk-warn strong { color: #d97706; }

.mk-prog-wrap { display: flex; align-items: center; gap: 7px; }
.mk-prog      { flex: 1; height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
.mk-prog-fill { height: 100%; width: 78%; background: linear-gradient(90deg,#34d399,#059669); border-radius: 3px; animation: mkProgIn 1s .6s ease both; }
@keyframes mkProgIn { from { width: 0; } to { width: 78%; } }
.mk-prog-lbl  { font-size: 10px; font-weight: 700; color: #059669; flex-shrink: 0; }

/* Toast */
.mk-toast {
  position: absolute;
  right: 0; bottom: 24px;
  background: white;
  border-radius: 12px;
  padding: 9px 12px;
  font-size: 11px; color: #0f172a;
  box-shadow: 0 8px 28px rgba(0,0,0,.14);
  display: flex; align-items: center; gap: 7px;
  white-space: nowrap;
  animation: mkToast 6s ease-in-out infinite 1.4s;
  z-index: 3;
  border: 1px solid rgba(16,185,129,.12);
}
.mk-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #10b981; flex-shrink: 0;
  animation: mkPulse 1.8s ease-in-out infinite;
}
@keyframes mkToast  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes mkPulse  { 0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,.5); } 60% { box-shadow: 0 0 0 5px rgba(16,185,129,0); } }

/* Mini chart */
.mk-chart {
  position: absolute;
  left: 14px; bottom: 0;
  display: flex; align-items: flex-end; gap: 5px;
  height: 52px; padding: 9px 12px 6px;
  background: rgba(255,255,255,.82);
  backdrop-filter: blur(10px);
  border-radius: 11px;
  box-shadow: 0 4px 18px rgba(0,0,0,.1);
  animation: mkChart 7s ease-in-out infinite .6s;
  z-index: 1;
}
@keyframes mkChart { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.mc-b    { width: 9px; border-radius: 3px 3px 0 0; background: rgba(5,150,105,.25); }
.mc-b.hi { background: #059669; }

/* Floating badge */
.mk-badge {
  position: absolute;
  right: 8px; top: 4px;
  background: linear-gradient(135deg,#059669,#10b981);
  color: white;
  font-size: 10px; font-weight: 700;
  padding: 5px 10px;
  border-radius: 20px;
  box-shadow: 0 4px 14px rgba(5,150,105,.35);
  animation: mkBadge 5s ease-in-out infinite 2s;
  z-index: 4;
}
@keyframes mkBadge { 0%,100% { transform: translateY(0) rotate(1deg); } 50% { transform: translateY(-8px) rotate(0deg); } }

/* Brand footer */
.lp-brand-foot { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; }
.lp-secure { display: flex; align-items: center; gap: 5px; font-size: .68rem; color: rgba(255,255,255,.5); font-weight: 600; }
.lp-copy   { font-size: .68rem; color: rgba(255,255,255,.4); font-weight: 600; }

/* ══ RIGHT PANEL ══ */
.lp-right { flex: 1; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 32px 24px; position: relative; overflow-y: auto; }
.lp-right-bg { position: absolute; inset: 0; background-image: radial-gradient(rgba(5,150,105,.08) 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; z-index: 0; }

.lp-card {
  position: relative; z-index: 1;
  width: 100%; max-width: 520px;
  background: linear-gradient(155deg, #f0fdf9 0%, #ffffff 55%);
  border-radius: 22px;
  border: 1px solid rgba(5,150,105,.1);
  box-shadow: 0 4px 28px rgba(15,23,42,.08), 0 1px 4px rgba(15,23,42,.04);
  padding: 38px 40px 30px;
  box-sizing: border-box;
  animation: cardIn .4s cubic-bezier(.4,0,.2,1);
}
@keyframes cardIn { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }

/* Small logo */
.lp-card-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 22px; }
.lp-card-mark  { width: 20px; height: 24px; }
.lp-card-brand { font-size: 1rem; font-weight: 800; color: #0f172a; letter-spacing: -.4px; }

/* ── Tabs ── */
.lp-tabs { margin-bottom: 24px; }
.tabs-track { position: relative; display: flex; background: #f1f5f9; border-radius: 11px; padding: 4px; }
.tabs-pill {
  position: absolute; top: 4px; bottom: 4px;
  width: calc(50% - 4px);
  background: white; border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15,23,42,.09);
  transition: transform .26s cubic-bezier(.4,0,.2,1);
}
.tabs-pill.left  { transform: translateX(0); }
.tabs-pill.right { transform: translateX(100%); }
.tab-btn {
  flex: 1; position: relative; z-index: 1; border: none; background: transparent;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 13px; font-weight: 600; padding: 9px 12px;
  color: #94a3b8; cursor: pointer; transition: color .2s; font-family: inherit; border-radius: 7px;
}
.tab-btn.active { color: #0f172a; }

/* ── Form heading ── */
.lp-form-hd { margin-bottom: 20px; }
.lp-form-title { font-size: 1.35rem; font-weight: 800; color: #0f172a; margin: 0 0 5px; letter-spacing: -.5px; }
.lp-form-sub   { font-size: .85rem; color: #64748b; margin: 0; }

/* ── Form fields ── */
.lp-form { display: flex; flex-direction: column; gap: 14px; }
.lf-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.lf-group { display: flex; flex-direction: column; gap: 5px; }
.lf-label-row { display: flex; justify-content: space-between; align-items: center; }
.lf-label { font-size: 12px; font-weight: 700; color: #374151; }
.req { color: #ef4444; }
.lf-forgot { font-size: 11.5px; color: #059669; font-weight: 600; text-decoration: none; cursor: pointer; }
.lf-forgot:hover { color: #047857; }

.lf-field {
  display: flex; align-items: center; gap: 9px;
  border: 1.5px solid rgba(15,23,42,.1); border-radius: 10px;
  padding: 0 12px; background: #f8fafc;
  transition: border-color .15s, background .15s, box-shadow .15s;
}
.lf-field.sm { }
.lf-field.focused { border-color: #059669; background: #fff; box-shadow: 0 0 0 3px rgba(5,150,105,.1); }
.lf-field.err     { border-color: #ef4444; background: #fef2f2; }
.lf-ico { color: #94a3b8; flex-shrink: 0; transition: color .15s; }
.lf-field.focused .lf-ico { color: #059669; }
.lf-inp { flex: 1; border: none; background: transparent; outline: none; font-size: 13.5px; color: #0f172a; padding: 11px 0; font-family: inherit; }
.lf-inp::placeholder { color: #cbd5e1; }
.lf-eye { border: none; background: transparent; cursor: pointer; color: #94a3b8; padding: 4px; display: flex; align-items: center; transition: color .15s; flex-shrink: 0; }
.lf-eye:hover { color: #475569; }
.lf-err { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #ef4444; font-weight: 500; }

/* Password strength */
.str-bar { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.str-track { flex: 1; height: 3px; background: #e2e8f0; border-radius: 2px; overflow: hidden; }
.str-fill  { height: 100%; border-radius: 2px; transition: width .3s ease, background .3s; }
.str-lbl   { font-size: 10.5px; font-weight: 700; white-space: nowrap; transition: color .3s; min-width: 60px; text-align: right; }

/* Remember me */
.lf-check { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.lf-check-inp { display: none; }
.lf-check-box {
  width: 17px; height: 17px; border-radius: 5px;
  border: 1.5px solid rgba(15,23,42,.15);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all .15s; background: white; color: white;
}
.lf-check-box.on { background: #059669; border-color: #059669; }
.lf-check-lbl { font-size: 13px; color: #475569; font-weight: 500; }

/* Login error */
.lf-login-err { display: flex; align-items: center; gap: 8px; padding: 10px 13px; background: #fef2f2; border: 1px solid rgba(239,68,68,.2); border-radius: 8px; color: #dc2626; font-size: 13px; font-weight: 500; animation: errIn .2s ease; }
@keyframes errIn { from { opacity:0; transform: translateY(-4px); } to { opacity:1; transform: translateY(0); } }

/* Submit button */
.lf-submit {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 13px 20px;
  background: linear-gradient(135deg, #059669, #10b981);
  color: white; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
  box-shadow: 0 4px 16px rgba(5,150,105,.28);
  transition: transform .15s, box-shadow .15s;
}
.lf-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(5,150,105,.38); }
.lf-submit:active:not(:disabled) { transform: translateY(0); }
.lf-submit:disabled { opacity: .65; cursor: not-allowed; }
.lf-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.lf-arrow { transition: transform .2s; }
.lf-submit:hover .lf-arrow { transform: translateX(3px); }

/* Switch hint */
.lf-switch-hint { text-align: center; font-size: 12.5px; color: #94a3b8; margin: 0; font-weight: 500; }
.lf-switch-btn { background: none; border: none; color: #059669; font-weight: 700; cursor: pointer; font-family: inherit; font-size: inherit; padding: 0; }
.lf-switch-btn:hover { color: #047857; text-decoration: underline; }

/* Register success */
.reg-success {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 28px 16px; gap: 10px; animation: cardIn .3s ease;
}
.rs-icon { width: 60px; height: 60px; border-radius: 50%; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; }
.rs-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0; }
.rs-sub   { font-size: .85rem; color: #64748b; margin: 0; line-height: 1.55; }

/* Card footer */
.lp-card-foot { text-align: center; margin-top: 22px; padding-top: 16px; border-top: 1px solid rgba(15,23,42,.06); font-size: 11px; color: #94a3b8; font-weight: 500; }

/* ── Forgot modal ── */
.fm-bg { position: fixed; inset: 0; z-index: 9999; background: rgba(15,23,42,.45); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.fm-box { background: white; border-radius: 16px; border: 1px solid rgba(15,23,42,.08); box-shadow: 0 20px 60px rgba(15,23,42,.18); padding: 32px 28px; width: min(380px,100%); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; animation: cardIn .25s ease; }
.fm-ico   { width: 48px; height: 48px; border-radius: 50%; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; }
.fm-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; }
.fm-desc  { font-size: 13px; color: #64748b; margin: 0; line-height: 1.55; }
.fm-email { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; color: #059669; background: #ecfdf5; border: 1px solid rgba(5,150,105,.15); border-radius: 8px; padding: 8px 16px; }

/* ── Tab form transitions ── */
.tf-left-enter-active, .tf-left-leave-active,
.tf-right-enter-active,.tf-right-leave-active { transition: all .22s cubic-bezier(.4,0,.2,1); }
.tf-left-enter-from  { opacity:0; transform: translateX(18px); }
.tf-left-leave-to    { opacity:0; transform: translateX(-18px); }
.tf-right-enter-from { opacity:0; transform: translateX(-18px); }
.tf-right-leave-to   { opacity:0; transform: translateX(18px); }

.suc-fade-enter-active,.suc-fade-leave-active { transition: all .2s ease; }
.suc-fade-enter-from,.suc-fade-leave-to { opacity:0; transform: scale(.96); }

/* ══ RESPONSIVE ══ */
@media (max-width: 960px) {
  .lp { flex-direction: column; }
  .lp-brand { width: 100%; min-height: auto; padding: 36px 28px 28px; }
  .lp-brand-content { justify-content: flex-start; }
  .lp-h { font-size: 1.5rem; }
  .lp-features { display: none; }
  .lp-right { padding: 28px 16px; }
  .lp-card  { padding: 28px 28px 22px; }
}
@media (max-width: 480px) {
  .lf-row2  { grid-template-columns: 1fr; }
  .lp-card  { border-radius: 14px; }
  .lp-card-foot { margin-top: 16px; }
}
</style>
