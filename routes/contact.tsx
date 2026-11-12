import { PageProps } from "fresh";
import Nav from "../components/Nav.tsx";
import Footer from "../components/Footer.tsx";
import ContactForm from "../islands/ContactForm.tsx";

export default function ContactPage(_props: PageProps) {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-24 pb-8">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-red-600 font-semibold uppercase tracking-wider mb-4">
                GET IN TOUCH
              </p>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                We'd love to hear from you
              </h1>
              <p className="text-xl text-gray-600">
                If you are interested in finding out more we'd love to speak to
                you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {/* Map */}
              <div className="bg-gray-100 rounded-lg overflow-hidden h-[600px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2486.115673119996!2d-2.549885084261516!3d51.45645097962549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48718e7a6e2d5c9f%3A0x3d7a3f3f3f3f3f3f!2sEaston%20Business%20Centre%2C%20Felix%20Rd%2C%20Easton%2C%20Bristol%20BS5%200HE!5e0!3m2!1sen!2suk!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="The Foundry Location"
                  className="w-full h-full"
                >
                </iframe>
              </div>

              {/* Contact Information and Form */}
              <div className="space-y-8">
                {/* Address Section */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Head Office & Operations
                  </h2>
                  <p className="text-blue-600 text-lg">
                    Unit 21a, Easton Business Centre, Felix Road, Easton,
                    Bristol, BS5 0HE
                  </p>
                </div>

                {/* Contact Form */}
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
