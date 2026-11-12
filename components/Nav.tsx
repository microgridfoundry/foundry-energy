export default function Nav() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                The Foundry
              </span>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/#communities"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Our Communities
            </a>
            <a
              href="/#what-we-do"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              What We Do
            </a>
            <a
              href="/contact"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Contact
            </a>
            <a
              href="/contact"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
