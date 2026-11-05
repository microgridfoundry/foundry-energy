import { useState } from "preact/hooks";

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className = "" }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enquiry: "",
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const form = e.target as HTMLFormElement;
      const formDataToSend = new FormData(form);

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        // Reset form
        setFormData({ name: "", email: "", enquiry: "" });
        form.reset();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        type: "error",
        text:
          "Failed to send message. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  return (
    <div class={className}>
      <h3 class="text-2xl font-bold text-gray-900 mb-6">
        Contact us now
      </h3>

      {message && (
        <div
          class={`mb-6 p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
          role="alert"
        >
          <div class="flex items-start">
            <span class="text-xl mr-2">
              {message.type === "success" ? "✓" : "⚠"}
            </span>
            <p class="flex-1">{message.text}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} class="space-y-4">
        {/* Honeypot field - hidden from users but visible to bots */}
        <div class="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autocomplete="off"
          />
        </div>

        <div>
          <label htmlFor="name" class="sr-only">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onInput={handleInputChange}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Name"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" class="sr-only">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onInput={handleInputChange}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Email"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="enquiry" class="sr-only">Enquiry</label>
          <textarea
            id="enquiry"
            name="enquiry"
            rows={6}
            value={formData.enquiry}
            onInput={handleInputChange}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            placeholder="Enquiry"
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          class={`bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition duration-200 ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-yellow-600"
          }`}
        >
          {isSubmitting
            ? (
              <span class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </span>
            )
            : (
              "Send"
            )}
        </button>

        <p class="text-xs text-gray-500 mt-4">
          By submitting this form, you agree to our privacy policy. We'll only
          use your information to respond to your enquiry.
        </p>
      </form>
    </div>
  );
}
