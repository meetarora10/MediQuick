import homeImg from '../assets/about.svg'

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 flex flex-col items-center justify-center py-16 px-4" id='about'>
      <div className="max-w-7xl w-full mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            About MediQuick
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <img
                src={homeImg}
                alt="Telehealth Illustration"
                className="relative w-full max-w-md h-auto object-contain rounded-2xl shadow-2xl border-4 border-white bg-white/90 transform group-hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 lg:p-10 border border-white/50">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-blue-900 leading-tight">
                Your Health Partner in the Digital Age
              </h3>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                <span className="font-semibold text-blue-700">MediQuick</span> is an innovative platform designed to make healthcare accessible to everyone,
                regardless of location. Our mission is to provide seamless, secure, and compassionate care through modern technology.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Whether you're in a remote area or simply looking for quick access to quality consultation, our system connects patients with certified doctors through real-time video calls, secure messaging, and encrypted health data storage.
              </p>

              {/* Features Section */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-blue-800 mb-4">
                  Our platform includes:
                </h4>
                <div className="grid gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-blue-700">Instant video consultations</span> powered by <span className="font-semibold">Daily.co</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-blue-700">Secure payment integration</span> with <span className="font-semibold">Square</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-blue-700">Real-time transcription</span> using <span className="font-semibold">Deepgram</span> or <span className="font-semibold">Whisper</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-blue-700">Role-based dashboards</span> for patients and doctors
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-blue-700">Encrypted storage</span> of PHI (Protected Health Information)
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 pt-6 border-t border-blue-200">
                <p className="text-lg text-gray-800 italic font-medium">
                  We're committed to building a healthier, more connected future — one consultation at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;