<template>
  <div class="mh">

    <!-- ══ CONTEXT BANNER ══ -->
    <div class="ctx-card">

      <!-- Hexagon decoration -->
      <svg class="ctx-deco" viewBox="0 0 300 155" fill="none" aria-hidden="true">
        <defs>
          <polygon id="mhhx" points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"/>
        </defs>
        <g stroke="#059669" stroke-width=".9" opacity=".13">
          <use href="#mhhx" transform="translate(21,24)"/>  <use href="#mhhx" transform="translate(62,24)"/>
          <use href="#mhhx" transform="translate(103,24)"/> <use href="#mhhx" transform="translate(144,24)"/>
          <use href="#mhhx" transform="translate(185,24)"/> <use href="#mhhx" transform="translate(226,24)"/>
          <use href="#mhhx" transform="translate(267,24)"/>
          <use href="#mhhx" transform="translate(0,60)"/>   <use href="#mhhx" transform="translate(41,60)"/>
          <use href="#mhhx" transform="translate(82,60)"/>  <use href="#mhhx" transform="translate(123,60)"/>
          <use href="#mhhx" transform="translate(164,60)"/> <use href="#mhhx" transform="translate(205,60)"/>
          <use href="#mhhx" transform="translate(246,60)"/> <use href="#mhhx" transform="translate(287,60)"/>
          <use href="#mhhx" transform="translate(21,96)"/>  <use href="#mhhx" transform="translate(62,96)"/>
          <use href="#mhhx" transform="translate(103,96)"/> <use href="#mhhx" transform="translate(144,96)"/>
          <use href="#mhhx" transform="translate(185,96)"/> <use href="#mhhx" transform="translate(226,96)"/>
          <use href="#mhhx" transform="translate(267,96)"/>
          <use href="#mhhx" transform="translate(0,132)"/>  <use href="#mhhx" transform="translate(41,132)"/>
          <use href="#mhhx" transform="translate(82,132)"/> <use href="#mhhx" transform="translate(123,132)"/>
          <use href="#mhhx" transform="translate(164,132)"/><use href="#mhhx" transform="translate(205,132)"/>
          <use href="#mhhx" transform="translate(246,132)"/><use href="#mhhx" transform="translate(287,132)"/>
        </g>
        <g stroke="#059669" stroke-width="1.2" opacity=".28">
          <use href="#mhhx" transform="translate(144,60)"/>
          <use href="#mhhx" transform="translate(185,24)"/>
          <use href="#mhhx" transform="translate(226,96)"/>
        </g>
        <polygon points="144,36 164.8,48 164.8,72 144,84 123.2,72 123.2,48" fill="#059669" opacity=".07"/>
        <polygon points="185,0 205.8,12 205.8,36 185,48 164.2,36 164.2,12" fill="#047857" opacity=".06"/>
        <g fill="#059669" opacity=".5">
          <circle cx="144" cy="60" r="3.5"/><circle cx="185" cy="24" r="3"/><circle cx="226" cy="96" r="3"/>
        </g>
        <g stroke="#059669" stroke-width=".8" stroke-dasharray="3 4" opacity=".2">
          <line x1="144" y1="60" x2="185" y2="24"/>
          <line x1="144" y1="60" x2="226" y2="96"/>
        </g>
        <g fill="#047857" opacity=".3">
          <circle cx="62" cy="24" r="2"/><circle cx="267" cy="60" r="2"/><circle cx="103" cy="132" r="2"/>
        </g>
      </svg>

      <svg class="ctx-wm" viewBox="0 0 95 95" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="5" y="5" width="38" height="38" rx="7"/>
        <rect x="52" y="5" width="38" height="38" rx="7"/>
        <rect x="5" y="52" width="38" height="38" rx="7"/>
        <rect x="52" y="52" width="38" height="38" rx="7"/>
        <line x1="18" y1="24" x2="30" y2="24" stroke-width="3"/>
        <line x1="65" y1="24" x2="77" y2="24" stroke-width="3"/>
        <line x1="18" y1="71" x2="30" y2="71" stroke-width="3"/>
        <line x1="65" y1="71" x2="77" y2="71" stroke-width="3"/>
      </svg>

      <div class="ctx-top">
        <div>
          <h1 class="ctx-title">Danh Mục Sản Phẩm</h1>
          <p class="ctx-sub">{{ products.length }} mặt hàng · Giá nhập — Giá xuất — Tồn kho thực tế · {{ monthName }}/{{ _now.getFullYear() }}</p>
        </div>
        <div class="ctx-actions">
          <button class="btn-csv" @click="exportCSV"><Download :size="13"/> Xuất CSV</button>
          <button class="btn-p" @click="openAdd"><Plus :size="14"/> Thêm mặt hàng</button>
        </div>
      </div>

      <div class="ctx-divider"></div>

      <div class="ctx-stats">

        <!-- KPI 1: Tổng mặt hàng -->
        <div class="cs-col">
          <strong class="cs-num">
            {{ products.length }}
            <span class="cs-tag cs-tag-green">đang kinh doanh</span>
          </strong>
          <span class="cs-delta cs-up">↑ 1 so tháng 4</span>
          <span class="cs-lbl">Tổng mặt hàng</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 2: Giá trị tồn kho + sparkline -->
        <div class="cs-col">
          <strong class="cs-num">{{ totalValue }} <span style="font-size:14px;font-weight:600;color:#94a3b8">Tr</span></strong>
          <span class="cs-delta cs-up">↑ 8% so tháng 4</span>
          <div class="spark-wrap">
            <div v-for="(h, i) in spark" :key="i"
                 class="spark-bar" :class="{ 'spark-active': i === spark.length - 1 }"
                 :style="{ height: (h / maxSpark * 100) + '%' }"
                 :title="sparkLabels[i] + ': ' + h + ' Tr'">
            </div>
          </div>
          <span class="cs-lbl">Giá trị tồn kho (Tr)</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 3: Sắp hết hàng + donut -->
        <div class="cs-col cs-warn">
          <div class="cs-pending-row">
            <div class="donut-wrap">
              <div class="donut-ring" :style="{ background: donutGradient }"></div>
            </div>
            <div>
              <strong class="cs-num cs-amber" style="display:block;margin-bottom:2px">
                {{ lowStockCount }}
                <span class="cs-tag" v-if="lowStockCount > 0">cần nhập thêm</span>
              </strong>
              <span class="cs-delta cs-ok">{{ okStockCount }} mặt hàng đủ hàng</span>
            </div>
          </div>
          <div class="donut-legend">
            <span class="dl-dot" style="background:#10b981"></span> Đủ hàng {{ okStockCount }}
            <span class="dl-dot" style="background:#f59e0b;margin-left:6px"></span> Sắp hết {{ lowStockCount }}
            <span class="dl-dot" style="background:#cbd5e1;margin-left:6px"></span> Hết {{ outOfStockCount }}
          </div>
          <span class="cs-lbl" style="margin-top:4px">Sắp hết hàng</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 4: Loại mặt hàng -->
        <div class="cs-col">
          <strong class="cs-num">
            {{ categoryCount }}
            <span class="cs-tag cs-tag-green">danh mục</span>
          </strong>
          <span class="cs-delta cs-up">↑ 0 so tháng 4</span>
          <span class="cs-lbl">Loại mặt hàng</span>
        </div>
      </div>

      <!-- Month progress bar -->
      <div class="ctx-timeline">
        <div class="ctl-row">
          <span class="ctl-label">{{ monthName }} · Ngày {{ dayOfMonth }}/{{ daysInMonth }}</span>
          <span class="ctl-pct">{{ monthProgressPct }}% tiến độ tháng</span>
        </div>
        <div class="ctl-track">
          <div class="ctl-fill" :style="{ width: monthProgressPct + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- ══ MAIN LAYOUT ══ -->
    <div class="dl-flex">

      <!-- ════ LIST CARD ════ -->
      <div class="dl-card list-card">

        <!-- Toolbar -->
        <div class="lc-hd">
          <div class="lc-title-row">
            <h3 class="lc-title">Danh sách mặt hàng</h3>
            <span class="count-badge">{{ filteredList.length }} / {{ products.length }}</span>
            <button v-if="hasFilter" class="clear-btn" @click="clearFilters" title="Xóa bộ lọc">
              <X :size="11"/> Xóa lọc
            </button>
            <div class="stab-group">
              <button class="stab" :class="{ active: filterStock === '' }" @click="filterStock = ''">Tất cả</button>
              <button class="stab stab-green" :class="{ active: filterStock === 'ok' }" @click="filterStock = 'ok'">
                Đủ hàng <span class="stab-n">{{ okStockCount }}</span>
              </button>
              <button class="stab stab-warn" :class="{ active: filterStock === 'low' }" @click="filterStock = 'low'">
                Sắp hết <span class="stab-n">{{ lowStockCount }}</span>
              </button>
            </div>
          </div>
          <div class="lc-tools">
            <div class="search-wrap">
              <Search :size="14" class="search-ic"/>
              <input v-model="searchQ" class="search-inp" placeholder="Tìm mã, tên mặt hàng…"/>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="dl-table">
            <colgroup>
              <col style="width:12%"/>
              <col/>
              <col style="width:7%"/>
              <col style="width:11%"/>
              <col style="width:11%"/>
              <col style="width:15%"/>
              <col style="width:13%"/>
            </colgroup>
            <thead>
              <tr>
                <th>
                  <span class="sort-hd" @click="toggleSort('code')">Mã <SortIcon field="code" :sk="sk" :sd="sd"/></span>
                </th>
                <th>Tên mặt hàng</th>
                <th>DVT</th>
                <th class="text-right">
                  <span class="sort-hd sort-hd-r" @click="toggleSort('buyPrice')">Giá nhập <SortIcon field="buyPrice" :sk="sk" :sd="sd"/></span>
                </th>
                <th class="text-right">Giá xuất (+2%)</th>
                <th class="text-right">
                  <span class="sort-hd sort-hd-r" @click="toggleSort('stock')">Tồn kho <SortIcon field="stock" :sk="sk" :sd="sd"/></span>
                </th>
                <th class="text-center col-actions-head">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in sortedList" :key="r.id"
                class="mh-row" :class="{ selected: selectedId === r.id }"
                @click="openView(r)">
                <td><span class="mh-code">{{ r.code }}</span></td>
                <td>
                  <div class="mh-name-cell">
                    <div class="prod-thumb">
                      <img v-if="prodImgUrls[r.id]" :src="prodImgUrls[r.id]" class="prod-img" :alt="r.name" @error="e => e.target.style.display='none'"/>
                      <span class="prod-init" :style="{ background: prodCatColor(r.category) }">{{ r.category.charAt(0) }}</span>
                    </div>
                    <div>
                      <span class="mh-name">{{ r.name }}</span>
                      <span class="cat-chip">{{ r.category }}</span>
                    </div>
                  </div>
                </td>
                <td class="muted">{{ r.dvt }}</td>
                <td class="text-right">
                  <span class="price-num">{{ fmtPrice(r.buyPrice) }}</span>
                </td>
                <td class="text-right">
                  <span class="price-num sell-price">{{ fmtPrice(r.sellPrice) }}</span>
                </td>
                <td class="text-right">
                  <div class="stock-cell" :class="stockClass(r)">
                    <div class="stock-head">
                      <span class="stock-num">{{ r.stock.toLocaleString('vi-VN') }}</span>
                      <span class="stock-state">{{ stockLabelShort(r) }}</span>
                    </div>
                    <div class="stock-mini-bar"><div class="stock-mini-fill" :style="{width: stockPct(r)+'%', background: stockColor(r)}"></div></div>
                  </div>
                </td>
                <td class="col-actions">
                  <div class="action-group">
                    <button class="act-btn view-btn" title="Xem" @click.stop="openView(r)"><Eye :size="13"/></button>
                    <button class="act-btn edit-btn" title="Sửa" @click.stop="openEdit(r)"><Edit2 :size="13"/></button>
                    <button class="act-btn del-btn" title="Xóa" @click.stop="askDelete(r)"><Trash2 :size="13"/></button>
                  </div>
                </td>
              </tr>
              <tr v-if="!sortedList.length">
                <td colspan="7" class="empty-row">
                  <PackageOpen :size="30" class="empty-ic"/><p>Không tìm thấy mặt hàng phù hợp</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="lc-foot" v-if="sortedList.length">
          Hiển thị {{ sortedList.length }} mặt hàng
          <span v-if="hasFilter"> (đã lọc từ {{ products.length }})</span>
        </div>
      </div>

      <!-- ════ SIDE PANEL ════ -->
      <Transition name="panel">
      <div class="dl-card side-panel" v-if="panelVisible">

        <!-- ─ VIEW MODE ─ -->
        <template v-if="panelMode === 'view' && selectedProduct">
          <div class="ap-hd">
            <div class="ap-avatar">
              <img v-if="prodImgUrls[selectedProduct.id]" :src="prodImgUrls[selectedProduct.id]" class="prod-img" :alt="selectedProduct.name" @error="e => e.target.style.display='none'"/>
              <span class="prod-init" :style="{ background: prodCatColor(selectedProduct.category) }">{{ selectedProduct.name.charAt(0) }}</span>
            </div>
            <div class="ap-title-block">
              <h3 class="ap-name">{{ selectedProduct.name }}</h3>
              <div class="ap-badges">
                <span class="mh-code" style="font-size:11px">{{ selectedProduct.code }}</span>
                <span class="dist-chip">{{ selectedProduct.dvt }}</span>
                <span class="dist-chip">{{ selectedProduct.category }}</span>
              </div>
            </div>
            <div style="display:flex;gap:5px">
              <button class="act-btn edit-btn" title="Sửa mặt hàng" @click="openEdit(selectedProduct)"><Edit2 :size="14"/></button>
              <button class="act-btn" style="background:rgba(15,23,42,.04);color:var(--c-txt-3)" title="Đóng" @click="closePanel"><X :size="14"/></button>
            </div>
          </div>

          <!-- Price section -->
          <div class="price-section">
            <div class="ps-row">
              <span class="ps-lbl">Giá nhập</span>
              <span class="ps-val">{{ fmtPrice(selectedProduct.buyPrice) }}</span>
            </div>
            <div class="ps-sub-row">
              <span style="color:var(--c-txt-3)">Giá xuất</span>
              <span style="font-weight:700;color:var(--c-txt-2)">{{ fmtPrice(selectedProduct.sellPrice) }}</span>
            </div>
            <div class="ps-sub-row">
              <span style="color:var(--c-txt-3)">Margin</span>
              <span style="font-weight:700;color:#10b981">+2%</span>
            </div>
            <div class="ps-sub-row" style="margin-top:4px;padding-top:6px;border-top:1px solid var(--c-border)">
              <span style="color:var(--c-txt-3)">Lợi nhuận/đơn vị</span>
              <span style="font-weight:800;color:#2e7d32">{{ fmtPrice(selectedProduct.sellPrice - selectedProduct.buyPrice) }}</span>
            </div>
          </div>

          <!-- Stock section -->
          <div class="stock-section">
            <div class="ps-row">
              <span class="ps-lbl">Tồn kho hiện tại</span>
              <div style="display:flex;align-items:baseline;gap:5px">
                <span class="ss-num" :style="{color: stockColor(selectedProduct)}">
                  {{ selectedProduct.stock.toLocaleString('vi-VN') }}
                </span>
                <span style="font-size:12px;color:var(--c-txt-3)">{{ selectedProduct.dvt }}</span>
              </div>
            </div>
            <div class="ss-bar-wrap">
              <div class="ss-bar">
                <div class="ss-fill" :style="{ width: stockPct(selectedProduct)+'%', background: stockColor(selectedProduct) }"></div>
              </div>
              <span class="ss-chip" :class="stockClass(selectedProduct)">{{ stockLabel(selectedProduct) }}</span>
            </div>
          </div>

          <!-- Info grid -->
          <div class="info-grid">
            <div class="ig-row">
              <Tag :size="13" class="ig-ic"/>
              <span class="ig-lbl">Mã hàng</span>
              <span class="ig-val"><span class="mh-code" style="font-size:11px">{{ selectedProduct.code }}</span></span>
            </div>
            <div class="ig-row">
              <Layers :size="13" class="ig-ic"/>
              <span class="ig-lbl">Danh mục</span>
              <span class="ig-val">{{ selectedProduct.category }}</span>
            </div>
            <div class="ig-row">
              <Package :size="13" class="ig-ic"/>
              <span class="ig-lbl">DVT</span>
              <span class="ig-val">{{ selectedProduct.dvt }}</span>
            </div>
            <div class="ig-row">
              <BarChart2 :size="13" class="ig-ic"/>
              <span class="ig-lbl">Giá nhập</span>
              <span class="ig-val" style="font-weight:700;color:var(--c-txt-2)">{{ fmtPrice(selectedProduct.buyPrice) }}</span>
            </div>
            <div class="ig-row">
              <BarChart2 :size="13" class="ig-ic"/>
              <span class="ig-lbl">Giá xuất</span>
              <span class="ig-val" style="font-weight:700;color:#2e7d32">{{ fmtPrice(selectedProduct.sellPrice) }}</span>
            </div>
          </div>

          <!-- Quick links -->
          <div class="quick-links">
            <button class="btn-p" style="flex:1;justify-content:center" @click="openEdit(selectedProduct)">
              <Edit2 :size="14"/>Chỉnh sửa
            </button>
            <button class="btn-danger-o" @click="askDelete(selectedProduct)">
              <Trash2 :size="14"/>Xóa
            </button>
          </div>
        </template>

        <!-- ─ ADD MODE ─ -->
        <template v-else-if="panelMode === 'add'">
          <div class="fc-hd">
            <div>
              <h3 class="fc-title">Thêm mặt hàng mới</h3>
              <span class="fc-sub">Điền đầy đủ thông tin mặt hàng</span>
            </div>
            <div style="display:flex;gap:5px;align-items:center">
              <span class="mode-chip add">Mới</span>
              <button class="act-btn" style="background:rgba(15,23,42,.04);color:var(--c-txt-3)" title="Đóng" @click="closePanel"><X :size="14"/></button>
            </div>
          </div>

          <div class="fc-body">
            <div class="field full">
              <label class="flabel">Tên mặt hàng <span class="req">*</span></label>
              <input v-model="form.name" class="finp" :class="{ 'finp-err': errors.name }" placeholder="Nhập tên mặt hàng"/>
              <span class="err-msg" v-if="errors.name">{{ errors.name }}</span>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Danh mục</label>
                <select v-model="form.category" class="finp">
                  <option value="">— Chọn danh mục —</option>
                  <option v-for="c in categories" :key="c">{{ c }}</option>
                </select>
              </div>
              <div class="field">
                <label class="flabel">Đơn vị tính (DVT)</label>
                <select v-model="form.dvt" class="finp">
                  <option value="">— Chọn DVT —</option>
                  <option v-for="d in dvts" :key="d">{{ d }}</option>
                </select>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Giá nhập (Tr) <span class="req">*</span></label>
                <input v-model.number="form.buyPrice" type="number" min="0" step="0.001" class="finp finp-num" :class="{ 'finp-err': errors.buyPrice }" placeholder="0.000"/>
                <span class="err-msg" v-if="errors.buyPrice">{{ errors.buyPrice }}</span>
              </div>
              <div class="field">
                <label class="flabel">Giá xuất (Tr)</label>
                <input :value="form.sellPrice.toFixed(4)" type="number" class="finp finp-num" readonly/>
              </div>
            </div>

            <div class="field">
              <label class="flabel">Tồn kho ban đầu</label>
              <input v-model.number="form.stock" type="number" min="0" class="finp finp-num" placeholder="0"/>
            </div>

            <div class="limit-row">
              <Package :size="11"/>
              Giá xuất tự động = Giá nhập × <strong>1.02</strong>
            </div>
          </div>

          <div class="fc-footer">
            <button class="btn-ghost" @click="closePanel"><X :size="12"/> Hủy</button>
            <button class="btn-p" @click="submitAdd"><Plus :size="13"/> Thêm mặt hàng</button>
          </div>
        </template>

        <!-- ─ EDIT MODE ─ -->
        <template v-else-if="panelMode === 'edit'">
          <div class="fc-hd">
            <div>
              <h3 class="fc-title">Chỉnh sửa mặt hàng</h3>
              <span class="fc-sub">{{ selectedProduct?.code ?? '' }}</span>
            </div>
            <div style="display:flex;gap:5px;align-items:center">
              <span class="mode-chip edit-chip">Sửa</span>
              <button class="act-btn" style="background:rgba(15,23,42,.04);color:var(--c-txt-3)" title="Đóng" @click="panelMode = 'view'"><X :size="14"/></button>
            </div>
          </div>

          <div class="fc-body">
            <div class="field full">
              <label class="flabel">Tên mặt hàng <span class="req">*</span></label>
              <input v-model="form.name" class="finp" :class="{ 'finp-err': errors.name }" placeholder="Nhập tên mặt hàng"/>
              <span class="err-msg" v-if="errors.name">{{ errors.name }}</span>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Danh mục</label>
                <select v-model="form.category" class="finp">
                  <option value="">— Chọn danh mục —</option>
                  <option v-for="c in categories" :key="c">{{ c }}</option>
                </select>
              </div>
              <div class="field">
                <label class="flabel">Đơn vị tính (DVT)</label>
                <select v-model="form.dvt" class="finp">
                  <option value="">— Chọn DVT —</option>
                  <option v-for="d in dvts" :key="d">{{ d }}</option>
                </select>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Giá nhập (Tr) <span class="req">*</span></label>
                <input v-model.number="form.buyPrice" type="number" min="0" step="0.001" class="finp finp-num" :class="{ 'finp-err': errors.buyPrice }" placeholder="0.000"/>
                <span class="err-msg" v-if="errors.buyPrice">{{ errors.buyPrice }}</span>
              </div>
              <div class="field">
                <label class="flabel">Giá xuất (Tr)</label>
                <input :value="form.sellPrice.toFixed(4)" type="number" class="finp finp-num" readonly/>
              </div>
            </div>

            <div class="field">
              <label class="flabel">Tồn kho hiện tại</label>
              <input v-model.number="form.stock" type="number" min="0" class="finp finp-num" placeholder="0"/>
            </div>

            <div class="limit-row">
              <Package :size="11"/>
              Giá xuất tự động = Giá nhập × <strong>1.02</strong>
            </div>
          </div>

          <div class="fc-footer">
            <button class="btn-ghost" @click="panelMode = 'view'"><X :size="12"/> Hủy</button>
            <button class="btn-p" @click="submitEdit"><Edit2 :size="13"/> Cập nhật</button>
          </div>
        </template>

      </div>
      </Transition>
    </div>

    <!-- ══ TOAST ══ -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="toast-snack" :class="toast.type">
          <CheckCircle v-if="toast.type === 'success'" :size="15"/>
          <Trash2      v-else-if="toast.type === 'danger'" :size="15"/>
          <Package     v-else :size="15"/>
          {{ toast.msg }}
        </div>
      </Transition>
    </Teleport>

    <!-- ══ DELETE MODAL ══ -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-bg" @click="deleteTarget = null">
        <div class="modal-box" @click.stop>
          <div class="del-avatar-wrap">
            <div class="del-prod-avatar" :style="{ background: prodCatColor(deleteTarget.category) }">
              <img v-if="prodImgUrls[deleteTarget.id]" :src="prodImgUrls[deleteTarget.id]" class="del-avatar-img" :alt="deleteTarget.name" @error="e => e.target.style.display='none'"/>
              <span class="del-avatar-abbr">{{ deleteTarget.name.charAt(0) }}</span>
            </div>
            <div class="del-trash-badge"><Trash2 :size="13"/></div>
          </div>
          <h4 class="modal-title">Xác nhận xóa mặt hàng</h4>
          <p class="modal-desc">
            Bạn có chắc muốn xóa <strong>{{ deleteTarget.name }}</strong>?<br/>
            <span style="color:#94a3b8">{{ deleteTarget.code }} · {{ deleteTarget.category }}</span><br/>
            Hành động này không thể hoàn tác.
          </p>
          <div class="modal-actions">
            <button class="btn-o" @click="deleteTarget = null">Hủy</button>
            <button class="btn-danger" @click="confirmDelete">Xóa</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import {
  Search, Plus, Download, X, Eye, Trash2, PackageOpen,
  Package, Edit2, Tag, Layers, BarChart2, CheckCircle,
} from 'lucide-vue-next';

/* ── Sort icon ── */
const SortIcon = {
  props: ['field', 'sk', 'sd'],
  template: `<span class="sort-arrow"><svg width="8" height="10" viewBox="0 0 8 10" fill="none">
    <path d="M4 0L7 3.5H1L4 0Z" :fill="sk===field && sd==='asc' ? '#059669' : '#cbd5e1'"/>
    <path d="M4 10L1 6.5H7L4 10Z" :fill="sk===field && sd==='desc' ? '#059669' : '#cbd5e1'"/>
  </svg></span>`,
};

/* ── Constants ── */
const categories = ['Đèn LED', 'Đèn', 'Thiết bị điện', 'Dây cáp'];
const dvts       = ['Cái', 'Bộ', 'Mét', 'Cuộn', 'Hộp'];

/* ── Mock data ── */
const PROD_CATS = {
  'Đèn LED':       '#16a34a',
  'Đèn':           '#d97706',
  'Thiết bị điện': '#1d4ed8',
  'Dây cáp':       '#dc2626',
}
const prodCatColor = (cat) => PROD_CATS[cat] ?? '#64748b'

const products = ref([
  { id:1, code:'MH-001', name:'Bóng đèn LED 9W',    dvt:'Cái',  category:'Đèn LED',       buyPrice:0.120,  sellPrice:0.1224, stock:850,  img:'LED_A19_Bulb.jpg' },
  { id:2, code:'MH-002', name:'Đèn LED panel 12W',  dvt:'Cái',  category:'Đèn LED',       buyPrice:0.280,  sellPrice:0.2856, stock:320,  img:'LED_panel_lamp.jpg' },
  { id:3, code:'MH-003', name:'Đèn huỳnh quang T8', dvt:'Bộ',   category:'Đèn',           buyPrice:0.095,  sellPrice:0.0969, stock:540,  img:'Fluorescent_tube_2.jpg' },
  { id:4, code:'MH-004', name:'Công tắc điện Sino',  dvt:'Cái',  category:'Thiết bị điện', buyPrice:0.080,  sellPrice:0.0816, stock:1200, img:'Light_switch.jpg' },
  { id:5, code:'MH-005', name:'Ổ cắm 3 chấu',        dvt:'Cái',  category:'Thiết bị điện', buyPrice:0.065,  sellPrice:0.0663, stock:95,   img:'Schuko_outlet.jpg' },
  { id:6, code:'MH-006', name:'Cầu dao MCB 20A',     dvt:'Cái',  category:'Thiết bị điện', buyPrice:0.450,  sellPrice:0.459,  stock:210,  img:'Merlin_gerin_mcb.jpg' },
  { id:7, code:'MH-007', name:'Dây điện CVV 1.5mm',  dvt:'Mét',  category:'Dây cáp',       buyPrice:0.022,  sellPrice:0.0224, stock:4500, img:'Stranded_wire.jpg' },
  { id:8, code:'MH-008', name:'Relay nhiệt LS 10A',  dvt:'Cái',  category:'Thiết bị điện', buyPrice:0.380,  sellPrice:0.3876, stock:68,   img:'Thermal_overload_relay.jpg' },
]);

/* ── Product image URLs — verified Wikimedia Commons thumbnails ── */
const prodImgUrls = reactive({
  1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Led-lampa.jpg/300px-Led-lampa.jpg',
  2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/LED_tubes_in_various_length.JPG/300px-LED_tubes_in_various_length.JPG',
  3: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Fluorescent_lamps_artistic.jpg/300px-Fluorescent_lamps_artistic.jpg',
  4: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Opened_light_switch.JPG/300px-Opened_light_switch.JPG',
  5: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Steckdose.jpg/300px-Steckdose.jpg',
  6: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Jtecul.jpg',
  7: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Electrical_wire.jpg/330px-Electrical_wire.jpg',
  8: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Overload_relay.jpg/300px-Overload_relay.jpg',
})

/* ── State ── */
const searchQ      = ref('');
const filterStock  = ref('');
const sk           = ref('code');
const sd           = ref('asc');
const selectedId   = ref(null);
const panelMode    = ref('view');
const deleteTarget = ref(null);

/* ── Computeds ── */
const hasFilter = computed(() => searchQ.value || filterStock.value);
const clearFilters = () => { searchQ.value = ''; filterStock.value = ''; };

const toggleSort = (key) => {
  if (sk.value === key) sd.value = sd.value === 'asc' ? 'desc' : 'asc';
  else { sk.value = key; sd.value = 'asc'; }
};

const totalValue      = computed(() => products.value.reduce((s, p) => s + p.stock * p.buyPrice, 0).toFixed(0));
const lowStockCount   = computed(() => products.value.filter(p => p.stock <= 100 && p.stock > 0).length);
const outOfStockCount = computed(() => products.value.filter(p => p.stock === 0).length);
const okStockCount    = computed(() => products.value.filter(p => p.stock > 100).length);
const categoryCount   = computed(() => new Set(products.value.map(p => p.category)).size);
const maxStock        = computed(() => Math.max(...products.value.map(p => p.stock), 1));

/* ── Donut ring ── */
const donutGradient = computed(() => {
  const total  = products.value.length || 1;
  const okPct  = Math.round(okStockCount.value  / total * 100);
  const lowPct = Math.round(lowStockCount.value / total * 100);
  return `conic-gradient(#10b981 0% ${okPct}%, #f59e0b ${okPct}% ${okPct + lowPct}%, #e2e8f0 ${okPct + lowPct}% 100%)`;
});

/* ── Sparkline (mock: last 6 months inventory value) ── */
const spark       = [420, 468, 395, 518, 487, 564];
const maxSpark    = Math.max(...spark);
const sparkLabels = ['Th.12', 'Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5'];

/* ── Month progress ── */
const _now             = new Date();
const daysInMonth      = new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate();
const dayOfMonth       = _now.getDate();
const monthProgressPct = Math.round(dayOfMonth / daysInMonth * 100);
const monthName        = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                          'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'][_now.getMonth()];

/* ── Stock helpers ── */
const stockPct   = (p) => Math.min(p.stock / maxStock.value * 100, 100);
const stockColor = (p) => p.stock === 0 ? '#dc2626' : p.stock <= 100 ? '#d97706' : '#2e7d32';
const stockClass = (p) => p.stock === 0 ? 'stock-out' : p.stock <= 100 ? 'stock-low' : 'stock-ok';
const stockLabel = (p) => p.stock === 0 ? 'Hết hàng' : p.stock <= 100 ? 'Sắp hết hàng' : 'Đủ hàng';
const stockLabelShort = (p) => p.stock === 0 ? 'Hết' : p.stock <= 100 ? 'Thấp' : 'Đủ';
const fmtPrice   = (v) => `${Math.round(Number(v) * 1_000_000).toLocaleString('vi-VN')}đ`;

/* ── Filtered & sorted list ── */
const filteredList = computed(() => {
  const q = searchQ.value.toLowerCase();
  return products.value.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    const matchS = filterStock.value === 'ok'  ? p.stock > 100
                 : filterStock.value === 'low' ? p.stock <= 100
                 : true;
    return matchQ && matchS;
  });
});

const sortedList = computed(() => {
  const list = [...filteredList.value];
  list.sort((a, b) => {
    let va = a[sk.value], vb = b[sk.value];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return sd.value === 'asc' ? -1 : 1;
    if (va > vb) return sd.value === 'asc' ?  1 : -1;
    return 0;
  });
  return list;
});

const selectedProduct = computed(() => products.value.find(p => p.id === selectedId.value) ?? null);
const panelVisible    = computed(() => selectedProduct.value !== null || panelMode.value === 'add');

/* ── Form ── */
const emptyForm = () => ({ name: '', category: '', dvt: '', buyPrice: 0, sellPrice: 0, stock: 0 });
const form      = ref(emptyForm());
const errors    = reactive({ name: '', buyPrice: '' });

// Auto-calculate sellPrice when buyPrice changes
watch(() => form.value.buyPrice, (v) => {
  form.value.sellPrice = +(v * 1.02).toFixed(4);
});

/* ── Toast ── */
const toast = ref({ show: false, msg: '', type: 'success' });
let _toastTimer = null;
const showToast = (msg, type = 'success') => {
  toast.value = { show: true, msg, type };
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { toast.value.show = false; }, 2800);
};

/* ── Actions ── */
const openView = (p) => { selectedId.value = p.id; panelMode.value = 'view'; };

const openAdd = () => {
  selectedId.value = null;
  panelMode.value  = 'add';
  form.value       = emptyForm();
  errors.name = ''; errors.buyPrice = '';
};

const openEdit = (p) => {
  selectedId.value = p.id;
  panelMode.value  = 'edit';
  form.value = { name: p.name, category: p.category, dvt: p.dvt, buyPrice: p.buyPrice, sellPrice: p.sellPrice, stock: p.stock };
  errors.name = ''; errors.buyPrice = '';
};

const closePanel = () => { selectedId.value = null; panelMode.value = 'view'; };

const submitAdd = () => {
  errors.name = ''; errors.buyPrice = '';
  if (!form.value.name.trim())                       { errors.name     = 'Vui lòng nhập tên mặt hàng'; return; }
  if (!form.value.buyPrice || form.value.buyPrice <= 0) { errors.buyPrice = 'Giá nhập phải lớn hơn 0'; return; }
  const newId = Math.max(...products.value.map(p => p.id)) + 1;
  const code  = `MH-${String(newId).padStart(3, '0')}`;
  products.value.push({
    id: newId, code,
    name:      form.value.name.trim(),
    category:  form.value.category || categories[0],
    dvt:       form.value.dvt      || dvts[0],
    buyPrice:  form.value.buyPrice,
    sellPrice: form.value.sellPrice,
    stock:     form.value.stock || 0,
  });
  showToast(`Đã thêm mặt hàng ${form.value.name}`);
  closePanel();
};

const submitEdit = () => {
  errors.name = ''; errors.buyPrice = '';
  if (!form.value.name.trim())                       { errors.name     = 'Vui lòng nhập tên mặt hàng'; return; }
  if (!form.value.buyPrice || form.value.buyPrice <= 0) { errors.buyPrice = 'Giá nhập phải lớn hơn 0'; return; }
  const found = products.value.find(p => p.id === selectedId.value);
  if (!found) return;
  found.name      = form.value.name.trim();
  found.category  = form.value.category || found.category;
  found.dvt       = form.value.dvt      || found.dvt;
  found.buyPrice  = form.value.buyPrice;
  found.sellPrice = form.value.sellPrice;
  found.stock     = form.value.stock;
  showToast(`Đã cập nhật ${found.name}`);
  panelMode.value = 'view';
};

const askDelete     = (p) => { deleteTarget.value = p; };
const confirmDelete = () => {
  const name  = deleteTarget.value.name;
  const delId = deleteTarget.value.id;
  products.value = products.value.filter(p => p.id !== delId);
  if (selectedId.value === delId) closePanel();
  deleteTarget.value = null;
  showToast(`Đã xóa mặt hàng ${name}`, 'danger');
};

const exportCSV = () => {
  const cols = ['Mã hàng', 'Tên mặt hàng', 'Danh mục', 'DVT', 'Giá nhập (Tr)', 'Giá xuất (Tr)', 'Tồn kho'];
  const rows = sortedList.value.map(p => [p.code, p.name, p.category, p.dvt, p.buyPrice, p.sellPrice, p.stock]);
  const csv  = [cols, ...rows].map(row => row.map(v => `"${v ?? ''}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `mat-hang-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* ══ TOKENS ══ */
.mh {
  --c-primary:    #059669; --c-primary-d: #047857;
  --c-success:    #059669; --c-success-bg:#f0fdf4;
  --c-danger:     #EF4444; --c-danger-bg: #FEF2F2;
  --c-info:       #4f46e5;
  --c-surface:    #ffffff; --c-bg:        #f8fafc;
  --c-border:     rgba(15,23,42,.07); --c-border-s: rgba(15,23,42,.04);
  --c-txt:        #0f172a; --c-txt-2:     #475569; --c-txt-3: #94a3b8;
  --r-card: 12px; --r-md: 8px; --r-sm: 6px; --r-pill: 999px;
  --sh-card:  0 1px 3px rgba(15,23,42,.05),0 1px 2px rgba(15,23,42,.04);
  --sh-hover: 0 4px 16px rgba(15,23,42,.08);
  --sh-modal: 0 20px 60px rgba(15,23,42,.18);
  --t: .15s ease;
  padding: 4px 0 32px;
  font-family: 'Inter','Be Vietnam Pro',ui-sans-serif,system-ui,sans-serif;
  color: var(--c-txt); font-size: 14px; line-height: 1.5;
}

/* ══ CONTEXT BANNER ══ */
.ctx-card {
  background: linear-gradient(120deg,#ffffff 0%,#f0fdf8 45%,#eef9ff 100%);
  border: 1px solid rgba(16,185,129,.14);
  border-radius: var(--r-card);
  box-shadow: 0 2px 16px rgba(5,150,105,.07),0 1px 3px rgba(15,23,42,.04);
  margin-bottom: 18px; overflow: hidden; position: relative;
}
.ctx-card::before {
  content:''; position:absolute; inset:0;
  background-image: radial-gradient(rgba(5,150,105,.1) 1px,transparent 1px);
  background-size: 22px 22px; pointer-events:none; z-index:0;
}
.ctx-card::after {
  content:''; position:absolute; top:0; left:0; right:0; height:2.5px;
  background: linear-gradient(90deg,transparent,#34d399 25%,#059669 50%,#34d399 75%,transparent);
  z-index:1;
}
.ctx-deco { position:absolute; right:0; top:0; width:260px; height:100%; pointer-events:none; z-index:0; }
.ctx-wm   { position:absolute; right:300px; top:50%; transform:translateY(-50%); width:90px; height:90px; color:var(--c-primary); opacity:.08; pointer-events:none; }
.ctx-top  { display:flex; justify-content:space-between; align-items:center; padding:20px 26px 18px; gap:16px; position:relative; z-index:2; }
.ctx-title { font-size:22px; font-weight:800; margin:0; letter-spacing:-.6px; color:var(--c-txt); }
.ctx-sub   { font-size:12px; color:var(--c-txt-3); margin:4px 0 0; }
.ctx-actions { display:flex; gap:8px; align-items:center; flex-shrink:0; }
.ctx-divider { height:1px; background:rgba(16,185,129,.1); position:relative; z-index:2; }

.ctx-stats { display:flex; align-items:stretch; position:relative; z-index:2; }
.cs-col { flex:1; display:flex; flex-direction:column; gap:6px; padding:18px 26px; transition:background var(--t); }
.cs-col:hover { background:rgba(5,150,105,.04); }
.cs-warn { background:rgba(245,158,11,.04); }
.cs-warn:hover { background:rgba(245,158,11,.09); }
.cs-sep { width:1px; background:rgba(16,185,129,.12); flex-shrink:0; margin:12px 0; }
.cs-num { font-size:30px; font-weight:900; letter-spacing:-1.2px; color:var(--c-txt); line-height:1; display:flex; align-items:baseline; gap:7px; font-variant-numeric:tabular-nums; flex-wrap:wrap; }
.cs-amber { color:#D97706; }
.cs-tag { font-size:10px; font-weight:700; padding:2px 7px; border-radius:var(--r-pill); background:#fffbeb; color:#B45309; border:1px solid rgba(245,158,11,.25); letter-spacing:.2px; vertical-align:middle; }
.cs-tag-green { background:var(--c-success-bg); color:var(--c-primary); border-color:rgba(16,185,129,.18); }
.cs-lbl { font-size:11px; color:var(--c-txt-3); font-weight:600; letter-spacing:.2px; }

/* ── Delta ── */
.cs-delta { font-size:10.5px; font-weight:600; margin-top:-3px; }
.cs-up    { color:#2e7d32; }
.cs-ok    { color:#2e7d32; }
.cs-down  { color:var(--c-danger); }

/* ── Sparkline ── */
.spark-wrap { display:flex; align-items:flex-end; gap:3px; height:28px; margin:4px 0 2px; }
.spark-bar  { flex:1; background:#e2e8f0; border-radius:3px 3px 0 0; min-height:3px; transition:height .4s; }
.spark-bar.spark-active { background:linear-gradient(180deg,#5eead4,#059669); }

/* ── Donut ring ── */
.cs-pending-row { display:flex; align-items:center; gap:11px; }
.donut-wrap { flex-shrink:0; }
.donut-ring {
  width:46px; height:46px; border-radius:50%;
  -webkit-mask: radial-gradient(circle,transparent 52%,black 53%);
  mask: radial-gradient(circle,transparent 52%,black 53%);
}
.donut-legend { display:flex; align-items:center; flex-wrap:wrap; gap:3px; margin-top:5px; font-size:10px; color:var(--c-txt-3); font-weight:600; }
.dl-dot { width:7px; height:7px; border-radius:50%; display:inline-block; flex-shrink:0; }

/* ── Month timeline bar ── */
.ctx-timeline { padding:10px 26px 14px; position:relative; z-index:2; }
.ctl-row  { display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; }
.ctl-label { font-size:11px; font-weight:600; color:var(--c-txt-3); }
.ctl-pct   { font-size:11px; font-weight:700; color:var(--c-primary); }
.ctl-track { height:4px; background:rgba(13,148,136,.1); border-radius:99px; overflow:hidden; }
.ctl-fill  { height:100%; background:linear-gradient(90deg,#5eead4,#059669); border-radius:99px; transition:width .8s ease; }

/* ══ MAIN LAYOUT ══ */
.dl-flex   { display:flex; gap:20px; align-items:flex-start; }
.list-card { flex:1 1 auto; min-width:0; }
.dl-card   { background:var(--c-surface); border-radius:var(--r-card); border:1px solid var(--c-border); box-shadow:var(--sh-card); overflow:hidden; }

/* ══ LIST CARD ══ */
.lc-hd { padding:16px 20px 14px; border-bottom:1px solid var(--c-border); display:flex; flex-direction:column; gap:10px; }
.lc-title-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.lc-title { font-size:15px; font-weight:700; margin:0; }
.count-badge { background:var(--c-success-bg); color:var(--c-primary); font-size:11px; font-weight:700; padding:2px 8px; border-radius:var(--r-pill); border:1px solid rgba(13,148,136,.15); }
.clear-btn { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; color:var(--c-danger); background:var(--c-danger-bg); border:1px solid rgba(239,68,68,.15); border-radius:var(--r-pill); padding:2px 8px; cursor:pointer; }
.lc-tools  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.search-wrap { position:relative; flex:1; min-width:160px; }
.search-ic  { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--c-txt-3); pointer-events:none; }
.search-inp { width:100%; padding:7px 10px 7px 32px; border:1px solid var(--c-border); border-radius:var(--r-md); font-size:13px; color:var(--c-txt); background:var(--c-bg); outline:none; box-sizing:border-box; transition:border-color var(--t); }
.search-inp:focus { border-color:var(--c-primary); background:#fff; }
.psel { border:1px solid var(--c-border); border-radius:var(--r-sm); padding:7px 10px; font-size:12px; font-weight:500; color:var(--c-txt-2); background:var(--c-bg); outline:none; cursor:pointer; }

/* ── Status tabs ── */
.stab-group { display:flex; background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-md); padding:3px; gap:2px; margin-left:auto; flex-shrink:0; }
.stab { padding:4px 10px; border:none; border-radius:var(--r-sm); font-size:11px; font-weight:700; cursor:pointer; background:transparent; color:var(--c-txt-3); transition:all var(--t); font-family:inherit; display:inline-flex; align-items:center; gap:4px; white-space:nowrap; }
.stab:hover { background:#fff; color:var(--c-txt-2); }
.stab.active { background:#fff; color:var(--c-txt); box-shadow:0 1px 3px rgba(15,23,42,.08); }
.stab-green.active { background:rgba(13,148,136,.08); color:#065f46; }
.stab-warn.active  { background:#fef3c7; color:#b45309; }
.stab-n { font-size:10px; background:rgba(15,23,42,.06); padding:0 5px; border-radius:3px; line-height:1.6; }

/* ══ TABLE ══ */
.table-wrap { overflow-x:auto; }
.dl-table { width:100%; border-collapse:collapse; font-size:13px; table-layout:fixed; }
.dl-table thead tr { background:var(--c-bg); border-bottom:1px solid var(--c-border); }
.dl-table th { padding:10px 14px; text-align:left; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--c-txt-3); white-space:nowrap; }
.dl-table td { padding:11px 14px; border-bottom:1px solid var(--c-border-s); vertical-align:middle; }
.mh-row { cursor:pointer; transition:background var(--t); }
.mh-row:hover { background:rgba(15,23,42,.02); }
.mh-row.selected { background:var(--c-success-bg); }
.mh-row:last-child td { border-bottom:none; }
.sort-hd { display:inline-flex; align-items:center; gap:4px; cursor:pointer; user-select:none; }
.sort-hd-r { display:flex !important; justify-content:flex-end; }
.sort-arrow { display:inline-flex; align-items:center; }
.text-right  { text-align:right; }
.text-center { text-align:center; }
.col-mono { font-variant-numeric:tabular-nums; font-size:12px; }
.muted    { color:var(--c-txt-3); }

.mh-code {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:62px;
  white-space:nowrap;
  font-size:12px;
  font-weight:700;
  color:#475569;
  background:#f8fafc;
  border:1px solid #e2e8f0;
  padding:3px 7px;
  border-radius:6px;
  font-variant-numeric:tabular-nums;
  box-sizing:border-box;
}
.mh-name-cell { display:flex; align-items:center; gap:10px; min-width:0; }
.mh-name-cell > div { min-width:0; }
.mh-name { font-size:13px; font-weight:600; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cat-chip { font-size:10px; font-weight:600; padding:2px 7px; border-radius:var(--r-pill); background:var(--c-bg); border:1px solid var(--c-border); color:var(--c-txt-3); align-self:flex-start; }
.prod-thumb { position:relative; width:44px; height:44px; border-radius:8px; flex-shrink:0; overflow:hidden; background:white; border:1px solid rgba(0,0,0,.08); box-shadow:0 1px 4px rgba(0,0,0,.10); }
.prod-img   { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; padding:4px; box-sizing:border-box; z-index:2; background:white; display:block; }
.prod-init  { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:white; }
.price-num { display:inline-block; min-width:74px; font-weight:700; font-size:12px; font-variant-numeric:tabular-nums; color:var(--c-txt-2); text-align:right; }
.sell-price { color:#2e7d32; }

/* ── Stock cell ── */
.stock-cell {
  width:116px;
  margin-left:auto;
  padding:7px 9px;
  border:1px solid #e2e8f0;
  border-radius:10px;
  background:#fff;
  box-sizing:border-box;
}
.stock-cell.stock-ok { background:#f4fbf5; border-color:#dcefe1; }
.stock-cell.stock-low { background:#fff8ed; border-color:#fde4bd; }
.stock-cell.stock-out { background:#fff5f5; border-color:#fecaca; }
.stock-head { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px; }
.stock-num { font-size:13px; font-weight:800; font-variant-numeric:tabular-nums; color:#334155; }
.stock-cell.stock-ok .stock-num  { color:#2e7d32; }
.stock-cell.stock-low .stock-num { color:#d97706; }
.stock-cell.stock-out .stock-num { color:var(--c-danger); }
.stock-state {
  min-width:30px;
  text-align:center;
  font-size:10px;
  line-height:1.5;
  font-weight:700;
  border-radius:var(--r-pill);
  padding:1px 6px;
  background:#f1f5f9;
  color:#64748b;
}
.stock-cell.stock-ok .stock-state { background:#dff3e5; color:#2e7d32; }
.stock-cell.stock-low .stock-state { background:#ffedd5; color:#c2410c; }
.stock-cell.stock-out .stock-state { background:#fee2e2; color:#b91c1c; }
.stock-mini-bar { width:100%; height:4px; background:#e8edf4; border-radius:99px; overflow:hidden; }
.stock-mini-fill { height:100%; border-radius:99px; transition:width .4s; }

.col-actions-head { width:96px; }
.col-actions { text-align:center; white-space:nowrap; padding-left:8px !important; padding-right:8px !important; }
.action-group { width:94px; margin:0 auto; display:grid; grid-template-columns:repeat(3, 28px); gap:5px; align-items:center; justify-content:center; }
.act-btn  { width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border:none; border-radius:var(--r-sm); cursor:pointer; transition:background var(--t), transform var(--t); }
.act-btn:hover { transform:translateY(-1px); }
.view-btn { background:rgba(13,148,136,.08); color:var(--c-primary); }
.view-btn:hover { background:rgba(13,148,136,.18); }
.edit-btn { background:rgba(37,99,235,.08); color:#2563eb; }
.edit-btn:hover { background:rgba(37,99,235,.16); }
.del-btn  { background:rgba(239,68,68,.08); color:var(--c-danger); }
.del-btn:hover { background:rgba(239,68,68,.18); }

.empty-row { text-align:center; padding:40px 0; color:var(--c-txt-3); }
.empty-ic  { margin:0 auto 8px; display:block; opacity:.35; }
.lc-foot   { padding:10px 20px; font-size:11.5px; font-weight:600; color:#64748b; border-top:1px solid var(--c-border-s); }

/* ══ SIDE PANEL ══ */
.side-panel {
  display:flex;
  flex-direction:column;
  width:360px;
  flex-shrink:0;
  max-height:calc(100vh - 200px);
  position:sticky;
  top:16px;
  overflow:hidden;
  background:linear-gradient(180deg,#fbfdff 0%,#fffaf4 100%);
}

.ap-hd { padding:18px 18px 14px; border-bottom:1px solid var(--c-border); display:flex; align-items:flex-start; gap:12px; background:rgba(255,255,255,.72); }
.ap-avatar { position:relative; width:64px; height:64px; border-radius:12px; flex-shrink:0; overflow:hidden; background:white; border:1px solid rgba(0,0,0,.10); box-shadow:0 2px 8px rgba(0,0,0,.12); }
.ap-title-block { flex:1; min-width:0; }
.ap-name   { font-size:15px; font-weight:700; margin:0 0 6px; overflow:hidden; text-overflow:ellipsis; }
.ap-badges { display:flex; gap:5px; flex-wrap:wrap; align-items:center; }
.dist-chip { font-size:10px; font-weight:600; color:var(--c-txt-3); background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-pill); padding:3px 8px; }

/* ── Price section ── */
.price-section {
  margin:14px 18px 0;
  padding:14px;
  border:1px solid #bfdbfe;
  border-radius:14px;
  display:flex;
  flex-direction:column;
  gap:10px;
  background:linear-gradient(135deg, rgba(239,246,255,.86), rgba(240,253,250,.76));
}
.ps-row { display:flex; justify-content:space-between; align-items:baseline; }
.ps-lbl { font-size:11px; color:var(--c-txt-3); font-weight:600; text-transform:uppercase; letter-spacing:.4px; }
.ps-val { font-size:23px; font-weight:800; color:#047857; font-variant-numeric:tabular-nums; letter-spacing:0; }
.ps-sub-row { display:flex; justify-content:space-between; align-items:center; gap:10px; font-size:12px; }
.ps-sub-row + .ps-sub-row { padding-top:8px; border-top:1px solid rgba(148,163,184,.18); }

/* ── Stock section ── */
.stock-section {
  margin:12px 18px 0;
  padding:14px;
  border:1px solid #fed7aa;
  border-radius:14px;
  display:flex;
  flex-direction:column;
  gap:8px;
  background:linear-gradient(135deg, rgba(255,251,235,.88), rgba(255,255,255,.68));
}
.ss-num { font-size:25px; font-weight:800; font-variant-numeric:tabular-nums; letter-spacing:0; }
.ss-bar-wrap { display:flex; align-items:center; gap:8px; }
.ss-bar { flex:1; height:5px; background:#eef2f7; border-radius:99px; overflow:hidden; }
.ss-fill { height:100%; border-radius:4px; transition:width .5s; }
.ss-chip { font-size:10.5px; font-weight:700; padding:3px 9px; border-radius:var(--r-pill); }
.ss-chip.stock-ok  { background:rgba(5,150,105,.1); color:#065f46; }
.ss-chip.stock-low { background:#fef3c7; color:#92400e; }
.ss-chip.stock-out { background:var(--c-danger-bg); color:#991b1b; }

/* ── Info grid ── */
.info-grid {
  margin-top:12px;
  padding:14px 18px;
  border-top:1px solid var(--c-border);
  border-bottom:1px solid var(--c-border);
  display:flex;
  flex-direction:column;
  gap:9px;
  background:rgba(255,255,255,.42);
}
.ig-row { display:flex; align-items:flex-start; gap:8px; font-size:12px; }
.ig-ic  { color:var(--c-txt-3); flex-shrink:0; margin-top:1px; }
.ig-lbl { color:var(--c-txt-3); width:52px; flex-shrink:0; }
.ig-val { color:var(--c-txt-2); font-weight:500; flex:1; min-width:0; }

/* ── Quick links ── */
.quick-links { padding:14px 18px; display:flex; gap:8px; border-bottom:1px solid var(--c-border); background:rgba(255,255,255,.36); }
.btn-danger-o { display:inline-flex; align-items:center; gap:6px; padding:9px 14px; border-radius:var(--r-md); border:1.5px solid rgba(239,68,68,.25); background:#fef2f2; color:#dc2626; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; transition:all var(--t); }
.btn-danger-o:hover { background:#fee2e2; }

/* ══ FORM ══ */
.fc-hd { padding:16px 18px; border-bottom:1px solid var(--c-border); display:flex; justify-content:space-between; align-items:flex-start; gap:8px; background:rgba(255,255,255,.72); }
.fc-title { font-size:15px; font-weight:700; margin:0; }
.fc-sub   { font-size:11px; color:var(--c-txt-3); display:block; margin-top:2px; }
.mode-chip { font-size:10px; font-weight:700; padding:3px 9px; border-radius:var(--r-pill); flex-shrink:0; }
.mode-chip.add       { background:var(--c-success-bg); color:#065f46; border:1px solid rgba(13,148,136,.2); }
.mode-chip.edit-chip { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; }

.fc-body { flex:1; padding:16px 18px; display:flex; flex-direction:column; gap:13px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#e2e8f0 transparent; background:rgba(255,255,255,.34); }
.field     { display:flex; flex-direction:column; gap:5px; flex:1; min-width:0; }
.field.full { width:100%; }
.field-row  { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.flabel { font-size:11px; font-weight:700; color:var(--c-txt-2); }
.req    { color:var(--c-danger); }
.finp {
  padding:8px 11px; border:1px solid var(--c-border); border-radius:var(--r-md);
  font-size:13px; color:var(--c-txt); background:var(--c-bg);
  outline:none; width:100%; box-sizing:border-box;
  transition:border-color var(--t),box-shadow var(--t); font-family:inherit;
}
.finp:focus { border-color:var(--c-primary); box-shadow:0 0 0 3px rgba(13,148,136,.08); background:#fff; }
.finp.finp-err { border-color:var(--c-danger); }
.finp.finp-sm { padding:6px 8px; font-size:12px; }
.finp.finp-num { text-align:right; }
.finp[readonly] { background:#f8fafc; color:var(--c-txt-3); cursor:default; }
.err-msg { font-size:11px; color:var(--c-danger); }

.limit-row { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--c-txt-3); background:var(--c-bg); border-radius:var(--r-sm); padding:7px 10px; border:1px dashed var(--c-border); }
.limit-row strong { color:var(--c-primary); font-weight:800; margin-left:4px; }

.fc-footer { padding:14px 18px; border-top:1px solid var(--c-border); display:flex; justify-content:space-between; align-items:center; gap:8px; }

/* ══ BUTTONS ══ */
.btn-p {
  background:var(--c-primary); color:#fff; border:none; border-radius:var(--r-md);
  padding:9px 16px; font-size:13px; font-weight:600; cursor:pointer;
  transition:background var(--t),transform var(--t); font-family:inherit;
  display:inline-flex; align-items:center; gap:6px;
}
.btn-p:hover { background:var(--c-primary-d); transform:translateY(-1px); }
.btn-o {
  background:transparent; color:var(--c-primary); border:1.5px solid rgba(13,148,136,.3);
  border-radius:var(--r-md); padding:9px 16px; font-size:13px; font-weight:600;
  cursor:pointer; transition:all var(--t); font-family:inherit;
}
.btn-o:hover { background:var(--c-success-bg); }
.btn-ghost {
  background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-md);
  padding:8px 14px; font-size:12px; font-weight:600; color:var(--c-txt-2);
  cursor:pointer; transition:all var(--t); display:flex; align-items:center; gap:5px; font-family:inherit;
}
.btn-ghost:hover { background:#fff; box-shadow:var(--sh-card); }
.btn-danger { background:var(--c-danger); color:#fff; border:none; border-radius:var(--r-md); padding:9px 16px; font-size:13px; font-weight:600; cursor:pointer; transition:background var(--t); font-family:inherit; }
.btn-danger:hover { background:#dc2626; }
.btn-csv {
  background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-md);
  padding:8px 14px; font-size:12px; font-weight:600; color:var(--c-txt-2);
  cursor:pointer; transition:all var(--t); display:inline-flex; align-items:center; gap:5px; font-family:inherit;
}
.btn-csv:hover { background:#fff; box-shadow:var(--sh-card); }

/* ══ TOAST ══ */
.toast-snack {
  position:fixed; bottom:28px; right:28px; z-index:500;
  display:inline-flex; align-items:center; gap:9px;
  padding:11px 18px; border-radius:12px;
  font-size:13px; font-weight:600; font-family:inherit;
  box-shadow:0 8px 32px rgba(15,23,42,.2),0 2px 8px rgba(15,23,42,.1);
  min-width:240px;
}
.toast-snack.success { background:#ecfdf5; color:#065f46; border:1px solid rgba(13,148,136,.25); }
.toast-snack.danger  { background:#fef2f2; color:#991b1b; border:1px solid rgba(239,68,68,.2); }
.toast-snack.warn    { background:#fffbeb; color:#92400e; border:1px solid rgba(245,158,11,.2); }
.toast-enter-active { animation:toastIn .25s cubic-bezier(.2,.8,.2,1); }
.toast-leave-active { animation:toastIn .2s cubic-bezier(.2,.8,.2,1) reverse; }
@keyframes toastIn { from { opacity:0; transform:translateY(12px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }

/* ══ MODAL ══ */
.modal-bg {
  --c-primary:#059669; --c-success-bg:#ECFDF5;
  --c-danger:#EF4444; --c-danger-bg:#FEF2F2;
  --c-surface:#ffffff; --c-border:rgba(15,23,42,.07);
  --c-txt:#0f172a; --c-txt-2:#475569;
  --r-md:8px; --t:.15s ease;
  position:fixed; inset:0; z-index:200;
  background:rgba(15,23,42,.5); backdrop-filter:blur(3px);
  display:flex; align-items:center; justify-content:center; padding:20px;
  font-family:'Inter','Be Vietnam Pro',ui-sans-serif,system-ui,sans-serif;
}
.modal-box {
  width:min(420px,100%);
  background:linear-gradient(170deg,#fff5f5 0%,#fffafa 45%,#ffffff 100%);
  border-radius:20px; border:1px solid rgba(239,68,68,.13);
  box-shadow:0 8px 40px rgba(239,68,68,.1),0 2px 14px rgba(15,23,42,.08);
  padding:32px 28px 24px;
  display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px;
}
.del-avatar-wrap { position:relative; margin-bottom:4px; }
.del-prod-avatar {
  width:72px; height:72px; border-radius:18px;
  position:relative; overflow:hidden;
  box-shadow:0 4px 18px rgba(15,23,42,.14);
}
.del-avatar-img {
  position:absolute; inset:0;
  width:100%; height:100%;
  object-fit:contain; padding:10px; box-sizing:border-box; z-index:2; background:white; display:block;
}
.del-avatar-abbr {
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  color:#fff; font-size:22px; font-weight:800; letter-spacing:-.5px; z-index:0;
}
.del-trash-badge {
  position:absolute; bottom:-7px; right:-7px;
  width:28px; height:28px; border-radius:50%;
  background:#fee2e2; border:2.5px solid #fff;
  color:#ef4444;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 2px 6px rgba(239,68,68,.2);
}
.modal-title  { font-size:17px; font-weight:700; margin:0; color:#0f172a; }
.modal-desc   { font-size:13px; color:#475569; margin:0; line-height:1.6; }
.modal-actions { display:flex; gap:10px; margin-top:8px; }
.modal-actions .btn-o {
  background:transparent; color:#059669; border:1.5px solid rgba(5,150,105,.3);
  border-radius:8px; padding:9px 20px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;
}
.modal-actions .btn-o:hover { background:#ecfdf5; }
.modal-actions .btn-danger {
  background:#EF4444; color:#fff; border:none;
  border-radius:8px; padding:9px 20px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;
}
.modal-actions .btn-danger:hover { background:#dc2626; }

/* ── Panel slide ── */
.panel-enter-active { animation:panelIn .22s cubic-bezier(.4,0,.2,1); }
.panel-leave-active { animation:panelOut .18s cubic-bezier(.4,0,.2,1); }
@keyframes panelIn  { from { opacity:0; transform:translateX(18px); } to { opacity:1; transform:translateX(0); } }
@keyframes panelOut { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(18px); } }

/* ══ RESPONSIVE ══ */
@media (max-width:1100px) { .dl-flex { flex-direction:column; } .side-panel { width:100%; max-height:none; position:static; } }
@media (max-width:700px)  { .field-row { grid-template-columns:1fr; } .lc-tools { flex-direction:column; align-items:stretch; } }
</style>
