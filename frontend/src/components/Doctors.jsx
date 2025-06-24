// import doctors from '../utils/doctors.json';
// import { FaCalendarAlt, FaUserMd, FaInfoCircle } from 'react-icons/fa';

// function Doctors() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100" id="doctor">
//       <div className="max-w-6xl mx-auto px-4 py-16">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-900 mb-10 drop-shadow-lg">
//           Our Doctors
//         </h1>

//         <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
//           {doctors.map((doc) => (
//             <div
//               key={doc.id}
//               className="group bg-gradient-to-br from-blue-50 via-white to-blue-100/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 text-center relative overflow-hidden border-2 border-blue-100
//                 hover:scale-[1.025] hover:border-blue-300 duration-300"
//               style={{
//                 background:
//                   "linear-gradient(135deg, rgba(219,234,254,0.85) 0%, rgba(255,255,255,0.95) 60%, rgba(191,219,254,0.7) 100%)",
//                 boxShadow:
//                   "0 8px 32px 0 rgba(31,38,135,0.10), 0 1.5px 4px 0 #fff8, 0 1.5px 4px 0 #e0e0e0",
//                 backdropFilter: "blur(8px)",
//               }}
//             >
//               <div className="relative w-28 h-28 mx-auto mb-4">
//                                 <div className="absolute inset-0 rounded-full ring-8 ring-blue-400 ring-offset-2 ring-offset-white blur-sm animate-pulse z-0 pointer-events-none"></div>
//                 <img
//                   src={doc.image}
//                   alt={doc.name}
//                   className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg z-10"
//                 />
//               </div>
//               <h2 className="text-xl font-bold text-blue-800 mt-2">{doc.name}</h2>
//               <p className="text-blue-700 font-medium">{doc.specialty}</p>
//               <p className="text-gray-500 text-sm">{doc.experience}</p>
//               <p className="text-gray-500 text-sm">{doc.location}</p>

//               <div className="flex justify-center gap-2 mt-4 mb-2">
//                 <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
//                   {doc.specialty}
//                 </span>
//                 <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
//                   {doc.experience}
//                 </span>
//               </div>

//               <div className="absolute left-0 bottom-0 w-full h-20 pointer-events-none">
//                 <div className="absolute left-0 bottom-[-32px] w-full h-26 flex justify-center items-end z-20
//                   transition-all duration-500 ease-in-out
//                   translate-y-full group-hover:translate-y-0
//                   pointer-events-auto
//                 ">
//                   <div className="w-full h-full bg-gradient-to-t from-blue-600/90 to-blue-400/90 rounded-t-[60px] flex justify-center items-end gap-6 pb-10 shadow-lg">
//                     <div className="relative group/icon">
//                       <span className="absolute inset-0 rounded-full bg-blue-200 blur-md opacity-60 animate-pulse z-0"></span>
//                       <div className="relative bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 text-white p-3 rounded-full shadow-lg hover:from-blue-500 hover:to-blue-900 cursor-pointer z-10 border-4 border-white transition">
//                         <FaCalendarAlt size={18} className="text-cyan-200 drop-shadow-[0_2px_8px_rgba(34,211,238,0.5)]" />
//                       </div>
//                     </div>
//                     <div className="relative group/icon">
//                       <span className="absolute inset-0 rounded-full bg-green-200 blur-md opacity-60 animate-pulse z-0"></span>
//                       <div className="relative bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white p-3 rounded-full shadow-lg hover:from-green-500 hover:to-emerald-700 cursor-pointer z-10 border-4 border-white transition">
//                         <FaUserMd size={18} className="text-lime-100 drop-shadow-[0_2px_8px_rgba(163,230,53,0.4)]" />
//                       </div>
//                     </div>
//                     <div className="relative group/icon">
//                       <span className="absolute inset-0 rounded-full bg-purple-200 blur-md opacity-60 animate-pulse z-0"></span>
//                       <div className="relative bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:from-purple-500 hover:to-indigo-700 cursor-pointer z-10 border-4 border-white transition">
//                         <FaInfoCircle size={18} className="text-pink-100 drop-shadow-[0_2px_8px_rgba(244,114,182,0.4)]" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute inset-0 z-10 pointer-events-auto"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Doctors;
import React from 'react'

const Doctors = () => {
  return (
    <div>
      <h1>Our Doctors</h1>
      <p>Meet our team of experienced healthcare professionals.</p>
    </div>
  )
}

export default Doctors
