# HRIS - Human Resource Information System

Aplikasi HRIS berbasis web untuk mengelola data karyawan, absensi, cuti, dan pengumuman perusahaan.

## 🚀 Teknologi

### Frontend
- **React 18** dengan TypeScript
- **Tailwind CSS** untuk styling
- **Vite** sebagai build tool
- **Axios** untuk HTTP client
- **React Router** untuk routing
- **Lucide React** untuk icons

### Backend
- **Node.js** dengan Express.js
- **PostgreSQL** sebagai database
- **JWT** untuk authentication
- **Socket.IO** untuk real-time features
- **bcryptjs** untuk password hashing
- **Helmet** untuk security headers

## 📋 Prerequisites

Pastikan Anda telah menginstall:
- Node.js (v18 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm atau yarn

## 🛠️ Setup Development

### 1. Clone Repository
```bash
git clone <repository-url>
cd hris-web-app
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Setup Database
```bash
# Buat database PostgreSQL
createdb hris_db

# Copy environment file
cp server/.env.example server/.env

# Edit server/.env dengan konfigurasi database Anda
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=hris_db
# DB_USER=postgres
# DB_PASSWORD=your_password
```

### 4. Run Database Migration
```bash
cd server
npm run migrate
```

### 5. Start Development Servers
```bash
# Dari root directory, jalankan frontend dan backend bersamaan
npm run dev

# Atau jalankan secara terpisah:
# Frontend (port 5173)
npm run client

# Backend (port 5000)
npm run server
```

## 📊 Database Schema

### Tables
- **users** - Data pengguna dan autentikasi
- **divisions** - Divisi/departemen perusahaan
- **employees** - Data karyawan
- **attendance_records** - Catatan absensi harian
- **leave_requests** - Pengajuan cuti
- **announcements** - Pengumuman perusahaan
- **documents** - Dokumen karyawan
- **payroll_components** - Komponen gaji
- **salary_records** - Catatan gaji bulanan

## 🔐 Default Admin Account

Setelah migration, akun admin default akan dibuat:
- **Email**: admin@company.com
- **Password**: admin123

⚠️ **Penting**: Ubah password default ini setelah login pertama!

## 🎯 Fitur Utama

### 👤 Manajemen Pengguna
- Registrasi dan login
- Role-based access (Admin, Manager, Employee)
- Profile management

### 👥 Manajemen Karyawan
- CRUD data karyawan
- Manajemen divisi
- Status employment

### ⏰ Absensi
- Clock in/out dengan lokasi
- Riwayat absensi
- Statistik kehadiran
- Status keterlambatan otomatis

### 🏖️ Manajemen Cuti
- Pengajuan cuti
- Approval workflow
- Saldo cuti
- Berbagai jenis cuti

### 📢 Pengumuman
- Buat dan kelola pengumuman
- Target audience (role/divisi)
- Jenis pengumuman (general, urgent, event)

### 📊 Dashboard
- Ringkasan data real-time
- Quick actions
- Statistik kehadiran
- Pengumuman terbaru

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/user/:userId` - Get employee by user ID
- `POST /api/employees` - Create employee (Admin only)
- `PUT /api/employees/:id` - Update employee (Admin only)
- `GET /api/employees/divisions` - Get divisions

### Attendance
- `GET /api/attendance/:employeeId/today` - Get today attendance
- `GET /api/attendance/:employeeId/history` - Get attendance history
- `GET /api/attendance/:employeeId/stats` - Get attendance statistics
- `POST /api/attendance/:employeeId/clock-in` - Clock in
- `POST /api/attendance/:employeeId/clock-out` - Clock out

### Leave Requests
- `GET /api/leave` - Get leave requests
- `POST /api/leave` - Create leave request
- `PUT /api/leave/:id` - Update leave request (Admin/Manager only)
- `GET /api/leave/:employeeId/balance` - Get leave balance

### Announcements
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement (Admin/Manager only)
- `PUT /api/announcements/:id` - Update announcement (Admin/Manager only)
- `DELETE /api/announcements/:id` - Delete announcement (Admin/Manager only)

## 🔒 Security Features

- JWT-based authentication
- Password hashing dengan bcryptjs
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection

## 🚀 Production Deployment

### Environment Variables
```bash
# Database
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=hris_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Build Frontend
```bash
npm run build
```

### Start Production Server
```bash
cd server
npm start
```

## 📝 Development Notes

- Frontend berjalan di port 5173
- Backend berjalan di port 5000
- Database menggunakan UUID sebagai primary key
- Real-time features menggunakan Socket.IO
- File upload support (untuk foto absensi dan dokumen)

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.