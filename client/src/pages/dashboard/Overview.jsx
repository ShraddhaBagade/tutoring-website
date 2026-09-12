import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import tutors from "../../data/tutors";

function Overview() {
  const { user } = useAuth();

  const rawFirstName =
    user?.fullName?.split(" ")[0] || "Student";

  const firstName =
    rawFirstName.charAt(0).toUpperCase() +
    rawFirstName.slice(1);

  const recommendedTutors = tutors.slice(0, 3);

  const subjectsCount = new Set(
    tutors.map((tutor) => tutor.subject)
  ).size;

  return (
    <div className="py-10">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 to-blue-800 px-8 py-12 text-white shadow-lg md:px-12">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/30" />

        <div className="absolute -bottom-28 right-52 h-56 w-56 rounded-full bg-orange-300/20" />

        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-orange-200">
              Student Dashboard
            </p>

            <h1 className="mt-6 text-3xl font-bold md:text-4xl">
              Welcome back, {firstName}!
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-blue-100">
              Find an experienced tutor, choose an available
              time, and continue building your confidence.
            </p>
          </div>

          <Link
            to="/dashboard/tutors"
            className="inline-flex w-fit items-center justify-center rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-orange-700"
          >
            Find a Tutor →
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-500">
                Upcoming Sessions
              </p>

              <p className="mt-3 text-4xl font-bold text-blue-950">
                0
              </p>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-2xl">
              📅
            </div>
          </div>

          <Link
            to="/dashboard/sessions"
            className="mt-6 inline-block font-semibold text-blue-700 hover:underline"
          >
            View sessions →
          </Link>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-500">
                Available Tutors
              </p>

              <p className="mt-3 text-4xl font-bold text-blue-950">
                {tutors.length}
              </p>
            </div>

            <div className="rounded-xl bg-orange-100 p-3 text-2xl">
              👩‍🏫
            </div>
          </div>

          <Link
            to="/dashboard/tutors"
            className="mt-6 inline-block font-semibold text-orange-700 hover:underline"
          >
            Browse tutors →
          </Link>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-500">
                Subjects Available
              </p>

              <p className="mt-3 text-4xl font-bold text-blue-950">
                {subjectsCount}
              </p>
            </div>

            <div className="rounded-xl bg-purple-100 p-3 text-2xl">
              📚
            </div>
          </div>

          <Link
            to="/dashboard/subjects"
            className="mt-6 inline-block font-semibold text-purple-700 hover:underline"
          >
            Explore subjects →
          </Link>
        </article>
      </section>

      {/* Main dashboard content */}
      <section className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Recommended tutors */}
        <div className="lg:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-semibold uppercase tracking-wide text-orange-600">
                Recommended for you
              </p>

              <h2 className="mt-2 text-2xl font-bold text-blue-950">
                Popular Tutors
              </h2>
            </div>

            <Link
              to="/dashboard/tutors"
              className="text-sm font-semibold text-blue-700 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {recommendedTutors.map((tutor) => (
              <article
                key={tutor.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img
                  src={tutor.image}
                  alt={`${tutor.name}, ${tutor.subject} tutor`}
                  className="h-44 w-full object-cover"
                />

                <div className="p-5">
                  <p className="text-sm font-semibold text-orange-700">
                    {tutor.subject}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-blue-950">
                    {tutor.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {tutor.experience} of experience
                  </p>

                  <Link
                    to={`/dashboard/tutors/${tutor.id}/schedule`}
                    className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
                  >
                    View schedule →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Next session */}
        <aside>
          <p className="font-semibold uppercase tracking-wide text-orange-600">
            Your schedule
          </p>

          <h2 className="mt-2 text-2xl font-bold text-blue-950">
            Next Session
          </h2>

          <div className="mt-5 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-2xl">
              📅
            </div>

            <h3 className="mt-5 text-lg font-bold text-blue-950">
              No session scheduled
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Book a session and your next lesson will
              appear here.
            </p>

            <Link
              to="/dashboard/tutors"
              className="mt-6 rounded-lg bg-blue-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900"
            >
              Book a Session
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Overview;