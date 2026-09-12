import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";

function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rawFirstName = user?.fullName?.split(" ")[0] || "Student";

  const firstName =
    rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1);

  const firstLetter = firstName.charAt(0);

  const navigationItems = [
    {
      name: "Overview",
      path: "/dashboard",
      end: true,
    },
    {
      name: "Subjects",
      path: "/dashboard/subjects",
    },
    {
      name: "Tutors",
      path: "/dashboard/tutors",
    },
    {
      name: "Book Session",
      path: "/dashboard/book",
    },
    {
      name: "My Sessions",
      path: "/dashboard/sessions",
    },
  ];

  function getLinkClasses({ isActive }) {
    return isActive
      ? "text-sm font-semibold text-blue-950"
      : "text-sm font-medium text-gray-600 hover:text-blue-950";
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b Tokens-gray-200 bg-white">
      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex min-h-20 items-center justify-between gap-5">
          <Link
            to="/dashboard"
            className="text-2xl font-bold text-blue-950"
            onClick={closeMobileMenu}>
            EduModern
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-7 lg:flex">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={getLinkClasses}>
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop account area */}
          <div className="ml-auto hidden items-center gap-3 sm:flex">
            <span className="hidden text-sm text-gray-600 md:block">
              Hi, {firstName}
            </span>

            <Link
              to="/dashboard/profile"
              aria-label="Open profile"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-950 font-bold text-white transition hover:bg-blue-900">
              {firstLetter}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle dashboard menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((currentValue) => !currentValue)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-xl text-blue-950 sm:hidden">
            {mobileMenuOpen ? "×" : "☰"}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 sm:hidden">
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-lg bg-blue-50 px-4 py-3 font-semibold text-blue-950"
                      : "rounded-lg px-4 py-3 font-medium text-gray-600 hover:bg-gray-50"
                  }>
                  {item.name}
                </NavLink>
              ))}

              <NavLink
                to="/dashboard/profile"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  isActive
                    ? "rounded-lg bg-blue-50 px-4 py-3 font-semibold text-blue-950"
                    : "rounded-lg px-4 py-3 font-medium text-gray-600 hover:bg-gray-50"
                }>
                Profile
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 rounded-lg bg-red-50 px-4 py-3 text-left font-semibold text-red-700 hover:bg-red-100">
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default DashboardNavbar;
