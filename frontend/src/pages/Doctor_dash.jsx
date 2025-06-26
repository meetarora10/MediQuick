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
                  <th className="py-2 px-4">Patient ID</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 px-4">{appt.appointment_date || "-"}</td>
                    <td className="py-2 px-4">{appt.start_time || "-"}</td>
                    <td className="py-2 px-4">{appt.end_time || "-"}</td>
                    <td className="py-2 px-4">{appt.patient_id || "-"}</td>
                    <td className="py-2 px-4">{appt.status || "Scheduled"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  } else if (activeTab === "profile") {
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
      </div>
    );
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
