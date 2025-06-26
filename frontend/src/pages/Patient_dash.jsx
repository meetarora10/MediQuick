import React, { useEffect, useState } from "react";

const TABS = [
  { id: "home", label: "Home" },
  { id: "appointments", label: "Appointments" },
  { id: "profile", label: "Profile" },
  { id: "find", label: "Find Doctor" },
  { id: "logout", label: "Logout" },
];

const Patient_dash = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

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
          setPatientData(data.data.patient);
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
        return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctors-nearby`, {
          method: 'GET',
          headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        .then((res) => res.json().then((data) => ({ status: res.status, data })))
          .then(({ status, data }) => {
            if (status === 200) {
              setDoctors(data);
            } else {
              setError(data.message || 'Failed to fetch doctors');
            }
          })
          .catch((err) => {
            console.error('Error fetching doctors:', err);
            setError('An error occurred while fetching doctors.');
          });
      },
      (error) => {
        console.error("Geolocation failed:", error);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleLogout = () => {
    // Clear tokens, redirect, etc.
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  const handleGetDirections = (address) => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
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
              <li><span className="font-medium">Email:</span> {patientData.email}</li>
              <li><span className="font-medium">Phone:</span> {patientData.phone}</li>
              <li><span className="font-medium">Gender:</span> {patientData.gender}</li>
              <li><span className="font-medium">Age:</span> {patientData.age}</li>
              <li><span className="font-medium">Medical Conditions:</span> {patientData.medicalConditions?.join(", ") || "None"}</li>
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
                    <td className="py-2 px-4">{appt.appointment_date || "-"}</td>
                    <td className="py-2 px-4">{appt.start_time || "-"}</td>
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
  } else if (activeTab === "find") {
    content = (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Find a Doctor</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-2">Nearby Doctors</h3>
          {doctors.length === 0 ? (
            <div className="text-gray-500">No doctors found nearby.</div>
          ) : (
            <ul className="space-y-4">
              {doctors.map((doctor, idx) => (
                <li key={idx} className="border p-4 rounded-lg">
                  <h4 className="font-semibold text-lg">{doctor.name}</h4>
                  <p><span className="font-medium">Specialty:</span> {doctor.specialty}</p>
                  <p><span className="font-medium">Clinic:</span> {doctor.clinic_name}</p>
                  <p><span className="font-medium">Address:</span> {doctor.clinic_address}</p>
                  <p><span className="font-medium">Phone:</span> {doctor.phone}</p>
                  <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
                    Book Appointment
                  </button>
                  <button
                    className="mt-2 mx-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                    onClick={() => handleGetDirections(doctor.clinic_address)}
                  >
                    Get Directions
                  </button>
                </li>
              ))}
            </ul>
          )}
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white shadow flex items-center justify-between px-6 py-4">
                                <span
                            className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400 bg-clip-text text-transparent drop-shadow-md"
                            style={{ WebkitTextStroke: '0.5px rgba(0,0,0,0.08)' }}
                        >
                            MediQuick
                        </span>
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