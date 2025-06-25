import React, { useEffect, useState } from "react";

const TABS = [
  { id: "home", label: "Home" },
  { id: "appointments", label: "Appointments" },
  { id: "profile", label: "Profile" },
  { id: "logout", label: "Logout" },
];

const Patient_dash = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No access token found. Redirecting to login.");
          // window.location.href = "/login";
          return;
        }
        console.log("access_token:", localStorage.getItem("access_token"));
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patient_dashboard`, {
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
          setPatientData(data.data);
          setAppointments(data.data.appointments || []);
        } else {
          // setPatientData({
          //   name: "Alex Johnson",
          //   age: 32,
          //   gender: "Male",
          //   email: "alex@example.com",
          //   phone: "+1 234 567 8900",
          //   medicalConditions: ["Hypertension", "Asthma"],
          //   emergencyContact: {
          //     name: "Sarah Johnson",
          //     relation: "Spouse",
          //     phone: "+1 234 567 8901"
          //   }
          // });
          console.error("Failed to fetch patient data:", data);
        }
      } catch (err) {
        // setPatientData({
        //   name: "Alex Johnson",
        //   age: 32,
        //   gender: "Male",
        //   email: "alex@example.com",
        //   phone: "+1 234 567 8900",
        //   medicalConditions: ["Hypertension", "Asthma"],
        //   emergencyContact: {
        //     name: "Sarah Johnson",
        //     relation: "Spouse",
        //     phone: "+1 234 567 8901"
        //   }
        // });
        console.error("Error fetching patient data:", err);
        // setAppointments([]);
      }
    };
    fetchPatientData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found. Redirecting to login.");
      // window.location.href = "/login";
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch("http://localhost:5000/api/update-location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          credentials: "include",
          body: JSON.stringify({ latitude, longitude }),
        })
          .then((res) => res.json())
          .then((data) => console.log("Location updated:", data))
          .catch((err) => console.error("Error updating location:", err));
      },
      (error) => {
        console.error("Geolocation failed:", error);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleLogout = () => {
    // Clear tokens, redirect, etc.
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  let content = null;
  if (!patientData) {
    content = <div className="text-center py-10 text-gray-500">Loading...</div>;
  } else if (activeTab === "home") {
    content = (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome, {patientData.name}!</h2>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Profile Overview</h3>
            <ul className="text-gray-700 space-y-1">
              <li><span className="font-medium">Age:</span> {patientData.age}</li>
              <li><span className="font-medium">Gender:</span> {patientData.gender}</li>
              <li><span className="font-medium">Email:</span> {patientData.email}</li>
              <li><span className="font-medium">Phone:</span> {patientData.phone}</li>
              {/* <li><span className="font-medium">Medical Conditions:</span> {patientData.medicalConditions?.join(", ") || "None"}</li> */}
            </ul>
          </div>
          {/* <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Emergency Contact</h3>
            <ul className="text-gray-700 space-y-1">
              <li><span className="font-medium">Name:</span> {patientData.emergencyContact?.name}</li>
              <li><span className="font-medium">Relation:</span> {patientData.emergencyContact?.relation}</li>
              <li><span className="font-medium">Phone:</span> {patientData.emergencyContact?.phone}</li>
            </ul>
          </div> */}
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
                  <th className="py-2 px-4">Time</th>
                  <th className="py-2 px-4">Doctor</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 px-4">{appt.date || "-"}</td>
                    <td className="py-2 px-4">{appt.time || "-"}</td>
                    <td className="py-2 px-4">{appt.doctorName || "-"}</td>
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
          <li><span className="font-medium">Name:</span> {patientData.name}</li>
          <li><span className="font-medium">Age:</span> {patientData.age}</li>
          <li><span className="font-medium">Gender:</span> {patientData.gender}</li>
          <li><span className="font-medium">Email:</span> {patientData.email}</li>
          <li><span className="font-medium">Phone:</span> {patientData.phone}</li>
          <li><span className="font-medium">Medical Conditions:</span> {patientData.medicalConditions?.join(", ") || "None"}</li>
        </ul>
        {/* <div className="mt-6">
          <h3 className="font-bold text-lg mb-2">Emergency Contact</h3>
          <ul className="text-gray-700 space-y-1">
            <li><span className="font-medium">Name:</span> {patientData.emergencyContact?.name}</li>
            <li><span className="font-medium">Relation:</span> {patientData.emergencyContact?.relation}</li>
            <li><span className="font-medium">Phone:</span> {patientData.emergencyContact?.phone}</li>
          </ul>
        </div> */}
      </div>
    );
  } else if (activeTab === "logout") {
    handleLogout();
    content = null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white shadow flex items-center justify-between px-6 py-4">
        <div className="text-xl font-bold text-blue-700 tracking-wide">MediQuick</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </nav>
      {/* Tab Navigation */}
      <div className="flex justify-center bg-white shadow-sm">
        {TABS.filter(tab => tab.id !== "logout").map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-md font-medium focus:outline-none transition border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-700 bg-blue-50"
                : "border-transparent text-gray-600 hover:bg-blue-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Main Content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {content}
      </main>
    </div>
  );
};

export default Patient_dash;