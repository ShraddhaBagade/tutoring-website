import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
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
    setMessage("Logging in...");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
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

      setUser(data.user);
      setMessage("Login successful!");
      navigate("/dashboard");
    } catch {
      setMessage("Cannot connect to the server.");
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-violet-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-950">EduModern</h1>

          <p className="mt-2 text-gray-600">
            Sign in to your account to continue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl bg-white p-8 shadow-md">
          <div>
            <label htmlFor="login-email" className="font-medium text-blue-950">
              Email Address
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="student@example.com"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="login-password"
              className="font-medium text-blue-950">
              Password
            </label>

            <input
              id="login-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
            Log In
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-700 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
