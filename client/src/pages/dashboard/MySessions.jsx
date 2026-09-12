import { useState } from "react";
import { Link } from "react-router";

function MySessions() {
  const [activeTab, setActiveTab] =
    useState("upcoming");

  const tabs = [
    {
      id: "upcoming",
      label: "Upcoming",
      count: 0,
    },
    {
      id: "completed",
      label: "Completed",
      count: 0,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: 0,
    },
  ];

  const emptyStateContent = {
    upcoming: {
      icon: "📅",
      title: "No upcoming sessions",
      description:
        "You have not scheduled a lesson yet. Find a tutor and book a convenient time.",
    },
    completed: {
      icon: "✅",
      title: "No completed sessions",
      description:
        "Your completed tutoring sessions will appear here.",
    },
    cancelled: {
      icon: "✕",
      title: "No cancelled sessions",
      description:
        "Any sessions you cancel will appear here.",
    },
  };

  const currentEmptyState =
    emptyStateContent[activeTab];

  return (
    <section className="py-10">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-semibold uppercase tracking-wide text-orange-600">
            Your schedule
          </p>

          <h1 className="mt-2 text-3xl font-bold text-blue-950">
            My Sessions
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage all your tutoring sessions.
          </p>
        </div>

        <Link
          to="/dashboard/book"
          className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-900"
        >
          Book New Session +
        </Link>
      </div>

      {/* Session summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Upcoming
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-950">
            0
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-700">
            0
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Cancelled
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-500">
            0
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-200 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(tab.id)
              }
              className={
                activeTab === tab.id
                  ? "whitespace-nowrap border-b-2 border-blue-950 px-5 py-4 font-semibold text-blue-950"
                  : "whitespace-nowrap border-b-2 border-transparent px-5 py-4 font-medium text-gray-500 hover:text-blue-950"
              }
            >
              {tab.label}

              <span
                className={
                  activeTab === tab.id
                    ? "ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-950"
                    : "ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500"
                }
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div className="grid min-h-96 lg:grid-cols-2">
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
              {currentEmptyState.icon}
            </div>

            <h2 className="mt-6 text-2xl font-bold text-blue-950">
              {currentEmptyState.title}
            </h2>

            <p className="mt-3 max-w-md leading-7 text-gray-600">
              {currentEmptyState.description}
            </p>

            {activeTab === "upcoming" && (
              <Link
                to="/dashboard/book"
                className="mt-6 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
              >
                Browse Tutors →
              </Link>
            )}
          </div>

          {/* Booking explanation */}
          <div className="bg-violet-50 p-8 lg:p-10">
            <p className="font-semibold uppercase tracking-wide text-blue-700">
              How it works
            </p>

            <h2 className="mt-2 text-2xl font-bold text-blue-950">
              Book a session in three steps
            </h2>

            <div className="mt-8 space-y-7">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
                  1
                </span>

                <div>
                  <h3 className="font-bold text-blue-950">
                    Choose your tutor
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Find a tutor for the subject you need.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
                  2
                </span>

                <div>
                  <h3 className="font-bold text-blue-950">
                    Select a time
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Choose an available date and time.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
                  3
                </span>

                <div>
                  <h3 className="font-bold text-blue-950">
                    Confirm your session
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Review and confirm the booking details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MySessions;