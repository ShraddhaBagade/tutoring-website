import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const rawFirstName = user?.fullName?.split(" ")[0] || "Student";

  const firstName =
    rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1);

  const firstLetter = firstName.charAt(0);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-950">
          EduModern
        </Link>

        <div className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
          <a href="/dashboard#tutors" className="hover:text-blue-950">
            Find Tutors
          </a>

          <a href="/dashboard#sessions" className="hover:text-blue-950">
            My Sessions
          </a>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-600 sm:block">
            Hi, {firstName}
          </span>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
            {firstLetter}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default DashboardNavbar;
