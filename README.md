# Clinic Booking Application

A full-stack web application for booking clinic appointments built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Register and login with JWT authentication
- **Browse Clinics**: View and search clinics by city and specialty
- **Doctor Information**: See detailed doctor profiles with qualifications and experience
- **Book Appointments**: Schedule appointments with doctors at various clinics
- **Manage Bookings**: View booking history and cancel appointments
- **User Profile**: Update personal information

## Tech Stack

### Frontend
- React 18
- React Router DOM for navigation
- Axios for API calls
- Context API for state management
- Responsive CSS design

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

## Project Structure

```
clinic-booking/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Clinic.js
│   │   ├── Doctor.js
│   │   ├── Schedule.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── clinics.js
│   │   ├── doctors.js
│   │   ├── schedules.js
│   │   └── bookings.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Clinics.js
│   │   │   ├── ClinicDetail.js
│   │   │   ├── Booking.js
│   │   │   ├── Profile.js
│   │   │   └── History.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clinic-booking
JWT_SECRET=your_secret_key_here
```

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file for API configuration:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Clinics
- `GET /api/clinics` - Get all clinics (supports city and specialty filters)
- `GET /api/clinics/:id` - Get clinic by ID
- `POST /api/clinics` - Create clinic (protected)
- `PUT /api/clinics/:id` - Update clinic (protected)
- `DELETE /api/clinics/:id` - Delete clinic (protected)

### Doctors
- `GET /api/doctors` - Get all doctors (supports clinic and specialty filters)
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create doctor (protected)
- `PUT /api/doctors/:id` - Update doctor (protected)
- `DELETE /api/doctors/:id` - Delete doctor (protected)

### Schedules
- `GET /api/schedules` - Get all schedules (supports doctor and clinic filters)
- `GET /api/schedules/:id` - Get schedule by ID
- `POST /api/schedules` - Create schedule (protected)
- `PUT /api/schedules/:id` - Update schedule (protected)
- `DELETE /api/schedules/:id` - Delete schedule (protected)

### Bookings
- `GET /api/bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get booking by ID (protected)
- `POST /api/bookings` - Create booking (protected)
- `PUT /api/bookings/:id` - Update booking (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

## Usage

1. Start MongoDB service
2. Start the backend server
3. Start the frontend development server
4. Open http://localhost:3000 in your browser
5. Register a new account or login
6. Browse clinics and book appointments

## Database Models

### User
- name, email, password, phone, role (user/admin)

### Clinic
- name, description, address, city, phone, email, specialties, image, rating

### Doctor
- name, specialty, qualification, experience, clinic (ref), email, phone, image, rating

### Schedule
- doctor (ref), clinic (ref), dayOfWeek, startTime, endTime, slotDuration, isActive

### Booking
- user (ref), clinic (ref), doctor (ref), date, time, status, symptoms, notes

## Features to Add

- Email notifications
- Payment integration
- Reviews and ratings
- Advanced search and filters
- Admin dashboard
- Appointment reminders
- Doctor availability calendar

## License

ISC