import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import tutors from "../data/tutors";
import { Link } from "react-router";
function Dashboard() {
  const { user } = useAuth();

  const rawFirstName = user?.fullName?.split(" ")[0] || "Student";

  const firstName =
    rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1);

  const [selectedSubject, setSelectedSubject] = useState("All");

  const subjects = [
    "All",
    "Mathematics",
    "Science",
    "Social Studies",
    "Computer Skills",
    "English",
  ];

  const filteredTutors =
    selectedSubject === "All"
      ? tutors
      : tutors.filter((tutor) => tutor.subject === selectedSubject);

  return (
    <div className="min-h-screen py-8 md:py-10">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 px-7 py-10 text-white shadow-xl md:px-10 md:py-12">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/20" />

        <div className="absolute -bottom-24 right-28 h-52 w-52 rounded-full bg-orange-400/10" />

        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-orange-200">
              Student Dashboard
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Welcome back, {firstName}!
            </h1>

            <p className="mt-4 max-w-xl text-blue-100">
              Find an experienced tutor, explore available times and schedule
              your next learning session.
            </p>
          </div>

          <a
            href="#tutors"
            className="inline-flex w-fit items-center justify-center rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600">
            Find a Tutor
            <span className="ml-2">→</span>
          </a>
        </div>
      </section>

      {/* Overview cards */}
      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming sessions */}
        <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Upcoming Sessions
              </p>

              <p className="mt-3 text-4xl font-bold text-blue-950">0</p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              📅
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            You have no upcoming sessions.
          </p>

          <a
            href="#tutors"
            className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline">
            Schedule a session →
          </a>
        </article>

        {/* Available tutors */}
        <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Available Tutors
              </p>

              <p className="mt-3 text-4xl font-bold text-blue-950">
                {tutors.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              👩‍🏫
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Experienced tutors ready to help.
          </p>

          <a
            href="#tutors"
            className="mt-3 inline-block text-sm font-semibold text-orange-700 hover:underline">
            Browse tutors →
          </a>
        </article>

        {/* Subjects */}
        <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Subjects Available
              </p>

              <p className="mt-3 text-4xl font-bold text-blue-950">
                {subjects.length - 1}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl">
              📚
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Personalized support across key subjects.
          </p>

          <a
            href="#tutors"
            className="mt-3 inline-block text-sm font-semibold text-violet-700 hover:underline">
            Explore subjects →
          </a>
        </article>
      </section>

      {/* Find a Tutor section */}
      <section id="tutors" className="scroll-mt-28 py-14">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              Expert Guidance
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-950">
              Find the Right Tutor
            </h2>

            <p className="mt-2 max-w-xl text-slate-600">
              Browse experienced tutors and choose an available session that
              fits your schedule.
            </p>
          </div>

          <p className="text-sm font-medium text-slate-500">
            {filteredTutors.length}{" "}
            {filteredTutors.length === 1 ? "tutor" : "tutors"} found
          </p>
        </div>

        {/* Subject filters */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => setSelectedSubject(subject)}
              className={
                selectedSubject === subject
                  ? "shrink-0 rounded-full bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
                  : "shrink-0 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-950 hover:text-blue-950"
              }>
              {subject}
            </button>
          ))}
        </div>

        {/* Tutor cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTutors.map((tutor) => (
            <article
              key={tutor.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              {/* Tutor photograph */}
              <div className="relative overflow-hidden">
                <img
                  src={tutor.image}
                  alt={`${tutor.name}, ${tutor.subject} tutor`}
                  className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-green-700 shadow">
                  ● Available
                </span>

                <span className="absolute bottom-4 left-4 rounded-full bg-blue-950/90 px-3 py-1 text-xs font-semibold text-white">
                  {tutor.subject}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-blue-950">
                      {tutor.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {tutor.experience} of experience
                    </p>
                  </div>

                  <div className="rounded-lg bg-orange-50 px-2.5 py-1 text-sm font-bold text-orange-700">
                    ★ 4.9
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-blue-950">
                      Next available
                    </p>

                    <p className="text-xs font-medium text-green-700">
                      {tutor.nextAvailable}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {tutor.times.slice(0, 3).map((time) => (
                      <span
                        key={time}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/tutors/${tutor.id}/schedule`}
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700">
                  View Schedule
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredTutors.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-blue-950">
              No tutors found
            </p>

            <p className="mt-2 text-slate-500">
              Try selecting another subject.
            </p>
          </div>
        )}
      </section>

      {/* My Sessions section */}
      <section
        id="sessions"
        className="scroll-mt-28 border-t border-slate-200 py-14">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              Your Schedule
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-950">
              My Sessions
            </h2>

            <p className="mt-2 text-slate-600">
              View and manage your upcoming tutoring sessions.
            </p>
          </div>

          <a
            href="#tutors"
            className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-900">
            Book New Session
            <span className="ml-2">+</span>
          </a>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-2">
            {/* Empty state */}
            <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-4xl">
                📅
              </div>

              <h3 className="mt-6 text-2xl font-bold text-blue-950">
                No upcoming sessions
              </h3>

              <p className="mt-3 max-w-sm text-slate-500">
                You haven’t scheduled a lesson yet. Find a tutor and book a time
                that works for you.
              </p>

              <a
                href="#tutors"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700">
                Browse Tutors
                <span className="ml-2">→</span>
              </a>
            </div>

            {/* How booking works */}
            <div className="bg-gradient-to-br from-violet-50 to-blue-50 px-8 py-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                How It Works
              </p>

              <h3 className="mt-2 text-2xl font-bold text-blue-950">
                Book a session in three steps
              </h3>

              <div className="mt-7 space-y-6">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
                    1
                  </span>

                  <div>
                    <h4 className="font-bold text-blue-950">
                      Choose your tutor
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Filter tutors by the subject you need.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
                    2
                  </span>

                  <div>
                    <h4 className="font-bold text-blue-950">Select a time</h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose a convenient date and available time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
                    3
                  </span>

                  <div>
                    <h4 className="font-bold text-blue-950">
                      Confirm the session
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Review the details and confirm your booking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
