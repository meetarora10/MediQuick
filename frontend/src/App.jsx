function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Patient Routes */}
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
      <Route
        path="/doctor_dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <Doctor_dash />
          </ProtectedRoute>
        }
      />

      {/* Protected Meeting Route */}
      <Route
        path="/meet/:roomId"
        element={
          <ProtectedRoute>
            <MeetRouteWrapper />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;