import React, { useEffect, useState } from "react";

const TABS = [
  { id: "home", label: "Home" },
  { id: "appointments", label: "Appointments" },
  { id: "profile", label: "Profile" },
  { id: "logout", label: "Logout" },
];

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  // Edit profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState(null);
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editProfileError, setEditProfileError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No access token found. Redirecting to login.");
          // window.location.href = "/login";
          return;
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctor_dashboard`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setDoctorData(data.data.doctor);
          setAppointments(data.data.appointments || []);
        } else {
          console.error("Failed to fetch doctor data:", data);
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
      }
    };
    fetchDoctorData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  // Add cancel appointment handler
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh appointments list
        const dashboardRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctor_dashboard`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const dashboardData = await dashboardRes.json();
        if (dashboardData.success) {
          setAppointments(dashboardData.data.appointments || []);
        }
      } else {
        alert(data.message || 'Failed to cancel appointment.');
      }
    } catch (err) {
      alert('An error occurred while cancelling appointment.');
    }
  };

  let content = null;
  if (!doctorData) {
    content = <div className="text-center py-10 text-gray-500">Loading...</div>;
  } else if (activeTab === "home") {
    content = (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome, Dr. {doctorData.name}!</h2>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Profile Overview</h3>
            <ul className="text-gray-700 space-y-1">
              <li><span className="font-medium">Email:</span> {doctorData.email}</li>
              <li><span className="font-medium">Phone:</span> {doctorData.phone}</li>
              <li><span className="font-medium">Gender:</span> {doctorData.gender}</li>
              <li><span className="font-medium">Age:</span> {doctorData.age}</li>
              <li><span className="font-medium">Specialty:</span> {doctorData.specialty}</li>
              <li><span className="font-medium">Clinic Name:</span> {doctorData.clinic_name}</li>
              <li><span className="font-medium">Clinic Address:</span> {doctorData.clinic_address}</li>
              <li><span className="font-medium">Fees:</span> {doctorData.fees}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  } else if (activeTab === "appointments") {
    content = (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Appointments</h2>
        {appointments.length === 0 ? (
          <div className="text-gray-500">No appointments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Start Time</th>
                  <th className="py-2 px-4">End Time</th>
                  <th className="py-2 px-4">Patient Name</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 px-4">{appt.appointment_date || "-"}</td>
                    <td className="py-2 px-4">{appt.start_time || "-"}</td>
                    <td className="py-2 px-4">{appt.end_time || "-"}</td>
                    <td className="py-2 px-4">{appt.patientName || "-"}</td>
                    <td className="py-2 px-4">{appt.status || "Scheduled"}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600"
                        onClick={() => handleCancelAppointment(appt.id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  } else if (activeTab === "profile") {
    if (isEditingProfile && editProfileData) {
      content = (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
          {editProfileError && <div className="text-red-500 mb-2">{editProfileError}</div>}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setEditProfileLoading(true);
              setEditProfileError(null);
              try {
                const token = localStorage.getItem("access_token");
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/profile`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                  },
                  credentials: "include",
                  body: JSON.stringify(editProfileData),
                });
                const data = await res.json();
                if (res.ok && data.success) {
                  setDoctorData(data.data.doctor || editProfileData);
                  setIsEditingProfile(false);
                } else {
                  setEditProfileError(data.message || "Failed to update profile.");
                }
              } catch (err) {
                setEditProfileError("An error occurred while updating profile.");
              } finally {
                setEditProfileLoading(false);
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Name</label>
                <input
                  type="text"
                  className="border rounded px-3 py-1 w-full"
                  value={editProfileData.name || ""}
                  onChange={e => setEditProfileData({ ...editProfileData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Age</label>
                <input
                  type="number"
                  className="border rounded px-3 py-1 w-full"
                  value={editProfileData.age || ""}
                  onChange={e => setEditProfileData({ ...editProfileData, age: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Gender</label>
                <select
                  className="border rounded px-3 py-1 w-full"
                  value={editProfileData.gender || ""}
                  onChange={e => setEditProfileData({ ...editProfileData, gender: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  className="border rounded px-3 py-1 w-full"
                  value={editProfileData.email || ""}
                  onChange={e => setEditProfileData({ ...editProfileData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Phone</label>
                <input
                  type="text"
                  className="border rounded px-3 py-1 w-full"
                  value={editProfileData.phone || ""}
                  onChange={e => setEditProfileData({ ...editProfileData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Specialty</label>
                <input
                  type="text"
                  className="border rounded px-3 py-1 w-full"
                  value={editProfileData.specialty || ""}
                  onChange={e => setEditProfileData({ ...editProfileData, specialty: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Clinic Name</label>
                <input
                  type="text"
                  className="border rounded px-3 py-1 w-full"
                  value={editProfileData.clinic_name || ""}
                  onChange={e => setEditProfileData({ ...editProfileData, clinic_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Clinic Address</label>
                <input
                  type="text"
                  className="border rounded px-3 py-1 w-full"
                  value={editProfileData.clinic_address || ""}
                  onChange={e => setEditProfileData({ ...editProfileData, clinic_address: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Fees</label>
                <input
                  type="number"
                  className="border rounded px-3 py-1 w-full"
                  value={editProfileData.fees || ""}
                  onChange={e => setEditProfileData({ ...editProfileData, fees: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={editProfileLoading}
              >
                {editProfileLoading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => { setIsEditingProfile(false); setEditProfileError(null); }}
                disabled={editProfileLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    } else {
      content = (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
          <ul className="text-gray-700 space-y-2">
            <li><span className="font-medium">Name:</span> {doctorData.name}</li>
            <li><span className="font-medium">Age:</span> {doctorData.age}</li>
            <li><span className="font-medium">Gender:</span> {doctorData.gender}</li>
            <li><span className="font-medium">Email:</span> {doctorData.email}</li>
            <li><span className="font-medium">Phone:</span> {doctorData.phone}</li>
            <li><span className="font-medium">Specialty:</span> {doctorData.specialty}</li>
            <li><span className="font-medium">Clinic Name:</span> {doctorData.clinic_name}</li>
            <li><span className="font-medium">Clinic Address:</span> {doctorData.clinic_address}</li>
            <li><span className="font-medium">Fees:</span> {doctorData.fees}</li>
          </ul>
          <button
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              setEditProfileData({
                name: doctorData.name || "",
                age: doctorData.age || "",
                gender: doctorData.gender || "",
                email: doctorData.email || "",
                phone: doctorData.phone || "",
                specialty: doctorData.specialty || "",
                clinic_name: doctorData.clinic_name || "",
                clinic_address: doctorData.clinic_address || "",
                fees: doctorData.fees || "",
              });
              setIsEditingProfile(true);
            }}
          >
            Edit Profile
          </button>
        </div>
      );
    }
  } else if (activeTab === "logout") {
    handleLogout();
    content = null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <div className="flex flex-row">
        <div className="w-56 bg-white shadow h-screen flex flex-col">
          <div className="p-6 font-bold text-xl border-b">Doctor Dashboard</div>
          <ul className="flex-1">
            {TABS.map(tab => (
              <li
                key={tab.id}
                className={`px-6 py-3 cursor-pointer hover:bg-blue-100 ${activeTab === tab.id ? "bg-blue-50 font-semibold" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </div>
        <main className="flex-1 p-8">{content}</main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
