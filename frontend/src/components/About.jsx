import homeImg from '../assets/about.svg'

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 flex flex-col items-center justify-center py-10" id='about'>
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center gap-22">
        <div className="flex-1 flex justify-center mb-8 md:mb-0">
          <img
            src={homeImg}
            alt="Telehealth Illustration"
            className="w-auto h-100 object-contain rounded-2xl shadow-2xl border-4 border-blue-100 bg-white/70"
          />
        </div>
        <div className="flex-1 bg-white/80 rounded-2xl shadow-xl p-8 md:p-14">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center md:text-left drop-shadow-lg">
            About Our Telehealth Platform
          </h1>
          <p className="text-lg text-gray-700 mb-4 text-center md:text-left">
            <span className="font-semibold text-blue-700">MediQuick</span> is an innovative platform designed to make healthcare accessible to everyone,
            regardless of location. Our mission is to provide seamless, secure, and compassionate care through modern technology.
          </p>
          <p className="text-lg text-gray-700 mb-4 text-center md:text-left">
            Whether you're in a remote area or simply looking for quick access to quality consultation, our system connects patients with certified doctors through real-time video calls, secure messaging, and encrypted health data storage.
          </p>
          <div className="mb-6">
            <p className="text-lg text-blue-800 font-semibold mb-2 text-center md:text-left">
              Our platform includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
              <li>
                <span className="font-medium text-blue-700">Instant video consultations</span> powered by <span className="font-semibold">Daily.co</span>
              </li>
              <li>
                <span className="font-medium text-blue-700">Secure payment integration</span> with <span className="font-semibold">Square</span>
              </li>
              <li>
                <span className="font-medium text-blue-700">Real-time transcription</span> using <span className="font-semibold">Deepgram</span> or <span className="font-semibold">Whisper</span>
              </li>
              <li>
                <span className="font-medium text-blue-700">Role-based dashboards</span> for patients and doctors
              </li>
              <li>
                <span className="font-medium text-blue-700">Encrypted storage</span> of PHI (Protected Health Information)
              </li>
            </ul>
          </div>
          <p className="text-lg text-gray-800 text-center md:text-left italic">
            We’re committed to building a healthier, more connected future — one consultation at a time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;