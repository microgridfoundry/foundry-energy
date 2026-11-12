export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            The Foundry
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Helping communities build smart grids across the South-West
          </p>
          <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
            We work with local communities who seek to own and operate local
            renewable energy systems with solar generation, battery storage, and
            smart distribution networks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Get Started
            </a>
            <a
              href="#communities"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-200"
            >
              Our Communities
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
