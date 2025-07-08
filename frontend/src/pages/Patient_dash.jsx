import React, { useEffect, useState } from "react";
import DoctorSearch from "../components/DoctorSearch";
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
  const [searchTerm, setSearchTerm] = useState("");
  // Edit profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState(null);
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editProfileError, setEditProfileError] = useState(null);

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

  useEffect(() => {
    if (activeTab !== "find") return;
    const token = localStorage.getItem("access_token");
    if (!token) return;
    let url = `${import.meta.env.VITE_BACKEND_URL}/api/doctors-nearby`;
    // Always fetch all doctors, filter client-side
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 200 && Array.isArray(data)) {
          setDoctors(data);
          setError(null);
        } else {
          setDoctors([]);
          setError(data.message || 'Failed to fetch doctors');
        }
      })
      .catch((err) => {
        setDoctors([]);
        setError('An error occurred while fetching doctors.');
      });
  }, [activeTab, searchTerm]);

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

  // Add a function to fetch appointments only
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
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
        setAppointments(data.data.appointments || []);
      }
    } catch (err) {
      // ignore
    }
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
        fetchAppointments();
      } else {
        alert(data.message || 'Failed to cancel appointment.');
      }
    } catch (err) {
      alert('An error occurred while cancelling appointment.');
    }
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
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 px-4">{appt.appointment_date || "-"}</td>
                    <td className="py-2 px-4">{appt.start_time || "-"}</td>
                    <td className="py-2 px-4">{appt.doctorName || "-"}</td>
                    <td className="py-2 px-4">{appt.status || "Scheduled"}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patient/profile`, {
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
                  setPatientData(data.data.patient || editProfileData);
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
              {/* <div>
                <label className="block font-medium">Medical Conditions (comma separated)</label>
                <input
                  type="text"
                  className="border rounded px-3 py-1 w-full"
                  value={editProfileData.medicalConditions ? editProfileData.medicalConditions.join(", ") : ""}
                  onChange={e => setEditProfileData({ ...editProfileData, medicalConditions: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                />
              </div> */}
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
            <li><span className="font-medium">Name:</span> {patientData.name}</li>
            <li><span className="font-medium">Age:</span> {patientData.age}</li>
            <li><span className="font-medium">Gender:</span> {patientData.gender}</li>
            <li><span className="font-medium">Email:</span> {patientData.email}</li>
            <li><span className="font-medium">Phone:</span> {patientData.phone}</li>
            <li><span className="font-medium">Medical Conditions:</span> {patientData.medicalConditions?.join(", ") || "None"}</li>
          </ul>
          <button
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              setEditProfileData({
                name: patientData.name || "",
                age: patientData.age || "",
                gender: patientData.gender || "",
                email: patientData.email || "",
                phone: patientData.phone || "",
                medicalConditions: patientData.medicalConditions || [],
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
  } else if (activeTab === "find") {
    content = (
      <DoctorSearch
        doctors={doctors}
        error={error}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleGetDirections={handleGetDirections}
        onAppointmentBooked={fetchAppointments}
      />
      // <div>
      //   <h2 className="text-2xl font-semibold mb-4">Find a Doctor</h2>
      //   <div className="bg-white rounded-lg shadow p-6">
      //     {/* Search Input */}
      //     <div className="mb-4">
      //       <input
      //         type="text"
      //         placeholder="Search doctors by specialty or name or symptom..."
      //         value={searchTerm}
      //         onChange={e => setSearchTerm(e.target.value)}
      //         className="border rounded px-3 py-1 w-full"
      //       />
      //     </div>
      //     {/* Doctors List */}
      //     {error ? (
      //       <div className="text-red-500">{error}</div>
      //     ) : doctors.length === 0 ? (
      //       <div className="text-gray-500">No doctors found{searchTerm ? " for your search." : " nearby."}</div>
      //     ) : (
      //       <ul className="space-y-4">
      //         {doctors.map((doctor, idx) => (
      //           <li key={idx} className="border p-4 rounded-lg">
      //             <h4 className="font-semibold text-lg">{doctor.name}</h4>
      //             <p><span className="font-medium">Specialty:</span> {doctor.specialty}</p>
      //             <p><span className="font-medium">Clinic:</span> {doctor.clinic_name}</p>
      //             <p><span className="font-medium">Address:</span> {doctor.clinic_address}</p>
      //             <p><span className="font-medium">Phone:</span> {doctor.phone}</p>
      //             <p><span className="font-medium">Fees:</span> ₹{doctor.fees} </p>
      //             {doctor.distance_km !== undefined && (
      //               <p><span className="font-medium">Distance:</span> {doctor.distance_km} km</p>
      //             )}
      //             <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
      //               Book Appointment
      //             </button>
      //             <button
      //               className="mt-2 mx-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
      //               onClick={() => handleGetDirections(doctor.clinic_address)}
      //             >
      //               <FaLocationDot className="inline mr-1" />
      //               Get Directions
      //             </button>
      //           </li>
      //         ))}
      //       </ul>
      //     )}
      //   </div>
      // </div>
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
