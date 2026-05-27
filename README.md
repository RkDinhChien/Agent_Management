# 🏢 Hệ Thống Quản Lý Đại Lý

> **SE104 - Nhập môn Công nghệ Phần mềm**

## 🛠 Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| Frontend | VueJS 3 + Vite |
| Backend | NodeJS + Express |
| Database | MySQL |
| ORM | Sequelize |
| Auth | JWT (JSON Web Token) |

## 📁 Cấu trúc dự án

```
QUẢN LÝ ĐẠI LÝ/
├── client/                 # Frontend - VueJS
│   ├── src/
│   │   ├── assets/         # Hình ảnh, fonts, CSS
│   │   ├── components/     # Vue components tái sử dụng
│   │   ├── views/          # Các trang (pages)
│   │   ├── router/         # Vue Router config
│   │   ├── stores/         # Pinia state management
│   │   ├── services/       # API service (axios)
│   │   ├── utils/          # Hàm tiện ích
│   │   ├── App.vue         # Root component
│   │   └── main.js         # Entry point
│   └── package.json
│
├── server/                 # Backend - NodeJS
│   ├── src/
│   │   ├── config/         # Cấu hình (DB, env)
│   │   ├── controllers/    # Xử lý logic request
│   │   ├── middleware/     # Auth, validation
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # Định nghĩa API routes
│   │   ├── utils/          # Hàm tiện ích
│   │   └── index.js        # Entry point
│   ├── .env.example
│   └── package.json
│
├── database/               # Database
│   ├── migrations/         # SQL scripts tạo bảng
│   └── seeds/              # Dữ liệu mẫu
│
├── docs/                   # Tài liệu
│   ├── designs/            # Thiết kế UI (Figma exports)
│   ├── database/           # ERD, sơ đồ
│   └── requirements/       # Yêu cầu đề tài
│
├── .gitignore
└── README.md
```

## 🚀 Hướng dẫn chạy

### 1. Cài đặt

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 2. Cấu hình Database

```bash
# Copy file .env mẫu
cp server/.env.example server/.env
# Sửa thông tin database trong file .env
```

### 3. Chạy ứng dụng

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## Ghi chú quản lý mã nguồn

- Một số file cấu hình cá nhân (ví dụ: editor/IDE hoặc tool settings) không nên được đẩy lên kho chung. Tôi đã xóa một file cục bộ không cần thiết (`.claude/settings.local.json`) và đã thêm `.claude/` vào `.gitignore` để tránh đẩy các cấu hình cá nhân sau này.
- Giữ lại `package-lock.json` giúp tái tạo môi trường cài đặt; nếu bạn muốn loại bỏ lockfile cho cả workspace, thông báo cho tôi trước khi xóa.

## Thông tin nhanh

- Branch hiện tại: `main`
- Nếu bạn gặp lỗi khi chạy dev server (ví dụ: process bị kill với exit code 137), thử khởi động lại Node/Vite và đảm bảo không có tiến trình cũ đang chiếm cổng, hoặc tăng bộ nhớ cho tiến trình nếu cần.


## 👥 Thành viên nhóm

| STT | Họ tên | MSSV | Vai trò |
|-----|--------|------|---------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
