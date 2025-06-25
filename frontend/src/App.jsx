import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Patient_dash from './pages/Patient_dash';
// import Doctor_dash from './pages/Doctor_dash';
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/patient_dashboard' element={<Patient_dash />} />
      {/* <Route path='/doctor_dashboard' element={<Doctor_dash />} /> */}
      {/* Protected Patient Routes
      <Route
        path="/patient_dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Patient_dash />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search-doctor"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <SearchDoctor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-appointment/:doctorId"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <BookAppointment />
          </ProtectedRoute>
        }
      />

      {/* Protected Doctor Routes */}
      {/* <Route
        path="/doctor_dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <Doctor_dash />
          </ProtectedRoute>
        }
      /> */}

      {/* Protected Meeting Route */}
      {/* <Route
        path="/meet/:roomId"
        element={
          <ProtectedRoute>
            <MeetRouteWrapper />
          </ProtectedRoute>
        }
      />  */}
    </Routes>
  );
}

export default App;