# 🎨 Design System — SE104 Quản Lý Đại Lý

> Tài liệu này mô tả hệ thống thiết kế cốt lõi, được rút trích từ DashboardView.
> Tất cả các trang trong hệ thống phải tuân theo các quy tắc dưới đây để đảm bảo **đồng bộ về thẩm mỹ và trải nghiệm**.

---

## 1. Phong cách tổng thể (Design Philosophy)

| Thuộc tính | Giá trị |
|---|---|
| **Phong cách** | Neumorphic-Lite + Glassmorphism nhẹ |
| **Cảm giác** | Premium, thoáng đãng, chuyên nghiệp |
| **White space** | Hào phóng — padding 25px cards, gap 24px grid |
| **Chiều sâu** | Multi-layer shadow (inset + outer) cho cards |
| **Tương tác** | translateY(-4px) hover, cubic-bezier easing |
| **Typography** | Outfit / Inter, sans-serif |

---

## 2. Bảng màu (Color Palette)

### Primary — Emerald
| Token | Hex | Sử dụng |
|---|---|---|
| `emerald-50` | `#ecfdf5` | Background nhẹ, badge |
| `emerald-100` | `#d1fae5` | Border active |
| `emerald-300` | `#6ee7b7` | Accent nhẹ |
| `emerald-400` | `#34d399` | Progress bar, trend up |
| `emerald-500` | `#10b981` | Primary brand, CTA button |
| `emerald-600` | `#059669` | Text on light bg, hover |
| `emerald-700` | `#047857` | Dark text accent |
| `emerald-800` | `#064e3b` | Deep text in branded cards |

### Neutral — Slate
| Token | Hex | Sử dụng |
|---|---|---|
| `slate-50` | `#f8fafc` | Hover bg, input bg |
| `slate-100` | `#f1f5f9` | Borders, dividers, track bg |
| `slate-200` | `#e2e8f0` | Stronger borders |
| `slate-300` | `#cbd5e1` | Muted text, scrollbar |
| `slate-400` | `#94a3b8` | Subtitle text |
| `slate-500` | `#64748b` | Body text, subtitle đậm |
| `slate-600` | `#475569` | Medium text |
| `slate-800` | `#1e293b` | Secondary heading |
| `slate-900` | `#0f172a` | Primary heading, số liệu |

### Accent — Semantic
| Màu | Hex | Sử dụng |
|---|---|---|
| `sky-400` | `#38bdf8` | Chart bar, icon info |
| `blue-500` | `#3b82f6` | Quick action P.Xuất |
| `indigo-500` | `#6366f1` | Accent, badge đặc biệt |
| `amber-400` | `#f59e0b` | Quick action P.Thu, cảnh báo nhẹ |
| `rose-500` | `#f43f5e` | Xóa, lỗi, danger |
| `red-500` | `#ef4444` | Debt warning accent |
| `teal-400` | `#2dd4bf` | Chart striped bar |

### Background
| Token | Hex |
|---|---|
| Page background | `#f5f7f9` (var `--s-bg`) |
| Card background | `#ffffff` |
| Input background | `#f8fafc` |

---

## 3. Typography

```
Font Family: 'Outfit', 'Inter', sans-serif
```

| Loại | Size | Weight | Color | Ví dụ |
|---|---|---|---|---|
| **Page title** | 2rem | 800 | `#0f172a` | "Danh sách Đại lý" |
| **Card title** | 0.85-0.95rem | 700 | `#0f172a` | "Cảnh Báo Nợ" |
| **Big number** | 1.35-1.8rem | 800 | `#0f172a` | "1,245.0" |
| **Body text** | 0.85rem | 600 | `#64748b` | Mô tả ngắn |
| **Small label** | 0.7-0.75rem | 600-800 | `#64748b` | "TỔNG ĐẠI LÝ" |
| **Micro text** | 0.65rem | 500-600 | `#64748b` | Sub-info |
| **Trend up** | 0.75rem | 600 | `#059669` | "+17.5%" |
| **Trend down** | 0.75rem | 600 | `#e11d48` | "Chưa thanh toán" |

**Quy tắc:** Letter-spacing: `-0.5px` cho heading/số lớn. Letter-spacing: `0.5-1px` cho label UPPERCASE.

---

## 4. Card System

### Standard Card (`.card-box`)
```css
background: #ffffff;
border-radius: 20px;
padding: 25px;
border: 1px solid rgba(255, 255, 255, 0.8);
box-shadow:
  -5px -5px 15px rgba(255, 255, 255, 1),
  5px 5px 15px rgba(15, 23, 42, 0.05),
  -1px -1px 2px rgba(255, 255, 255, 0.3) inset;
```

### Hover Effect
```css
transform: translateY(-4px);
box-shadow:
  -8px -8px 25px rgba(255, 255, 255, 1),
  8px 8px 25px rgba(15, 23, 42, 0.08),
  -1px -1px 2px rgba(255, 255, 255, 0.3) inset;
transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Branded Card (Gradient Emerald)
```css
background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
border: 1px solid #d1fae5;
box-shadow: 0 4px 20px rgba(16, 185, 129, 0.05);
```

---

## 5. Buttons

### Primary CTA (`.btn-master.btn-emerald`)
```css
background: #0c4a35;     /* Deep emerald */
color: white;
padding: 10px 24px;
border-radius: 99px;      /* Pill shape */
font-weight: 800;
font-size: 0.82rem;
box-shadow: 0 10px 15px rgba(12, 74, 53, 0.15);
```
Hover: `translateY(-2px)`, darken bg, deeper shadow.

### Ghost/Outline Button
```css
background: white;
border: 1.5px solid #eaedf1;
color: #1e293b;
border-radius: 99px;
```

### Small Action Button (`.btn-act`)
```css
width: 32px; height: 32px;
border-radius: 8px;
border: 1px solid #f1f5f9;
background: white;
```
Hover: edit → `#f0f9ff` bg + `#0284c7` color, delete → `#fff1f2` bg + `#e11d48` color.

### Icon-Only Tool Button
```css
width: 44px; height: 44px;
border-radius: 12px;
background: white;
border: 1px solid #f1f5f9;
```

---

## 6. Form Inputs

```css
height: 50px;
background: #f8fafc;
border: 1.5px solid #f1f5f9;
border-radius: 12px;
padding: 0 16px;
font-weight: 700;
font-size: 0.95rem;
```

**Focus:**
```css
background: white;
border-color: #10b981;
box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);
```

**Label:** 0.7rem, weight 800, UPPERCASE, color `#64748b`, letter-spacing 0.5px.

---

## 7. Table Design

```css
/* Header */
th {
  background: #fcfdfe;
  font-size: 0.75rem;
  font-weight: 800;
  color: #64748b;           /* NOT too light */
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 18px 30px;
}

/* Rows */
td {
  padding: 20px 30px;
  border-bottom: 1px solid #fcfdfe;  /* Nearly invisible divider */
}

tr:hover {
  background: #fafbfc;
}
```

---

## 8. Badges & Pills

| Type | Background | Color | Border-radius |
|---|---|---|---|
| ID Badge | `#f1f5f9` | `#475569` | `6px` |
| Type Pill (Loại 1) | `#ecfdf5` | `#059669` | `99px` |
| Type Pill (Loại 2) | `#eff6ff` | `#2563eb` | `99px` |
| Status Active | `white` | `#059669` | `6px` |

---

## 9. Modal Design

```css
/* Overlay */
background: rgba(15, 23, 42, 0.4);
backdrop-filter: blur(8px);

/* Modal Card */
background: white;
border-radius: 28px;              /* var(--rad-card) */
box-shadow: 0 30px 60px rgba(0,0,0,0.2);
animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 10. Icon System

- **Library:** Lucide Vue Next (stroke-based)
- **Stroke-width:** 1.75 (standard) — 2.5 (logo/brand only)
- **Sizes:** 14px (table actions) → 18px (buttons) → 20px (nav/stats) → 24px (modal header)
- **Style:** Phải đồng bộ stroke (NOT fill) xuyên suốt toàn bộ app

---

## 11. Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `gap-xs` | 4px | Inline elements |
| `gap-sm` | 8px | Button groups, compact lists |
| `gap-md` | 12px | Card internal elements |
| `gap-lg` | 20-24px | Grid gaps, section spacing |
| `gap-xl` | 30-40px | Page padding, section margins |

---

## 12. Transitions & Animations

```css
/* Standard */
transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Master (for layout shifts) */
transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);

/* Page entrance */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Modal pop */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
```

---

## 13. Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `> 1200px` | Full layout, sidebar expanded |
| `1024 - 1200px` | Reduced padding |
| `< 1024px` | Sidebar collapses, stacked layout |
