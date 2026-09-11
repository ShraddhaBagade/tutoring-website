import { useState } from "react";
import { Link, useNavigate } from "react-router";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountType: "student",
    fullName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("Creating account...");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Account created successfully!");
      navigate("/login");
    } catch {
      setMessage("Cannot connect to the server.");
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-violet-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-950">EduModern</h1>

          <p className="mt-2 text-gray-600">Join our learning community.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl bg-white p-8 shadow-md">
          <p className="font-medium text-blue-950">I am joining as a:</p>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  accountType: "student",
                })
              }
              className={
                formData.accountType === "student"
                  ? "rounded-lg border-2 border-blue-600 bg-blue-50 p-4 font-semibold text-blue-950"
                  : "rounded-lg border border-gray-300 p-4 text-gray-600"
              }>
              Student
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  accountType: "parent",
                })
              }
              className={
                formData.accountType === "parent"
                  ? "rounded-lg border-2 border-blue-600 bg-blue-50 p-4 font-semibold text-blue-950"
                  : "rounded-lg border border-gray-300 p-4 text-gray-600"
              }>
              Parent
            </button>
          </div>

          <div className="mt-5">
            <label htmlFor="signup-name" className="font-medium text-blue-950">
              Full Name
            </label>

            <input
              id="signup-name"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Jane Doe"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="signup-email" className="font-medium text-blue-950">
              Email Address
            </label>

            <input
              id="signup-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="jane@example.com"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="signup-password"
              className="font-medium text-blue-950">
              Password
            </label>

            <input
              id="signup-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Enter at least 8 characters"
            />

            <p className="mt-1 text-sm text-gray-500">
              Must be at least 8 characters long.
            </p>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
            Create Account
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-700 hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Signup;
