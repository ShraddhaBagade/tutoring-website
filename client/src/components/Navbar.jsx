import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gray-100 px-6 py-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-blue-950">
          EduModern
        </Link>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <a href="/#subjects" className="hover:text-amber-900">
            Subjects
          </a>

          <a href="/#tutors" className="hover:text-amber-900">
            Tutors
          </a>

          <a href="/#why-us" className="hover:text-amber-900">
            Why Us
          </a>

          <a href="/#testimonials" className="hover:text-amber-900">
            Testimonials
          </a>

          <a href="/#contact" className="hover:text-amber-900">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-3">
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
      </div>
    </nav>
  );
}

export default Navbar;

/*difference between Link to and a href*/

/*sticky top-0 --	Keeps the navbar at the top while scrolling

z-50 --	Keeps it above the page content

scroll-mt-48 ---	Leaves space above a section so the navbar doesn’t cover its heading

py-16	--- Adds vertical space inside each section*/
