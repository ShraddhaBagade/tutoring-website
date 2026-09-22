import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, authLoading, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-violet-50">
      <nav className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-6 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-950">
          EduModern
        </Link>

        {/* Landing page links */}
        <div className="hidden items-center gap-7 text-sm text-gray-700 md:flex">
          <a href="/#subjects" className="hover:text-blue-950">
            Subjects
          </a>

          <a href="/#tutors" className="hover:text-blue-950">
            Tutors
          </a>

          <a href="/#why-us" className="hover:text-blue-950">
            Why Us
          </a>

          <a href="/#testimonials" className="hover:text-blue-950">
            Testimonials
          </a>

          <a href="/#contact" className="hover:text-blue-950">
            Contact
          </a>
        </div>

        {/* Authentication buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link
            to="/become-a-tutor"
            className="text-sm font-semibold text-blue-950 hover:text-orange-600">
            Become a Tutor
          </Link>

          <Link
            to="/login"
            className="rounded-full border border-amber-950 px-5 py-2 text-amber-950 hover:bg-amber-50">
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-full bg-amber-950 px-5 py-2 text-white hover:bg-amber-900">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
