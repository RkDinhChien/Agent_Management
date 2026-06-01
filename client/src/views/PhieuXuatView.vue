<template>
  <div class="px">

    <!-- ══ CONTEXT BANNER ══ -->
    <div class="ctx-card">

      <!-- Hexagon decoration -->
      <svg class="ctx-deco" viewBox="0 0 300 155" fill="none" aria-hidden="true">
        <defs>
          <polygon id="pxhx" points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"/>
        </defs>
        <g stroke="#059669" stroke-width=".9" opacity=".12">
          <use href="#pxhx" transform="translate(21,24)"/>  <use href="#pxhx" transform="translate(62,24)"/>
          <use href="#pxhx" transform="translate(103,24)"/> <use href="#pxhx" transform="translate(144,24)"/>
          <use href="#pxhx" transform="translate(185,24)"/> <use href="#pxhx" transform="translate(226,24)"/>
          <use href="#pxhx" transform="translate(267,24)"/>
          <use href="#pxhx" transform="translate(0,60)"/>   <use href="#pxhx" transform="translate(41,60)"/>
          <use href="#pxhx" transform="translate(82,60)"/>  <use href="#pxhx" transform="translate(123,60)"/>
          <use href="#pxhx" transform="translate(164,60)"/> <use href="#pxhx" transform="translate(205,60)"/>
          <use href="#pxhx" transform="translate(246,60)"/> <use href="#pxhx" transform="translate(287,60)"/>
          <use href="#pxhx" transform="translate(21,96)"/>  <use href="#pxhx" transform="translate(62,96)"/>
          <use href="#pxhx" transform="translate(103,96)"/> <use href="#pxhx" transform="translate(144,96)"/>
          <use href="#pxhx" transform="translate(185,96)"/> <use href="#pxhx" transform="translate(226,96)"/>
          <use href="#pxhx" transform="translate(267,96)"/>
          <use href="#pxhx" transform="translate(0,132)"/>  <use href="#pxhx" transform="translate(41,132)"/>
          <use href="#pxhx" transform="translate(82,132)"/> <use href="#pxhx" transform="translate(123,132)"/>
          <use href="#pxhx" transform="translate(164,132)"/><use href="#pxhx" transform="translate(205,132)"/>
          <use href="#pxhx" transform="translate(246,132)"/><use href="#pxhx" transform="translate(287,132)"/>
        </g>
        <g stroke="#059669" stroke-width="1.2" opacity=".26">
          <use href="#pxhx" transform="translate(144,60)"/>
          <use href="#pxhx" transform="translate(185,24)"/>
          <use href="#pxhx" transform="translate(226,96)"/>
        </g>
        <polygon points="144,36 164.8,48 164.8,72 144,84 123.2,72 123.2,48" fill="#059669" opacity=".06"/>
        <polygon points="185,0 205.8,12 205.8,36 185,48 164.2,36 164.2,12" fill="#059669" opacity=".05"/>
        <g fill="#059669" opacity=".45">
          <circle cx="144" cy="60" r="3.5"/><circle cx="185" cy="24" r="3"/><circle cx="226" cy="96" r="3"/>
        </g>
        <g stroke="#059669" stroke-width=".8" stroke-dasharray="3 4" opacity=".18">
          <line x1="144" y1="60" x2="185" y2="24"/>
          <line x1="144" y1="60" x2="226" y2="96"/>
        </g>
        <g fill="#059669" opacity=".28">
          <circle cx="62" cy="24" r="2"/><circle cx="267" cy="60" r="2"/><circle cx="103" cy="132" r="2"/>
        </g>
      </svg>

      <svg class="ctx-wm" viewBox="0 0 110 80" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="5" y="18" width="62" height="42" rx="5"/>
        <path d="M67 32h18l16 18v18H67V32z"/>
        <circle cx="24" cy="70" r="9"/>
        <circle cx="85" cy="70" r="9"/>
        <line x1="33" y1="70" x2="76" y2="70"/>
        <line x1="5" y1="70" x2="15" y2="70"/>
        <line x1="25" y1="35" x2="55" y2="35" stroke-width="3"/>
        <line x1="25" y1="45" x2="45" y2="45" stroke-width="3"/>
      </svg>

      <div class="ctx-top">
        <div class="ctx-title-block">
          <p class="ctx-eyebrow">Nghiệp vụ · Phiếu xuất hàng</p>
          <h1 class="ctx-title">Xuất Hàng</h1>
          <p class="ctx-sub">Giao đúng hàng, đúng đại lý, đúng giá — không bỏ sót · {{ monthName }}/{{ _now.getFullYear() }}</p>
        </div>
        <div class="ctx-actions">
          <button class="btn-csv" @click="exportCSV"><Download :size="13"/> Xuất CSV</button>
          <button class="btn-p" @click="openCreate"><Plus :size="14"/> Lập phiếu xuất</button>
        </div>
      </div>

      <div class="ctx-divider"></div>

      <div class="ctx-stats">

        <!-- KPI 1: Tổng phiếu -->
        <div class="cs-col">
          <strong class="cs-num">{{ thisMonthCount }}</strong>
          <span class="cs-delta" :class="countDelta >= 0 ? 'cs-up' : 'cs-down'">
            {{ countDelta >= 0 ? '↑' : '↓' }} {{ Math.abs(countDelta) }} so với tháng trước
          </span>
          <span class="cs-lbl">Tổng phiếu tháng này</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 2: Doanh thu + sparkline -->
        <div class="cs-col">
          <strong class="cs-num">{{ fmtSummary(thisMonthRevenue) }}</strong>
          <span class="cs-delta" :class="revDelta >= 0 ? 'cs-up' : 'cs-down'">
            {{ revDelta >= 0 ? '↑' : '↓' }} {{ Math.abs(revDelta).toFixed(1) }}% so với tháng trước
          </span>
          <div class="spark-wrap">
            <div v-for="(h, i) in spark" :key="i"
                 class="spark-bar" :class="{ 'spark-active': i === spark.length - 1 }"
                 :style="{ height: (h / maxSpark * 100) + '%' }"
                 :title="sparkLabels[i] + ': ' + h + ' Tr'">
            </div>
          </div>
          <span class="cs-lbl">Doanh thu đã giao</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 4: Đại lý nợ -->
        <div class="cs-col">
          <strong class="cs-num">
            {{ overDebtCount }}
            <span class="cs-tag cs-tag-red" v-if="overDebtCount > 0">vượt hạn mức</span>
          </strong>
          <span class="cs-delta" :class="overDelta <= 0 ? 'cs-up' : 'cs-down'">
            {{ overDelta > 0 ? '↑ ' : '↓ ' }}{{ Math.abs(overDelta) }} so với tháng trước
          </span>
          <span class="cs-lbl">Đại lý quá hạn mức nợ</span>
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
            <h3 class="lc-title">Danh sách phiếu xuất</h3>
            <span class="count-badge">{{ filteredList.length }} / {{ receipts.length }}</span>
            <button v-if="hasFilter" class="clear-btn" @click="clearFilters">
              <X :size="11"/> Xóa lọc
            </button>

          </div>
          <div class="lc-tools">
            <div class="search-wrap">
              <Search :size="14" class="search-ic"/>
              <input v-model="searchQ" class="search-inp" placeholder="Tìm mã phiếu, tên đại lý…"/>
            </div>
            <select v-model="filterAgent" class="psel">
              <option value="">Tất cả đại lý</option>
              <option v-for="a in agents" :key="a.id" :value="a.name">{{ a.name }}</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="dl-table">
            <colgroup>
              <col style="width:12%"/>
              <col style="width:12%"/>
              <col/>
              <col style="width:13%"/>
              <col style="width:14%"/>
              <col style="width:13%"/>
            </colgroup>
            <thead>
              <tr>
                <th><span class="sort-hd" @click="toggleSort('code')">Mã phiếu <SortIcon field="code" :sk="sk" :sd="sd"/></span></th>
                <th><span class="sort-hd" @click="toggleSort('rawDate')">Ngày xuất <SortIcon field="rawDate" :sk="sk" :sd="sd"/></span></th>
                <th>Đại lý</th>
                <th class="text-center">Số mặt hàng</th>
                <th class="text-right"><span class="sort-hd" @click="toggleSort('total')">Tổng cộng <SortIcon field="total" :sk="sk" :sd="sd"/></span></th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in sortedList" :key="r.id"
                class="px-row" :class="{ selected: selectedId === r.id }"
                @click="openView(r)">
                <td><span class="px-code">{{ r.code }}</span></td>
                <td class="muted col-mono">{{ r.date }}</td>
                <td>
                  <div class="agent-cell">
                    <div class="agent-av">
                      <img :src="agentBrand(r.agentId).logo" class="av-logo" :alt="r.agent" @error="e => e.target.style.display='none'"/>
                      <span class="av-init" :style="{ background: agentBrand(r.agentId).bg }">{{ avatarInit(r.agent) }}</span>
                    </div>
                    <div class="agent-info">
                      <span class="agent-name">{{ r.agent }}</span>
                      <span class="agent-debt" :class="debtClass(r.agentId)">
                        Nợ: {{ fmtMoney(getAgent(r.agentId)?.debt) }}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="item-cnt-chip">{{ r.items.length }} mặt hàng</span>
                </td>
                <td class="text-right col-total">
                  <span class="total-num">{{ fmtTr(r.total) }}</span>
                </td>
                <td class="col-actions">
                  <div class="act-group">
                    <button class="act-btn edit-btn" data-tooltip="Sửa phiếu" @click.stop="openEdit(r)"><Edit2 :size="13"/></button>
                    <button class="act-btn del-btn" data-tooltip="Xóa phiếu" @click.stop="askDelete(r)"><Trash2 :size="13"/></button>
                  </div>
                </td>
              </tr>
              <tr v-if="!sortedList.length">
                <td colspan="6" class="empty-row">
                  <PackageOpen :size="30" class="empty-ic"/><p>Không tìm thấy phiếu xuất phù hợp</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="lc-foot" v-if="sortedList.length">
          Hiển thị {{ sortedList.length }} phiếu xuất
          <span v-if="hasFilter"> (đã lọc từ {{ receipts.length }})</span>
        </div>
      </div>

      <!-- ════ SIDE PANEL ════ -->
      <Transition name="panel">
      <div class="dl-card side-panel" v-if="panelVisible">

        <!-- ─ VIEW MODE ─ -->
        <template v-if="panelMode === 'view' && selectedReceipt">
          <div class="ap-hd">
            <div class="ap-avatar">
              <img :src="agentBrand(selectedReceipt.agentId).logo" class="av-logo" :alt="selectedReceipt.agent" @error="e => e.target.style.display='none'"/>
              <span class="av-init" :style="{ background: agentBrand(selectedReceipt.agentId).bg }">{{ avatarInit(selectedReceipt.agent) }}</span>
            </div>
            <div class="ap-title-block">
              <h3 class="ap-name">{{ selectedReceipt.code }}</h3>
              <div class="ap-badges">
                <span class="dist-chip">{{ selectedReceipt.items.length }} mặt hàng</span>
              </div>
            </div>
            <div style="display:flex;gap:5px">
              <button class="act-btn" style="background:rgba(15,23,42,.04);color:var(--c-txt-3)" data-tooltip="Đóng" @click="closePanel"><X :size="14"/></button>
            </div>
          </div>

          <div class="ap-body">
            <!-- Info grid -->
            <div class="info-grid">
              <div class="ig-row">
                <Store :size="13" class="ig-ic"/>
                <span class="ig-lbl">Đại lý</span>
                <span class="ig-val" style="font-weight:600">{{ selectedReceipt.agent }}</span>
              </div>
              <div class="ig-row">
                <CalendarDays :size="13" class="ig-ic"/>
                <span class="ig-lbl">Ngày xuất</span>
                <span class="ig-val col-mono">{{ selectedReceipt.date }}</span>
              </div>
            </div>



            <!-- Financial Summary Card -->
            <div class="financial-card">
              <div class="gauge-section-compact">
                <div class="val-summary">
                  <div class="vs-main">
                    <span class="vs-label">Tổng tiền phiếu</span>
                    <span class="vs-val">{{ fmtTr(selectedReceipt.total) }}</span>
                  </div>
                  <div class="vs-bar-wrap">
                    <div class="vs-bar">
                      <div class="vs-fill" :style="{ width: revBarPct(selectedReceipt) + '%', background: revBarColor(selectedReceipt) }"></div>
                    </div>
                    <span class="vs-pct">{{ Math.round(revBarPct(selectedReceipt)) }}%</span>
                  </div>
                </div>

                <!-- Agent debt bar -->
                <div class="debt-section-compact">
                  <div class="debt-hd">
                    <span class="debt-lbl">Nợ đại lý</span>
                    <span class="debt-val" :class="debtClass(selectedReceipt.agentId)">
                      {{ fmtMoney(getAgent(selectedReceipt.agentId)?.debt) }}
                      / {{ fmtMoney(getAgent(selectedReceipt.agentId)?.limit) }}
                    </span>
                  </div>
                  <div class="debt-bar-wrap">
                    <div class="debt-bar">
                      <div class="debt-fill" :style="{ width: agentDebtPct(selectedReceipt.agentId) + '%', background: debtBarColor(selectedReceipt.agentId) }"></div>
                    </div>
                    <span class="debt-pct-lbl" :class="debtClass(selectedReceipt.agentId)">{{ Math.round(agentDebtPct(selectedReceipt.agentId)) }}%</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Items list (Natural flow height, scrolls within .ap-body) -->
            <div class="items-section">
              <p class="recent-title">Danh sách mặt hàng</p>
              <div class="items-hd">
                <span style="flex:1.6;min-width:0">Mặt hàng</span>
                <span style="width:32px;flex-shrink:0;text-align:center">SL</span>
                <span style="width:80px;flex-shrink:0;text-align:right">Đơn giá</span>
                <span style="width:88px;flex-shrink:0;text-align:right">Thành tiền</span>
              </div>
              <div class="item-row" v-for="item in selectedReceipt.items" :key="item.name">
                <span class="item-name" style="flex:1.6;min-width:0">{{ item.name }}</span>
                <span style="width:32px;flex-shrink:0;text-align:center;color:#64748b;font-size:12px">{{ item.qty.toLocaleString('vi-VN') }}</span>
                <span style="width:80px;flex-shrink:0;text-align:right;color:#475569;font-size:12px;font-variant-numeric:tabular-nums">{{ fmtVND(item.price) }}</span>
                <span style="width:88px;flex-shrink:0;text-align:right;font-weight:700;font-size:12px;font-variant-numeric:tabular-nums">{{ fmtVND(item.qty * item.price) }}</span>
              </div>
              <div class="items-total">
                <span>Tổng cộng</span>
                <strong>{{ fmtVND(selectedReceipt.total) }}</strong>
              </div>

              <!-- Thanh toán -->
              <div class="payment-summary">
                <div class="ps-row">
                  <span class="ps-lbl">Đã trả</span>
                  <span class="ps-val ps-paid">{{ fmtVND(selectedReceipt.tienTra) }}</span>
                </div>
                <div class="ps-row ps-conlai-row">
                  <span class="ps-lbl">Còn lại (nợ)</span>
                  <span class="ps-val" :class="selectedReceipt.conLai > 0 ? 'conlai-debt' : 'conlai-clear'">
                    {{ fmtVND(selectedReceipt.conLai) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sticky Footer Actions (Only show when pending) -->

        </template>

        <!-- ─ EDIT MODE ─ -->
        <template v-else-if="panelMode === 'edit'">
          <div class="fc-hd">
            <div>
              <h3 class="fc-title">Chỉnh sửa phiếu xuất</h3>
              <span class="fc-sub">{{ selectedReceipt?.code ?? '' }}</span>
            </div>
            <div style="display:flex;gap:5px;align-items:center">
              <span class="mode-chip edit-chip">Sửa</span>
              <button class="act-btn" style="background:rgba(15,23,42,.04);color:var(--c-txt-3)" @click="panelMode = 'view'"><X :size="14"/></button>
            </div>
          </div>
          <div class="fc-body">
            <div class="field full">
              <label class="flabel">Đại lý <span class="req">*</span></label>
              <select v-model="form.agentId" class="finp" :class="{ 'finp-err': errors.agent }" @change="onAgentChange">
                <option value="">— Chọn đại lý —</option>
                <option v-for="a in agents" :key="a.id" :value="a.id">{{ a.name }}</option>
              </select>
              <span class="err-msg" v-if="errors.agent">{{ errors.agent }}</span>
            </div>
            <div class="debt-hint" v-if="formAgent">
              <div class="dh-row">
                <span>Nợ hiện tại</span>
                <strong :class="debtClass(formAgent.id)">{{ fmtMoney(formAgent.debt) }} / {{ fmtMoney(formAgent.limit) }}</strong>
              </div>
              <div class="dh-bar"><div class="dh-fill" :style="{ width: agentDebtPct(formAgent.id)+'%', background: debtBarColor(formAgent.id) }"></div></div>
            </div>
            <div class="field full">
              <label class="flabel">Ngày xuất</label>
              <input v-model="form.date" type="date" class="finp" :max="today"/>
            </div>
            <div class="field full">
              <label class="flabel">Danh sách mặt hàng <span class="req">*</span></label>
              <div class="items-form-list">
                <div class="items-form-hd">
                  <span style="flex:2">Mặt hàng</span>
                  <span style="flex:.75;text-align:center">SL</span>
                  <span style="flex:1">Đơn giá</span>
                  <span style="width:26px"></span>
                </div>
                <div v-for="(item, idx) in form.items" :key="idx" class="item-form-row">
                  <select v-model="item.name" class="finp finp-sm" style="flex:2" @change="onProductChange(item)">
                    <option value="">Chọn mặt hàng</option>
                    <option v-for="p in products" :key="p.name" :value="p.name">{{ p.name }}</option>
                  </select>
                  <input v-model.number="item.qty" type="number" min="1" class="finp finp-sm finp-num" style="flex:.75" placeholder="SL"/>
                  <input :value="item.price ? item.price.toLocaleString('vi-VN') : ''" type="text" class="finp finp-sm finp-num" style="flex:1;background:#f8fafc" placeholder="0" readonly/>
                  <button type="button" class="act-btn del-btn" style="flex-shrink:0" @click="removeItem(idx)" :disabled="form.items.length <= 1"><Trash2 :size="11"/></button>
                </div>
                <button type="button" class="add-item-btn" @click="addItem"><Plus :size="13"/> Thêm mặt hàng</button>
              </div>
              <span class="err-msg" v-if="errors.items">{{ errors.items }}</span>
            </div>
            <div class="limit-row">
              <Package :size="11"/>
              Tổng cộng (ước tính): <strong>{{ fmtVND(formTotal) }}</strong>
            </div>
          </div>
          <div class="fc-footer">
            <button class="btn-ghost" @click="panelMode = 'view'"><X :size="12"/> Hủy</button>
            <button class="btn-p" @click="submitEdit"><Edit2 :size="13"/> Cập nhật</button>
          </div>
        </template>

        <!-- ─ CREATE MODE ─ -->
        <template v-else-if="panelMode === 'create'">
          <div class="fc-hd">
            <div>
              <h3 class="fc-title">Lập phiếu xuất hàng</h3>
              <span class="fc-sub">Điền thông tin và danh sách mặt hàng</span>
            </div>
            <span class="mode-chip add">Mới</span>
          </div>
          <div class="fc-body">
            <div class="field full">
              <label class="flabel">Đại lý <span class="req">*</span></label>
              <select v-model="form.agentId" class="finp" :class="{ 'finp-err': errors.agent }" @change="onAgentChange">
                <option value="">— Chọn đại lý —</option>
                <option v-for="a in agents" :key="a.id" :value="a.id">{{ a.name }}</option>
              </select>
              <span class="err-msg" v-if="errors.agent">{{ errors.agent }}</span>
            </div>
            <!-- Debt hint when agent selected -->
            <div class="debt-hint" v-if="formAgent">
              <div class="dh-row">
                <span>Nợ hiện tại</span>
                <strong :class="debtClass(formAgent.id)">{{ fmtMoney(formAgent.debt) }} / {{ fmtMoney(formAgent.limit) }}</strong>
              </div>
              <div class="dh-bar"><div class="dh-fill" :style="{ width: agentDebtPct(formAgent.id)+'%', background: debtBarColor(formAgent.id) }"></div></div>
              <span class="dh-warn" v-if="agentDebtPct(formAgent.id) >= 80">
                ⚠ Đại lý gần đạt hạn mức nợ
              </span>
            </div>
            <div class="field full">
              <label class="flabel">Ngày xuất <span class="req">*</span></label>
              <input v-model="form.date" type="date" class="finp" :max="today"/>
            </div>
            <div class="field full">
              <label class="flabel">Danh sách mặt hàng <span class="req">*</span></label>
              <div class="items-form-list">
                <div class="items-form-hd">
                  <span style="flex:2">Mặt hàng</span>
                  <span style="flex:.75;text-align:center">SL</span>
                  <span style="flex:1">Đơn giá</span>
                  <span style="width:26px"></span>
                </div>
                <div v-for="(item, idx) in form.items" :key="idx" class="item-form-row">
                  <select v-model="item.name" class="finp finp-sm" style="flex:2" @change="onProductChange(item)">
                    <option value="">Chọn mặt hàng</option>
                    <option v-for="p in products" :key="p.name" :value="p.name">{{ p.name }}</option>
                  </select>
                  <input v-model.number="item.qty" type="number" min="1" class="finp finp-sm finp-num" style="flex:.75" placeholder="SL"/>
                  <input v-model.number="item.price" type="number" step="0.001" class="finp finp-sm finp-num" style="flex:1" placeholder="0.00" readonly/>
                  <button type="button" class="act-btn del-btn" style="flex-shrink:0" @click="removeItem(idx)" :disabled="form.items.length <= 1"><Trash2 :size="11"/></button>
                </div>
                <button type="button" class="add-item-btn" @click="addItem"><Plus :size="13"/> Thêm mặt hàng</button>
              </div>
              <span class="err-msg" v-if="errors.items">{{ errors.items }}</span>
            </div>
            <div class="limit-row">
              <Package :size="11"/>
              Tổng cộng: <strong>{{ fmtVND(formTotal) }}</strong>
            </div>

            <div class="payment-block">
              <div class="field full">
                <label class="flabel">Số tiền trả ngay</label>
                <MoneyInput
                  v-model="form.tienTra"
                  :input-class="['finp', form.tienTra > formTotal ? 'finp-err' : '']"
                  placeholder="0"
                />
                <span class="err-msg" v-if="form.tienTra > formTotal">Tiền trả không được vượt tổng tiền</span>
              </div>
              <div class="conlai-row">
                <span class="conlai-lbl">Còn lại (nợ)</span>
                <span class="conlai-val" :class="formConLai > 0 ? 'conlai-debt' : 'conlai-clear'">
                  {{ fmtVND(formConLai) }}
                </span>
              </div>
            </div>
          </div>
          <div class="fc-footer">
            <button class="btn-ghost" @click="closePanel"><X :size="12"/> Hủy</button>
            <button class="btn-p" @click="submitCreate">Lập phiếu xuất</button>
          </div>
        </template>

      </div>
      </Transition>
    </div>

    <!-- ══ TOAST ══ -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="toast-snack" :class="toast.type">
          <Truck       v-if="toast.type === 'success'" :size="15"/>
          <XCircle     v-else-if="toast.type === 'danger'" :size="15"/>
          <Clock       v-else :size="15"/>
          <span class="toast-msg">{{ toast.msg }}</span>
          <button v-if="toast.undoFn" class="toast-undo-btn" @click="toast.undoFn">
            <Undo2 :size="12"/> Hoàn tác
            <span class="toast-countdown">{{ undoCountdown }}s</span>
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ DELETE MODAL ══ -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-bg" @click="deleteTarget = null">
        <div class="modal-box" @click.stop>
          <div class="del-avatar-wrap">
            <div class="del-agent-avatar" :style="{ background: agentBrand(deleteTarget.agentId).bg }">
              <img :src="agentBrand(deleteTarget.agentId).logo" class="del-avatar-img" :alt="deleteTarget.agent" @error="e => e.target.style.display='none'"/>
              <span class="del-avatar-abbr">{{ avatarInit(deleteTarget.agent) }}</span>
            </div>
            <div class="del-trash-badge"><Trash2 :size="13"/></div>
          </div>
          <h4 class="modal-title">Xác nhận xóa phiếu xuất</h4>
          <p class="modal-desc">
            Bạn có chắc muốn xóa <strong>{{ deleteTarget.code }}</strong>?<br/>
            <span style="color:#94a3b8">{{ deleteTarget.agent }}</span><br/>
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
import { ref, computed, reactive, onMounted, watch } from 'vue';
import api from '../services/api';
import { parseError } from '../utils/errorMessages';
import MoneyInput from '../components/MoneyInput.vue';
import {
  Search, Plus, Download, X, Eye, XCircle,
  Trash2, PackageOpen, Package, CalendarDays,
  UserRound, FileText, Clock, Edit2, Truck, Store, Undo2,
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
const STATUS      = { pending: 'Chờ giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };
const STATUS_DESC = {
  pending:   'Phiếu đang chờ giao hàng',
  delivered: 'Đã giao hàng thành công',
  cancelled: 'Phiếu xuất đã bị hủy',
};

const AGENT_CLR = [
  'linear-gradient(135deg,#059669,#34d399)',
  'linear-gradient(135deg,#0d9488,#2dd4bf)',
  'linear-gradient(135deg,#0284c7,#38bdf8)',
  'linear-gradient(135deg,#4f46e5,#818cf8)',
  'linear-gradient(135deg,#0891b2,#22d3ee)',
  'linear-gradient(135deg,#7c3aed,#a78bfa)',
];
const agentColor = (id) => AGENT_CLR[id % AGENT_CLR.length];

const BRANDS = [
  { bg:'#0066A1', logo:'https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_logo_new.svg' },
  { bg:'#003087', logo:'/logos/panasonic.svg' },
  { bg:'#1428A0', logo:'https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg' },
  { bg:'#A50034', logo:'https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg' },
  { bg:'#009999', logo:'https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg' },
  { bg:'#1b7a30', logo:'https://upload.wikimedia.org/wikipedia/commons/9/95/Schneider_Electric_2007.svg' },
  { bg:'#C8001A', logo:'https://iconape.com/wp-content/png_logo_vector/dien-quang-logo.png' },
  { bg:'#d97706', logo:'https://cdn.haitrieu.com/wp-content/uploads/2022/08/logo-rang-dong.png' },
]
const agentBrand = (id) => BRANDS[(id - 1 + BRANDS.length) % BRANDS.length]
const avatarInit = (name) => name.replace(/^Đại lý\s*/i,'').trim().charAt(0).toUpperCase();

const agents = ref([]);
const products = ref([]);

const loadAgents = async () => {
  try {
    const res = await api.get('/dai-ly');
    agents.value = (res.data?.data || []).map(a => ({
      id: a.MaDaiLy,
      name: a.TenDaiLy,
      debt: a.TongNo || 0,
      limit: 10_000_000
    }));
  } catch (err) {
    console.warn('Failed to load agents', err);
  }
};

const loadProducts = async () => {
  try {
    const res = await api.get('/mat-hang');
    products.value = (res.data?.data || []).map(p => ({
      id: p.MaMatHang,
      name: p.TenMatHang,
      sellPrice: parseFloat(p.DonGiaHienTai) || 0
    }));
  } catch (err) {
    console.warn('Failed to load products', err);
  }
};

/* ── Mock data ── */
const receipts = ref([]);

const loadReceipts = async () => {
  try {
    const res = await api.get('/phieu-xuat');
    const raw = res.data?.data || res.data || [];
    receipts.value = raw.map(r => ({
      id: r.MaPhieuXuat,
      code: `PX-${String(r.MaPhieuXuat).padStart(3, '0')}`,
      date: new Date(r.NgayLapPhieu).toLocaleDateString('vi-VN'),
      rawDate: r.NgayLapPhieu,
      agentId: r.MaDaiLy,
      agent: r.daiLy?.TenDaiLy || 'Đại lý',
      total: parseFloat(r.TongTien) || (r.chiTiets || []).reduce((s, ct) => s + (parseFloat(ct.ThanhTien) || (parseFloat(ct.SoLuongXuat) * parseFloat(ct.DonGiaXuat))), 0) || 0,
      tienTra: parseFloat(r.TienTra) || 0,
      conLai: parseFloat(r.ConLai) || 0,
      status: 'delivered',
      createdBy: 'Admin',
      items: (r.chiTiets || []).map(ct => {
        const prod = products.value.find(p => p.id === ct.MaMatHang);
        const price = parseFloat(ct.DonGiaXuat) || prod?.sellPrice || 0;
        return {
          name: ct.matHang?.TenMatHang || prod?.name || '?',
          qty: ct.SoLuongXuat || 0,
          price: price
        };
      })
    }));
    // Re-calculate totals if they are 0
    receipts.value.forEach(r => {
      if (r.total === 0) {
        r.total = r.items.reduce((s, i) => s + (i.qty * i.price), 0);
      }
    });
  } catch (err) {
    console.warn('Failed to load receipts', err?.response?.status || err.message);
  }
};

onMounted(async () => {
  await loadAgents();
  await loadProducts();
  await loadReceipts();
});

/* ── State ── */
const searchQ      = ref('');
const filterAgent  = ref('');
const filterStatus = ref('');
const sk           = ref('rawDate');
const sd           = ref('desc');
const selectedId   = ref(null);
const panelMode    = ref('view');
const deleteTarget = ref(null);

/* ── Computed ── */
const hasFilter = computed(() => searchQ.value || filterAgent.value || filterStatus.value);
const clearFilters = () => { searchQ.value = ''; filterAgent.value = ''; filterStatus.value = ''; };
const toggleSort = (key) => {
  if (sk.value === key) sd.value = sd.value === 'asc' ? 'desc' : 'asc';
  else { sk.value = key; sd.value = 'asc'; }
};

const filteredList = computed(() => {
  const q = searchQ.value.toLowerCase();
  return receipts.value.filter(r => {
    const matchQ = !q || r.code.toLowerCase().includes(q) || r.agent.toLowerCase().includes(q);
    const matchA = !filterAgent.value  || r.agent  === filterAgent.value;
    const matchS = !filterStatus.value || r.status === filterStatus.value;
    return matchQ && matchA && matchS;
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

const selectedReceipt = computed(() => receipts.value.find(r => r.id === selectedId.value) ?? null);
const panelVisible    = computed(() => selectedReceipt.value !== null || panelMode.value === 'create');

const newThisMonth    = computed(() => receipts.value.length);
const monthMax        = computed(() => Math.max(...receipts.value.map(r => r.total), 1));
const totalRevenue   = computed(() => receipts.value.reduce((s, r) => s + r.total, 0));
const overDebtCount  = computed(() => agents.value.filter(a => a.debt >= a.limit).length);
const donutGradient  = computed(() => `conic-gradient(#059669 0deg 100%)`);
/* ── KPI deltas ── */
const thisMonthCount = computed(() => {
  const now = _now;
  return receipts.value.filter(r => {
    const d = new Date(r.rawDate);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
});

const thisMonthRevenue = computed(() => {
  const now = _now;
  return receipts.value.filter(r => {
    const d = new Date(r.rawDate);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).reduce((s, r) => s + r.total, 0);
});

const countDelta = computed(() => {
  const now = _now;
  const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const lastMonthCount = receipts.value.filter(r => {
    const d = new Date(r.rawDate);
    return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
  }).length;
  return thisMonthCount.value - lastMonthCount;
});

const revDelta = computed(() => {
  const now = _now;
  const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const lastMonthRev = receipts.value.filter(r => {
    const d = new Date(r.rawDate);
    return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
  }).reduce((s, r) => s + r.total, 0);
  if (lastMonthRev === 0) return thisMonthRevenue.value > 0 ? 100 : 0;
  return ((thisMonthRevenue.value - lastMonthRev) / lastMonthRev) * 100;
});

const overDelta = ref(0);
watch(overDebtCount, (newVal, oldVal) => {
  overDelta.value = newVal - (oldVal || 0);
});

/* ── Sparkline ── */
const spark       = [65, 78, 58, 110, 95, 79];
const maxSpark    = Math.max(...spark);
const sparkLabels = ['Th.12', 'Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5'];

/* ── Month progress ── */
const _now           = new Date();
const daysInMonth    = new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate();
const dayOfMonth     = _now.getDate();
const monthProgressPct = Math.round(dayOfMonth / daysInMonth * 100);
const monthName      = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                        'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'][_now.getMonth()];

/* ── Helpers ── */
const getAgent       = (id) => agents.value.find(a => a.id === id);
const fmtVND = (v) => v.toLocaleString('vi-VN') + ' ₫';
const fmtTr  = (v) => fmtVND(v);
const fmtSummary = (v) => {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + ' Tỷ';
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(0) + ' Triệu';
  return fmtVND(v);
};
const fmtMoney       = (v) => ((v || 0) / 1_000_000).toFixed(1) + ' Tr';
const revBarPct      = (r) => Math.min((r.total / monthMax.value) * 100, 100);
const revBarColor    = (r) => '#059669';
const agentDebtPct   = (id) => {
  const a = getAgent(id); if (!a) return 0;
  return Math.min((a.debt / a.limit) * 100, 100);
};
const debtBarColor   = (id) => {
  const p = agentDebtPct(id);
  return p >= 100 ? '#ef4444' : p >= 80 ? '#f59e0b' : '#059669';
};
const debtClass      = (id) => {
  const p = agentDebtPct(id);
  return p >= 100 ? 'debt-over' : p >= 80 ? 'debt-warn' : 'debt-ok';
};

/* ── Form ── */
const today     = new Date().toISOString().split('T')[0];
const emptyForm = () => ({ agentId: '', date: today, tienTra: 0, items: [{ name: '', qty: 1, price: 0 }] });

const form      = ref(emptyForm());
const errors    = reactive({ agent: '', items: '' });
const formAgent = computed(() => form.value.agentId ? getAgent(Number(form.value.agentId)) : null);
const formTotal  = computed(() => form.value.items.reduce((s, i) => s + (i.qty || 0) * (i.price || 0), 0));
const formConLai = computed(() => Math.max(0, formTotal.value - (form.value.tienTra || 0)));

const addItem    = () => form.value.items.push({ name: '', qty: 1, price: 0 });
const removeItem = (i) => { if (form.value.items.length > 1) form.value.items.splice(i, 1); };
const onAgentChange = () => {};
const onProductChange = (item) => {
  const p = products.value.find(p => p.name === item.name);
  if (p) item.price = p.sellPrice;
};

/* ── Toast ── */
const toast = ref({ show: false, msg: '', type: 'success', undoFn: null });
const undoCountdown = ref(0);
let _toastTimer = null;
let _countdownTimer = null;
const showToast = (msg, type = 'success', undoFn = null) => {
  clearTimeout(_toastTimer);
  clearInterval(_countdownTimer);
  const duration = undoFn ? 5000 : 2800;
  toast.value = { show: true, msg, type, undoFn };
  if (undoFn) {
    undoCountdown.value = Math.ceil(duration / 1000);
    _countdownTimer = setInterval(() => {
      undoCountdown.value--;
      if (undoCountdown.value <= 0) clearInterval(_countdownTimer);
    }, 1000);
  }
  _toastTimer = setTimeout(() => { toast.value = { show: false, msg: '', type: 'success', undoFn: null }; }, duration);
};

/* ── Actions ── */
const openView = (r) => { selectedId.value = r.id; panelMode.value = 'view'; };

const openCreate = () => {
  selectedId.value = null;
  panelMode.value  = 'create';
  form.value       = emptyForm();
  errors.agent = ''; errors.items = '';
};

const openEdit = (r) => {
  selectedId.value = r.id;
  panelMode.value  = 'edit';
  form.value = { agentId: r.agentId, date: r.rawDate, items: r.items.map(i => ({ ...i })) };
  errors.agent = ''; errors.items = '';
};

const closePanel = () => { selectedId.value = null; panelMode.value = 'view'; };



const askDelete     = (r) => { deleteTarget.value = r; };
const confirmDelete = async () => {
  const target = deleteTarget.value;
  const code = target.code;
  try {
    const res = await api.delete(`/phieu-xuat/${target.id}`);
    if (res.data?.status === 'success') {
      showToast(`Đã xóa phiếu ${code}`);
      await loadReceipts();
      await loadAgents();
      if (selectedId.value === target.id) closePanel();
    }
  } catch (err) {
    showToast(err.response?.data?.message || 'Lỗi khi xóa phiếu', 'danger');
  }
  deleteTarget.value = null;
};

const submitCreate = async () => {
  errors.agent = ''; errors.items = '';
  if (!form.value.agentId) { errors.agent = 'Vui lòng chọn đại lý'; return; }
  const validItems = form.value.items.filter(i => i.name && i.qty > 0);
  if (!validItems.length) { errors.items = 'Thêm ít nhất 1 mặt hàng hợp lệ'; return; }

  try {
    const payload = {
      MaDaiLy: Number(form.value.agentId),
      NgayLapPhieu: form.value.date,
      TienTra: form.value.tienTra || 0,
      chiTiets: validItems.map(i => {
        const prod = products.value.find(p => p.name === i.name);
        return {
          MaMatHang: prod?.id,
          SoLuongXuat: i.qty,
          DonGiaXuat: i.price
        };
      })
    };

    const res = await api.post('/phieu-xuat', payload);
    if (res.data?.status === 'success') {
      showToast(`Đã lập phiếu xuất hàng thành công`);
      loadReceipts();
      loadAgents(); // Refresh debt
      closePanel();
    }
  } catch (err) {
    showToast(err.response?.data?.message || 'Lỗi khi lập phiếu xuất', 'danger');
  }
};

const submitEdit = async () => {
  errors.agent = ''; errors.items = '';
  if (!form.value.agentId) { errors.agent = 'Vui lòng chọn đại lý'; return; }
  const validItems = form.value.items.filter(i => i.name && i.qty > 0);
  if (!validItems.length) { errors.items = 'Thêm ít nhất 1 mặt hàng hợp lệ'; return; }
  
  try {
    const payload = {
      MaDaiLy: Number(form.value.agentId),
      NgayLapPhieu: form.value.date,
      chiTiets: validItems.map(i => {
        const prod = products.value.find(p => p.name === i.name);
        return {
          MaMatHang: prod?.id,
          SoLuongXuat: i.qty,
          DonGiaXuat: i.price
        };
      })
    };

    const res = await api.put(`/phieu-xuat/${selectedId.value}`, payload);
    if (res.data?.status === 'success') {
      showToast(`Đã cập nhật phiếu xuất hàng thành công`);
      await loadReceipts();
      await loadAgents();
      panelMode.value = 'view';
    }
  } catch (err) {
    showToast(err.response?.data?.message || 'Lỗi khi cập nhật phiếu xuất', 'danger');
  }
};

const exportCSV = () => {
  const cols = ['Mã phiếu', 'Ngày xuất', 'Đại lý', 'Tổng tiền (Tr)'];
  const rows = sortedList.value.map(r => [r.code, r.date, r.agent, r.total]);
  const csv = [cols, ...rows].map(row => row.map(v => `"${v ?? ''}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `phieu-xuat-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* ══ TOKENS ══ */
.px {
  --c-primary:    #059669; --c-primary-d: #047857;
  --c-success:    #059669; --c-success-bg:#f0fdf4;
  --c-danger:     #EF4444; --c-danger-bg: #FEF2F2;
  --c-info:       #7c3aed;
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
.ctx-deco  { position:absolute; right:0; top:0; width:260px; height:100%; pointer-events:none; z-index:0; }
.ctx-wm    { position:absolute; right:300px; top:50%; transform:translateY(-50%); width:90px; height:90px; color:var(--c-primary); opacity:.07; pointer-events:none; z-index:0; }
.ctx-top   { display:flex; justify-content:space-between; align-items:center; padding:20px 26px 18px; gap:16px; position:relative; z-index:2; }
.ctx-title-block { display:flex; flex-direction:column; gap:2px; }
.ctx-eyebrow { margin:0; font-size:10.5px; font-weight:700; color:var(--c-primary); text-transform:uppercase; letter-spacing:1px; display:flex; align-items:center; gap:7px; }
.ctx-eyebrow::before { content:''; display:inline-block; width:18px; height:2.5px; background:linear-gradient(90deg,#10b981,#059669); border-radius:2px; flex-shrink:0; }
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
.cs-num { font-size:30px; font-weight:900; letter-spacing:-1.2px; color:var(--c-txt); line-height:1; display:flex; align-items:baseline; gap:7px; font-variant-numeric:tabular-nums; }
.cs-amber { color:#D97706; }
.cs-tag { font-size:10px; font-weight:700; padding:2px 7px; border-radius:var(--r-pill); background:#fffbeb; color:#B45309; border:1px solid rgba(245,158,11,.25); }
.cs-tag-red { background:#fef2f2; color:#991b1b; border-color:rgba(239,68,68,.2); }
.cs-lbl { font-size:11px; color:var(--c-txt-3); font-weight:600; letter-spacing:.2px; }

/* ── Delta ── */
.cs-delta { font-size:10.5px; font-weight:600; margin-top:-3px; }
.cs-up    { color:#10b981; }
.cs-ok    { color:#10b981; }
.cs-down  { color:var(--c-danger); }

/* ── Sparkline ── */
.spark-wrap { display:flex; align-items:flex-end; gap:3px; height:28px; margin:4px 0 2px; }
.spark-bar  { flex:1; background:#e2e8f0; border-radius:3px 3px 0 0; min-height:3px; transition:height .4s; }
.spark-bar.spark-active { background:linear-gradient(180deg,#34d399,#059669); }

/* ── Donut ── */
.cs-pending-row { display:flex; align-items:center; gap:11px; }
.donut-wrap { flex-shrink:0; }
.donut-ring {
  width:46px; height:46px; border-radius:50%;
  -webkit-mask: radial-gradient(circle,transparent 52%,black 53%);
  mask: radial-gradient(circle,transparent 52%,black 53%);
}
.donut-legend { display:flex; align-items:center; flex-wrap:wrap; gap:3px; margin-top:5px; font-size:10px; color:var(--c-txt-3); font-weight:600; }
.dl-dot { width:7px; height:7px; border-radius:50%; display:inline-block; flex-shrink:0; }

/* ── Timeline ── */
.ctx-timeline { padding:10px 26px 14px; position:relative; z-index:2; }
.ctl-row  { display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; }
.ctl-label { font-size:11px; font-weight:600; color:var(--c-txt-3); }
.ctl-pct   { font-size:11px; font-weight:700; color:var(--c-primary); }
.ctl-track { height:4px; background:rgba(5,150,105,.1); border-radius:99px; overflow:hidden; }
.ctl-fill  { height:100%; background:linear-gradient(90deg,#34d399,#059669); border-radius:99px; transition:width .8s ease; }

/* ══ MAIN LAYOUT ══ */
.dl-flex   { display:flex; gap:20px; align-items:flex-start; }
.list-card { flex:1 1 auto; min-width:0; }
.dl-card   { background:var(--c-surface); border-radius:var(--r-card); border:1px solid var(--c-border); box-shadow:var(--sh-card); overflow:hidden; }

/* ══ LIST CARD ══ */
.lc-hd { padding:16px 20px 14px; border-bottom:1px solid var(--c-border); display:flex; flex-direction:column; gap:10px; }
.lc-title-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.lc-title { font-size:15px; font-weight:700; margin:0; }
.count-badge { background:var(--c-success-bg); color:var(--c-primary); font-size:11px; font-weight:700; padding:2px 8px; border-radius:var(--r-pill); border:1px solid rgba(91,157,250,.15); }
.clear-btn { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; color:var(--c-danger); background:var(--c-danger-bg); border:1px solid rgba(239,68,68,.15); border-radius:var(--r-pill); padding:2px 8px; cursor:pointer; }
.lc-tools  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.search-wrap { position:relative; flex:1; min-width:160px; }
.search-ic   { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--c-txt-3); pointer-events:none; }
.search-inp  { width:100%; padding:7px 10px 7px 32px; border:1px solid var(--c-border); border-radius:var(--r-md); font-size:13px; color:var(--c-txt); background:var(--c-bg); outline:none; box-sizing:border-box; transition:border-color var(--t); }
.search-inp:focus { border-color:var(--c-primary); background:#fff; }
.psel { border:1px solid var(--c-border); border-radius:var(--r-sm); padding:7px 10px; font-size:12px; font-weight:500; color:var(--c-txt-2); background:var(--c-bg); outline:none; cursor:pointer; }

/* ── Status tabs ── */
.stab-group { display:flex; background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-md); padding:3px; gap:2px; margin-left:auto; flex-shrink:0; }
.stab { padding:4px 10px; border:none; border-radius:var(--r-sm); font-size:11px; font-weight:700; cursor:pointer; background:transparent; color:var(--c-txt-3); transition:all var(--t); font-family:inherit; display:inline-flex; align-items:center; gap:4px; white-space:nowrap; }
.stab:hover { background:#fff; color:var(--c-txt-2); }
.stab.active { background:#fff; color:var(--c-txt); box-shadow:0 1px 3px rgba(15,23,42,.08); }
.stab-warn.active  { background:#fef3c7; color:#b45309; }
.stab-green.active { background:var(--c-success-bg); color:#2563eb; }
.stab-muted.active { background:#f8fafc; color:var(--c-txt-2); }
.stab-n { font-size:10px; background:rgba(15,23,42,.06); padding:0 5px; border-radius:3px; line-height:1.6; }

/* ══ TABLE ══ */
.table-wrap { overflow-x:auto; }
.dl-table { width:100%; border-collapse:collapse; font-size:13px; table-layout:fixed; }
.dl-table thead tr { background:var(--c-bg); border-bottom:1px solid var(--c-border); }
.dl-table th { padding:10px 14px; text-align:left; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--c-txt-3); white-space:nowrap; overflow:hidden; }
.dl-table td { padding:11px 14px; border-bottom:1px solid var(--c-border-s); vertical-align:middle; }
.px-row { cursor:pointer; transition:background var(--t); }
.px-row:hover { background:rgba(15,23,42,.02); }
.px-row.selected { background:var(--c-success-bg); }
.px-row:last-child td { border-bottom:none; }
.sort-hd { display:inline-flex; align-items:center; gap:4px; cursor:pointer; user-select:none; }
.sort-arrow { display:inline-flex; align-items:center; }
.text-right  { text-align:right !important; }
.text-center { text-align:center !important; }
.dl-table .text-right  { text-align: right !important; }
.dl-table .text-center { text-align: center !important; }
.col-mono { font-variant-numeric:tabular-nums; font-size:12px; }
.muted    { color:var(--c-txt-3); }

.px-code { font-size:12px; font-weight:700; color:var(--c-primary); background:var(--c-success-bg); padding:3px 8px; border-radius:6px; font-variant-numeric:tabular-nums; }
.agent-cell { display:flex; align-items:center; gap:9px; min-width:0; }
.agent-av   {
  position: relative; width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.12); box-shadow: 0 1px 4px rgba(0,0,0,.15);
  overflow: hidden; background: white;
}
.av-logo { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:center; padding:5px; box-sizing:border-box; z-index:2; background:white; display:block; }
.av-init { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:white; letter-spacing:-.3px; }
.agent-info { min-width:0; flex:1; }
.agent-name { display:block; font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.agent-debt { display:block; font-size:10.5px; font-weight:600; margin-top:1px; white-space:nowrap; }
.debt-ok   { color:#059669; }
.debt-warn { color:#f59e0b; }
.debt-over { color:var(--c-danger); }

.item-cnt-chip {
  font-size: 11px;
  font-weight: 700;
  color: #6d28d9;
  background: #f5f3ff;
  border: 1px solid rgba(139, 92, 246, 0.2);
  padding: 3px 9px;
  border-radius: var(--r-pill);
  white-space: nowrap;
  display: inline-block;
}
.col-total { min-width:110px; }
.total-num { font-weight:700; font-size:13px; font-variant-numeric:tabular-nums; }
.sort-hd-r { display: flex !important; justify-content: flex-end; }

.status-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:var(--r-pill); font-size:11px; font-weight:700; white-space:nowrap; }
.status-badge.pending   { background:#fef3c7; color:#92400e; border:1px solid rgba(245,158,11,.2); }
.status-badge.delivered { background:#ecfdf5; color:#059669; border:1px solid rgba(16, 185, 129, 0.2); }
.status-badge.cancelled { background:#fef2f2; color:#ef4444; border:1px solid rgba(239, 68, 68, 0.2); }

.col-actions { white-space:nowrap; vertical-align:middle; }
.act-group { display:flex; align-items:center; gap:4px; }
.act-btn {
  width:30px; height:30px; display:inline-flex; align-items:center; justify-content:center;
  border:none; border-radius:8px; cursor:pointer; transition:all var(--t);
}
.view-btn { background:rgba(5,150,105,.08); color:#059669; }
.view-btn:hover { background:rgba(5,150,105,.18); transform:scale(1.1); }
.edit-btn { background:rgba(37,99,235,.08); color:#2563eb; }
.edit-btn:hover { background:rgba(37,99,235,.18); transform:scale(1.1); }
.ok-btn   { background:rgba(5,150,105,.1); color:#059669; }
.ok-btn:hover { background:#059669; color:white; transform:scale(1.1); }
.del-btn  { background:rgba(239,68,68,.08); color:#dc2626; }
.del-btn:hover { background:rgba(239,68,68,.16); transform:scale(1.1); }
.del-btn:disabled { opacity:.3; cursor:not-allowed; }

.empty-row { text-align:center; padding:40px 0; color:var(--c-txt-3); }
.empty-ic  { margin:0 auto 8px; display:block; opacity:.35; }
.lc-foot   { padding:10px 20px; font-size:11px; color:var(--c-txt-3); border-top:1px solid var(--c-border-s); }

/* ══ SIDE PANEL ══ */
.side-panel {
  display: flex;
  flex-direction: column;
  width: 380px;
  flex-shrink: 0;
  height: calc(100vh - 130px);
  max-height: calc(100vh - 130px);
  overflow: hidden;
  position: sticky;
  top: 16px;
  background:linear-gradient(180deg,#f7fbff 0%,#f8fff9 100%);
}

.ap-hd { padding:18px 18px 14px; border-bottom:1px solid var(--c-border); display:flex; align-items:flex-start; gap:12px; background:rgba(255,255,255,.72); }
.ap-avatar {
  position: relative; width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.12); box-shadow: 0 2px 6px rgba(0,0,0,.15);
  overflow: hidden; background: white;
}
.ap-title-block { flex:1; min-width:0; }
.ap-name   { font-size:15px; font-weight:700; margin:0 0 5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ap-badges { display:flex; gap:5px; flex-wrap:wrap; }
.dist-chip { font-size:10px; font-weight:600; color:var(--c-txt-3); background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-pill); padding:3px 8px; }

/* Gauge section */
.gauge-section { padding:14px 18px; border-bottom:1px solid var(--c-border); display:flex; flex-direction:column; gap:10px; background:rgba(255,255,255,.48); }
.val-summary { display:flex; flex-direction:column; gap:8px; }
.vs-main  { display:flex; justify-content:space-between; align-items:baseline; }
.vs-label { font-size:11px; color:var(--c-txt-3); font-weight:600; text-transform:uppercase; letter-spacing:.4px; }
.vs-val   { font-size:22px; font-weight:900; color:var(--c-primary); letter-spacing:-.5px; font-variant-numeric:tabular-nums; }
.vs-bar-wrap { display:flex; align-items:center; gap:10px; }
.vs-bar   { flex:1; height:6px; background:#f1f5f9; border-radius:3px; overflow:hidden; }
.vs-fill  { height:100%; border-radius:3px; transition:width .5s ease; }
.vs-pct   { font-size:10px; color:var(--c-txt-3); font-weight:600; white-space:nowrap; }

/* Debt section */
.debt-section { display:flex; flex-direction:column; gap:5px; padding:10px 12px; background:var(--c-bg); border-radius:var(--r-md); border:1px solid var(--c-border); }
.debt-hd { display:flex; justify-content:space-between; align-items:center; }
.debt-lbl { font-size:11px; color:var(--c-txt-3); font-weight:600; text-transform:uppercase; letter-spacing:.3px; }
.debt-val { font-size:12px; font-weight:700; font-variant-numeric:tabular-nums; }
.debt-bar-wrap { display:flex; align-items:center; gap:8px; }
.debt-bar { flex:1; height:5px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
.debt-fill { height:100%; border-radius:3px; transition:width .5s; }
.debt-pct-lbl { font-size:10px; font-weight:700; white-space:nowrap; }

.debt-status-bar { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; padding:7px 12px; border-radius:var(--r-md); }
.debt-status-bar.delivered { background:var(--c-success-bg); color:#2563eb; }
.debt-status-bar.pending   { background:#fef3c7; color:#92400e; }
.debt-status-bar.cancelled { background:#fef2f2; color:#ef4444; }

/* Info grid */
.info-grid { padding:14px 18px; border-bottom:1px solid var(--c-border); display:flex; flex-direction:column; gap:9px; background:rgba(255,255,255,.4); }
.ig-row { display:flex; align-items:flex-start; gap:8px; font-size:12px; }
.ig-ic  { color:var(--c-txt-3); flex-shrink:0; margin-top:1px; }
.ig-lbl { color:var(--c-txt-3); width:52px; flex-shrink:0; }
.ig-val { color:var(--c-txt-2); font-weight:500; flex:1; min-width:0; }

/* Items section */
.items-section { padding:14px 18px 18px; }
.recent-title  { font-size:11px; font-weight:700; color:var(--c-txt-3); text-transform:uppercase; letter-spacing:.6px; margin:0 0 10px; }
.items-hd  { display:flex; gap:6px; font-size:10px; font-weight:700; color:var(--c-txt-3); text-transform:uppercase; padding-bottom:6px; border-bottom:1px solid var(--c-border-s); margin-bottom:4px; }
.items-hd span { white-space:nowrap; overflow:hidden; }
.item-row  { display:flex; align-items:center; gap:6px; padding:7px 0; border-bottom:1px solid var(--c-border-s); }
.item-row:last-of-type { border-bottom:none; }
.item-name { font-size:12.5px; font-weight:600; color:var(--c-txt); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.items-total { display:flex; justify-content:space-between; align-items:center; padding:10px 12px; margin-top:8px; background:var(--c-success-bg); border-radius:var(--r-md); border:1px solid rgba(91,157,250,.12); }
.items-total span   { font-size:12px; font-weight:600; color:var(--c-primary); }
.items-total strong { font-size:15px; font-weight:900; color:var(--c-primary); font-variant-numeric:tabular-nums; }

/* Quick actions */
.quick-links  { padding:14px 18px; display:flex; gap:8px; border-bottom:1px solid var(--c-border); }
.btn-danger-o { display:inline-flex; align-items:center; gap:6px; padding:9px 14px; border-radius:var(--r-md); border:1.5px solid rgba(239,68,68,.25); background:#fef2f2; color:#dc2626; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; transition:all var(--t); }
.btn-danger-o:hover { background:#fee2e2; }
.status-note  { display:flex; align-items:center; gap:7px; padding:12px 18px; font-size:12.5px; font-weight:600; }
.status-note:not(.cancelled) { color:var(--c-primary); }
.status-note.cancelled { color:var(--c-txt-3); }

/* ── Custom Tooltips ── */
[data-tooltip] {
  position: relative;
}
[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: #0f172a;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(15,23,42,0.15);
  pointer-events: none;
  z-index: 100;
}
[data-tooltip]::before {
  content: '';
  position: absolute;
  bottom: 115%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  border-width: 5px;
  border-style: solid;
  border-color: #0f172a transparent transparent transparent;
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 100;
}
[data-tooltip]:hover::after,
[data-tooltip]:hover::before {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* ── Sidebar Redesign Extensions ── */
.ap-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}
.ap-ft {
  padding: 14px 18px;
  border-top: 1px solid var(--c-border);
  background: #ffffff;
  position: sticky;
  bottom: 0;
  z-index: 10;
}
.note-quote-box {
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  background: #f8fafc;
  border-left: 3.5px solid var(--c-primary);
  border-radius: 4px 8px 8px 4px;
  border: 1px solid var(--c-border);
  border-left-width: 3.5px;
}
.note-quote-ic {
  color: var(--c-primary);
  margin-top: 2px;
  flex-shrink: 0;
}
.note-quote-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.note-quote-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--c-txt-2);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.note-quote-text {
  font-size: 12.5px;
  color: var(--c-txt-2);
  font-style: italic;
  margin: 0;
  line-height: 1.4;
}
.financial-card {
  background: #ffffff;
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  overflow: hidden;
  box-shadow: var(--sh-card);
}
.gauge-section-compact {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.debt-section-compact {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 12px;
  background: var(--c-bg);
  border-radius: var(--r-md);
  border: 1px solid var(--c-border);
}
.quick-links-compact {
  display: flex;
  gap: 8px;
}
.status-note-sticky {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 14px;
  font-size: 12.5px;
  font-weight: 700;
  border-radius: var(--r-md);
  text-align: center;
}
.status-note-sticky.delivered {
  background: var(--c-success-bg);
  color: var(--c-primary);
  border: 1px solid rgba(16, 185, 129, 0.15);
}
.status-note-sticky.cancelled {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.15);
}

/* ══ FORM ══ */
.fc-hd { padding:16px 18px; border-bottom:1px solid var(--c-border); display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
.fc-title { font-size:15px; font-weight:700; margin:0; }
.fc-sub   { font-size:11px; color:var(--c-txt-3); display:block; margin-top:2px; }
.mode-chip { font-size:10px; font-weight:700; padding:3px 9px; border-radius:var(--r-pill); flex-shrink:0; }
.mode-chip.add       { background:var(--c-success-bg); color:#2563eb; border:1px solid rgba(91,157,250,.2); }
.mode-chip.edit-chip { background:rgba(124,58,237,.08); color:#5b21b6; border:1px solid rgba(124,58,237,.2); }

.fc-body { flex:1; padding:16px 18px; display:flex; flex-direction:column; gap:13px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#e2e8f0 transparent; }
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
.finp:focus { border-color:var(--c-primary); box-shadow:0 0 0 3px rgba(91,157,250,.08); background:#fff; }
.finp.finp-err { border-color:var(--c-danger); }
.finp.ftarea { resize:none; }
.finp.finp-sm { padding:6px 8px; font-size:12px; }
.finp.finp-num { text-align:center; }
.finp[readonly] { background:#f8fafc; color:var(--c-txt-3); cursor:default; }
.err-msg { font-size:11px; color:var(--c-danger); }

/* Debt hint in form */
.debt-hint { background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-md); padding:10px 12px; display:flex; flex-direction:column; gap:6px; }
.dh-row { display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--c-txt-3); font-weight:600; }
.dh-bar { height:5px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
.dh-fill { height:100%; border-radius:3px; transition:width .4s; }
.dh-warn { font-size:10.5px; font-weight:700; color:#b45309; }

/* Items form */
.items-form-list { display:flex; flex-direction:column; gap:6px; }
.items-form-hd { display:flex; gap:6px; font-size:10px; font-weight:700; color:var(--c-txt-3); text-transform:uppercase; padding:0 2px; }
.item-form-row { display:flex; align-items:center; gap:6px; }
.add-item-btn {
  display:inline-flex; align-items:center; gap:6px;
  padding:6px 12px; border-radius:var(--r-md); align-self:flex-start;
  border:1.5px dashed rgba(91,157,250,.3); background:transparent; color:var(--c-primary);
  font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all var(--t);
}
.add-item-btn:hover { background:var(--c-success-bg); border-color:var(--c-primary); }
.limit-row { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--c-txt-3); background:var(--c-bg); border-radius:var(--r-sm); padding:7px 10px; border:1px dashed var(--c-border); }
.limit-row strong { color:var(--c-primary); font-weight:800; margin-left:4px; }
.payment-summary { display:flex; flex-direction:column; gap:0; border:1px solid var(--c-border); border-radius:var(--r-md); overflow:hidden; margin-top:10px; }
.ps-row { display:flex; justify-content:space-between; align-items:center; padding:9px 13px; background:#fff; border-bottom:1px solid var(--c-border-s); }
.ps-row:last-child { border-bottom:none; }
.ps-conlai-row { background:#f8fafc; }
.ps-lbl { font-size:12px; font-weight:600; color:var(--c-txt-3); }
.ps-val { font-size:14px; font-weight:800; font-variant-numeric:tabular-nums; }
.ps-paid { color:#059669; }

.payment-block { display:flex; flex-direction:column; gap:8px; padding:12px 14px; background:#f8fafc; border:1px solid var(--c-border); border-radius:var(--r-md); }
.conlai-row { display:flex; justify-content:space-between; align-items:center; padding:8px 10px; border-radius:var(--r-md); background:#fff; border:1px solid var(--c-border); }
.conlai-lbl { font-size:12px; font-weight:700; color:var(--c-txt-3); }
.conlai-val { font-size:15px; font-weight:900; font-variant-numeric:tabular-nums; }
.conlai-debt  { color:#ef4444; }
.conlai-clear { color:#059669; }

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
  background:transparent; color:var(--c-primary); border:1.5px solid rgba(91,157,250,.3);
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
  --c-primary: #059669;
  --c-success-bg: #f0fdf4;
  --c-danger: #EF4444;
  --c-danger-bg: #FEF2F2;
  position:fixed; bottom:28px; right:28px; z-index:500;
  display:inline-flex; align-items:center; gap:9px;
  padding:11px 18px; border-radius:12px;
  font-size:13px; font-weight:600; font-family:'Inter','Be Vietnam Pro',ui-sans-serif,system-ui,sans-serif;
  box-shadow:0 8px 32px rgba(15,23,42,.2),0 2px 8px rgba(15,23,42,.1);
  min-width:240px;
}
.toast-msg { flex:1; }
.toast-snack.success { background:var(--c-success-bg); color:#2563eb; border:1px solid rgba(91,157,250,.2); }
.toast-snack.danger  { background:#fef2f2; color:#991b1b; border:1px solid rgba(239,68,68,.2); }
.toast-snack.warn    { background:#fffbeb; color:#92400e; border:1px solid rgba(245,158,11,.2); }
.toast-undo-btn {
  display:inline-flex; align-items:center; gap:5px;
  padding:5px 12px; border-radius:8px; margin-left:8px;
  background:rgba(5,150,105,.12); color:#059669; border:1.5px solid rgba(5,150,105,.25);
  font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap;
  font-family:inherit; transition:all .15s ease;
}
.toast-undo-btn:hover { background:rgba(5,150,105,.22); border-color:#059669; transform:scale(1.03); }
.toast-countdown {
  display:inline-flex; align-items:center; justify-content:center;
  min-width:18px; height:18px; border-radius:50%; margin-left:2px;
  background:rgba(5,150,105,.15); font-size:10px; font-weight:800; color:#059669;
}
.toast-enter-active { animation:toastIn .25s cubic-bezier(.2,.8,.2,1); }
.toast-leave-active { animation:toastIn .2s cubic-bezier(.2,.8,.2,1) reverse; }
@keyframes toastIn { from { opacity:0; transform:translateY(12px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }

/* ══ MODAL — variables redeclared here because <Teleport> moves element outside .px ══ */
.modal-bg {
  --c-primary:   #059669; --c-primary-d: #047857;
  --c-success-bg:#f0fdf4;
  --c-danger:    #EF4444; --c-danger-bg: #FEF2F2;
  --c-surface:   #ffffff; --c-bg:        #f8fafc;
  --c-border:    rgba(15,23,42,.07);
  --c-txt:       #0f172a; --c-txt-2:     #475569;
  --r-md: 8px; --r-pill: 999px;
  --sh-modal: 0 20px 60px rgba(15,23,42,.18);
  --t: .15s ease;
  position:fixed; inset:0; z-index:200;
  background:rgba(15,23,42,.5); backdrop-filter:blur(3px);
  display:flex; align-items:center; justify-content:center; padding:20px;
  font-family:'Inter','Be Vietnam Pro',ui-sans-serif,system-ui,sans-serif;
}
.modal-box {
  width:min(420px,100%);
  background:linear-gradient(170deg, #fff5f5 0%, #fffafa 45%, #ffffff 100%);
  border-radius:20px; border:1px solid rgba(239,68,68,.13);
  box-shadow:0 8px 40px rgba(239,68,68,.1), 0 2px 14px rgba(15,23,42,.08);
  padding:32px 28px 24px;
  display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px;
}
.del-avatar-wrap { position:relative; margin-bottom:4px; }
.del-agent-avatar {
  width:76px; height:76px; border-radius:18px;
  overflow:hidden; position:relative;
  box-shadow:0 4px 18px rgba(15,23,42,.14);
}
.del-avatar-img {
  position:absolute; inset:12px;
  width:calc(100% - 24px); height:calc(100% - 24px);
  object-fit:contain; z-index:1;
}
.del-avatar-abbr {
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  font-size:22px; font-weight:800; color:rgba(255,255,255,.88); letter-spacing:-0.5px;
  z-index:0;
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
  border-radius:8px; padding:9px 20px; font-size:13px; font-weight:600; cursor:pointer;
  font-family:inherit; transition:all .15s ease;
}
.modal-actions .btn-o:hover { background:#f0fdf4; }
.modal-actions .btn-danger {
  background:#EF4444; color:#fff; border:none;
  border-radius:8px; padding:9px 20px; font-size:13px; font-weight:600; cursor:pointer;
  font-family:inherit; transition:background .15s ease;
}
.modal-actions .btn-danger:hover { background:#dc2626; }

/* ── Panel slide ── */
.panel-enter-active { animation:panelIn .24s cubic-bezier(.4,0,.2,1); }
.panel-leave-active { animation:panelOut .2s cubic-bezier(.4,0,.2,1); }
@keyframes panelIn  { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
@keyframes panelOut { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(32px); } }

/* ══ RESPONSIVE ══ */
@media (max-width:1100px) { .dl-flex { flex-direction:column; } .side-panel { width:100%; max-height:none; position:static; } }
@media (max-width:700px)  { .field-row { grid-template-columns:1fr; } .lc-tools { flex-direction:column; align-items:stretch; } }
</style>
