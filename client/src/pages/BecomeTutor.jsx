import { useState } from "react";
import { Link } from "react-router";
import { apiUrl } from "../config/api";

function BecomeTutor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    experience: "",
    bio: "",
    image: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        apiUrl("/api/tutors/apply"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to submit your application.");
        return;
      }

      setSubmitted(true);
      setMessage(data.message);

      setFormData({
        name: "",
        email: "",
        subject: "",
        experience: "",
        bio: "",
        image: "",
      });
    } catch {
      setMessage("Cannot connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-2xl py-16">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center shadow-sm">
          <div className="text-5xl">✓</div>

          <h1 className="mt-5 text-3xl font-bold text-blue-950">
            Application Submitted
          </h1>

          <p className="mt-3 leading-7 text-gray-600">
            Your tutor application is pending review. Once approved, your
            profile can appear in the EduModern tutor directory.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white hover:bg-blue-900"
          >
            Return to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl py-12">
      <div className="text-center">
        <p className="font-semibold uppercase tracking-wide text-orange-600">
          Teach with EduModern
        </p>

        <h1 className="mt-2 text-3xl font-bold text-blue-950">
          Become a Tutor
        </h1>

        <p className="mt-3 leading-7 text-gray-600">
          Submit your details to apply as an EduModern tutor. Your profile will
          be reviewed before it becomes visible to students.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="tutor-name"
              className="font-semibold text-blue-950"
            >
              Full Name
            </label>

            <input
              id="tutor-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Alex Morgan"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="tutor-email"
              className="font-semibold text-blue-950"
            >
              Email Address
            </label>

            <input
              id="tutor-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="alex@example.com"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="tutor-subject"
              className="font-semibold text-blue-950"
            >
              Main Subject
            </label>

            <select
              id="tutor-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select a subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Computer Skills">Computer Skills</option>
              <option value="English">English</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="tutor-experience"
              className="font-semibold text-blue-950"
            >
              Experience
            </label>

            <input
              id="tutor-experience"
              name="experience"
              type="text"
              value={formData.experience}
              onChange={handleChange}
              required
              placeholder="For example: 4 years"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="tutor-image"
            className="font-semibold text-blue-950"
          >
            Profile Image URL
          </label>

          <input
            id="tutor-image"
            name="image"
            type="text"
            value={formData.image}
            onChange={handleChange}
            required
            placeholder="https://example.com/your-profile-photo.jpg"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-sm text-gray-500">
            Image upload will be added later. For now, paste a public image URL.
          </p>
        </div>

        <div className="mt-5">
          <label
            htmlFor="tutor-bio"
            className="font-semibold text-blue-950"
          >
            Short Introduction
          </label>

          <textarea
            id="tutor-bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="5"
            placeholder="Tell students about your teaching experience and approach."
            className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {message && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isSubmitting ? "Submitting Application..." : "Submit Application"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already a student?{" "}
          <Link to="/login" className="font-semibold text-blue-700 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}

export default BecomeTutor;