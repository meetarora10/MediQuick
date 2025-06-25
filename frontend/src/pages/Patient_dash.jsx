import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PatientHome from "../components/PatientHome";
import PatientAppointments from "../components/PatientAppointments";
import PatientProfile from "../components/PatientProfile";
import { FiHome, FiCalendar, FiFileText, FiUser, FiSearch, FiLogOut } from "react-icons/fi";

const sidebarItems = [
  { id: "home", icon: <FiHome />, label: "Home" },
  { id: "appointments", icon: <FiFileText />, label: "Appointments" },
  { id: "profile", icon: <FiUser />, label: "Profile" },
  { id: "logout", icon: <FiLogOut />, label: "Logout" }
];

const Patient_dash = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patient/dashboard`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
          const data = await res.json();
          console.log("Patient data", data);
        if (data.success) {
          setPatientData(data.data);
          setAppointments(data.data.appointments || []);
        } else {
          setPatientData({
            name: "Alex Johnson",
            age: 32,
            gender: "Male",
            email: "alex@example.com",
            phone: "+1 234 567 8900",
            medicalConditions: ["Hypertension", "Asthma"],
            emergencyContact: {
              name: "Sarah Johnson",
              relation: "Spouse",
              phone: "+1 234 567 8901"
            }
          });
          setAppointments([]);
        }
      } catch (err) {
        setPatientData({
          name: "Alex Johnson",
          age: 32,
          gender: "Male",
          email: "alex@example.com",
          phone: "+1 234 567 8900",
          medicalConditions: ["Hypertension", "Asthma"],
          emergencyContact: {
            name: "Sarah Johnson",
            relation: "Spouse",
            phone: "+1 234 567 8901"
          }
        });
        setAppointments([]);
      }
    };
    fetchPatientData();
  }, []);
  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Send location to Flask backend
      fetch("http://localhost:5000/api/update-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
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

  let content = null;
  if (!patientData) {
    content = <div>Loading...</div>;
  } else if (activeSection === "home") {
    content = <PatientHome userProfile={patientData} appointments={appointments} />;
  } else if (activeSection === "appointments") {
    content = <PatientAppointments appointments={appointments} />;
  } else if (activeSection === "profile") {
    content = <PatientProfile patientData={patientData} />;
  } else {
    content = null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeSection}
        setActiveTab={setActiveSection}
        sidebarItems={sidebarItems}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1 overflow-auto">
        <Topbar userRole="Patient" userData={patientData} />
        <main className="p-6">
          {content}
        </main>
      </div>
    </div>
  );
};

export default Patient_dash;