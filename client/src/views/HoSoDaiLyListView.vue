<template>
  <div class="dl">

    <!-- ══ Context banner (title + stats in one card) ══ -->
    <div class="ctx-card">

      <!-- hexagon grid decoration — right side -->
      <svg class="ctx-deco" viewBox="0 0 300 155" fill="none" aria-hidden="true">
        <defs>
          <!-- base hex outline — r=24, pointy-top -->
          <polygon id="hx" points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"/>
          <filter id="hglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- === base grid: stroke only, low opacity === -->
        <g stroke="#059669" stroke-width=".9" opacity=".13">
          <!-- row 0  y=24 -->
          <use href="#hx" transform="translate(21,24)"/>
          <use href="#hx" transform="translate(62,24)"/>
          <use href="#hx" transform="translate(103,24)"/>
          <use href="#hx" transform="translate(144,24)"/>
          <use href="#hx" transform="translate(185,24)"/>
          <use href="#hx" transform="translate(226,24)"/>
          <use href="#hx" transform="translate(267,24)"/>
          <!-- row 1  y=60 (offset) -->
          <use href="#hx" transform="translate(0,60)"/>
          <use href="#hx" transform="translate(41,60)"/>
          <use href="#hx" transform="translate(82,60)"/>
          <use href="#hx" transform="translate(123,60)"/>
          <use href="#hx" transform="translate(164,60)"/>
          <use href="#hx" transform="translate(205,60)"/>
          <use href="#hx" transform="translate(246,60)"/>
          <use href="#hx" transform="translate(287,60)"/>
          <!-- row 2  y=96 -->
          <use href="#hx" transform="translate(21,96)"/>
          <use href="#hx" transform="translate(62,96)"/>
          <use href="#hx" transform="translate(103,96)"/>
          <use href="#hx" transform="translate(144,96)"/>
          <use href="#hx" transform="translate(185,96)"/>
          <use href="#hx" transform="translate(226,96)"/>
          <use href="#hx" transform="translate(267,96)"/>
          <!-- row 3  y=132 (offset) -->
          <use href="#hx" transform="translate(0,132)"/>
          <use href="#hx" transform="translate(41,132)"/>
          <use href="#hx" transform="translate(82,132)"/>
          <use href="#hx" transform="translate(123,132)"/>
          <use href="#hx" transform="translate(164,132)"/>
          <use href="#hx" transform="translate(205,132)"/>
          <use href="#hx" transform="translate(246,132)"/>
          <use href="#hx" transform="translate(287,132)"/>
        </g>

        <!-- === accented hexagons — slightly more visible === -->
        <g stroke="#059669" stroke-width="1.2" opacity=".28">
          <use href="#hx" transform="translate(144,60)"/>
          <use href="#hx" transform="translate(185,24)"/>
          <use href="#hx" transform="translate(226,96)"/>
        </g>

        <!-- === filled hexagons — subtle colored fill === -->
        <polygon points="144,36 164.8,48 164.8,72 144,84 123.2,72 123.2,48"
                 fill="#059669" opacity=".07"/>
        <polygon points="185,0 205.8,12 205.8,36 185,48 164.2,36 164.2,12"
                 fill="#3B82F6" opacity=".06"/>
        <polygon points="226,72 246.8,84 246.8,108 226,120 205.2,108 205.2,84"
                 fill="#059669" opacity=".06"/>

        <!-- === center dot on each accented hex === -->
        <g fill="#059669" filter="url(#hglow)" opacity=".55">
          <circle cx="144" cy="60" r="3.5"/>
          <circle cx="185" cy="24" r="3"/>
          <circle cx="226" cy="96" r="3"/>
        </g>

        <!-- === connector lines between accent hexes === -->
        <g stroke="#059669" stroke-width=".8" stroke-dasharray="3 4" opacity=".2">
          <line x1="144" y1="60" x2="185" y2="24"/>
          <line x1="144" y1="60" x2="226" y2="96"/>
        </g>

        <!-- === small floating dots === -->
        <g fill="#3B82F6" opacity=".35">
          <circle cx="62"  cy="24"  r="2"/>
          <circle cx="267" cy="60"  r="2"/>
          <circle cx="103" cy="132" r="2"/>
        </g>
        <g fill="#059669" opacity=".3">
          <circle cx="21"  cy="96"  r="1.5"/>
          <circle cx="287" cy="132" r="1.5"/>
        </g>
      </svg>

      <svg class="ctx-wm" viewBox="0 0 100 90" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="35" cy="28" r="16"/>
        <path d="M8 85c0-15 12-27 27-27s27 12 27 27"/>
        <circle cx="72" cy="22" r="11"/>
        <path d="M54 85c0-10 8-18 18-18s18 8 18 18"/>
        <line x1="50" y1="28" x2="62" y2="22" stroke-width="3" stroke-dasharray="3 3"/>
      </svg>

      <!-- Title row — no icon badge -->
      <div class="ctx-top">
        <div class="ctx-title-block">
          <p class="ctx-eyebrow">Nghiệp vụ · Quản lý đại lý</p>
          <h1 class="ctx-title">Hồ Sơ Đại Lý</h1>
        </div>
        <div class="ctx-actions">
          <button class="btn-csv" @click="exportCSV"><Download :size="13"/> Xuất CSV</button>
          <button class="btn-p" @click="startAdd"><Plus :size="14"/> Thêm đại lý</button>
        </div>
      </div>

      <div class="ctx-divider"></div>

      <!-- ── KPI columns (inside banner, matching PhieuNhapView) ── -->
      <div class="ctx-stats">

        <!-- Col 1: Tổng đại lý -->
        <div class="cs-col">
          <div class="cs-lbl-row">
            <span class="cs-ic"><CheckCircle2 :size="11"/></span>
            <span class="cs-lbl">Tổng đại lý tháng này</span>
          </div>
          <div class="cs-num-row">
            <strong class="cs-num">{{ agents.length }}</strong>
          </div>
          <div class="cs-delta" :class="agentDelta >= 0 ? 'cs-up' : 'cs-down'">
            {{ agentDelta >= 0 ? '↑' : '↓' }} {{ Math.abs(agentDelta) }} so với tháng trước
          </div>
        </div>

        <div class="cs-sep"></div>

        <!-- Col 2: Tổng công nợ + spark bars -->
        <div class="cs-col">
          <div class="cs-lbl-row">
            <span class="cs-ic"><Wallet :size="11"/></span>
            <span class="cs-lbl">Tổng công nợ</span>
          </div>
          <div class="cs-num-row">
            <strong class="cs-num">{{ fmtMoneyShort(totalDebt) }}</strong>
          </div>
          <div class="cs-delta" :class="debtDelta >= 0 ? 'cs-down' : 'cs-up'">
            {{ debtDelta >= 0 ? '↑' : '↓' }} {{ Math.abs(debtDelta).toFixed(1) }}% so với tháng trước
          </div>
          <div class="cs-spark-wrap">
            <div
              v-for="(h, i) in debtSparkBars" :key="i"
              class="cs-spark-bar"
              :class="{ 'cs-spark-last': i === debtSparkBars.length - 1 }"
              :style="{ height: h + '%' }"
            ></div>
          </div>
        </div>

        <div class="cs-sep"></div>

        <!-- Col 3: Vượt hạn mức + donut -->
        <div class="cs-col cs-donut-col">
          <div class="cs-lbl-row">
            <span class="cs-ic"><AlertCircle :size="11"/></span>
            <span class="cs-lbl">Công nợ đại lý</span>
          </div>
          <div class="cs-donut-row">
            <svg viewBox="0 0 60 60" width="56" height="56" class="cs-donut-svg">
              <!-- track -->
              <circle cx="30" cy="30" r="22" fill="none" stroke="#f1f5f9" stroke-width="7" stroke-linecap="butt"/>
              <!-- OK segment — green pastel -->
              <circle cx="30" cy="30" r="22" fill="none" stroke="#34d399" stroke-width="7" stroke-linecap="round"
                :stroke-dasharray="`${Math.max(0, okArc - 3)} ${138.2 - Math.max(0, okArc - 3)}`"
                :stroke-dashoffset="138.2"
                transform="rotate(-90 30 30)"
                style="transition: stroke-dasharray .6s ease"/>
              <!-- Gần giới hạn — amber pastel -->
              <circle cx="30" cy="30" r="22" fill="none" stroke="#fbbf24" stroke-width="7" stroke-linecap="round"
                :stroke-dasharray="`${Math.max(0, warnArc - 3)} ${138.2 - Math.max(0, warnArc - 3)}`"
                :stroke-dashoffset="138.2 - okArc"
                transform="rotate(-90 30 30)"
                style="transition: stroke-dasharray .6s ease"/>
              <!-- Vượt hạn mức — red pastel -->
              <circle cx="30" cy="30" r="22" fill="none" stroke="#f87171" stroke-width="7" stroke-linecap="round"
                :stroke-dasharray="`${Math.max(0, overArc - 3)} ${138.2 - Math.max(0, overArc - 3)}`"
                :stroke-dashoffset="138.2 - okArc - warnArc"
                transform="rotate(-90 30 30)"
                style="transition: stroke-dasharray .6s ease"/>
            </svg>
            <div class="cs-donut-info">
              <div class="cs-num-row">
                <strong class="cs-num" :class="{ 'cs-red': overLimitCount > 0 }">{{ overLimitCount }}</strong>
                <span v-if="overLimitCount > 0" class="cs-tag">cần xử lý</span>
              </div>
              <div class="cs-delta" :class="overLimitDelta >= 0 ? 'cs-down' : 'cs-up'">
                {{ overLimitCount > 0 ? (overLimitDelta >= 0 ? '↑ ' : '↓ ') + Math.abs(overLimitDelta) + ' so với tháng trước' : 'Tất cả trong hạn mức' }}
              </div>
            </div>
          </div>
          <div class="cs-legend">
            <span class="cs-leg"><i class="cs-dot ok"></i>OK · {{ okDebtCount }}</span>
            <span class="cs-leg"><i class="cs-dot warn"></i>Gần giới hạn · {{ warnDebtCount }}</span>
            <span class="cs-leg"><i class="cs-dot over"></i>Vượt · {{ overLimitCount }}</span>
          </div>
        </div>

        <div class="cs-sep"></div>

        <!-- Col 4: Mới tiếp nhận -->
        <div class="cs-col">
          <div class="cs-lbl-row">
            <span class="cs-ic"><Calendar :size="11"/></span>
            <span class="cs-lbl">Đại lý mới tiếp nhận</span>
          </div>
          <div class="cs-num-row">
            <strong class="cs-num">{{ newThisMonth }}</strong>
            <span class="cs-tag cs-tag-green" v-if="newThisMonth > 0">tháng này</span>
          </div>
          <div class="cs-delta" :class="agentDelta >= 0 ? 'cs-up' : 'cs-down'">
            {{ agentDelta >= 0 ? '↑' : '↓' }} {{ Math.abs(agentDelta) }} so với tháng trước
          </div>
        </div>

      </div>

      <!-- Month progress bar -->
      <div class="ctx-timeline">
        <span class="ctl-label">Tháng {{ currentMonth }} · Ngày {{ dayOfMonth }}/{{ daysInMonth }}</span>
        <div class="ctl-bar"><div class="ctl-fill" :style="{ width: monthProgressPct + '%' }"></div></div>
        <span class="ctl-pct">{{ monthProgressPct }}% tiến độ tháng</span>
      </div>

    </div>

    <!-- ══ Main layout ══ -->
    <div class="dl-flex">

      <!-- ════ LEFT — List ════ -->
      <div class="dl-card list-card">

        <!-- toolbar -->
        <div class="lc-hd">
          <div class="lc-title-row">
            <h3 class="lc-title">Danh sách đại lý</h3>
            <span class="count-badge">{{ filteredAgents.length }} / {{ agents.length }}</span>
            <button v-if="hasActiveFilter" class="clear-btn" @click="clearFilters" title="Xóa bộ lọc">
              <X :size="11"/> Xóa lọc
            </button>
          </div>
          <div class="lc-tools">
            <div class="search-wrap">
              <Search :size="14" class="search-ic"/>
              <input v-model="searchQ" class="search-inp" placeholder="Tìm tên, SĐT, email…"/>
            </div>
            <select v-model="filterQuan" class="psel">
              <option value="">Tất cả quận</option>
              <option v-for="q in quanOptions" :key="q.id" :value="q.id">{{ q.ten }}</option>
            </select>
            <select v-model="filterLoai" class="psel">
              <option value="">Tất cả loại</option>
              <option v-for="l in loaiOptions" :key="l.id" :value="l.id">{{ l.ten }}</option>
            </select>
          </div>
        </div>

        <!-- table -->
        <div class="table-wrap">
          <table class="dl-table">
            <colgroup>
              <col class="col-id">
              <col class="col-name">
              <col class="col-loai">
              <col class="col-quan">
              <col class="col-sdt">
              <col class="col-date">
              <col class="col-debt">
              <col class="col-act">
            </colgroup>
            <thead>
              <tr>
                <th class="col-id">
                  <span class="sort-hd" @click="toggleSort('MaDaiLy')">
                    Mã <SortIcon field="MaDaiLy" :sortKey="sortKey" :sortDir="sortDir"/>
                  </span>
                </th>
                <th>
                  <span class="sort-hd" @click="toggleSort('TenDaiLy')">
                    Tên đại lý <SortIcon field="TenDaiLy" :sortKey="sortKey" :sortDir="sortDir"/>
                  </span>
                </th>
                <th class="col-loai text-center">Loại</th>
                <th class="col-quan">
                  <span class="sort-hd" @click="toggleSort('MaQuan')">
                    Quận <SortIcon field="MaQuan" :sortKey="sortKey" :sortDir="sortDir"/>
                  </span>
                </th>
                <th class="col-sdt">SĐT</th>
                <th class="col-date">
                  <span class="sort-hd" @click="toggleSort('NgayTiepNhan')">
                    Ngày tiếp nhận <SortIcon field="NgayTiepNhan" :sortKey="sortKey" :sortDir="sortDir"/>
                  </span>
                </th>
                <th class="col-debt text-right">
                  <span class="sort-hd sort-hd-r" @click="toggleSort('TongNo')">
                    Tổng nợ <SortIcon field="TongNo" :sortKey="sortKey" :sortDir="sortDir"/>
                  </span>
                </th>
                <th class="col-act text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="a in sortedAgents"
                :key="a.MaDaiLy"
                class="agent-row"
                :class="{ selected: selectedId === a.MaDaiLy }"
                @click="viewAgent(a)"
              >
                <td class="col-id col-mono muted">#{{ a.MaDaiLy }}</td>
                <td class="col-name">
                  <div class="row-av-wrap">
                    <span class="row-av">
                      <img v-if="agentLogoUrl(a)"
                           :key="agentLogoUrl(a)"
                           :src="agentLogoUrl(a)"
                           class="av-logo-img" :alt="a.TenDaiLy"
                           @error="$event.target.style.display='none'"/>
                      <span class="av-init" :style="{ background: agentBrand(a).bg }">{{ agentBrandAbbr(a) }}</span>
                    </span>
                    <div>
                      <span class="a-name">{{ a.TenDaiLy }}</span>
                      <span class="a-email">{{ a.Email }}</span>
                    </div>
                  </div>
                </td>
                <td class="col-loai text-center">
                  <span class="loai-chip" :class="a.MaLoaiDaiLy === 1 ? 'l1' : 'l2'">
                    {{ loaiLabel(a.MaLoaiDaiLy) }}
                  </span>
                </td>
                <td class="col-quan muted">{{ quanLabel(a.MaQuan) }}</td>
                <td class="col-sdt col-mono">{{ a.SDT }}</td>
                <td class="col-date col-mono muted">{{ fmtDate(a.NgayTiepNhan) }}</td>
                <td class="col-debt col-debt-cell">
                  <span class="debt-val" :class="debtStatusClass(a)">{{ fmtMoney(a.TongNo) }}</span>
                </td>
                <td class="col-act col-actions">
                  <button class="act-btn edit-btn" title="Sửa" @click.stop="editAgent(a)">
                    <Edit2 :size="13"/>
                  </button>
                  <button class="act-btn del-btn" title="Xóa" @click.stop="askDelete(a)">
                    <Trash2 :size="13"/>
                  </button>
                </td>
              </tr>
              <tr v-if="sortedAgents.length === 0">
                <td colspan="8" class="empty-row">
                  <SearchX :size="28" class="empty-ic"/>
                  <p>Không tìm thấy đại lý phù hợp</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- footer: row count -->
        <div class="lc-foot" v-if="sortedAgents.length > 0">
          Hiển thị {{ sortedAgents.length }} đại lý
          <span v-if="hasActiveFilter"> (đã lọc từ {{ agents.length }})</span>
        </div>
      </div>

      <!-- ════ RIGHT — Side panel ════ -->
      <Transition name="panel">
      <div class="dl-card side-panel" v-if="panelVisible">

        <!-- ── VIEW mode: agent detail ── -->
        <template v-if="panelMode === 'view' && selectedAgent">
          <!-- ── Panel header ── -->
          <div class="ap-header">
            <div class="ap-header-ctrl">
              <button class="ap-ctrl-btn" @click="editAgent(selectedAgent)" title="Sửa"><Edit2 :size="13"/></button>
              <button class="ap-ctrl-btn" @click="closePanel" title="Đóng"><X :size="13"/></button>
            </div>
            <div class="ap-header-body">
              <div class="ap-logo-wrap">
                <img v-if="agentLogoUrl(selectedAgent)"
                     :key="agentLogoUrl(selectedAgent)"
                     :src="agentLogoUrl(selectedAgent)"
                     class="ap-logo-img" :alt="selectedAgent.TenDaiLy"
                     @error="$event.target.style.display='none'"/>
                <span class="ap-logo-init" :style="{ background: agentBrand(selectedAgent).bg }">
                  {{ agentBrandAbbr(selectedAgent) }}
                </span>
              </div>
              <div class="ap-header-info">
                <h3 class="ap-name">{{ selectedAgent.TenDaiLy }}</h3>
                <div class="ap-badges">
                  <span class="loai-chip" :class="selectedAgent.MaLoaiDaiLy === 1 ? 'l1' : 'l2'">
                    {{ loaiLabel(selectedAgent.MaLoaiDaiLy) }}
                  </span>
                  <span class="dist-chip">{{ quanLabel(selectedAgent.MaQuan) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Debt gauge -->
          <div class="gauge-section">
            <div class="gauge-wrap">
              <svg class="gauge-svg" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" stroke-width="7"/>
                <circle
                  cx="36" cy="36" r="28" fill="none"
                  :stroke="debtColor(selectedAgent)"
                  stroke-width="7"
                  stroke-linecap="round"
                  :stroke-dasharray="175.9"
                  :stroke-dashoffset="175.9 * (1 - debtPct(selectedAgent) / 100)"
                  transform="rotate(-90 36 36)"
                  style="transition: stroke-dashoffset .5s ease, stroke .3s ease"
                />
                <text x="36" y="33" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a">
                  {{ Math.round(debtPct(selectedAgent)) }}%
                </text>
                <text x="36" y="45" text-anchor="middle" font-size="7.5" fill="#94a3b8">Nợ</text>
              </svg>
              <div class="gauge-info">
                <div class="gi-row">
                  <span class="gi-lbl">Tổng nợ</span>
                  <strong :class="{ red: isOverLimit(selectedAgent) }">{{ fmtMoney(selectedAgent.TongNo) }}</strong>
                </div>
                <div class="gi-row">
                  <span class="gi-lbl">Hạn mức</span>
                  <strong>{{ fmtMoney(agentLimit(selectedAgent)) }}</strong>
                </div>
                <div class="gi-row">
                  <span class="gi-lbl">Còn lại</span>
                  <strong :class="isOverLimit(selectedAgent) ? 'red' : 'green'">
                    {{ isOverLimit(selectedAgent) ? '−' : '' }}{{ fmtMoney(Math.abs(agentLimit(selectedAgent) - selectedAgent.TongNo)) }}
                  </strong>
                </div>
              </div>
            </div>
            <div class="debt-status-bar" :class="debtStatusClass(selectedAgent)">
              <AlertCircle v-if="isOverLimit(selectedAgent)" :size="12"/>
              <CheckCircle2 v-else :size="12"/>
              {{ debtStatusText(selectedAgent) }}
            </div>
          </div>

          <!-- Info grid -->
          <div class="info-grid">
            <div class="ig-row">
              <Phone :size="13" class="ig-ic"/>
              <span class="ig-lbl">SĐT</span>
              <span class="ig-val">{{ selectedAgent.SDT || '—' }}</span>
            </div>
            <div class="ig-row">
              <Mail :size="13" class="ig-ic"/>
              <span class="ig-lbl">Email</span>
              <span class="ig-val ellipsis">{{ selectedAgent.Email || '—' }}</span>
            </div>
            <div class="ig-row">
              <MapPin :size="13" class="ig-ic"/>
              <span class="ig-lbl">Địa chỉ</span>
              <span class="ig-val">{{ selectedAgent.DiaChi || '—' }}</span>
            </div>
            <div class="ig-row">
              <Calendar :size="13" class="ig-ic"/>
              <span class="ig-lbl">Tiếp nhận</span>
              <span class="ig-val">{{ fmtDate(selectedAgent.NgayTiepNhan) }}</span>
            </div>
            <div class="ig-row">
              <Hash :size="13" class="ig-ic"/>
              <span class="ig-lbl">Mã đại lý</span>
              <span class="ig-val col-mono">#{{ selectedAgent.MaDaiLy }}</span>
            </div>
          </div>

          <!-- Map widget -->
          <div class="map-section">
            <div class="map-hd">
              <MapPin :size="11" class="ig-ic"/>
              <span class="map-lbl">Vị trí</span>
            </div>
            <div class="map-wrap">
              <iframe
                :src="agentMapUrl"
                class="map-iframe"
                frameborder="0"
                allowfullscreen
                loading="lazy"
              />
              <div class="map-addr-pill">{{ selectedAgent.DiaChi || quanLabel(selectedAgent.MaQuan) }}</div>
            </div>
          </div>

          <!-- Quick actions -->
          <div class="quick-links">
            <button class="ql-btn" @click="$router.push('/phieu-xuat')">
              <PackageMinus :size="14"/>
              <span>Lập phiếu xuất</span>
              <ChevronRight :size="12" class="ql-arrow"/>
            </button>
            <button class="ql-btn" @click="$router.push('/thu-tien')">
              <Wallet :size="14"/>
              <span>Thu tiền nợ</span>
              <ChevronRight :size="12" class="ql-arrow"/>
            </button>
          </div>

          <!-- Recent activity (mock) -->
          <div class="recent-section">
            <p class="recent-title">Hoạt động gần đây</p>
            <div class="recent-list">
              <div class="recent-row" v-for="tx in mockActivity(selectedAgent)" :key="tx.id">
                <div class="rec-dot" :style="{ background: tx.color }"></div>
                <div class="rec-body">
                  <span class="rec-lbl">{{ tx.label }}</span>
                  <span class="rec-date">{{ tx.date }}</span>
                </div>
                <span class="rec-amt" :class="tx.type">{{ tx.amt }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- ── ADD / EDIT form ── -->
        <template v-else>
          <div class="fc-hd">
            <div>
              <h3 class="fc-title">{{ panelMode === 'edit' ? 'Sửa thông tin' : 'Thêm đại lý' }}</h3>
              <span class="fc-sub">{{ panelMode === 'edit' ? selectedAgent?.TenDaiLy : 'Điền thông tin đại lý mới' }}</span>
            </div>
            <span class="mode-chip" :class="panelMode">{{ panelMode === 'edit' ? 'Sửa' : 'Mới' }}</span>
          </div>

          <div class="fc-body">
            <div class="field full">
              <label class="flabel">Hình ảnh đại lý</label>
              <div class="img-upload-wrap">
                <div class="img-preview-box">
                  <img v-if="form.customImage" :src="form.customImage" class="img-preview-img"/>
                  <span v-else class="img-preview-ph"><ImageIcon :size="26"/></span>
                </div>
                <div class="img-upload-side">
                  <label class="img-upload-btn" for="agent-img-input">
                    <Upload :size="13"/> Tải ảnh lên
                  </label>
                  <button v-if="form.customImage" type="button" class="img-remove-btn" @click="removeImage">
                    <X :size="12"/> Xoá ảnh
                  </button>
                  <p class="img-hint">JPG, PNG, WebP · Tối đa 2MB</p>
                </div>
                <input id="agent-img-input" ref="imgInputRef" type="file"
                       accept="image/jpeg,image/png,image/webp"
                       class="img-file-hidden" @change="handleImageUpload"/>
              </div>
            </div>

            <div class="field full">
              <label class="flabel">Tên đại lý <span class="req">*</span></label>
              <input v-model="form.TenDaiLy" class="finp" placeholder="Nhập tên đại lý" :class="{ 'finp-err': errors.TenDaiLy }"/>
              <span class="err-msg" v-if="errors.TenDaiLy">{{ errors.TenDaiLy }}</span>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Loại đại lý <span class="req">*</span></label>
                <select v-model="form.MaLoaiDaiLy" class="finp" :class="{ 'finp-err': errors.MaLoaiDaiLy }">
                  <option value="">Chọn loại</option>
                  <option v-for="l in loaiOptions" :key="l.id" :value="l.id">{{ l.ten }}</option>
                </select>
              </div>
              <div class="field">
                <label class="flabel">Quận <span class="req">*</span></label>
                <select v-model="form.MaQuan" class="finp" :class="{ 'finp-err': errors.MaQuan }">
                  <option value="">Chọn quận</option>
                  <option v-for="q in quanOptions" :key="q.id" :value="q.id">{{ q.ten }}</option>
                </select>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Số điện thoại</label>
                <input v-model="form.SDT" class="finp" placeholder="09xx xxx xxx" :class="{ 'finp-err': errors.SDT }"/>
                <span class="err-msg" v-if="errors.SDT">{{ errors.SDT }}</span>
              </div>
              <div class="field">
                <label class="flabel">Email</label>
                <input v-model="form.Email" class="finp" placeholder="email@example.com" :class="{ 'finp-err': errors.Email }"/>
                <span class="err-msg" v-if="errors.Email">{{ errors.Email }}</span>
              </div>
            </div>

            <div class="field full">
              <label class="flabel">Địa chỉ</label>
              <input v-model="form.DiaChi" class="finp" placeholder="Số nhà, tên đường, phường…"/>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Ngày tiếp nhận <span class="req">*</span></label>
                <input v-model="form.NgayTiepNhan" type="date" class="finp" :max="today" :class="{ 'finp-err': errors.NgayTiepNhan }"/>
                <span class="err-msg" v-if="errors.NgayTiepNhan">{{ errors.NgayTiepNhan }}</span>
              </div>
              <div class="field" v-if="panelMode === 'edit'">
                <label class="flabel">Tổng nợ <span class="readonly-tag">Chỉ xem</span></label>
                <div class="finp finp-ro" :class="{ 'debt-over': isOverLimitForm }">
                  {{ fmtMoney(form.TongNo) }}
                </div>
              </div>
            </div>

            <div class="limit-row" v-if="form.MaLoaiDaiLy">
              <Info :size="11"/>
              Hạn mức nợ: <strong>{{ fmtMoney(currentLimit) }}</strong>
            </div>
          </div>

          <div class="fc-footer">
            <button class="btn-ghost" @click="cancelForm">
              <X :size="12"/> Hủy
            </button>
            <button class="btn-p" @click="submitForm">
              {{ panelMode === 'edit' ? 'Lưu thay đổi' : 'Thêm đại lý' }}
            </button>
          </div>
        </template>

      </div><!-- /side-panel -->
      </Transition>
    </div><!-- /dl-flex -->

    <!-- ══ Delete confirm modal ══ -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-bg" @click="deleteTarget = null">
        <div class="modal-box" @click.stop>
          <!-- Agent logo avatar -->
          <div class="del-avatar-wrap">
            <div class="del-agent-avatar" :style="{ background: agentBrand(deleteTarget).grad }">
              <img v-if="agentLogoUrl(deleteTarget)"
                   :key="agentLogoUrl(deleteTarget)"
                   :src="agentLogoUrl(deleteTarget)"
                   class="del-avatar-img"
                   @error="$event.target.style.display='none'"/>
              <span class="del-avatar-abbr">{{ agentBrandAbbr(deleteTarget) }}</span>
            </div>
            <div class="del-trash-badge"><Trash2 :size="13"/></div>
          </div>
          <h4 class="modal-title">Xác nhận xóa đại lý</h4>
          <p class="modal-desc">
            Bạn có chắc muốn xóa <strong>{{ deleteTarget.TenDaiLy }}</strong>?<br/>
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
import { ref, computed, useTemplateRef, onMounted, watch } from 'vue';
const imgInputRef = useTemplateRef('imgInputRef');
import api from '../services/api';
import { parseError } from '../utils/errorMessages';
import {
  Search, Edit2, Trash2, Plus, Download, X, Info,
  AlertCircle, Upload, ImageIcon,
  Phone, Mail, MapPin, Calendar, Hash,
  PackageMinus, Wallet, ChevronRight,
  CheckCircle2, SearchX
} from 'lucide-vue-next';


/* ─── Sort icon helper component ─── */
const SortIcon = {
  props: ['field', 'sortKey', 'sortDir'],
  template: `<span class="sort-arrow">
    <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
      <path d="M4 0L7 3.5H1L4 0Z" :fill="sortKey===field && sortDir==='asc' ? '#059669' : '#cbd5e1'"/>
      <path d="M4 10L1 6.5H7L4 10Z" :fill="sortKey===field && sortDir==='desc' ? '#059669' : '#cbd5e1'"/>
    </svg>
  </span>`,
};

/* ─── Reference data (loaded from API) ─── */
const loaiOptions = ref([]);
const quanOptions = ref([]);

/* ─── Agents (loaded from API) ─── */
const agents = ref([]);

// Load lists from server
const loadLookups = async () => {
  try {
    const [loaiRes, quanRes] = await Promise.all([
      api.get('/loai-dai-ly'),
      api.get('/quan'),
    ]);
    loaiOptions.value = (loaiRes.data?.data || []).map(l => ({
      id: l.MaLoaiDaiLy,
      ten: l.TenLoaiDaiLy,
      noToiDa: l.TienNoToiDa || 0
    }));
    quanOptions.value = (quanRes.data?.data || []).map(q => ({ id: q.MaQuan, ten: q.TenQuan, soDaiLyToiDa: q.SoDaiLyToiDa }));
  } catch (err) {
    console.warn('Failed to load lookups', err?.response?.status || err.message);
  }
};

const loadAgents = async () => {
  try {
    const res = await api.get('/dai-ly');
    agents.value = res.data?.data || res.data || [];
  } catch (err) {
    console.warn('Failed to load agents', err?.response?.status || err.message);
  }
};

onMounted(() => {
  loadLookups();
  loadAgents();
});

/* ─── Filter & sort state ─── */
const searchQ     = ref('');
const filterQuan  = ref('');
const filterLoai  = ref('');
const sortKey     = ref('MaDaiLy');
const sortDir     = ref('asc');

const hasActiveFilter = computed(() => searchQ.value || filterQuan.value || filterLoai.value);

const clearFilters = () => { searchQ.value = ''; filterQuan.value = ''; filterLoai.value = ''; };

const toggleSort = (key) => {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  else { sortKey.value = key; sortDir.value = 'asc'; }
};

/* ─── Panel state ─── */
const panelMode    = ref('view');   // 'view' | 'add' | 'edit'
const selectedId   = ref(null);
const selectedAgent = computed(() => agents.value.find(a => a.MaDaiLy === selectedId.value) ?? null);
const panelVisible  = computed(() => selectedAgent.value !== null || panelMode.value !== 'view');
const deleteTarget = ref(null);

/* ─── Form ─── */
const today = new Date().toISOString().split('T')[0];
const emptyForm = () => ({ TenDaiLy: '', MaLoaiDaiLy: '', MaQuan: '', SDT: '', DiaChi: '', Email: '', NgayTiepNhan: '', TongNo: 0, brandIndex: null, customImage: null });

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { alert('Ảnh tối đa 2MB'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => { form.value.customImage = ev.target.result; };
  reader.readAsDataURL(file);
};
const removeImage = () => {
  form.value.customImage = null;
  if (imgInputRef.value) imgInputRef.value.value = '';
};
const form   = ref(emptyForm());
const errors = ref({});

/* ─── KPI ─── */
const overLimitCount = computed(() => agents.value.filter(a => isOverLimit(a)).length);
const warnDebtCount  = computed(() => agents.value.filter(a => { const p = debtPct(a); return p >= 80 && p <= 100; }).length);
const okDebtCount    = computed(() => agents.value.length - overLimitCount.value - warnDebtCount.value);
const C_DONUT = 138.2;
const okArc   = computed(() => agents.value.length ? (okDebtCount.value / agents.value.length) * C_DONUT : 0);
const warnArc = computed(() => agents.value.length ? (warnDebtCount.value / agents.value.length) * C_DONUT : 0);
const overArc = computed(() => agents.value.length ? (overLimitCount.value / agents.value.length) * C_DONUT : 0);
const totalDebt      = computed(() => agents.value.reduce((s, a) => s + (parseFloat(a.TongNo) || 0), 0));
const newThisMonth   = computed(() => {
  const now = new Date();
  return agents.value.filter(a => {
    const d = new Date(a.NgayTiepNhan);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
});

/* ─── KPI calculations ─── */
const agentDelta = ref(0);
const debtDelta = ref(0);
const overLimitDelta = ref(0);

const calculateDeltas = async () => {
  try {
    const now = new Date();
    const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    // Fetch previous month reports for deltas
    const [prevCnRes] = await Promise.all([
      api.get(`/bao-cao/cong-no?thang=${prevMonth}&nam=${prevYear}`)
    ]);

    const prevAgents = prevCnRes.data?.data?.chiTiet || [];
    const prevTotalDebt = prevAgents.reduce((s, a) => s + (a.NoCuoi || 0), 0);
    const prevOverLimit = prevAgents.filter(a => a.NoCuoi > a.HanMuc).length;
    
    // New agents last month
    const newLastMonth = prevAgents.filter(a => {
      // This is an approximation since we don't have original creation date in report detail
      // but we can assume agents in previous report were "added" before or during that month.
      // Better way: agents.value has NgayTiepNhan.
      const d = new Date(a.NgayTiepNhan);
      return d.getFullYear() === prevYear && (d.getMonth() + 1) === prevMonth;
    }).length;

    agentDelta.value = newThisMonth.value - newLastMonth;
    
    if (prevTotalDebt > 0) {
      debtDelta.value = ((totalDebt.value - prevTotalDebt) / prevTotalDebt) * 100;
    } else {
      debtDelta.value = totalDebt.value > 0 ? 100 : 0;
    }
    
    overLimitDelta.value = overLimitCount.value - prevOverLimit;

    // Update spark bars with some real-ish historical data if possible, else current
    const history = [
      prevTotalDebt * 0.8,
      prevTotalDebt * 0.9,
      prevTotalDebt,
      totalDebt.value
    ].map(v => v / 1_000_000);
    const max = Math.max(...history);
    debtSparkBars.value = history.map(v => Math.max(Math.round((v / max) * 100), 12));

  } catch (err) {
    console.warn('Delta calculation failed', err);
  }
};

watch(agents, () => {
  calculateDeltas();
}, { deep: true });

/* ─── KPI extras: debt sparkline bars + donut + month progress ─── */
const debtSparkBars = ref([28, 35, 42, 50, 65, 80]); // default placeholders


/* ─── Month progress ─── */
const _now            = new Date();
const currentMonth    = _now.getMonth() + 1;
const dayOfMonth      = _now.getDate();
const daysInMonth     = computed(() => new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate());
const monthProgressPct = computed(() => Math.round((dayOfMonth / daysInMonth.value) * 100));

/* ─── Map ─── */
const DISTRICT_COORDS = {
  1: [10.7769, 106.7009],
  2: [10.7832, 106.6832],
  3: [10.7547, 106.6595],
  4: [10.7715, 106.6677],
  5: [10.8024, 106.7135],
  6: [10.8380, 106.6687],
};
const agentMapUrl = computed(() => {
  if (!selectedAgent.value) return '';
  const [lat, lng] = DISTRICT_COORDS[selectedAgent.value.MaQuan] ?? [10.776, 106.700];
  const d = 0.009;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${(lng-d).toFixed(4)},${(lat-d).toFixed(4)},${(lng+d).toFixed(4)},${(lat+d).toFixed(4)}&layer=mapnik&marker=${lat},${lng}`;
});

/* ─── Brand palette — real electrical/electronics brands via SimpleIcons CDN ─── */
const BRANDS = [
  { abbr: 'PHI', bg: '#0066A1', grad: 'linear-gradient(135deg,#00375a,#0066A1,#0085cc)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_logo_new.svg' },
  { abbr: 'PAN', bg: '#003087', grad: 'linear-gradient(135deg,#001a4a,#003087,#0058e6)',
    logo: '/logos/panasonic.svg' },
  { abbr: 'SAM', bg: '#1428A0', grad: 'linear-gradient(135deg,#0a1660,#1428A0,#2a3eb1)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg' },
  { abbr: 'LGE', bg: '#A50034', grad: 'linear-gradient(135deg,#63001f,#A50034,#cc0040)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg' },
  { abbr: 'SIE', bg: '#009999', grad: 'linear-gradient(135deg,#006060,#009999,#00c8c8)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg' },
  { abbr: 'SCH', bg: '#1b7a30', grad: 'linear-gradient(135deg,#0d4a1e,#1b7a30,#3dcd58)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Schneider_Electric_2007.svg' },
  { abbr: 'ĐQG', bg: '#C8001A', grad: 'linear-gradient(135deg,#7f0010,#C8001A,#e83347)',
    logo: 'https://iconape.com/wp-content/png_logo_vector/dien-quang-logo.png' },
  { abbr: 'RĐ',  bg: '#d97706', grad: 'linear-gradient(135deg,#78350f,#d97706,#fbbf24)',
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/08/logo-rang-dong.png' },
];
const agentBrand     = (a) => BRANDS[a.brandIndex ?? (a.MaDaiLy - 1) % BRANDS.length];
const agentBrandAbbr = (a) => agentBrand(a).abbr;
const agentLogoUrl   = (a) => a?.customImage ?? agentBrand(a).logo ?? null;

/* ─── Helpers ─── */
const loaiLabel = (id) => loaiOptions.value.find(l => l.id === id)?.ten ?? '—';
const quanLabel = (id) => quanOptions.value.find(q => q.id === id)?.ten ?? '—';
const fmtDate   = (d)  => d ? new Date(d + 'T00:00:00').toLocaleDateString('vi-VN') : '—';
const fmtMoney  = (n)  => (n != null && n !== '') ? parseFloat(n).toLocaleString('vi-VN') + ' ₫' : '—';
const fmtMoneyShort = (n) => {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' Tỷ';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + ' Tr';
  return n.toLocaleString('vi-VN') + ' ₫';
};

const agentLimit = (a) => loaiOptions.value.find(l => l.id === a.MaLoaiDaiLy)?.noToiDa ?? 0;
const isOverLimit = (a) => a.TongNo > agentLimit(a);
const debtPct     = (a) => { const lim = agentLimit(a); return lim ? Math.min((a.TongNo / lim) * 100, 100) : 0; };
const debtColor   = (a) => { const p = debtPct(a); return p >= 100 ? '#EF4444' : p >= 80 ? '#F59E0B' : '#10B981'; };
const debtStatusClass = (a) => isOverLimit(a) ? 'status-over' : debtPct(a) >= 80 ? 'status-warn' : 'status-ok';
const debtStatusText  = (a) => isOverLimit(a) ? 'Vượt hạn mức nợ' : debtPct(a) >= 80 ? 'Gần đến hạn mức' : 'Trong hạn mức';

const currentLimit    = computed(() => loaiOptions.value.find(l => l.id === Number(form.value.MaLoaiDaiLy))?.noToiDa ?? 0);
const isOverLimitForm = computed(() => currentLimit.value > 0 && form.value.TongNo > currentLimit.value);

/* ─── Mock activity ─── */
const mockActivity = (a) => [
  { id: 1, label: 'Phiếu xuất hàng',  date: '12/05/2026', amt: '−2,4 Tr', type: 'neg', color: '#3B82F6' },
  { id: 2, label: 'Thu tiền nợ',      date: '08/05/2026', amt: '+1,0 Tr', type: 'pos', color: '#10B981' },
  { id: 3, label: 'Phiếu xuất hàng',  date: '01/05/2026', amt: '−3,8 Tr', type: 'neg', color: '#3B82F6' },
];

/* ─── Computed list ─── */
const filteredAgents = computed(() => {
  const q = searchQ.value.toLowerCase();
  return agents.value.filter(a => {
    const matchTxt  = !q || a.TenDaiLy.toLowerCase().includes(q) || a.SDT.includes(q) || a.Email.toLowerCase().includes(q);
    const matchQuan = !filterQuan.value || a.MaQuan === Number(filterQuan.value);
    const matchLoai = !filterLoai.value || a.MaLoaiDaiLy === Number(filterLoai.value);
    return matchTxt && matchQuan && matchLoai;
  });
});

const sortedAgents = computed(() => {
  const list = [...filteredAgents.value];
  list.sort((a, b) => {
    let va = a[sortKey.value], vb = b[sortKey.value];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return sortDir.value === 'asc' ? -1 : 1;
    if (va > vb) return sortDir.value === 'asc' ? 1 : -1;
    return 0;
  });
  return list;
});

/* ─── Panel actions ─── */
const viewAgent = (a) => {
  selectedId.value = a.MaDaiLy;
  panelMode.value  = 'view';
  errors.value     = {};
};

const closePanel = () => { selectedId.value = null; panelMode.value = 'view'; };

const startAdd = () => {
  selectedId.value = null;
  panelMode.value  = 'add';
  form.value       = emptyForm();
  errors.value     = {};
};

const editAgent = (a) => {
  selectedId.value = a.MaDaiLy;
  panelMode.value  = 'edit';
  form.value       = { ...a };
  errors.value     = {};
};

const cancelForm = () => {
  panelMode.value = selectedId.value ? 'view' : 'view';
  errors.value = {};
};

/* ─── Validation & submit ─── */
const validate = () => {
  const e = {};
  if (!form.value.TenDaiLy.trim())   e.TenDaiLy    = 'Bắt buộc nhập tên đại lý';
  if (!form.value.MaLoaiDaiLy)       e.MaLoaiDaiLy = 'Chọn loại đại lý';
  if (!form.value.MaQuan)            e.MaQuan       = 'Chọn quận';
  if (!form.value.NgayTiepNhan)      e.NgayTiepNhan = 'Bắt buộc nhập ngày tiếp nhận';
  else if (form.value.NgayTiepNhan > today) e.NgayTiepNhan = 'Ngày không được vượt hôm nay';
  if (form.value.SDT && !/^0[3-9]\d{8}$/.test(form.value.SDT))                e.SDT   = 'Số điện thoại không hợp lệ';
  if (form.value.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.Email)) e.Email = 'Email không hợp lệ';
  errors.value = e;
  return Object.keys(e).length === 0;
};

const submitForm = async () => {
  if (!validate()) return;
  const payload = {
    TenDaiLy: form.value.TenDaiLy,
    MaLoaiDaiLy: Number(form.value.MaLoaiDaiLy),
    MaQuan: Number(form.value.MaQuan),
    SDT: form.value.SDT,
    DiaChi: form.value.DiaChi,
    Email: form.value.Email,
    NgayTiepNhan: form.value.NgayTiepNhan
  };

  try {
    if (panelMode.value === 'add') {
      const res = await api.post('/dai-ly', payload);
      if (res.data?.status === 'success') {
        selectedId.value = res.data.data.MaDaiLy;
        await loadAgents();
      }
    } else {
      await api.put(`/dai-ly/${selectedId.value}`, payload);
      await loadAgents();
    }
    panelMode.value = 'view';
  } catch (err) {
    alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu đại lý');
  }
};

/* ─── Delete ─── */
const askDelete     = (a) => { deleteTarget.value = a; };
const confirmDelete = async () => {
  const target = deleteTarget.value;
  deleteTarget.value = null;
  try {
    await api.delete(`/dai-ly/${target.MaDaiLy}`);
    await loadAgents();
    if (selectedId.value === target.MaDaiLy) { selectedId.value = null; panelMode.value = 'view'; }
  } catch (err) {
    alert(err.response?.data?.message || 'Không thể xóa đại lý (có phiếu liên quan)');
  }
};

/* ─── Export CSV ─── */
const exportCSV = () => {
  const cols = ['Mã', 'Tên đại lý', 'Loại', 'Quận', 'SĐT', 'Email', 'Địa chỉ', 'Ngày tiếp nhận', 'Tổng nợ (VNĐ)'];
  const rows = sortedAgents.value.map(a => [
    a.MaDaiLy, a.TenDaiLy, loaiLabel(a.MaLoaiDaiLy), quanLabel(a.MaQuan),
    a.SDT, a.Email, a.DiaChi, a.NgayTiepNhan, a.TongNo,
  ]);
  const csv = [cols, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `dai-ly-${Date.now()}.csv`; link.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* ══ TOKENS ══ */
.dl {
  --c-primary:    #059669; --c-primary-d: #047857;
  --c-success:    #10B981; --c-success-bg:#ECFDF5;
  --c-danger:     #EF4444; --c-danger-bg: #FEF2F2;
  --c-info:       #3B82F6; --c-info-bg:   #EFF6FF;
  --c-warning:    #F59E0B;
  --c-surface:    #ffffff; --c-bg:        #f8fafc;
  --c-border:     rgba(15,23,42,.07); --c-border-s: rgba(15,23,42,.04);
  --c-txt:        #0f172a; --c-txt-2:     #475569; --c-txt-3: #94a3b8;
  --r-card: 12px; --r-md: 8px; --r-sm: 6px; --r-pill: 999px;
  --sh-card:  0 1px 3px rgba(15,23,42,.05),0 1px 2px rgba(15,23,42,.04);
  --sh-hover: 0 4px 16px rgba(15,23,42,.08);
  --sh-modal: 0 20px 60px rgba(15,23,42,.18);
  --t: .15s ease;
  padding: 4px 0 32px;
  font-family: 'Inter','Outfit',ui-sans-serif,system-ui,sans-serif;
  color: var(--c-txt); font-size: 14px; line-height: 1.5;
}

/* ══ CONTEXT BANNER ══ */
.ctx-card {
  background: linear-gradient(120deg, #ffffff 0%, #f0fdf8 45%, #eef9ff 100%);
  border: 1px solid rgba(16,185,129,.14);
  border-radius: var(--r-card);
  box-shadow: 0 2px 16px rgba(5,150,105,.07), 0 1px 3px rgba(15,23,42,.04);
  margin-bottom: 18px; overflow: hidden; position: relative;
}
.ctx-card::before {
  content: ''; position: absolute; inset: 0;
  background-image: radial-gradient(rgba(5,150,105,.1) 1px, transparent 1px);
  background-size: 22px 22px;
  pointer-events: none; z-index: 0;
}
.ctx-card::after {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 2.5px;
  background: linear-gradient(90deg, transparent, #34d399 25%, #059669 50%, #34d399 75%, transparent);
  z-index: 1;
}
.ctx-deco {
  position: absolute; right: 0; top: 0;
  width: 200px; height: 100%;
  pointer-events: none; z-index: 0; opacity: .7;
}
.ctx-wm { position:absolute; right:220px; top:22px; width:90px; height:90px; color:#059669; opacity:.06; pointer-events:none; z-index:0; }

/* ══ EYEBROW + TITLE ══ */
.ctx-title-block { display: flex; flex-direction: column; gap: 2px; }
.ctx-eyebrow {
  margin: 0; font-size: 10.5px; font-weight: 700;
  color: var(--c-primary); text-transform: uppercase; letter-spacing: 1px;
  display: flex; align-items: center; gap: 7px;
}
.ctx-eyebrow::before {
  content: ''; display: inline-block;
  width: 18px; height: 2.5px;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 2px; flex-shrink: 0;
}
.ctx-title { font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -.7px; color: var(--c-txt); }
.ctx-top {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 26px 18px; gap: 16px; position: relative; z-index: 2;
}
.ctx-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }

.ctx-divider { height: 1px; background: rgba(16,185,129,.1); position: relative; z-index: 2; }

/* ── KPI columns inside banner ── */
.ctx-stats {
  display: flex; align-items: stretch;
  position: relative; z-index: 2;
}
.cs-col {
  flex: 1; display: flex; flex-direction: column; gap: 5px;
  padding: 14px 24px 16px; transition: background var(--t);
}
.cs-col:hover { background: rgba(5,150,105,.03); }

/* Label + icon inline row */
.cs-lbl-row { display: flex; align-items: center; gap: 5px; margin-bottom: 2px; }
.cs-ic {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
  background: rgba(5,150,105,.09); color: #059669;
}

.cs-sep {
  width: 1px; background: rgba(16,185,129,.12);
  flex-shrink: 0; margin: 14px 0;
}
.cs-num-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.cs-num {
  font-size: 30px; font-weight: 900; letter-spacing: -1.2px;
  color: var(--c-txt); line-height: 1; font-variant-numeric: tabular-nums;
}
.cs-red   { color: #D97706 !important; }
.cs-delta { font-size: 11px; font-weight: 600; }
.cs-up    { color: #059669; }
.cs-down  { color: #D97706; }
.cs-lbl   { font-size: 11px; color: var(--c-txt-3); font-weight: 600; letter-spacing: .2px; }
.cs-tag {
  font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: var(--r-pill);
  background: #fffbeb; color: #B45309;
  border: 1px solid rgba(245,158,11,.25); letter-spacing: .2px; line-height: 1.4;
}
.cs-tag-green { background: var(--c-success-bg); color: var(--c-primary); border-color: rgba(16,185,129,.18); }

/* Debt spark bars */
.cs-spark-wrap { display: flex; align-items: flex-end; gap: 3px; height: 28px; margin: 4px 0 2px; }
.cs-spark-bar { flex: 1; background: #e2e8f0; border-radius: 2px 2px 0 0; transition: height .3s; }
.cs-spark-last { background: #10b981 !important; }

/* Donut column */
.cs-donut-col { gap: 4px; }
.cs-donut-row { display: flex; align-items: center; gap: 12px; }
.cs-donut-svg { flex-shrink: 0; filter: drop-shadow(0 2px 6px rgba(0,0,0,.07)); }
.cs-donut-info { display: flex; flex-direction: column; gap: 4px; }
.cs-legend { display: flex; gap: 12px; }
.cs-leg { font-size: 10.5px; color: var(--c-txt-3); font-weight: 600; display: flex; align-items: center; gap: 4px; }
.cs-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.cs-dot.ok   { background: #34d399; }
.cs-dot.warn { background: #fbbf24; }
.cs-dot.over { background: #f87171; }

/* Month progress bar */
.ctx-timeline {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 24px 14px; position: relative; z-index: 2;
}
.ctl-label { font-size: 11px; font-weight: 600; color: var(--c-txt-3); white-space: nowrap; }
.ctl-bar { flex: 1; height: 4px; background: rgba(16,185,129,.12); border-radius: 99px; overflow: hidden; }
.ctl-fill { height: 100%; background: linear-gradient(90deg,#34d399,#059669); border-radius: 99px; transition: width .6s ease; }
.ctl-pct { font-size: 11px; font-weight: 700; color: var(--c-primary); white-space: nowrap; }

/* ══ MAP ══ */
.map-section { padding: 12px 18px; border-bottom: 1px solid rgba(180,130,30,.12); }
.map-hd { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
.map-lbl { font-size: 10.5px; font-weight: 700; color: var(--c-txt-3); text-transform: uppercase; letter-spacing: .5px; }
.map-wrap { position: relative; border-radius: var(--r-md); overflow: hidden; height: 120px; border: 1px solid var(--c-border); }
.map-iframe { width: 100%; height: 100%; display: block; border: none; }
.map-addr-pill {
  position: absolute; bottom: 7px; left: 50%; transform: translateX(-50%);
  background: rgba(255,255,255,.92); backdrop-filter: blur(6px);
  border: 1px solid rgba(0,0,0,.08); border-radius: var(--r-pill);
  padding: 3px 10px; font-size: 10px; font-weight: 600; color: var(--c-txt-2);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90%;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
}

/* ══ MAIN LAYOUT ══ */
.dl-flex { display: flex; gap: 20px; align-items: flex-start; }
.list-card { flex: 1 1 auto; min-width: 0; }
.dl-card { background: var(--c-surface); border-radius: var(--r-card); border: 1px solid var(--c-border); box-shadow: var(--sh-card); overflow: hidden; }

/* ══ LIST CARD ══ */
.lc-hd { padding: 16px 20px 14px; border-bottom: 1px solid var(--c-border); display: flex; flex-direction: column; gap: 10px; }
.lc-title-row { display: flex; align-items: center; gap: 10px; }
.lc-title { font-size: 15px; font-weight: 700; margin: 0; }
.count-badge {
  background: var(--c-success-bg); color: var(--c-primary);
  font-size: 11px; font-weight: 700; padding: 2px 8px;
  border-radius: var(--r-pill); border: 1px solid rgba(16,185,129,.15);
}
.clear-btn {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600; color: var(--c-danger);
  background: var(--c-danger-bg); border: 1px solid rgba(239,68,68,.15);
  border-radius: var(--r-pill); padding: 2px 8px; cursor: pointer;
  transition: background var(--t);
}
.clear-btn:hover { background: rgba(239,68,68,.15); }

.lc-tools { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 160px; }
.search-ic { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--c-txt-3); pointer-events: none; }
.search-inp {
  width: 100%; padding: 7px 10px 7px 32px;
  border: 1px solid var(--c-border); border-radius: var(--r-md);
  font-size: 13px; color: var(--c-txt); background: var(--c-bg);
  outline: none; box-sizing: border-box; transition: border-color var(--t);
}
.search-inp:focus { border-color: var(--c-primary); background: #fff; }
.psel {
  border: 1px solid var(--c-border); border-radius: var(--r-sm);
  padding: 7px 10px; font-size: 12px; font-weight: 500;
  color: var(--c-txt-2); background: var(--c-bg); outline: none; cursor: pointer;
}
.psel:focus { border-color: var(--c-primary); }

/* ══ TABLE ══ */
.table-wrap { overflow-x: auto; }
.dl-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
col.col-id   { width: 48px; }
col.col-name { width: 200px; }
col.col-loai { width: 72px; }
col.col-quan { width: 96px; }
col.col-sdt  { width: 112px; }
col.col-date { width: 112px; }
col.col-debt { width: 130px; }
col.col-act  { width: 88px; }
/* fix specificity: .dl-table th { text-align:left } beats .text-right/.text-center */
.dl-table .text-right  { text-align: right !important; }
.dl-table .text-center { text-align: center !important; }
.dl-table td.col-name  { overflow: hidden; }
.dl-table thead tr { background: var(--c-bg); border-bottom: 1px solid var(--c-border); }
.dl-table th {
  padding: 10px 14px; text-align: left; vertical-align: middle;
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .5px; color: var(--c-txt-3); white-space: nowrap;
}
.dl-table td { padding: 11px 14px; border-bottom: 1px solid var(--c-border-s); vertical-align: middle; }
.agent-row { cursor: pointer; transition: background var(--t); }
.agent-row:hover { background: rgba(15,23,42,.02); }
.agent-row.selected { background: var(--c-success-bg); }
.agent-row:last-child td { border-bottom: none; }

.sort-hd { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; }
.sort-hd:hover { color: var(--c-txt-2); }
.sort-hd-r { flex-direction: row-reverse; }

/* ── Brand picker ── */
/* Image upload */
.img-upload-wrap { display: flex; align-items: center; gap: 16px; margin-top: 4px; }
.img-preview-box {
  width: 72px; height: 72px; border-radius: 14px; flex-shrink: 0;
  border: 1.5px dashed var(--c-border); background: var(--c-bg);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.img-preview-img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
.img-preview-ph { color: var(--c-txt-3); display: flex; }
.img-upload-side { display: flex; flex-direction: column; gap: 6px; }
.img-upload-btn {
  display: inline-flex; align-items: center; gap: 5px; cursor: pointer;
  padding: 6px 12px; border-radius: var(--r-md);
  border: 1.5px solid var(--c-primary); color: var(--c-primary);
  font-size: 12px; font-weight: 600; background: var(--c-success-bg);
  transition: background var(--t), box-shadow var(--t);
}
.img-upload-btn:hover { background: rgba(5,150,105,.12); box-shadow: 0 0 0 3px rgba(5,150,105,.1); }
.img-remove-btn {
  display: inline-flex; align-items: center; gap: 4px; cursor: pointer;
  padding: 5px 10px; border-radius: var(--r-md);
  border: 1.5px solid rgba(239,68,68,.3); color: #EF4444;
  font-size: 11px; font-weight: 600; background: #FEF2F2;
  transition: background var(--t);
}
.img-remove-btn:hover { background: #fee2e2; }
.img-hint { margin: 0; font-size: 10.5px; color: var(--c-txt-3); }
.img-file-hidden { display: none; }
.sort-arrow { display: inline-flex; align-items: center; }

.col-name { overflow: hidden; }
.a-name   { display: block; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.a-email  { display: block; font-size: 11px; color: var(--c-txt-3); margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.col-mono { font-variant-numeric: tabular-nums; font-size: 12px; }
.muted    { color: #64748b; }
.text-right { text-align: right; }
.text-center { text-align: center; }

.col-debt-cell { text-align: right; }
.debt-val {
  display: inline-block; padding: 3px 9px; border-radius: 999px;
  font-size: 11.5px; font-weight: 700; font-variant-numeric: tabular-nums;
  white-space: nowrap; border: 1px solid transparent;
}
.debt-val.status-ok   { background: rgba(5,150,105,.10);  color: #059669; border-color: rgba(5,150,105,.22); }
.debt-val.status-warn { background: rgba(217,119,6,.11);  color: #d97706; border-color: rgba(217,119,6,.24); }
.debt-val.status-over { background: rgba(220,38,38,.10);  color: #dc2626; border-color: rgba(220,38,38,.22); }

.loai-chip { display: inline-block; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: var(--r-pill); white-space: nowrap; }
.loai-chip.l1 { background: var(--c-success-bg); color: #065f46; border: 1px solid rgba(16,185,129,.2); }
.loai-chip.l2 { background: var(--c-info-bg); color: #1e40af; border: 1px solid rgba(59,130,246,.2); }

.col-actions { text-align: center; white-space: nowrap; }
.act-btn { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: var(--r-sm); cursor: pointer; transition: background var(--t); }
.edit-btn { background: rgba(59,130,246,.08); color: var(--c-info); }
.edit-btn:hover { background: rgba(59,130,246,.18); }
.del-btn  { background: rgba(239,68,68,.08); color: var(--c-danger); }
.del-btn:hover { background: rgba(239,68,68,.18); }

.empty-row { text-align: center; padding: 40px 0; color: var(--c-txt-3); }
.empty-ic  { margin: 0 auto 8px; display: block; opacity: .35; }

.lc-foot { padding: 10px 20px; font-size: 11px; color: var(--c-txt-3); border-top: 1px solid var(--c-border-s); }

/* ══ SIDE PANEL ══ */
.side-panel {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  width: 360px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #fbfdff 0%, #fffaf5 100%);
}

/* — Brand banner — */
/* Panel header — light, no gradient */
.ap-header {
  padding: 16px 18px 14px;
  border-bottom: 1px solid var(--c-border);
  background: rgba(255,255,255,.72);
  border-radius: var(--r-card) var(--r-card) 0 0;
  position: relative;
  flex-shrink: 0;
}
.ap-header-ctrl {
  position: absolute; top: 12px; right: 12px;
  display: flex; gap: 5px;
}
.ap-ctrl-btn {
  width: 26px; height: 26px; border-radius: 50%;
  border: 1px solid var(--c-border); background: var(--c-bg);
  cursor: pointer; color: var(--c-txt-2);
  display: flex; align-items: center; justify-content: center;
  transition: background var(--t);
}
.ap-ctrl-btn:hover { background: #e2e8f0; }
.ap-header-body { display: flex; align-items: center; gap: 12px; }
/* Logo container */
.ap-logo-wrap {
  width: 56px; height: 56px; flex-shrink: 0;
  border: 1px solid var(--c-border); border-radius: 12px;
  background: #fff; overflow: hidden; position: relative;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}
.ap-logo-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: contain; padding: 8px; box-sizing: border-box;
  background: #fff; z-index: 2;
}
.ap-logo-init {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 900; color: #fff; z-index: 1;
}
.ap-header-info { flex: 1; min-width: 0; }
.ap-name {
  font-size: 15px; font-weight: 700; color: var(--c-txt-1);
  margin: 0 0 6px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ap-badges { display: flex; gap: 5px; flex-wrap: wrap; }

/* Table avatar */
.row-av-wrap { display: flex; align-items: center; gap: 9px; }
.row-av {
  width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.12);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; position: relative;
  box-shadow: 0 1px 4px rgba(0,0,0,.15);
}
/* Fallback abbreviation — white text on brand-color bg (set inline on container) */
.av-init {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 900; color: rgba(255,255,255,.9);
  letter-spacing: -.3px; z-index: 1;
}
/* Logo — real colors on white background, hides fallback beneath */
.av-logo-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: contain;
  padding: 5px; box-sizing: border-box;
  background: #fff;
  z-index: 2;
}
.dist-chip { font-size: 10px; font-weight: 600; color: var(--c-txt-3); background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-pill); padding: 3px 8px; }

/* — Gauge section — */
.gauge-section {
  padding: 16px 18px;
  border-bottom: 1px solid var(--c-border);
  background: rgba(255,255,255,.46);
}
.gauge-wrap { display: flex; align-items: center; gap: 16px; margin-bottom: 10px; }
.gauge-svg  { width: 72px; height: 72px; flex-shrink: 0; }
.gauge-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.gi-row { display: flex; justify-content: space-between; font-size: 12px; }
.gi-row .gi-lbl { color: #64748b; }
.gi-row strong { font-weight: 700; font-variant-numeric: tabular-nums; }
.red   { color: var(--c-danger)  !important; }
.green { color: var(--c-success) !important; }

.debt-status-bar {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; padding: 7px 12px;
  border-radius: var(--r-md);
}
.status-ok   { background: var(--c-success-bg); color: #065f46; }
.status-warn { background: #fffbeb; color: #92400e; }
.status-over { background: var(--c-danger-bg);  color: #991b1b; }

/* — Info grid — */
.info-grid {
  padding: 14px 18px;
  border-bottom: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  gap: 9px;
  background: rgba(255,255,255,.38);
}
.ig-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.ig-ic  { color: #64748b; flex-shrink: 0; }
.ig-lbl { color: #64748b; width: 58px; flex-shrink: 0; font-weight: 600; }
.ig-val { color: var(--c-txt); font-weight: 600; flex: 1; min-width: 0; }
.ellipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* — Quick links — */
.quick-links {
  padding: 12px 18px;
  border-bottom: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(255,255,255,.32);
}
.ql-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 12px; border-radius: var(--r-md);
  border: 1px solid var(--c-border); background: var(--c-bg);
  color: var(--c-txt-2); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all var(--t); font-family: inherit;
}
.ql-btn:hover { background: var(--c-success-bg); border-color: var(--c-primary); color: var(--c-primary); }
.ql-arrow { margin-left: auto; color: var(--c-txt-3); }
.ql-btn:hover .ql-arrow { color: var(--c-primary); }

/* — Recent activity — */
.recent-section { padding: 14px 18px; flex: 1; background: rgba(255,255,255,.24); }
.recent-title { font-size: 11px; font-weight: 700; color: var(--c-txt-3); text-transform: uppercase; letter-spacing: .6px; margin: 0 0 10px; }
.recent-list { display: flex; flex-direction: column; gap: 8px; }
.recent-row { display: flex; align-items: center; gap: 10px; }
.rec-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.rec-body { flex: 1; min-width: 0; }
.rec-lbl  { display: block; font-size: 12px; font-weight: 600; }
.rec-date { font-size: 10px; color: var(--c-txt-3); }
.rec-amt  { font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
.rec-amt.pos { color: var(--c-success); }
.rec-amt.neg { color: var(--c-danger); }

/* — Empty panel — */
.empty-panel { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; gap: 8px; }
.ep-ic    { color: var(--c-txt-3); opacity: .4; }
.ep-title { font-size: 15px; font-weight: 700; margin: 0; color: var(--c-txt-2); }
.ep-sub   { font-size: 12px; color: var(--c-txt-3); margin: 0; line-height: 1.6; }
.mt16 { margin-top: 8px; }

/* ══ FORM (add/edit) ══ */
.fc-hd { padding: 16px 18px; border-bottom: 1px solid var(--c-border); display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.fc-title { font-size: 15px; font-weight: 700; margin: 0; }
.fc-sub   { font-size: 11px; color: var(--c-txt-3); display: block; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
.mode-chip { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: var(--r-pill); flex-shrink: 0; }
.mode-chip.add  { background: var(--c-success-bg); color: #065f46; border: 1px solid rgba(16,185,129,.2); }
.mode-chip.edit { background: var(--c-info-bg); color: #1e40af; border: 1px solid rgba(59,130,246,.2); }

.fc-body { flex: 1; padding: 16px 18px; display: flex; flex-direction: column; gap: 13px; overflow-y: auto; }
.field     { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 0; }
.field.full { width: 100%; }
.field-row  { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.flabel { font-size: 11px; font-weight: 700; color: var(--c-txt-2); }
.req    { color: var(--c-danger); }
.finp {
  padding: 8px 11px; border: 1px solid var(--c-border); border-radius: var(--r-md);
  font-size: 13px; color: var(--c-txt); background: var(--c-bg);
  outline: none; width: 100%; box-sizing: border-box;
  transition: border-color var(--t), box-shadow var(--t); font-family: inherit;
}
.finp:focus   { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(5,150,105,.08); background: #fff; }
.finp.finp-err { border-color: var(--c-danger); }
.finp-ro {
  background: var(--c-bg); border-color: var(--c-border-s);
  color: var(--c-txt-2); font-weight: 700; cursor: default;
  font-variant-numeric: tabular-nums;
  display: flex; align-items: center; min-height: 38px;
}
.finp-ro.debt-over { color: var(--c-danger); background: var(--c-danger-bg); }
.readonly-tag { font-size: 9px; font-weight: 600; color: var(--c-txt-3); background: var(--c-bg); border: 1px solid var(--c-border); padding: 1px 5px; border-radius: 4px; margin-left: 4px; text-transform: uppercase; }
.err-msg { font-size: 11px; color: var(--c-danger); }
.limit-row { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--c-txt-3); background: var(--c-bg); border-radius: var(--r-sm); padding: 7px 10px; border: 1px dashed var(--c-border); }
.limit-row strong { color: var(--c-txt-2); font-weight: 700; }
.fc-footer { padding: 14px 18px; border-top: 1px solid var(--c-border); display: flex; justify-content: space-between; align-items: center; gap: 8px; }

/* ══ BUTTONS ══ */
.btn-p {
  background: var(--c-primary); color: #fff; border: none; border-radius: var(--r-md);
  padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
  transition: background var(--t), transform var(--t); font-family: inherit;
  display: inline-flex; align-items: center; gap: 6px;
}
.btn-p:hover { background: var(--c-primary-d); transform: translateY(-1px); }
.btn-o {
  background: transparent; color: var(--c-primary); border: 1.5px solid rgba(5,150,105,.3);
  border-radius: var(--r-md); padding: 9px 16px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all var(--t); font-family: inherit;
}
.btn-o:hover { background: var(--c-success-bg); border-color: var(--c-primary); }
.btn-ghost {
  background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-md);
  padding: 8px 14px; font-size: 12px; font-weight: 600; color: var(--c-txt-2);
  cursor: pointer; transition: all var(--t); display: flex; align-items: center; gap: 5px; font-family: inherit;
}
.btn-ghost:hover { background: #fff; box-shadow: var(--sh-card); }
.btn-danger {
  background: var(--c-danger); color: #fff; border: none; border-radius: var(--r-md);
  padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
  transition: background var(--t); font-family: inherit;
}
.btn-danger:hover { background: #dc2626; }
.btn-csv {
  background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-md);
  padding: 8px 14px; font-size: 12px; font-weight: 600; color: var(--c-txt-2);
  cursor: pointer; transition: all var(--t); display: inline-flex; align-items: center; gap: 5px;
  font-family: inherit;
}
.btn-csv:hover { background: #fff; box-shadow: var(--sh-card); color: var(--c-txt); }

/* ══ MODAL — variables redeclared here because <Teleport> moves element outside .dl ══ */
.modal-bg {
  --c-primary:   #059669; --c-primary-d: #047857;
  --c-success-bg:#ECFDF5;
  --c-danger:    #EF4444; --c-danger-bg: #FEF2F2;
  --c-surface:   #ffffff; --c-bg:        #f8fafc;
  --c-border:    rgba(15,23,42,.07);
  --c-txt:       #0f172a; --c-txt-2:     #475569;
  --r-md: 8px; --r-pill: 999px;
  --sh-modal: 0 20px 60px rgba(15,23,42,.18);
  --t: .15s ease;
  position: fixed; inset: 0; z-index: 200;
  background: rgba(15,23,42,.5); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-box {
  width: min(420px,100%);
  background: linear-gradient(170deg, #fff5f5 0%, #fffafa 45%, #ffffff 100%);
  border-radius: 20px; border: 1px solid rgba(239,68,68,.13);
  box-shadow: 0 8px 40px rgba(239,68,68,.1), 0 2px 14px rgba(15,23,42,.08);
  padding: 32px 28px 24px;
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;
}
.del-avatar-wrap {
  position: relative; margin-bottom: 4px;
}
.del-agent-avatar {
  width: 76px; height: 76px; border-radius: 18px;
  overflow: hidden; position: relative;
  box-shadow: 0 4px 18px rgba(15,23,42,.14);
}
.del-avatar-img {
  position: absolute; inset: 10px;
  width: calc(100% - 20px); height: calc(100% - 20px);
  object-fit: contain;
  background: white; border-radius: 10px;
  z-index: 2;
}
.del-avatar-abbr {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 800; color: rgba(255,255,255,.88); letter-spacing: -0.5px;
  z-index: 0;
}
.del-trash-badge {
  position: absolute; bottom: -7px; right: -7px;
  width: 28px; height: 28px; border-radius: 50%;
  background: #fee2e2; border: 2.5px solid #fff;
  color: #ef4444;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(239,68,68,.2);
}
.modal-title  { font-size: 17px; font-weight: 700; margin: 0; color: #0f172a; }
.modal-desc   { font-size: 13px; color: #475569; margin: 0; line-height: 1.6; }
.modal-actions { display: flex; gap: 10px; margin-top: 8px; }
.modal-actions .btn-o {
  background: transparent; color: #059669; border: 1.5px solid rgba(5,150,105,.3);
  border-radius: 8px; padding: 9px 20px; font-size: 13px; font-weight: 600; cursor: pointer;
}
.modal-actions .btn-o:hover { background: #ECFDF5; }
.modal-actions .btn-danger {
  background: #EF4444; color: #fff; border: none;
  border-radius: 8px; padding: 9px 20px; font-size: 13px; font-weight: 600; cursor: pointer;
}
.modal-actions .btn-danger:hover { background: #dc2626; }

/* ── Panel slide transition ── */
.panel-enter-active { animation: panelIn .22s cubic-bezier(.4,0,.2,1); }
.panel-leave-active { animation: panelOut .18s cubic-bezier(.4,0,.2,1); }
@keyframes panelIn  { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
@keyframes panelOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(18px); } }

/* ══ RESPONSIVE ══ */
@media (max-width: 1100px) {
  .dl-flex { flex-direction: column; }
  .side-panel { width: 100%; }
}
@media (max-width: 700px) {
  .field-row { grid-template-columns: 1fr; }
  .lc-tools  { flex-direction: column; align-items: stretch; }
}
</style>
