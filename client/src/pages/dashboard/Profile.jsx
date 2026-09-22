import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { apiUrl } from "../../config/api";

function Profile() {
  const { user } = useAuth();

  const fullName =
    user?.fullName || "Student";

  const email =
    user?.email || "Email unavailable";

  const accountType =
    user?.accountType || "student";

  const firstLetter =
    fullName.charAt(0).toUpperCase();

  return (
    <section className="py-10">
      {/* Heading */}
      <div>
        <p className="font-semibold uppercase tracking-wide text-orange-600">
          Your account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-blue-950">
          Profile
        </h1>

        <p className="mt-2 text-gray-600">
          View your personal information and account details.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Profile summary */}
        <aside className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-blue-950 to-blue-800 p-8 text-center text-white">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white text-4xl font-bold text-blue-950">
              {firstLetter}
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              {fullName}
            </h2>

            <p className="mt-2 capitalize text-blue-200">
              {accountType} account
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Account status
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                Active
              </span>
            </div>

            <Link
              to="/dashboard/sessions"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white hover:bg-blue-900"
            >
              View My Sessions
            </Link>
          </div>
        </aside>

        {/* Account details */}
        <div className="space-y-6 lg:col-span-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-blue-950">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Information associated with your account.
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-xl">
                👤
              </div>
            </div>

            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Full name
                </dt>

                <dd className="mt-2 font-semibold text-blue-950">
                  {fullName}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>

                <dd className="mt-2 break-all font-semibold text-blue-950">
                  {email}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Account type
                </dt>

                <dd className="mt-2 capitalize font-semibold text-blue-950">
                  {accountType}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Account ID
                </dt>

                <dd className="mt-2 break-all text-sm font-semibold text-blue-950">
                  {user?.id || "Unavailable"}
                </dd>
              </div>
            </dl>
          </article>

          {/* Learning section */}
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-blue-950">
                  Learning Dashboard
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Quickly access tutors, subjects, and sessions.
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-3 text-xl">
                📚
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Link
                to="/dashboard/subjects"
                className="rounded-xl border border-gray-200 p-5 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <p className="text-2xl">📖</p>

                <p className="mt-3 font-bold text-blue-950">
                  Subjects
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Explore learning areas
                </p>
              </Link>

              <Link
                to="/dashboard/tutors"
                className="rounded-xl border border-gray-200 p-5 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <p className="text-2xl">👩‍🏫</p>

                <p className="mt-3 font-bold text-blue-950">
                  Tutors
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Find expert support
                </p>
              </Link>

              <Link
                to="/dashboard/sessions"
                className="rounded-xl border border-gray-200 p-5 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <p className="text-2xl">📅</p>

                <p className="mt-3 font-bold text-blue-950">
                  Sessions
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your schedule
                </p>
              </Link>
            </div>
          </article>

          {/* Security */}
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-blue-950">
              Account Security
            </h2>

            <p className="mt-2 text-gray-600">
              Your authentication session is protected using
              a secure HTTP-only cookie.
            </p>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Password changes will be added as a future
              account-management feature.
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Profile;