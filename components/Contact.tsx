export default function Contact() {
  return (
    <div id="contact" className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to build your energy community?
          </h2>
          <p className="text-xl text-yellow-300 mb-10 max-w-3xl mx-auto">
            Book a demo to see how our platform can help you create, manage, and
            grow a successful energy community
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-yellow-400 text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-300 transition duration-200"
            >
              Get Started
            </a>
            <a
              href="https://simtricity.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
