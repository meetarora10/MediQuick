import React, { useState, useEffect, useCallback } from 'react';
import { FaLocationDot } from "react-icons/fa6";

const handleNlpSearch = async (query) => {
  if (!query.trim()) return { symptoms: [], specialties: [] };
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/extract-symptoms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { symptoms: [], specialties: [] };
  }
};

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const DoctorSearch = ({ doctors, error, searchTerm, setSearchTerm, handleGetDirections, onAppointmentBooked }) => {
  const [nlpSymptoms, setNlpSymptoms] = useState([]);
  const [nlpSpecialties, setNlpSpecialties] = useState([]);
  const [nlpLoading, setNlpLoading] = useState(false);
  const [nlpError, setNlpError] = useState(null);

  // Appointment booking modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [apptDate, setApptDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Debounced NLP search
  const debouncedNlpSearch = useCallback(
    debounce(async (query) => {
      setNlpLoading(true);
      setNlpError(null);
      try {
        const data = await handleNlpSearch(query);
        setNlpSymptoms(data.symptoms || []);
        setNlpSpecialties(data.specialties || []);
      } catch (err) {
        setNlpSymptoms([]);
        setNlpSpecialties([]);
        setNlpError('Failed to extract symptoms.');
      } finally {
        setNlpLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedNlpSearch(searchTerm);
    } else {
      setNlpSymptoms([]);
      setNlpSpecialties([]);
    }
  }, [searchTerm, debouncedNlpSearch]);

  // Filter doctors by mapped specialties, name, or specialty
  const search = searchTerm.trim().toLowerCase();
  const filteredDoctors = search
    ? doctors.filter(doctor => {
        const name = doctor.name?.toLowerCase() || "";
        const specialty = doctor.specialty?.toLowerCase() || "";
        // Match by name, specialty, or mapped specialties from NLP
        return (
          name.includes(search) ||
          specialty.includes(search) ||
          (nlpSpecialties.length > 0 && nlpSpecialties.some(spec => specialty.includes(spec.toLowerCase())))
        );
      })
    : doctors;

  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setApptDate("");
    setStartTime("");
    setEndTime("");
    setBookingError(null);
    setBookingSuccess(null);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          doctor_id: selectedDoctor.id,
          appointment_date: apptDate,
          start_time: startTime,
          end_time: endTime,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookingSuccess("Appointment booked successfully!");
        setShowModal(false);
        if (onAppointmentBooked) onAppointmentBooked();
      } else {
        setBookingError(data.message || "Failed to book appointment.");
      }
    } catch (err) {
      setBookingError("An error occurred while booking appointment.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Find a Doctor</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search doctors by specialty, name, or symptom..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 w-full"
          />
          {nlpLoading && <div className="text-blue-500 mt-2">Analyzing symptoms...</div>}
          {nlpError && <div className="text-red-500 mt-2">{nlpError}</div>}
          {nlpSymptoms.length > 0 && (
            <div className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Extracted symptoms:</span> {nlpSymptoms.join(', ')}
            </div>
          )}
          {nlpSpecialties.length > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Mapped specialties:</span> {nlpSpecialties.join(', ')}
            </div>
          )}
        </div>
        {/* Doctors List */}
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-gray-500">No doctors found{searchTerm ? " for your search." : " nearby."}</div>
        ) : (
          <ul className="space-y-4">
            {filteredDoctors.map((doctor, idx) => (
              <li key={idx} className="border p-4 rounded-lg">
                <h4 className="font-semibold text-lg">{doctor.name}</h4>
                <p><span className="font-medium">Specialty:</span> {doctor.specialty}</p>
                <p><span className="font-medium">Clinic:</span> {doctor.clinic_name}</p>
                <p><span className="font-medium">Address:</span> {doctor.clinic_address}</p>
                <p><span className="font-medium">Phone:</span> {doctor.phone}</p>
                <p><span className="font-medium">Fees:</span> ₹{doctor.fees} </p>
                {doctor.distance_km !== undefined && (
                  <p><span className="font-medium">Distance:</span> {doctor.distance_km} km</p>
                )}
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                  onClick={() => openBookingModal(doctor)}
                >
                  Book Appointment
                </button>
                <button
                  className="mt-2 mx-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                  onClick={() => handleGetDirections(doctor.clinic_address)}
                >
                  <FaLocationDot className="inline mr-1" />
                  Get Directions
                </button>
              </li>
            ))}
          </ul>
        )}
        {/* Booking Modal */}
        {showModal && selectedDoctor && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">Book Appointment with {selectedDoctor.name}</h3>
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div>
                  <label className="block font-medium">Date</label>
                  <input
                    type="date"
                    className="border rounded px-3 py-1 w-full"
                    value={apptDate}
                    onChange={e => setApptDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Start Time</label>
                  <input
                    type="time"
                    className="border rounded px-3 py-1 w-full"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">End Time</label>
                  <input
                    type="time"
                    className="border rounded px-3 py-1 w-full"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    required
                  />
                </div>
                {bookingError && <div className="text-red-500">{bookingError}</div>}
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Booking..." : "Book"}
                </button>
              </form>
            </div>
          </div>
        )}
        {bookingSuccess && (
          <div className="text-green-600 mt-4">{bookingSuccess}</div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
