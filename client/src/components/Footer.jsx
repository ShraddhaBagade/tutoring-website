import { Link } from "react-router";

function Footer() {
  return (
    <footer className="bg-blue-950 px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {/* Website information */}
        <div>
          <Link to="/" className="text-2xl font-bold">
            EduModern
          </Link>

          <p className="mt-3 text-sm text-gray-300">
            Personalized, face-to-face tutoring that helps students
            learn with confidence.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="font-bold">Quick Links</h2>

          <div className="mt-3 flex flex-col gap-2 text-sm text-gray-300">
            <a href="/#subjects" className="hover:text-white">
              Subjects
            </a>

            <a href="/#tutors" className="hover:text-white">
              Tutors
            </a>

            <a href="/#why-us" className="hover:text-white">
              Why Us
            </a>

            <a href="/#testimonials" className="hover:text-white">
              Testimonials
            </a>

            <a href="/#contact" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>

        {/* Contact details */}
        <div>
          <h2 className="font-bold">Contact Us</h2>

          <div className="mt-3 space-y-2 text-sm text-gray-300">
            <p>Edison, New Jersey</p>

            <a
              href="mailto:hello@edumodern.com"
              className="block hover:text-white"
            >
              hello@edumodern.com
            </a>

            <a
              href="tel:+17325550123"
              className="block hover:text-white"
            >
              (732) 555-0123
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-8 max-w-6xl border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} EduModern. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;