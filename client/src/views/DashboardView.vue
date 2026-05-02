<template>
  <div class="acru-replica-dashboard">
    <div class="acru-dashboard-grid">
      
      <!--============================================
          LEFT COLUMN (Contains Row 1, 2, 3 split grids)
      =============================================-->
      <div class="ad-left-col">
        
        <!-- ROW 1: Chart (Left) + 3 Stats (Right) -->
        <div class="ad-row-1">
          <!-- 1A: Chart Card -->
          <div class="ac-jumbo-chart card-box shadow-sm">
            <div class="card-head">
              <div class="ch-left">
                <h2 class="ch-value">1,245.0 <span class="ch-curr">Triệu ₫</span></h2>
                <span class="ch-subtitle">Doanh Số & Công Nợ Toàn Hệ Thống</span>
              </div>
              <div class="ch-right">
                <select class="ac-select"><option>7 Ngày</option></select>
                <div class="ac-icon-group">
                  <button class="active"><BarChart2 :size="16"/></button>
                  <button><LineChart :size="16"/></button>
                </div>
              </div>
            </div>
            
            <div class="ac-legend">
              <span class="leg-item"><span class="dot d-yellow"></span>Tiền Thu Nợ</span>
              <span class="leg-item"><span class="dot d-green"></span>Doanh Số Giao Đi</span>
              <span class="leg-item"><span class="dot d-orange"></span>Chiết Khấu Trao Tra</span>
            </div>

            <!-- Pure CSS Chart Stage -->
            <div class="ac-chart-stage">
              <div class="ac-y-axis">
                <div class="ay-line"><span>300</span></div>
                <div class="ay-line"><span>200</span></div>
                <div class="ay-line"><span>100</span></div>
                <div class="ay-line"><span>0</span></div>
                <div class="ay-line negative"><span>-100</span></div>
              </div>
              
              <div class="ac-x-axis">
                <div class="ax-col"><div class="bar-bg" style="height:40%"></div><div class="bar-neg" style="height:10%"></div><span class="ax-lbl">T2</span></div>
                <div class="ax-col"><div class="bar-bg" style="height:45%"></div><div class="bar-neg" style="height:12%"></div><span class="ax-lbl">T3</span></div>
                <div class="ax-col"><div class="bar-bg" style="height:60%"></div><span class="ax-lbl">T4</span></div>
                
                <!-- Active Column + Today Highlight -->
                <div class="ax-col is-active is-today">
                  <span class="today-badge">Hôm nay</span>
                  <div class="bar-stack" style="height:75%">
                    <div class="slice sl-yellow" style="height: 20%"></div>
                    <div class="slice sl-striped" style="height: 80%"></div>
                  </div>
                  <div class="bar-neg sl-orange" style="height:25%"></div>
                  <span class="ax-lbl active">T5</span>
                  <span class="today-dot"></span>
                  
                  <div class="tooltip-box">
                    <div class="tt-date">Đại Lý Quận 1 & Quận 3</div>
                    <div class="tt-row"><span class="dot d-yellow"></span>Tổng Thu Nợ <b>24.0 Tr</b></div>
                    <div class="tt-row"><span class="dot d-green"></span>Tổng Tiền Xuất <b>70.0 Tr</b></div>
                    <div class="tt-row"><span class="dot d-orange"></span>Chiết Khấu <b>12.0 Tr</b></div>
                  </div>
                </div>

                <div class="ax-col"><div class="bar-bg" style="height:65%"></div><div class="bar-neg" style="height:10%"></div><span class="ax-lbl">T6</span></div>
                <div class="ax-col"><div class="bar-bg" style="height:35%"></div><span class="ax-lbl">T7</span></div>
                <div class="ax-col"><div class="bar-bg" style="height:50%"></div><div class="bar-neg" style="height:20%"></div><span class="ax-lbl">CN</span></div>
              </div>
            </div>
          </div>

          <!-- 1B: Stacked Stats -->
          <div class="ac-vert-stats">
            <div class="vcard card-box shadow-sm">
              <span class="v-title">Doanh Số (Tiền Bán Hàng)</span>
              <h3 class="v-val">1,500 Triệu</h3>
              <span class="v-trend up"><ArrowUpRight :size="12"/> Đang đà tăng từ T2</span>
            </div>
            <div class="vcard card-box shadow-sm">
              <span class="v-title">Trung Bình Doanh Thu / Đại Lý</span>
              <h3 class="v-val">12.5 Triệu</h3>
              <span class="v-trend up"><ArrowUpRight :size="12"/> Khá hơn mức sàn 10Tr</span>
            </div>
            <div class="vcard card-box shadow-sm">
              <span class="v-title">Lượng Tiền Đã Thu Hồi</span>
              <h3 class="v-val">830 Triệu</h3>
              <span class="v-trend down"><ArrowDownRight :size="12"/> Nhiều đại lý chưa thanh toán</span>
            </div>
          </div>
        </div>

        <!-- ROW 2: Limit Bar (Left) + Tips Box (Right) -->
        <div class="ad-row-2">
          <!-- 2A: Limit -->
          <div class="limit-card card-box shadow-sm limit-warning">
            <div class="card-head limit-h">
              <div class="limit-title-group">
                <AlertTriangle :size="16" class="limit-warn-icon"/>
                <span class="limit-title">Cảnh Báo Nợ Của Đại Lý</span>
              </div>
              <Edit2 :size="14" class="icon-muted"/>
            </div>
            <span class="limit-sub">Số đại lý vượt quá hạn mức nợ quy định (QĐ 1)</span>
            
            <div class="progress-track warn-track">
              <div class="progress-fill warn-fill" style="width: 25%;"></div>
            </div>
            <div class="progress-labels">
              <span class="pl-left warn-text">Vi phạm: <strong>25</strong> Đại Lý</span>
              <span class="pl-right">Tổng: 100 Đại Lý</span>
            </div>
            <a href="#" class="limit-action-link">Xem chi tiết <ChevronRight :size="14"/></a>
          </div>

          <!-- 2B: Tips Box -->
          <div class="tips-card card-box shadow-sm tips-bg">
             <div class="tc-content">
               <h4 class="tc-title">Quy Định Mở Đại Lý</h4>
               <p class="tc-desc">Quận 1 hiện tại đã chạm số lượng tối đa. Cần xem xét hồ sơ đại lý ở các quận vùng ven.</p>
               <a href="#" class="tc-link">Kiểm tra ngay <ChevronRight :size="14"/></a>
             </div>
             <div class="tc-art">
               <div class="grid-art">
                 <div class="ga-box bg-lime"></div><div class="ga-box bg-lime-light"></div>
                 <div class="ga-box bg-orange"></div><div class="ga-box bg-lime"></div>
               </div>
             </div>
          </div>
        </div>

        <!-- ROW 3: Cost Pie (Left) + Health Donut (Mid) + Goal (Right) -->
        <div class="ad-row-3">
          <!-- 3A: Cost Pie -->
          <div class="bot-card card-box shadow-sm">
            <div class="card-head">
              <span class="bc-title">Phân Bố Loại Đại Lý</span>
              <select class="ac-select light"><option>Thành Phố</option></select>
            </div>
            <h3 class="bc-macro">120 ĐL</h3>
            
            <div class="pie-layout">
               <div class="legend-list">
                 <div class="lg-li"><span class="c-sq sq-1"></span>Đại Lý Loại 1 <b>33%</b></div>
                 <div class="lg-li"><span class="c-sq sq-2"></span>Đại Lý Loại 2 <b>45%</b></div>
                 <div class="lg-li"><span class="c-sq sq-3"></span>Đại Lý Loại 3 <b>22%</b></div>
               </div>
               <div class="pie-graphic"></div>
            </div>
          </div>

          <!-- 3B: Financial Donut -->
          <div class="bot-card card-box shadow-sm text-center fd-card">
            <div class="card-head fd-head">
              <div class="fd-titles">
                <span class="bc-title">Tỷ Lệ Thu Tiền</span><span class="ch-subtitle">Hiện tại</span>
              </div>
              <select class="ac-select light"><option>Trong Tháng</option></select>
            </div>
            <h3 class="bc-macro">75%</h3>
            <span class="v-trend up fd-trend"><ArrowUpRight :size="12"/> 17.5% so với tháng trước</span>
            
            <div class="donut-wrapper">
              <svg viewBox="0 0 100 50" class="donut-arc-svg">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" stroke-width="15" stroke-linecap="round"/>
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#84cc16" stroke-width="15" stroke-linecap="round" stroke-dasharray="125" stroke-dashoffset="30"/>
              </svg>
              <div class="donut-center-text">
                <h2>75%</h2>
                <span>Tỷ lệ hoàn nợ</span>
              </div>
            </div>
            <p class="fd-footer">Tính bằng Tổng Thu chia cho Tổng Nợ phát sinh đầu kỳ.</p>
          </div>

          <!-- 3C: Goal Tracker -->
          <div class="bot-card card-box shadow-sm">
            <div class="card-head">
              <span class="bc-title">Mở Rộng Đại Lý</span>
              <button class="add-btn">+ Thêm</button>
            </div>
            
            <div class="gt-list">
               <span class="gt-year">Năm nay</span>
               <div class="gt-item">
                 <div class="gi-icon"><Store :size="16" class="text-white"/></div>
                 <div class="gi-details">
                    <div class="gi-row"><b>Quận Bình Thạnh</b><span>12 / 15 CH</span></div>
                    <div class="gi-track"><div class="gi-fill" style="width:80%; background:#84cc16"></div></div>
                    <span class="gi-sub">Còn 3 đại lý nữa để đạt KPI</span>
                 </div>
               </div>

               <span class="gt-year mt-15">Dự Kiến Tương Lai</span>
               <div class="gt-item">
                 <div class="gi-icon bg-blue"><Truck :size="16" class="text-white"/></div>
                 <div class="gi-details">
                    <div class="gi-row"><b>Tuyến Giao Hàng Mới</b><span>4 / 10 Xe</span></div>
                    <div class="gi-track"><div class="gi-fill" style="width:40%; background:#fb923c"></div></div>
                    <span class="gi-sub">Chuẩn bị hồ sơ sau 3 tháng</span>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      <!--============================================
          RIGHT COLUMN (Cards, Actions, History)
      =============================================-->
      <div class="ad-right-col">
        <div class="rc-my-card card-box shadow-sm">
          <div class="card-head relative z-10">
             <div><span class="bc-title">Khối Quản Trị Hệ Thống</span><span class="ch-subtitle d-block mt-2">Mô-đun Giám Sát Cốt Lõi</span></div>
             <button class="add-btn dark-btn">Lịch Sử</button>
          </div>
          
          <div class="credit-card-mock relative z-10">
            <div class="cc-top"><span>Hạn Mức Nợ Tối Đa</span><b>Q.Định Số 1</b></div>
            <div class="cc-mid">50.0 Triệu ₫</div>
            <div class="cc-bot"><span>ÁP DỤNG TOÀN HỆ THỐNG</span><span>Active</span></div>
          </div>

          <div class="cc-actions relative z-10">
            <div class="cca-btn cca-green"><div class="cca-icon"><Plus :size="16"/></div><span>Thêm Đ.Lý</span></div>
            <div class="cca-btn cca-blue"><div class="cca-icon"><Package :size="16"/></div><span>P. Xuất</span></div>
            <div class="cca-btn cca-amber"><div class="cca-icon"><FileText :size="16"/></div><span>P. Thu</span></div>
            <div class="cca-btn cca-muted"><div class="cca-icon"><Settings :size="16"/></div><span>Tùy Chỉnh</span></div>
          </div>
        </div>

        <!-- Wall of Fame Leaderboard -->
        <div class="rc-quick-pay mt-20">
           <div class="card-head mb-15">
             <span class="bc-title">Vinh Danh Xuất Sắc</span>
             <select class="ac-select light"><option>Tháng 2</option></select>
           </div>
           <div class="lb-list lb-compact">
              <div class="lb-item">
                 <div class="lb-rank gold">1</div>
                 <img class="lb-ava" src="https://i.pravatar.cc/150?img=11" />
                 <div class="lb-info"><b>Đại Lý Tuấn Phát</b><span>Doanh số: 1.25 Tỷ</span></div>
                 <div class="lb-medal">🥇</div>
              </div>
              <div class="lb-item">
                 <div class="lb-rank silver">2</div>
                 <img class="lb-ava" src="https://i.pravatar.cc/150?img=9" />
                 <div class="lb-info"><b>Đại Lý Lan Anh</b><span>Doanh số: 950 Tr</span></div>
                 <div class="lb-medal">🥈</div>
              </div>
              <div class="lb-item">
                 <div class="lb-rank bronze">3</div>
                 <img class="lb-ava" src="https://i.pravatar.cc/150?img=12" />
                 <div class="lb-info"><b>Đại Lý Quốc Khánh</b><span>Doanh số: 820 Tr</span></div>
                 <div class="lb-medal">🥉</div>
              </div>
           </div>
        </div>

        <!-- Transaction History -->
        <div class="rc-tx-history card-box shadow-sm mt-20 p-0">
          <div class="tx-head">
             <span class="bc-title">Lịch Sử Giao Dịch</span>
             <select class="ac-select light"><option>7 Ngày</option></select>
          </div>
          
          <div class="tx-list">
             <div class="tx-item">
               <div class="txi-icon green-h"><ArrowUpRight :size="14"/></div>
               <div class="txi-info"><b>Phiếu Thu Tiền nợ</b><span>Đại Lý Tân Bình - 25 Feb 2026</span></div>
               <div class="txi-val text-emerald">+ 15.0 Tr</div>
             </div>
             
             <div class="tx-item">
               <div class="txi-icon blue-h"><Package :size="14"/></div>
               <div class="txi-info"><b>Phiếu Xuất Hàng Mới</b><span>Đại Lý Quận 1 - 25 Feb 2026</span></div>
               <div class="txi-val text-red">- 32.4 Tr</div>
             </div>
             
             <div class="tx-item">
               <div class="txi-icon dark-h"><FileText :size="14"/></div>
               <div class="txi-info"><b>Hóa Đơn Nhập Hàng</b><span>NCC Philips - 21 Feb 2026</span></div>
               <div class="txi-val text-dark">- 90.0 Tr</div>
             </div>
             
             <div class="tx-item">
               <div class="txi-icon orange-h"><Store :size="14"/></div>
               <div class="txi-info"><b>Tiếp Nhận Đại Lý</b><span>Hồ sơ mới Quân 3 - 21 Feb 2026</span></div>
               <div class="txi-val text-dark">Active</div>
             </div>
             
             <div class="tx-item">
               <div class="txi-icon green-h"><Users :size="14"/></div>
               <div class="txi-info"><b>Phiếu Thu Tiền nợ</b><span>Đại Lý Hóc Môn - 15 Feb 2026</span></div>
               <div class="txi-val text-emerald">+ 12.6 Tr</div>
             </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { 
  ChevronDown, ChevronRight, BarChart2, LineChart, 
  ArrowUpRight, ArrowDownRight, Edit2, PackagePlus, 
  Users, Truck, Store, Plus, ArrowUp, ArrowDown, Repeat, FileText, MoreHorizontal, Package, Wrench, AlertCircle, AlertTriangle, Settings
} from 'lucide-vue-next';
</script>

<style scoped>
/* BASE & RESETS */
.acru-replica-dashboard { min-height: 100vh; padding: 0; color: #1f2937; }
.card-box { background: #ffffff; border-radius: 20px; padding: 25px; border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: -5px -5px 15px rgba(255, 255, 255, 1), 5px 5px 15px rgba(15, 23, 42, 0.05), -1px -1px 2px rgba(255, 255, 255, 0.3) inset; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;}
.shadow-sm { /* Replaced by card-box 3D effect */ }
.mt-15 { margin-top: 15px;} .mt-20 { margin-top: 20px;} .mt-2 { margin-top: 2px;} .d-block { display: block;} .p-0 { padding: 0 !important;}

/* CORE ACRU GRID */
/* The layout strictly uses a 2.3fr : 1fr layout */
.acru-dashboard-grid { display: grid; grid-template-columns: 2.3fr 0.9fr; gap: 24px; max-width: 100%; margin: 0; align-items: start;}

.ad-left-col { display: flex; flex-direction: column; gap: 24px;}
.ad-right-col { display: flex; flex-direction: column;}

/* ROW 1 SPLIT: Chart (70%) + Vert Stats (30%) */
.ad-row-1 { display: grid; grid-template-columns: 2fr 0.8fr; gap: 24px;}
.ac-jumbo-chart { display: flex; flex-direction: column; }
.ac-vert-stats { display: flex; flex-direction: column; gap: 12px; justify-content: space-between;}
.vcard { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 16px 20px; cursor: pointer;}
.vcard:hover { transform: translateY(-4px); box-shadow: -8px -8px 25px rgba(255, 255, 255, 1), 8px 8px 25px rgba(15, 23, 42, 0.08), -1px -1px 2px rgba(255, 255, 255, 0.3) inset !important;}
.v-title { font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 2px;}
.v-val { font-size: 1.35rem; font-weight: 800; color: #0f172a; margin: 2px 0 8px 0; letter-spacing: -0.5px;}
.v-trend { font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 4px; transition: 0.2s;}
.vcard:hover .v-trend { opacity: 0.8;}
.v-trend.up { color: #059669; } .v-trend.down { color: #e11d48; }

/* UX Enhancements for Interactive Elements */
.bot-card.card-box { cursor: pointer; transition: 0.3s;}
.bot-card.card-box:hover { transform: translateY(-4px); box-shadow: -8px -8px 25px rgba(255, 255, 255, 1), 8px 8px 25px rgba(15, 23, 42, 0.08), -1px -1px 2px rgba(255, 255, 255, 0.3) inset;}
.tips-card.card-box { cursor: pointer; transition: 0.3s;}
.tips-card.card-box:hover { transform: translateY(-4px); box-shadow: -8px -8px 25px rgba(255, 255, 255, 1), 8px 8px 25px rgba(15, 23, 42, 0.08), -1px -1px 2px rgba(255, 255, 255, 0.3) inset;}


/* JUMBO CHART */
.card-head { display: flex; justify-content: space-between; align-items: flex-start;}
.ch-value { font-size: 1.6rem; font-weight: 800; margin: 0; letter-spacing: -0.5px;}
.ch-curr { font-size: 1rem; color: #64748b; font-weight: 500;}
.ch-subtitle { font-size: 0.8rem; color: #64748b; display: block; margin-top: 2px;}

.ac-select { border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px 10px; font-size: 0.75rem; color: #475569; outline: none; background: #fff; cursor: pointer; transition: 0.2s;}
.ac-select:hover { border-color: #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.02);}
.ac-select.light { background: #f8fafc; border: none;}
.ch-right { display: flex; align-items: center; gap: 10px; }
.ac-icon-group { display: flex; gap: 5px; margin-top: 0; background: #f1f5f9; padding: 4px; border-radius: 8px;}
.ac-icon-group button { border: none; background: transparent; padding: 4px 10px; border-radius: 6px; cursor: pointer; color: #94a3b8; transition: 0.2s;}
.ac-icon-group button:hover:not(.active) { color: #0f172a; background: rgba(0,0,0,0.02);}
.ac-icon-group button.active { background: white; color: #0f172a; box-shadow: 0 2px 5px rgba(0,0,0,0.05);}

.ac-legend { display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px;}
.leg-item { display: flex; align-items: center; gap: 5px; font-size: 0.7rem; font-weight: 600; color: #64748b;}
.dot { width: 8px; height: 8px; border-radius: 2px; display: inline-block;}
.d-yellow { background: #38bdf8; } .d-green { background: #34d399;} .d-orange { background: #fb7185;}

.ac-chart-stage { position: relative; margin-top: 30px; height: 180px; display: flex;}
.ac-y-axis { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 25px; pointer-events: none;}
.ay-line { border-top: 1px solid #f1f5f9; position: relative;}
.ay-line span { position: absolute; top: -8px; left: 0; font-size: 0.7rem; color: #cbd5e1; background: #fff; padding-right: 10px;}
.ay-line.negative { border-top-style: dashed;}

.ac-x-axis { position: relative; z-index: 5; flex: 1; display: flex; justify-content: space-between; padding-left: 50px; align-items: flex-end; padding-bottom: 30px;}
.ax-col { width: 45px; height: 100%; position: relative; display: flex; flex-direction: column; justify-content: flex-end; cursor: pointer;}
.ax-col.is-active { background: #f8fafc; border-radius: 12px; }
.bar-stack { display: flex; flex-direction: column; width: 14px; gap: 2px;}
.slice { width: 100%;}
.sl-yellow { background: #38bdf8; border-radius: 4px; box-shadow: inset 0 0 4px rgba(255,255,255,0.2);}
.sl-orange { background: #fb7185; border-radius: 4px; box-shadow: inset 0 0 4px rgba(255,255,255,0.2);}
.sl-striped { background: repeating-linear-gradient(45deg, #2dd4bf, #2dd4bf 5px, #99f6e4 5px, #99f6e4 10px); border-radius: 4px;}
.bar-bg { background: #f1f5f9; width: 14px; border-radius: 40px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);}
.bar-neg { background: #fee2e2; width: 14px; border-radius: 40px; margin-top: 5px;}
.ax-lbl { position: absolute; bottom: 0; width: 100%; text-align: center; font-size: 0.75rem; color: #9ca3af; font-weight: 500;}
.ax-lbl.active { color: #0f172a; font-weight: 700;}

/* Today Highlight */
.is-today { position: relative; }
.today-badge { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; font-size: 0.6rem; font-weight: 700; padding: 2px 8px; border-radius: 99px; white-space: nowrap; z-index: 10; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3); letter-spacing: 0.3px; }
.today-dot { position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }

.tooltip-box { display: none; position: absolute; top: -80px; left: 50%; transform: translateX(-50%); background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 12px; border-radius: 10px; width: 180px; z-index: 20;}
.ax-col:hover .tooltip-box { display: flex; flex-direction: column; gap: 8px;}
.tt-date { font-size: 0.7rem; color: #9ca3af; text-align: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; margin-bottom: 4px;}
.tt-row { display: flex; align-items: center; font-size: 0.75rem; gap: 6px;}

/* ROW 2 SPLIT: Limit (1.5fr) + Tips (1fr) */
.ad-row-2 { display: grid; grid-template-columns: 1.5fr 1.3fr; gap: 24px;}
.limit-card { display: flex; flex-direction: column;}
.limit-title { font-size: 0.85rem; font-weight: 700; color: #0f172a;}
.limit-sub { font-size: 0.75rem; color: #64748b; margin-top: 4px;}
.progress-track { height: 16px; background: #f1f5f9; border-radius: 100px; margin: 20px 0 10px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);}
.progress-fill { height: 100%; background: #34d399; border-radius: 100px; box-shadow: 0 0 10px rgba(52, 211, 153, 0.4);}
.progress-labels { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600;}
.pl-left { color: #34d399;} .pl-right { color: #9ca3af;}

/* Debt Warning Enhancement */
.limit-warning { position: relative; overflow: hidden; }
.limit-warning::before { content: ""; position: absolute; left: 0; top: 15px; bottom: 15px; width: 3px; border-radius: 0 3px 3px 0; background: linear-gradient(180deg, #ef4444, #f97316); box-shadow: 0 0 8px rgba(239, 68, 68, 0.3); }
.limit-title-group { display: flex; align-items: center; gap: 8px; }
.limit-warn-icon { color: #ef4444; animation: pulse-warn 2s ease-in-out infinite; }
@keyframes pulse-warn { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.warn-track { background: #fee2e2; }
.warn-fill { background: linear-gradient(90deg, #ef4444, #f97316) !important; box-shadow: 0 0 12px rgba(239, 68, 68, 0.35) !important; }
.warn-text { color: #ef4444 !important; font-size: 0.8rem; }
.warn-text strong { font-size: 1rem; }
.limit-action-link { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 600; color: #ef4444; text-decoration: none; margin-top: 12px; transition: 0.2s; }
.limit-action-link:hover { color: #dc2626; transform: translateX(3px); }

.tips-card { display: flex; justify-content: space-between; align-items: center; overflow: hidden;}
.tc-content { max-width: 60%;}
.tc-title { font-size: 0.85rem; font-weight: 700; margin: 0; color: #0f172a;}
.tc-desc { font-size: 0.75rem; color: #64748b; line-height: 1.5; margin: 8px 0;}
.tc-link { font-size: 0.8rem; font-weight: 600; color: #0f172a; text-decoration: none; display: flex; align-items: center; transition: 0.2s;}
.tc-link:hover { color: #84cc16; transform: translateX(2px);}
.tc-art { width: 80px; height: 80px; display: flex; align-items: center;}
.grid-art { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; transform: rotate(45deg);}
.ga-box { width: 16px; height: 16px; border-radius: 4px; box-shadow: inset 0 0 3px rgba(255,255,255,0.5);}
.bg-lime { background: #34d399;} .bg-lime-light { background: #a7f3d0;} .bg-orange { background: #fde047;}

/* ROW 3 SPLIT: 3 Equal Columns */
.ad-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px;}
.bot-card { display: flex; flex-direction: column;}
.bc-title { font-size: 0.85rem; font-weight: 700; color: #0f172a;}
.bc-macro { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 15px 0 20px 0; letter-spacing: -0.5px;}

.pie-layout { display: flex; justify-content: space-between; align-items: center;}
.legend-list { display: flex; flex-direction: column; gap: 8px;}
.lg-li { font-size: 0.7rem; color: #64748b; display: flex; align-items: center; gap: 6px;}
.lg-li b { margin-left: auto; color: #0f172a;}
.c-sq { width: 10px; height: 10px; border-radius: 2px;}
.sq-1 { background: #38bdf8;} .sq-2 { background: #2dd4bf;} .sq-3 { background: #6ee7b7;} .sq-4 { background: #34d399;} .sq-5 { background: #f1f5f9;}
.pie-graphic { width: 80px; height: 80px; border-radius: 50%; position: relative; overflow: hidden; background: conic-gradient(#38bdf8 0 33%, #bae6fd 33% 51%, #2dd4bf 51% 68%, #e0f2fe 68% 78%, #f1f5f9 78% 100%); box-shadow: inset 0 2px 10px rgba(0,0,0,0.05), 0 4px 10px rgba(0,0,0,0.05);}
.pie-graphic::after { content: ""; position: absolute; inset: 0; border-radius: 50%; background: repeating-linear-gradient(45deg, rgba(255,255,255,0.25), rgba(255,255,255,0.25) 3px, transparent 3px, transparent 6px); pointer-events: none;}

.fd-card { align-items: center; justify-content: center;}
.fd-titles { display: flex; flex-direction: column; align-items: center;}
.fd-trend { justify-content: center; margin-top: -10px;}
.donut-wrapper { position: relative; width: 160px; height: 80px; margin: 20px 0 10px;}
.donut-arc-svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 5px rgba(0,0,0,0.05));}
.donut-wrapper::after { content: ""; position: absolute; inset: 0; clip-path: inset(0 0 0 0); background: repeating-linear-gradient(-45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.3) 3px, transparent 3px, transparent 6px); pointer-events: none;}
.donut-center-text { position: absolute; bottom: 0; width: 100%; text-align: center;}
.donut-center-text h2 { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; line-height: 1;}
.donut-center-text span { font-size: 0.65rem; color: #94a3b8; letter-spacing: 0.5px;}
.fd-footer { font-size: 0.7rem; color: #64748b; text-align: center; border-top: 1px dashed #e2e8f0; padding-top: 15px; margin: 15px 0 0 0;}

.add-btn { background: #fff; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #0f172a; cursor: pointer; transition: 0.2s;}
.add-btn:hover { background: #f8fafc; border-color: #cbd5e1; transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.05);}
.border-box { border-color: transparent; box-shadow: 0 2px 5px rgba(0,0,0,0.05);}
.gt-list { margin-top: 15px; display: flex; flex-direction: column;}
.gt-year { font-size: 0.7rem; font-weight: 600; color: #cbd5e1; margin-bottom: 10px;}
.gt-item { display: flex; gap: 12px; align-items: flex-start; padding: 6px; border-radius: 12px; transition: 0.2s; cursor: pointer; margin-left: -6px;}
.gt-item:hover { background: #f8fafc;}
.gi-icon { width: 40px; height: 40px; background: #34d399; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: 0.2s; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 2px 5px rgba(52, 211, 153, 0.2);}
.gt-item:hover .gi-icon { transform: scale(1.05);}
.gi-icon.bg-blue { background: #38bdf8; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 2px 5px rgba(56, 189, 248, 0.2);}
.gi-details { flex: 1;}
.gi-row { display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 5px;}
.gi-row b { color: #0f172a;} .gi-row span { color: #94a3b8;}
.gi-track { height: 6px; background: #f1f5f9; border-radius: 5px; overflow: hidden;}
.gi-fill { height: 100%; border-radius: 5px;}
.gi-sub { font-size: 0.65rem; color: #64748b; margin-top: 5px; display: block;}

/* RIGHT COLUMN (30%) */
.rc-my-card { background: linear-gradient(135deg, #f0fdf4, #ecfdf5); position: relative; border: 1px solid #d1fae5; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.05);}
.rc-my-card .bc-title { color: #064e3b; font-size: 0.95rem; font-weight: 700;}
.rc-my-card .ch-subtitle { color: #047857; font-size: 0.75rem; }
.rc-my-card .add-btn.dark-btn { background: white; border: 1px solid #a7f3d0; color: #047857; font-weight: 600;}
.rc-my-card .add-btn.dark-btn:hover { background: #10b981; color: white; border-color: #10b981; }

.credit-card-mock { margin-top: 25px; display: flex; flex-direction: column; gap: 12px; }
.cc-top { display: flex; justify-content: space-between; font-size: 0.75rem;}
.cc-top span { color: #047857;} .cc-top b { color: white; font-weight: 700; background: #10b981; padding: 3px 8px; border-radius: 6px;}
.cc-mid { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px; color: #064e3b; text-shadow: none;}
.cc-bot { display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: #047857;}
.cc-bot span:last-child { color: #059669; background: white; padding: 3px 10px; border-radius: 6px; font-weight: 600; border: 1px solid #a7f3d0;}

.cc-actions { display: flex; justify-content: space-between; margin-top: 30px; }
.cca-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; color: #064e3b;}
.cca-icon { width: 44px; height: 44px; background: white; border: 1px solid #a7f3d0; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: 0.3s; color: #059669;}
.cca-btn span { font-size: 0.7rem; font-weight: 600; transition: 0.3s;}

/* Color-coded Quick Actions */
.cca-green .cca-icon { background: rgba(16, 185, 129, 0.1); border-color: #a7f3d0; color: #059669; }
.cca-green:hover .cca-icon { background: #10b981; color: white; border-color: #10b981; transform: translateY(-4px); box-shadow: 0 10px 20px rgba(16,185,129,0.25); }
.cca-green:hover span { color: #059669; }

.cca-blue .cca-icon { background: rgba(59, 130, 246, 0.1); border-color: #bfdbfe; color: #3b82f6; }
.cca-blue:hover .cca-icon { background: #3b82f6; color: white; border-color: #3b82f6; transform: translateY(-4px); box-shadow: 0 10px 20px rgba(59,130,246,0.25); }
.cca-blue:hover span { color: #2563eb; }

.cca-amber .cca-icon { background: rgba(245, 158, 11, 0.1); border-color: #fde68a; color: #f59e0b; }
.cca-amber:hover .cca-icon { background: #f59e0b; color: white; border-color: #f59e0b; transform: translateY(-4px); box-shadow: 0 10px 20px rgba(245,158,11,0.25); }
.cca-amber:hover span { color: #d97706; }

.cca-muted .cca-icon { background: rgba(148, 163, 184, 0.1); border-color: #e2e8f0; color: #94a3b8; }
.cca-muted:hover .cca-icon { background: #94a3b8; color: white; border-color: #94a3b8; transform: translateY(-4px); box-shadow: 0 10px 20px rgba(148,163,184,0.2); }
.cca-muted:hover span { color: #64748b; }

.rc-quick-pay { background: white; border-radius: 20px; padding: 25px; box-shadow: var(--shadow-sm); }
.lb-list { display: flex; flex-direction: column; }
.lb-item { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 10px; transition: background 0.2s; cursor: pointer; border: 1px solid transparent; }
.lb-compact .lb-item + .lb-item { margin-top: 4px; }
.lb-item:hover { background: #f8fafc; border-color: #f1f5f9; }
.lb-rank { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; color: white; background: #cbd5e1; flex-shrink: 0; }
.lb-rank.gold { background: linear-gradient(135deg, #fbbf24, #f59e0b); box-shadow: 0 4px 10px rgba(251,191,36,0.25); }
.lb-rank.silver { background: linear-gradient(135deg, #cbd5e1, #94a3b8); }
.lb-rank.bronze { background: linear-gradient(135deg, #fcd34d, #d97706); }
.lb-ava { width: 32px; height: 32px; border-radius: 10px; object-fit: cover; }
.lb-info { flex: 1; display: flex; flex-direction: column; }
.lb-info b { font-size: 0.8rem; color: #1e293b; }
.lb-info span { font-size: 0.65rem; color: #64748b; font-weight: 500; }
.lb-medal { font-size: 1.1rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
.mb-15 { margin-bottom: 15px; }

.tx-head { padding: 20px 25px; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9;}
.tx-list { display: flex; flex-direction: column;}
.tx-item { display: flex; align-items: center; justify-content: space-between; padding: 15px 25px; border-bottom: 1px solid #f8fafc; transition: 0.2s; cursor: pointer;}
.tx-item:hover { background: #f8fafc;}
.tx-item:last-child { border: none;}
.txi-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 2px 4px rgba(255,255,255,0.5);}
.green-h { background: #d1fae5; color: #34d399;} .blue-h { background: #e0f2fe; color: #38bdf8;} .dark-h { background: #f1f5f9; color: #64748b;} .orange-h { background: #ffe4e6; color: #fb7185;}
.txi-info { display: flex; flex-direction: column; gap: 2px;} 
.txi-info b { font-size: 0.8rem; color: #0f172a;} .txi-info span { font-size: 0.7rem; color: #94a3b8;}
.txi-val { font-weight: 800; font-size: 0.85rem;}
.text-emerald { color: #34d399;} .text-red { color: #fb7185;} .text-dark { color: #64748b;}
</style>
