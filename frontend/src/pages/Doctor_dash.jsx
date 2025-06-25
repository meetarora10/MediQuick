import React, { useState, useEffect } from "react";
import { FaHome, FaCalendar, FaEnvelope, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const DoctorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [profileEdit, setProfileEdit] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctor_dashboard`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setUserData(data.data);
          setAppointments(data.data.appointments || []);
        } else {
          console.error("Failed to fetch doctor dashboard:", data.message);
        }
      } catch (err) {
        console.error("Error fetching doctor dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      setProfileError("");
      setProfileSuccess("");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctor_profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedProfile)
      });
      const data = await res.json();
      if (data.success) {
        setUserData(prev => ({ ...prev, ...data.data }));
        setProfileSuccess('Profile updated successfully!');
        setProfileEdit(null);
      } else {
        setProfileError(data.message || 'Unknown server error');
      }
    } catch (error) {
      setProfileError('Error updating profile: ' + error.message);
    }
  };

  const sidebarItems = [
    { id: "home", icon: <FaHome />, label: "Home" },
    { id: "appointments", icon: <FaCalendar />, label: "Appointments" },
    { id: "messages", icon: <FaEnvelope />, label: "Messages" },
    { id: "profile", icon: <FaUser />, label: "Profile" },
    { id: "logout", icon: <FiLogOut />, label: "Logout" },
  ];

  const renderHome = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, Dr. {userData?.name || "Doctor"}!</h2>
      <p>Email: {userData?.email}</p>
      <p>Specialization: {userData?.specialization}</p>
      <h3 className="mt-6 text-xl font-semibold">Upcoming Appointments</h3>
      <ul className="mt-2">
        {appointments.length === 0 ? (
          <li>No appointments scheduled.</li>
        ) : (
          appointments.slice(0, 3).map((appt, idx) => (
            <li key={idx} className="border-b py-2">
              <strong>Patient:</strong> {appt.patient_name} <br />
              <strong>Date:</strong> {appt.date} <br />
              <strong>Time:</strong> {appt.time}
            </li>
          ))
        )}
      </ul>
    </div>
  );

  const renderAppointments = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Patient</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Time</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{appt.patient_name}</td>
                <td className="border px-2 py-1">{appt.date}</td>
                <td className="border px-2 py-1">{appt.time}</td>
                <td className="border px-2 py-1">{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderProfile = () => {
    if (!userData) return null;
    const isEditing = profileEdit !== null;
    const [edit, setEdit] = isEditing ? [profileEdit, setProfileEdit] : [userData, () => {}];
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {profileError && <div className="text-red-500 mb-2">{profileError}</div>}
        {profileSuccess && <div className="text-green-600 mb-2">{profileSuccess}</div>}
        {isEditing ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleProfileUpdate(edit);
            }}
            className="space-y-2"
          >
            <div>
              <label>Name: </label>
              <input
                className="border px-2 py-1"
                value={edit.name || ''}
                onChange={e => setEdit({ ...edit, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Email: </label>
              <input
                className="border px-2 py-1"
                value={edit.email || ''}
                onChange={e => setEdit({ ...edit, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Specialization: </label>
              <input
                className="border px-2 py-1"
                value={edit.specialization || ''}
                onChange={e => setEdit({ ...edit, specialization: e.target.value })}
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Save</button>
            <button type="button" className="ml-2 px-4 py-1" onClick={() => setProfileEdit(null)}>Cancel</button>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Specialization:</strong> {userData.specialization}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-1 rounded" onClick={() => setProfileEdit(userData)}>Edit Profile</button>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (!userData) return <div>Loading...</div>;
    switch (activeTab) {
      case "home":
        return renderHome();
      case "appointments":
        return renderAppointments();
      case "profile":
        return renderProfile();
      case "messages":
        return <div className="text-gray-500">Messages tab coming soon...</div>;
      case "logout":
        return <div className="text-red-500">Logging out...</div>;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow h-full transition-all duration-200 ${isSidebarOpen ? 'w-56' : 'w-16'} flex flex-col`}>
        <button
          className="p-2 focus:outline-none self-end"
          onClick={() => setIsSidebarOpen(prev => !prev)}
        >
          {isSidebarOpen ? '<' : '>'}
        </button>
        <nav className="flex-1">
          {sidebarItems.map(item => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-200 ${activeTab === item.id ? 'bg-blue-100 font-bold' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </nav>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="h-16 bg-white shadow flex items-center px-6 justify-between">
          <div className="font-bold text-lg">Doctor Dashboard</div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{userData ? userData.name : ''}</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Doctor</span>
          </div>
        </div>
        <div className="p-6 overflow-auto h-[calc(100vh-4rem)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
