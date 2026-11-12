export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Path to Energy Independence
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Design Together
            </h3>
            <p className="text-gray-600">
              We work with your community to design the right system
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Build Smart
            </h3>
            <p className="text-gray-600">
              Solar, batteries, and smart meters create your smart grid
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Operate Professionally
            </h3>
            <p className="text-gray-600">
              We handle everything from billing to battery optimization
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">4</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Benefit Locally
            </h3>
            <p className="text-gray-600">
              Lower costs, cleaner energy, community resilience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
