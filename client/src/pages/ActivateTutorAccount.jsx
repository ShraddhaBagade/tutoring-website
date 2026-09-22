import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../config/api";
function ActivateTutorAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activated, setActivated] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
         apiUrl("/api/tutors/activate-account"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to activate your tutor account.");
        return;
      }

      setActivated(true);
      setMessage(data.message);
    } catch {
      setMessage("Cannot connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (activated) {
    return (
      <section className="mx-auto max-w-xl py-16">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center shadow-sm">
          <div className="text-5xl">✓</div>

          <h1 className="mt-5 text-3xl font-bold text-blue-950">
            Tutor Account Activated
          </h1>

          <p className="mt-3 leading-7 text-gray-600">
            Your tutor account is ready. You can now log in with your approved
            email address and new password.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-7 rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white hover:bg-blue-900"
          >
            Go to Login
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl py-12">
      <div className="text-center">
        <p className="font-semibold uppercase tracking-wide text-orange-600">
          Approved Tutor
        </p>

        <h1 className="mt-2 text-3xl font-bold text-blue-950">
          Activate Your Tutor Account
        </h1>

        <p className="mt-3 leading-7 text-gray-600">
          Use the email address from your approved tutor application to create
          your password.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div>
          <label
            htmlFor="activation-email"
            className="font-semibold text-blue-950"
          >
            Approved Email Address
          </label>

          <input
            id="activation-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your-email@example.com"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="activation-password"
            className="font-semibold text-blue-950"
          >
            Create Password
          </label>

          <input
            id="activation-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            minLength="8"
            required
            placeholder="At least 8 characters"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="activation-confirm-password"
            className="font-semibold text-blue-950"
          >
            Confirm Password
          </label>

          <input
            id="activation-confirm-password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength="8"
            required
            placeholder="Re-enter your password"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
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
          className="mt-6 w-full rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isSubmitting ? "Activating Account..." : "Activate Tutor Account"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already activated?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-700 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}

export default ActivateTutorAccount;