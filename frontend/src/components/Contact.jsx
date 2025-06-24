function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-[#0e0e12]" id="contact">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            Have a question, suggestion, or need support? We’d love to hear from you.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-white/90 to-[#181824] shadow-lg rounded-2xl p-8 border border-blue-100">
          <form className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" placeholder="Your full name" className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" placeholder="your@email.com" className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" rows="4" placeholder="Type your message here..." className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>

            <div className="text-right">
              <button type="submit" className="inline-flex items-center px-6 py-3 border border-transparent text-white bg-blue-600 hover:bg-blue-700 text-base font-medium rounded-md shadow-sm transition">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;