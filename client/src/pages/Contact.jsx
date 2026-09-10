import { useState } from "react";

function Contact() {
  const [messageSent, setMessageSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setMessageSent(true);
  }

  return (
    <div className="rounded-xl bg-violet-50 px-6 py-12">
      {/* Section heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-950">
          Contact Us
        </h2>

        <p className="mt-3 text-gray-600">
          Have a question? Send us a message and we’ll get back to you.
        </p>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {/* Contact information */}
        <div>
          <h3 className="text-2xl font-bold text-blue-950">
            Get in Touch
          </h3>

          <p className="mt-4 text-gray-600">
            Contact us to learn more about our tutors, subjects,
            availability, and in-person tutoring sessions.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <h4 className="font-bold text-blue-950">Email</h4>
              <a
                href="mailto:hello@edumodern.com"
                className="text-gray-600 hover:text-amber-900"
              >
                hello@edumodern.com
              </a>
            </div>

            <div>
              <h4 className="font-bold text-blue-950">Phone</h4>
              <a
                href="tel:+17325550123"
                className="text-gray-600 hover:text-amber-900"
              >
                (732) 555-0123
              </a>
            </div>

            <div>
              <h4 className="font-bold text-blue-950">Location</h4>
              <p className="text-gray-600">
                Edison, New Jersey
              </p>
            </div>

            <div>
              <h4 className="font-bold text-blue-950">Hours</h4>
              <p className="text-gray-600">
                Monday–Friday: 3:00 PM–8:00 PM
              </p>
              <p className="text-gray-600">
                Saturday–Sunday: 9:00 AM–5:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="contact-name"
              className="font-medium text-blue-950"
            >
              Name
            </label>

            <input
              id="contact-name"
              type="text"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
              placeholder="Enter your name"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="contact-email"
              className="font-medium text-blue-950"
            >
              Email
            </label>

            <input
              id="contact-email"
              type="email"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
              placeholder="Enter your email"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="contact-message"
              className="font-medium text-blue-950"
            >
              Message
            </label>

            <textarea
              id="contact-message"
              rows="5"
              required
              className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
              placeholder="How can we help you?"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-amber-950 px-6 py-3 font-semibold text-white hover:bg-amber-900"
          >
            Send Message
          </button>

          {messageSent && (
            <p className="mt-4 text-center font-medium text-green-700">
              Thank you! Your message has been received.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Contact;