<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Danh Sách Đại Lý</h1>
        <p>Quản lý và theo dõi thông tin tất cả các đối tác kinh doanh</p>
      </div>
      <div class="header-actions">
        <button v-if="selectedCount > 0" class="btn-delete-bulk" @click="deleteBulk" title="Xóa các mục được chọn">
          <svg class="icon-delete" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Xóa ({{ selectedCount }})
        </button>
        <button class="btn-refresh" @click="fetchData" :disabled="loading" title="Làm mới dữ liệu">
          <svg class="icon-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36M20.49 15a9 9 0 0 1-14.85 3.36"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng Đại Lý</p>
          <h3 class="stat-value">{{ daiLys.length }}</h3>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Khu Vực Phụ</p>
          <h3 class="stat-value">{{ uniqueAreas }}</h3>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
            <circle cx="12" cy="12" r="1"></circle>
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6m-15.78 7.78l4.24-4.24m5.08 0l4.24 4.24"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng Công Nợ</p>
          <h3 class="stat-value">{{ (totalDebt / 1000000).toFixed(0) }}Tr</h3>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Công Nợ Lớn</p>
          <h3 class="stat-value">{{ highDebtCount }}</h3>
        </div>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="control-panel">
      <div class="search-wrapper">
        <input 
          type="text" 
          v-model="searchText"
          @input="currentPage = 1"
          placeholder="Tìm tên, điện thoại, email..."
          class="search-input"
        />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>

      <div class="filter-buttons">
        <button class="filter-btn" @click="showFilters = !showFilters" :class="{ active: showFilters }" title="Mở/đóng bộ lọc nâng cao">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Bộ Lọc {{ activeFilters > 0 ? `(${activeFilters})` : '' }}
        </button>
        <button class="filter-btn secondary" @click="toggleColumnSettings" title="Chọn hiển thị cột">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Cột
        </button>
        <button class="filter-btn secondary" @click="exportToExcel" title="Xuất tệp Excel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Excel
        </button>
        <button class="filter-btn secondary" @click="showAddModal = true" title="Thêm đại lý mới">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Thêm
        </button>
      </div>
    </div>

    <!-- Column Visibility Menu -->
    <div v-if="showColumnSettings" class="column-settings">
      <p class="settings-title">Chọn cột hiển thị</p>
      <div class="settings-grid">
        <label class="setting-item">
          <input type="checkbox" v-model="visibleColumns.loai" />
          <span>Loại</span>
        </label>
        <label class="setting-item">
          <input type="checkbox" v-model="visibleColumns.quan" />
          <span>Khu Vực</span>
        </label>
        <label class="setting-item">
          <input type="checkbox" v-model="visibleColumns.lienhe" />
          <span>Liên Hệ</span>
        </label>
        <label class="setting-item">
          <input type="checkbox" v-model="visibleColumns.duno" />
          <span>Dự Nợ</span>
        </label>
      </div>
      <button class="btn-save-settings" @click="toggleColumnSettings">✓ Lưu</button>
    </div>

    <!-- Advanced Filters -->
    <div v-if="showFilters" class="filter-panel">
      <div class="filter-row">
        <div class="filter-group">
          <label>Loại Đại Lý</label>
          <select v-model="filterLoai" class="filter-select">
            <option value="">Tất Cả</option>
            <option value="1">Loại 1</option>
            <option value="2">Loại 2</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Khu Vực</label>
          <select v-model="filterQuan" class="filter-select">
            <option value="">Tất Cả</option>
            <option v-for="q in quans" :key="q.MaQuan" :value="q.MaQuan">
              {{ q.TenQuan }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label>Trạng Thái Nợ</label>
          <select v-model="filterDebt" class="filter-select">
            <option value="">Tất Cả</option>
            <option value="paid">Đã Thanh Toán</option>
            <option value="unpaid">Còn Nợ</option>
            <option value="high">Nợ Lớn (>40Tr)</option>
          </select>
        </div>
        <button class="btn-reset" @click="resetFilters">↻ Reset</button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-wrapper">
      <div v-if="loading" class="loading-skeleton">
        <div class="skeleton-row"></div>
        <div class="skeleton-row"></div>
        <div class="skeleton-row"></div>
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th width="5%"><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th width="8%">MÃ SỐ</th>
            <th width="22%">THÔNG TIN</th>
            <th v-if="visibleColumns.loai" width="12%">LOẠI</th>
            <th v-if="visibleColumns.quan" width="15%">KHU VỰC</th>
            <th v-if="visibleColumns.lienhe" width="15%">LIÊN HỆ</th>
            <th v-if="visibleColumns.duno" width="15%">DỰ NỢ</th>
            <th width="13%">HÀNH ĐỘNG</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="paginatedDaiLys.length > 0">
            <tr v-for="dl in paginatedDaiLys" :key="dl.MaDaiLy" class="data-row" :class="getRowClass(dl)">
              <td class="checkbox-cell"><input type="checkbox" v-model="selectedIds" :value="dl.MaDaiLy" /></td>
              <td class="cell-id">#{{ String(dl.MaDaiLy).padStart(3, '0') }}</td>
              <td>
                <div class="cell-name-info">
                  <div class="avatar" :style="{ background: getAvatarColor(dl.TenDaiLy) }">
                    {{ dl.TenDaiLy.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="name">{{ dl.TenDaiLy }}</div>
                    <div class="phone">{{ dl.DienThoai }}</div>
                  </div>
                </div>
              </td>
              <td v-if="visibleColumns.loai">
                <span class="badge" :class="'loai-' + dl.MaLoai">
                  L{{ dl.MaLoai }}
                </span>
              </td>
              <td v-if="visibleColumns.quan">🏢 {{ dl.quan?.TenQuan || 'N/A' }}</td>
              <td v-if="visibleColumns.lienhe">
                <div class="contact-info">
                  <div class="email">{{ dl.Email || '—' }}</div>
                </div>
              </td>
              <td v-if="visibleColumns.duno">
                <div class="debt-cell" :class="getDebtClass(dl.TienNo)">
                  {{ (dl.TienNo / 1000000).toFixed(1) }}Tr
                  <span class="debt-status">{{ getDebtStatus(dl.TienNo) }}</span>
                </div>
              </td>
              <td>
                <div class="actions">
                  <button class="action-btn view" @click="viewDaiLy(dl)" title="Xem chi tiết">
                    👁
                  </button>
                  <button class="action-btn edit" title="Sửa">
                    ✎
                  </button>
                  <button class="action-btn delete" @click="deleteOne(dl)" title="Xóa">
                    ⛔
                  </button>
                </div>
              </td>
            </tr>
          </template>
          <tr v-else class="empty-row">
            <td :colspan="visibleColumns.loai && visibleColumns.quan && visibleColumns.lienhe && visibleColumns.duno ? 8 : 5" class="empty-state">
              <div class="empty-icon">📭</div>
              <p>Không tìm thấy dữ liệu</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <span class="pagination-info">Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredDaiLys.length) }} / {{ filteredDaiLys.length }} kết quả</span>
      <div class="pagination-buttons">
        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">← Trước</button>
        <div class="page-numbers">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            class="page-number"
            :class="{ active: currentPage === page }"
          >
            {{ page }}
          </button>
        </div>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">Sau →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import * as XLSX from 'xlsx';

const router = useRouter();
const daiLys = ref([]);
const quans = ref([]);
const loading = ref(false);
const searchText = ref('');
const filterLoai = ref('');
const filterQuan = ref('');
const filterDebt = ref('');
const showFilters = ref(false);
const showAddModal = ref(false);
const showColumnSettings = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedIds = ref([]);
const selectAll = ref(false);

// Column visibility state
const visibleColumns = ref({
  loai: true,
  quan: true,
  lienhe: true,
  duno: true
});

const avgDebt = computed(() => {
  if (daiLys.value.length === 0) return 0;
  return daiLys.value.reduce((s, dl) => s + parseFloat(dl.TienNo || 0), 0) / daiLys.value.length;
});

const totalDebt = computed(() => {
  return daiLys.value.reduce((s, dl) => s + parseFloat(dl.TienNo || 0), 0);
});

const uniqueAreas = computed(() => {
  return new Set(daiLys.value.map(d => d.MaQuan)).size;
});

const highDebtCount = computed(() => {
  return daiLys.value.filter(d => d.TienNo > 40000000).length;
});

const selectedCount = computed(() => {
  return selectedIds.value.length;
});

const activeFilters = computed(() => {
  let count = 0;
  if (filterLoai.value) count++;
  if (filterQuan.value) count++;
  if (filterDebt.value) count++;
  return count;
});

const filteredDaiLys = computed(() => {
  return daiLys.value.filter(dl => {
    const matchSearch = !searchText.value || 
      dl.TenDaiLy.toLowerCase().includes(searchText.value.toLowerCase()) ||
      dl.DienThoai.includes(searchText.value) ||
      (dl.Email && dl.Email.toLowerCase().includes(searchText.value.toLowerCase()));
    
    const matchLoai = !filterLoai.value || dl.MaLoai == filterLoai.value;
    const matchQuan = !filterQuan.value || dl.MaQuan == filterQuan.value;
    
    let matchDebt = true;
    if (filterDebt.value === 'paid') matchDebt = dl.TienNo === 0;
    else if (filterDebt.value === 'unpaid') matchDebt = dl.TienNo > 0;
    else if (filterDebt.value === 'high') matchDebt = dl.TienNo > 40000000;
    
    return matchSearch && matchLoai && matchQuan && matchDebt;
  });
});

const paginatedDaiLys = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredDaiLys.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredDaiLys.value.length / itemsPerPage);
});

const fetchData = async () => {
  loading.value = true;
  try {
    const [dl, q] = await Promise.all([
      api.get('/dai-ly'),
      api.get('/quan')
    ]);
    daiLys.value = dl.data.data;
    quans.value = q.data.data;
    
    daiLys.value.forEach(d => {
      d.quan = quans.value.find(q => q.MaQuan == d.MaQuan);
    });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const viewDaiLy = (dl) => {
  router.push(`/dai-ly/${dl.MaDaiLy}`);
};

const deleteOne = (dl) => {
  if (confirm(`Xóa "${dl.TenDaiLy}"?`)) {
    daiLys.value = daiLys.value.filter(d => d.MaDaiLy !== dl.MaDaiLy);
  }
};

const deleteBulk = () => {
  if (confirm(`Xóa ${selectedCount.value} mục?`)) {
    daiLys.value = daiLys.value.filter(d => !selectedIds.value.includes(d.MaDaiLy));
    selectedIds.value = [];
    selectAll.value = false;
  }
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedIds.value = paginatedDaiLys.value.map(d => d.MaDaiLy);
  } else {
    selectedIds.value = [];
  }
};

const toggleColumnSettings = () => {
  showColumnSettings.value = !showColumnSettings.value;
  if (!showColumnSettings.value) {
    localStorage.setItem('visibleColumns', JSON.stringify(visibleColumns.value));
  }
};

const exportToExcel = () => {
  const data = filteredDaiLys.value.map(dl => {
    const row = {
      'Mã số': dl.MaDaiLy,
      'Tên Đại Lý': dl.TenDaiLy,
      'Điện Thoại': dl.DienThoai
    };
    if (visibleColumns.value.loai) row['Loại'] = dl.MaLoai === 1 ? 'Loại 1' : 'Loại 2';
    if (visibleColumns.value.quan) row['Khu Vực'] = dl.quan?.TenQuan || 'N/A';
    if (visibleColumns.value.lienhe) row['Email'] = dl.Email || 'N/A';
    if (visibleColumns.value.duno) {
      row['Dư Nợ (VNĐ)'] = dl.TienNo;
      row['Dư Nợ (Triệu)'] = (dl.TienNo / 1000000).toFixed(1);
    }
    return row;
  });
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đại lý');
  XLSX.writeFile(wb, `danh-sach-dai-ly-${new Date().getTime()}.xlsx`);
};

const getAvatarColor = (name) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  return colors[name.length % colors.length];
};

const getRowClass = (dl) => {
  if (dl.TienNo > 40000000) return 'row-high-debt';
  if (dl.TienNo === 0) return 'row-paid';
  return '';
};

const getDebtClass = (debt) => {
  if (debt === 0) return 'debt-clear';
  if (debt > 40000000) return 'debt-high';
  return 'debt-normal';
};

const getDebtStatus = (debt) => {
  if (debt === 0) return '✓ Thanh toán';
  if (debt > 40000000) return '⚠ Nguy hiểm';
  return '⏳ Còn nợ';
};

const resetFilters = () => {
  filterLoai.value = '';
  filterQuan.value = '';
  filterDebt.value = '';
  searchText.value = '';
  currentPage.value = 1;
};

onMounted(() => {
  fetchData();
  const saved = localStorage.getItem('visibleColumns');
  if (saved) {
    visibleColumns.value = JSON.parse(saved);
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-wrapper {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 24px 32px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
  color: #212529;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8ecf1;
}

.header-left h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #1a202c;
}

.header-left p {
  font-size: 13px;
  color: #718096;
  margin: 0;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-delete-bulk {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #dc2626;
  background: #fee2e2;
  color: #dc2626;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete-bulk:hover {
  background: #fecaca;
  border-color: #b91c1c;
}

.btn-delete-bulk:hover {
  background: #fecaca;
  border-color: #b91c1c;
}

.icon-delete-bulk {
  font-size: 14px;
}

.btn-refresh {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  background: #f3f4f6;
  color: #1f2937;
}

.btn-refresh:disabled {
  opacity: 0.5;
}

.icon-spin {
  animation: spin 0.6s linear infinite;
}

.btn-refresh:not(:disabled) .icon-spin {
  animation: none;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  background: white;
  border-radius: 8px;
  padding: 18px;
  border: 1px solid #dee2e6;
  display: flex;
  gap: 14px;
  align-items: center;
  transition: all 0.2s;
}

.stat-item:hover {
  border-color: #adb5bd;
}

.stat-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

/* Control Panel */
.control-panel {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.search-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0 12px;
  max-width: 400px;
  transition: all 0.2s;
}

.search-wrapper:focus-within {
  border-color: #6c757d;
}

.search-wrapper svg {
  color: #9ca3af;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px 0;
  font-size: 13px;
  color: #1a202c;
  font-weight: 500;
}

.search-input::placeholder {
  color: #d1d5db;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.filter-btn.active {
  background: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.filter-btn.secondary {
  background: #f8f9fa;
}

/* Filter Panel */
.filter-panel {
  background: white;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 16px;
  border: 1px solid #dee2e6;
  animation: slideDown 0.3s ease-out;
}

/* Column Settings */
.column-settings {
  background: white;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 16px;
  border: 1px solid #dee2e6;
  animation: slideDown 0.3s ease-out;
}

.settings-title {
  font-size: 12px;
  font-weight: 700;
  color: #4b5563;
  text-transform: uppercase;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f9fafb;
  transition: all 0.2s;
  font-size: 13px;
  font-weight: 500;
}

.setting-item:hover {
  background: #f0f1f3;
}

.setting-item input[type="checkbox"] {
  cursor: pointer;
  accent-color: #3b82f6;
}

.btn-save-settings {
  padding: 8px 14px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save-settings:hover {
  background: #2563eb;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  background: white;
  color: #212529;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:hover {
  border-color: #adb5bd;
}

.filter-select:focus {
  outline: none;
  border-color: #0d6efd;
}

.btn-reset {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  color: #6b7280;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: #e5e7eb;
}

/* Table */
.table-wrapper {
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  overflow: hidden;
  margin-bottom: 16px;
}

.loading-skeleton {
  padding: 20px;
}

.skeleton-row {
  height: 48px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  margin-bottom: 12px;
  border-radius: 6px;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table thead {
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.data-table tbody tr {
  border-bottom: 1px solid #dee2e6;
  transition: all 0.2s;
  background: white;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

.data-table tbody tr.row-high-debt {
  background: #fff5f5;
}

.data-table tbody tr.row-high-debt:hover {
  background: #ffedec;
}

.data-table tbody tr.row-paid {
  background: #f0f8f4;
}

.data-table tbody tr.row-paid:hover {
  background: #e6f5ea;
}

.data-table td {
  padding: 12px 16px;
  vertical-align: middle;
}

.cell-id {
  font-family: 'Monaco', 'Courier New', monospace;
  font-weight: 700;
  color: #6b7280;
  font-size: 12px;
}

.cell-name-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.name {
  font-weight: 700;
  color: #1a202c;
  font-size: 13px;
}

.phone {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.loai-1 {
  background: #dbeafe;
  color: #0284c7;
}

.badge.loai-2 {
  background: #dbeafe;
  color: #0284c7;
}

.contact-info {
  font-size: 12px;
}

.email {
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

.debt-cell {
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.debt-cell.debt-clear {
  color: #059669;
}

.debt-cell.debt-normal {
  color: #d97706;
}

.debt-cell.debt-high {
  color: #dc2626;
  font-weight: 800;
}

.debt-status {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.7;
}

.checkbox-cell {
  text-align: center;
}

.checkbox-cell input[type="checkbox"],
.data-table th input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 4px;
  justify-content: flex-start;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background: white;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #495057;
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.action-btn.view:hover {
  background: #cfe2ff;
  border-color: #0d6efd;
}

.action-btn.edit:hover {
  background: #cfe2ff;
  border-color: #0d6efd;
}

.action-btn.delete:hover {
  background: #f8d7da;
  border-color: #dc3545;
  color: #dc3545;
}

.empty-row td {
  padding: 60px 16px;
}

.empty-state {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.empty-icon {
  font-size: 48px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
}

.pagination-info {
  color: #4b5563;
  font-weight: 600;
}

.pagination-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.page-btn {
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #adb5bd;
  color: #212529;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
  align-items: center;
}

.page-number {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.page-number:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.page-number.active {
  background: #212529;
  color: white;
  border-color: #212529;
}

/* Responsive */
@media (max-width: 1280px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-wrapper {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-left h1 {
    font-size: 22px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-item {
    padding: 14px;
  }

  .stat-value {
    font-size: 20px;
  }

  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    max-width: 100%;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }

  .data-table {
    font-size: 12px;
  }

  .data-table th,
  .data-table td {
    padding: 10px 12px;
  }

  .pagination {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
