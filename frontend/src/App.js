import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Clinics from './pages/Clinics';
import ClinicDetail from './pages/ClinicDetail';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import History from './pages/History';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageClinics from './pages/admin/ManageClinics';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import NewBooking from './pages/receptionist/NewBooking';
import RegisterPatient from './pages/receptionist/RegisterPatient';
import Queue from './pages/receptionist/Queue';
import BookingHistory from './pages/receptionist/BookingHistory';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Admin routes with AdminLayout */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="clinics" element={<ManageClinics />} />
              <Route path="doctors" element={<ManageDoctors />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="bookings" element={<ManageBookings />} />
            </Route>

            {/* Public and other routes with Navbar */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/clinics" element={<Clinics />} />
                    <Route path="/clinics/:id" element={<ClinicDetail />} />
                    
                    {/* User routes */}
                    <Route 
                      path="/booking" 
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <Booking />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/history" 
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <History />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Receptionist routes */}
                    <Route 
                      path="/receptionist/dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['receptionist']}>
                          <ReceptionistDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/receptionist/new-booking" 
                      element={
                        <ProtectedRoute allowedRoles={['receptionist']}>
                          <NewBooking />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/receptionist/register-patient" 
                      element={
                        <ProtectedRoute allowedRoles={['receptionist']}>
                          <RegisterPatient />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/receptionist/queue" 
                      element={
                        <ProtectedRoute allowedRoles={['receptionist']}>
                          <Queue />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/receptionist/history" 
                      element={
                        <ProtectedRoute allowedRoles={['receptionist']}>
                          <BookingHistory />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Shared protected route */}
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </main>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
