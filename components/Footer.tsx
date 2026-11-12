export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">The Foundry</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Independent operator of UK energy communities, powered by
              Simtricity Energy Communities platform.
            </p>
            <p className="text-gray-400 text-sm">
              © 2026 MICROGRID FOUNDRY LIMITED, TRADING AS THE FOUNDRY<br />
              Company number 11780032
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#what-we-do"
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/#communities"
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Communities
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            Powered by{" "}
            <a
              href="https://simtricity.ai"
              className="text-blue-400 hover:text-blue-300 transition duration-200"
            >
              Simtricity Energy Communities platform
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
