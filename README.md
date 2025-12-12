# 🏥 Clinic Booking Application

Ứng dụng web full-stack cho việc đặt lịch khám bệnh tại các phòng khám, được xây dựng với React, Node.js, Express và MongoDB.

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Tech Stack](#-tech-stack)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt](#-cài-đặt)
- [API Endpoints](#-api-endpoints)
- [Database Models](#-database-models)
- [Vai Trò Người Dùng](#-vai-trò-người-dùng)
- [Sử Dụng](#-sử-dụng)
- [Tính Năng Cần Bổ Sung](#-tính-năng-cần-bổ-sung)

## ✨ Tính Năng

### Người Dùng (User)
- ✅ Đăng ký và đăng nhập với JWT authentication
- ✅ Tìm kiếm phòng khám theo thành phố và chuyên khoa
- ✅ Xem thông tin chi tiết phòng khám và bác sĩ
- ✅ Đặt lịch hẹn với bác sĩ
- ✅ Xem lịch sử đặt hẹn
- ✅ Hủy lịch hẹn
- ✅ Cập nhật thông tin cá nhân

### Lễ Tân (Receptionist)
- ✅ Xem bảng điều khiển với thống kê hôm nay
- ✅ Tạo lịch hẹn mới cho bệnh nhân
- ✅ Đăng ký bệnh nhân mới
- ✅ Quản lý hàng đợi khám bệnh
- ✅ Cập nhật trạng thái lịch hẹn
- ✅ Xem lịch sử khám bệnh

### Quản Trị Viên (Admin)
- ✅ Bảng điều khiển tổng quan
- ✅ Quản lý phòng khám (CRUD)
- ✅ Quản lý bác sĩ (CRUD)
- ✅ Quản lý người dùng và vai trò
- ✅ Quản lý tất cả lịch hẹn
- ✅ Thống kê và báo cáo

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling (responsive design)

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-rate-limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

## 📁 Cấu Trúc Dự Án

```
clinic-booking/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   └── rateLimiter.js        # Rate limiting
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Clinic.js             # Clinic model
│   │   ├── Doctor.js             # Doctor model
│   │   ├── Schedule.js           # Schedule model
│   │   └── Booking.js            # Booking model
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── clinics.js            # Clinic routes
│   │   ├── doctors.js            # Doctor routes
│   │   ├── schedules.js          # Schedule routes
│   │   └── bookings.js           # Booking routes
│   ├── .env                      # Environment variables
│   ├── package.json
│   ├── seed.js                   # Database seeding
│   └── server.js                 # Server entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLayout.js    # Admin layout wrapper
│   │   │   ├── Navbar.js         # Navigation bar
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth context
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Clinics.js
│   │   │   ├── ClinicDetail.js
│   │   │   ├── Booking.js
│   │   │   ├── Profile.js
│   │   │   ├── History.js
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── ManageClinics.js
│   │   │   │   ├── ManageDoctors.js
│   │   │   │   ├── ManageUsers.js
│   │   │   │   └── ManageBookings.js
│   │   │   └── receptionist/
│   │   │       ├── ReceptionistDashboard.js
│   │   │       ├── NewBooking.js
│   │   │       ├── RegisterPatient.js
│   │   │       ├── Queue.js
│   │   │       └── BookingHistory.js
│   │   ├── services/
│   │   │   └── api.js            # API service
│   │   ├── utils/
│   │   │   └── helpers.js        # Helper functions
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Cài Đặt

### Yêu Cầu
- Node.js (v14 trở lên)
- MongoDB (local hoặc MongoDB Atlas)
- npm hoặc yarn

### Cài Đặt Nhanh

1. Clone repository:
```bash
git clone <repository-url>
cd clinic-booking
```

2. Cài đặt dependencies cho Backend:
```bash
cd backend
npm install
```

3. Cài đặt dependencies cho Frontend:
```bash
cd ../frontend
npm install
```

4. Cấu hình Backend:
```bash
cd backend
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clinic-booking
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
```

5. Khởi tạo database với dữ liệu mẫu:
```bash
cd backend
npm run seed
```

6. Khởi động Backend:
```bash
cd backend
npm run dev    # Development mode với nodemon
# hoặc
npm start      # Production mode
```

Backend sẽ chạy tại: http://localhost:5000

7. Khởi động Frontend:
```bash
cd frontend
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Đăng ký người dùng mới | ❌ |
| POST | `/login` | Đăng nhập | ❌ |
| GET | `/profile` | Lấy thông tin người dùng | ✅ |
| PUT | `/profile` | Cập nhật thông tin | ✅ |
| GET | `/users` | Lấy danh sách users (Admin) | ✅ |
| GET | `/patients` | Lấy danh sách bệnh nhân (Receptionist) | ✅ |
| PUT | `/users/:id/role` | Cập nhật role (Admin) | ✅ |
| DELETE | `/users/:id` | Xóa user (Admin) | ✅ |

### Clinics (`/api/clinics`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách phòng khám | ❌ |
| GET | `/:id` | Lấy chi tiết phòng khám | ❌ |
| POST | `/` | Tạo phòng khám mới (Admin) | ✅ |
| PUT | `/:id` | Cập nhật phòng khám (Admin) | ✅ |
| DELETE | `/:id` | Xóa phòng khám (Admin) | ✅ |

### Doctors (`/api/doctors`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách bác sĩ | ❌ |
| GET | `/:id` | Lấy chi tiết bác sĩ | ❌ |
| POST | `/` | Tạo bác sĩ mới (Admin) | ✅ |
| PUT | `/:id` | Cập nhật bác sĩ (Admin) | ✅ |
| DELETE | `/:id` | Xóa bác sĩ (Admin) | ✅ |

### Schedules (`/api/schedules`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy lịch khám | ❌ |
| POST | `/` | Tạo lịch khám (Admin) | ✅ |
| PUT | `/:id` | Cập nhật lịch khám (Admin) | ✅ |
| DELETE | `/:id` | Xóa lịch khám (Admin) | ✅ |

### Bookings (`/api/bookings`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách lịch hẹn | ✅ |
| GET | `/:id` | Lấy chi tiết lịch hẹn | ✅ |
| POST | `/` | Tạo lịch hẹn mới | ✅ |
| PUT | `/:id` | Cập nhật lịch hẹn | ✅ |
| DELETE | `/:id` | Hủy lịch hẹn | ✅ |

## 💾 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (enum: ['user', 'receptionist', 'admin']),
  clinic: ObjectId (ref: 'Clinic'), // Required for receptionist
  createdAt: Date
}
```

### Clinic
```javascript
{
  name: String,
  description: String,
  address: String,
  city: String,
  phone: String,
  email: String,
  specialties: [String],
  image: String,
  rating: Number,
  createdAt: Date
}
```

### Doctor
```javascript
{
  name: String,
  specialty: String,
  qualification: String,
  experience: Number,
  clinic: ObjectId (ref: 'Clinic'),
  email: String,
  phone: String,
  image: String,
  rating: Number,
  createdAt: Date
}
```

### Schedule
```javascript
{
  doctor: ObjectId (ref: 'Doctor'),
  clinic: ObjectId (ref: 'Clinic'),
  dayOfWeek: String,
  startTime: String,
  endTime: String,
  slotDuration: Number,
  isActive: Boolean
}
```

### Booking
```javascript
{
  user: ObjectId (ref: 'User'),
  clinic: ObjectId (ref: 'Clinic'),
  doctor: ObjectId (ref: 'Doctor'),
  date: Date,
  time: String,
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  symptoms: String,
  notes: String,
  createdAt: Date
}
```

## 👥 Vai Trò Người Dùng

### User (Người dùng)
- Tìm kiếm và xem phòng khám
- Đặt lịch hẹn
- Quản lý lịch hẹn cá nhân
- Cập nhật hồ sơ

### Receptionist (Lễ tân)
- Tạo lịch hẹn cho bệnh nhân
- Đăng ký bệnh nhân mới
- Quản lý hàng đợi
- Xem lịch sử khám bệnh
- Gắn với một phòng khám cụ thể

### Admin (Quản trị viên)
- Quản lý toàn bộ hệ thống
- CRUD phòng khám, bác sĩ
- Quản lý người dùng và phân quyền
- Xem tất cả lịch hẹn
- Thống kê hệ thống

## 📖 Sử Dụng

### Đăng Nhập Mẫu

Sau khi chạy `npm run seed`, bạn có thể đăng nhập với:

**Người dùng:**
- Email: `nguyenvanan@example.com` | Password: `password123`
- Email: `tranthibinh@example.com` | Password: `password123`

**Lễ tân:**
- Email: `lethimai@example.com` | Password: `receptionist123`
- Phòng khám: Bệnh Viện Đa Khoa Thành Phố

**Quản trị viên:**
- Email: `admin@example.com` | Password: `admin123`

### Workflow Cơ Bản

1. **Người dùng đặt lịch:**
   - Đăng ký/Đăng nhập
   - Tìm phòng khám theo thành phố/chuyên khoa
   - Chọn bác sĩ
   - Chọn ngày và giờ khám
   - Xác nhận đặt lịch

2. **Lễ tân quản lý:**
   - Đăng nhập với tài khoản receptionist
   - Xem dashboard hôm nay
   - Tạo lịch hẹn cho bệnh nhân walk-in
   - Cập nhật trạng thái lịch hẹn
   - Quản lý hàng đợi

3. **Admin quản trị:**
   - Đăng nhập với tài khoản admin
   - Thêm/sửa/xóa phòng khám
   - Quản lý bác sĩ
   - Phân quyền người dùng
   - Theo dõi thống kê

## 🔧 Tính Năng Cần Bổ Sung

- [ ] Email notifications cho lịch hẹn
- [ ] SMS reminders
- [ ] Payment integration
- [ ] Review và rating system
- [ ] Advanced search filters
- [ ] Export báo cáo PDF
- [ ] Multi-language support
- [ ] Video consultation
- [ ] Prescription management
- [ ] Medical records storage
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Mobile app (React Native)

## 🔒 Bảo Mật

- Password được hash với bcryptjs
- JWT tokens cho authentication
- Protected routes với middleware
- Rate limiting trên API endpoints
- Input validation và sanitization
- CORS configuration

## 📝 License

ISC

## 👨‍💻 Developer

Phát triển bởi [Your Name]

---

**Note:** Đây là dự án học tập/demo. Không sử dụng trong production mà không có security audit đầy đủ.