<template>
  <div class="page-container">
    <!-- Header -->
    <div class="form-header">
      <div class="header-breadcrumb">Workflows › Inventory › <strong>Phiếu Nhập Hàng (BM2)</strong></div>
      <div class="header-main">
        <h1 class="design-title">Phiếu Nhập Hàng</h1>
        <div class="action-buttons">
          <button class="btn btn-secondary"><Download :size="16" /> Export PDF</button>
          <button class="btn btn-primary" @click="savePhieuNhap" :disabled="submitting">
            <Save :size="16" /> {{ submitting ? 'Đang lưu...' : 'Hoàn tất lập phiếu' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="receipt-layout">
      <!-- Left Column: General Info -->
      <div class="col-info">
        <div class="card shadow-soft border-none">
          <div class="card-header border-none">
            <h3 class="card-title-small"><Info :size="16" /> General Information</h3>
          </div>
          <div class="card-body" style="padding-top: 0;">
            <div class="form-group-minimal">
              <label>MÃ PHIẾU NHẬP</label>
              <input type="text" value="PN-2024-04-001" readonly class="input-readonly" />
            </div>
            
            <div class="form-group-minimal">
              <label>NHÀ CUNG CẤP / ĐỐI TÁC</label>
              <select class="design-select-full">
                <option>Chọn nhà cung cấp...</option>
                <option>Logistics North-Star Ltd</option>
                <option>Kho vận Miền Nam</option>
              </select>
            </div>

            <div class="form-group-minimal">
              <label>KHO NHẬP HÀNG</label>
              <select class="design-select-full">
                <option>District 7 - Main Hub</option>
                <option>Tan Binh Warehouse</option>
              </select>
            </div>

            <div class="form-group-minimal">
              <label>NGÀY NHẬP KHO</label>
              <input type="date" v-model="ngayNhap" class="input-minimal" />
            </div>
          </div>
        </div>

        <!-- Inventory Status Card (Decorative as in design) -->
        <div class="inventory-status-card">
          <div class="status-overlay">
            <span class="status-label">STATUS REPORT</span>
            <h4 class="status-title">Kho bãi: 84% đã đầy</h4>
          </div>
          <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80" alt="Warehouse" />
        </div>
      </div>

      <!-- Right Column: Itemized Entry -->
      <div class="col-table">
        <div class="card shadow-soft border-none">
          <div class="card-header border-none">
            <h3 class="card-title-small"><Package :size="16" /> Danh sách mặt hàng nhập</h3>
            <button class="history-link"><History :size="14" /> Xem lịch sử Revision</button>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-minimal">
              <table>
                <thead>
                  <tr>
                    <th width="60">#</th>
                    <th>MẶT HÀNG</th>
                    <th width="100">ĐƠN VỊ</th>
                    <th width="100">SỐ LƯỢNG</th>
                    <th width="140">ĐƠN GIÁ (đ)</th>
                    <th width="140">THÀNH TIỀN</th>
                    <th width="50"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in chiTiet" :key="i">
                    <td><span class="row-index">{{ String(i + 1).padStart(2, '0') }}</span></td>
                    <td>
                      <select v-model="item.MaMatHang" class="table-select" @change="updateDVT(item)">
                        <option value="">Chọn mặt hàng...</option>
                        <option v-for="m in matHangs" :key="m.MaMatHang" :value="m.MaMatHang">{{ m.TenMatHang }}</option>
                      </select>
                    </td>
                    <td><span class="text-muted-sm">{{ findMatHang(item.MaMatHang)?.dvt?.TenDVT || '—' }}</span></td>
                    <td><input v-model.number="item.SoLuong" type="number" class="table-input" /></td>
                    <td><input v-model.number="item.DonGiaNhap" type="number" class="table-input" /></td>
                    <td class="text-bold">{{ fmtCurrency(item.SoLuong * item.DonGiaNhap) }}</td>
                    <td><button class="remove-btn" @click="chiTiet.splice(i, 1)"><X :size="14" /></button></td>
                  </tr>
                </tbody>
              </table>
              <div class="add-row-area">
                <button class="btn-add-line" @click="addLine"><Plus :size="16" /> Thêm dòng mới</button>
              </div>
            </div>

            <!-- Footer Calculations -->
            <div class="receipt-footer">
              <div class="calc-row"><span class="c-label">Subtotal:</span><span class="c-val">{{ fmtCurrency(tongTien) }}</span></div>
              <div class="calc-row"><span class="c-label">Tax (0%):</span><span class="c-val">0đ</span></div>
              <div class="calc-total"><span class="t-label">Tổng cộng:</span><span class="t-val">{{ fmtCurrency(tongTien) }}</span></div>
            </div>
          </div>
        </div>

        <!-- Feedback notes -->
        <div class="card shadow-soft border-none feedback-card">
          <div class="card-header border-none"><h4 class="card-title-small"><MessageSquare :size="16" /> Ghi chú nghiệp vụ</h4></div>
          <div class="card-body" style="padding-top: 0">
            <textarea placeholder="Nhập các sai sót hoặc tình trạng kiện hàng khi bốc dỡ..." class="minimal-textarea"></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Status Pills -->
    <div class="status-pills-row">
      <div class="pill-card white">
        <div class="pill-icon-box bg-blue"><Truck :size="18" /></div>
        <div class="pill-text"><strong>12 Đang chờ</strong><p>ACTIVE IMPORTS</p></div>
      </div>
      <div class="pill-card white">
        <div class="pill-icon-box bg-teal"><CheckCircle :size="18" /></div>
        <div class="pill-text"><strong>45 Hoàn tất</strong><p>COMPLETED TODAY</p></div>
      </div>
      <div class="pill-card white">
        <div class="pill-icon-box bg-red"><AlertTriangle :size="18" /></div>
        <div class="pill-text"><strong>2 Cảnh báo</strong><p>DISCREPANCIES</p></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';
import { Download, Save, Info, Package, History, Plus, X, MessageSquare, Truck, CheckCircle, AlertTriangle } from 'lucide-vue-next';

const matHangs = ref([]);
const chiTiet = ref([{ MaMatHang: '', SoLuong: 0, DonGiaNhap: 0 }]);
const ngayNhap = ref(new Date().toISOString().split('T')[0]);
const submitting = ref(false);

const tongTien = computed(() => chiTiet.value.reduce((s, i) => s + (i.SoLuong * i.DonGiaNhap), 0));

const addLine = () => chiTiet.value.push({ MaMatHang: '', SoLuong: 0, DonGiaNhap: 0 });

const savePhieuNhap = async () => {
  if (chiTiet.value.some(i => !i.MaMatHang || i.SoLuong <= 0)) return alert('Vui lòng nhập đầy đủ thông tin mặt hàng.');
  submitting.value = true;
  try {
    await api.post('/phieu-nhap', { NgayNhap: ngayNhap.value, items: chiTiet.value });
    alert('Lập phiếu nhập thành công!');
    chiTiet.value = [{ MaMatHang: '', SoLuong: 0, DonGiaNhap: 0 }];
  } catch (e) { alert(e.response?.data?.message || 'Lỗi'); } finally { submitting.value = false; }
};

const findMatHang = (id) => matHangs.value.find(m => m.MaMatHang == id);

const fetchData = async () => { try { const r = await api.get('/mat-hang'); matHangs.value = r.data.data; } catch (e) { console.error(e); } };
function fmtCurrency(n) { return (parseFloat(n) || 0).toLocaleString('vi-VN') + 'đ'; }
onMounted(fetchData);
</script>

<style scoped>
.header-breadcrumb { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px; }
.header-main { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
.design-title { font-size: 2.2rem; font-weight: 800; color: #0c4a6e; letter-spacing: -1px; }
.action-buttons { display: flex; gap: 12px; }

.receipt-layout { display: grid; grid-template-columns: 360px 1fr; gap: 24px; }

.card-title-small { display: flex; align-items: center; gap: 10px; font-size: 1rem; font-weight: 700; color: #075985; }
.form-group-minimal { margin-bottom: 20px; }
.form-group-minimal label { display: block; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 0.5px; }
.input-readonly { width: 100%; border: none; background: #f1f5f9; padding: 12px 16px; border-radius: 12px; font-weight: 700; color: var(--text-muted); }
.design-select-full { width: 100%; border: none; background: #eff6ff; padding: 12px 16px; border-radius: 12px; font-weight: 600; color: #1e40af; appearance: none; }
.input-minimal { width: 100%; border: 1px solid var(--gray-200); padding: 12px 16px; border-radius: 12px; font-weight: 600; }

.inventory-status-card { margin-top: 24px; border-radius: 24px; overflow: hidden; position: relative; height: 180px; }
.inventory-status-card img { width: 100%; height: 100%; object-fit: cover; }
.status-overlay { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(7, 89, 133, 0.8) 0%, transparent 80%); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; color: white; }
.status-label { font-size: 0.6rem; font-weight: 800; opacity: 0.8; letter-spacing: 1px; }
.status-title { font-size: 1.1rem; font-weight: 800; }

.col-table { display: flex; flex-direction: column; gap: 24px; }
.history-link { background: none; border: none; font-size: 0.75rem; font-weight: 700; color: #0369a1; cursor: pointer; display: flex; align-items: center; gap: 4px; }

.table-minimal th { border-bottom: 1px solid #f1f5f9; background: white; padding-bottom: 12px; }
.table-minimal td { padding: 12px 16px; border-bottom: 1px solid #f8fafc; }
.row-index { font-weight: 700; color: var(--text-muted); font-size: 0.8rem; }
.table-select { border: none; font-weight: 800; color: #0f172a; width: 100%; outline: none; }
.table-input { border: none; font-weight: 700; width: 80px; outline: none; }
.text-muted-sm { color: var(--text-muted); font-size: 0.85rem; }
.text-bold { font-weight: 800; color: #0c4a6e; }
.remove-btn { border: none; background: #fff5f5; color: #f87171; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; }

.add-row-area { padding: 20px; text-align: left; }
.btn-add-line { background: none; border: 1.5px solid #e0e7ff; color: #4338ca; padding: 10px 24px; border-radius: 30px; font-weight: 800; font-size: 0.85rem; cursor: pointer; }

.receipt-footer { padding: 30px; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; border-top: 1px solid #f1f5f9; }
.calc-row { width: 240px; display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 700; color: var(--text-muted); }
.calc-total { width: 240px; display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 2px solid #f1f5f9; }
.t-label { font-size: 1.1rem; font-weight: 800; color: #075985; }
.t-val { font-size: 1.5rem; font-weight: 800; color: #0369a1; }

.feedback-card { margin-top: 0; }
.minimal-textarea { width: 100%; border: none; background: #f8fafc; border-radius: 12px; padding: 16px; height: 80px; outline: none; font-size: 0.85rem; font-weight: 500; }

.status-pills-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 40px; }
.pill-card { background: white; padding: 20px; border-radius: 20px; display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow-soft); }
.pill-icon-box { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; }
.bg-blue { background: #3b82f6; } .bg-teal { background: #14b8a6; } .bg-red { background: #f87171; }
.pill-text strong { display: block; font-size: 1rem; color: #1e293b; }
.pill-text p { font-size: 0.6rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; }
</style>
