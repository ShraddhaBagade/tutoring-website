import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiUrl } from "../../config/api";

function MySessions() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  useEffect(() => {
    async function getBookings() {
      try {
        const response = await fetch(
           apiUrl("/api/bookings/my-bookings"),
          { credentials: "include" }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to retrieve your sessions.");
          return;
        }

        setSessions(data.bookings);
      } catch {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    getBookings();
  }, []);

  const upcomingSessions = sessions.filter(
    (session) => session.status === "upcoming"
  );
  const completedSessions = sessions.filter(
    (session) => session.status === "completed"
  );
  const cancelledSessions = sessions.filter(
    (session) => session.status === "cancelled"
  );

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: upcomingSessions.length },
    { id: "completed", label: "Completed", count: completedSessions.length },
    { id: "cancelled", label: "Cancelled", count: cancelledSessions.length },
  ];

  const filteredSessions = sessions.filter(
    (session) => session.status === activeTab
  );

  const emptyStateContent = {
    upcoming: {
      icon: "📅",
      title: "No upcoming sessions",
      description: "You have not scheduled a lesson yet. Find a tutor and book a convenient time.",
    },
    completed: {
      icon: "✅",
      title: "No completed sessions",
      description: "Your completed tutoring sessions will appear here.",
    },
    cancelled: {
      icon: "✕",
      title: "No cancelled sessions",
      description: "Any sessions you cancel will appear here.",
    },
  };

  const currentEmptyState = emptyStateContent[activeTab];

  function formatDate(dateValue) {
    return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  async function handleCancelBooking(bookingId) {
    if (!window.confirm("Are you sure you want to cancel this session?")) {
      return;
    }

    setCancellingId(bookingId);
    setError("");

    try {
      const response = await fetch(
         apiUrl("/api/bookings/${bookingId}/cancel"),
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to cancel this session.");
        return;
      }

      setSessions((currentSessions) =>
        currentSessions.map((session) =>
          session._id === bookingId ? data.booking : session
        )
      );
    } catch {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setCancellingId("");
    }
  }

  return (
    <section className="py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-semibold uppercase tracking-wide text-orange-600">
            Your schedule
          </p>
          <h1 className="mt-2 text-3xl font-bold text-blue-950">My Sessions</h1>
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

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="mt-2 text-3xl font-bold text-blue-950">
            {upcomingSessions.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {completedSessions.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="mt-2 text-3xl font-bold text-gray-500">
            {cancelledSessions.length}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-200 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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

        {loading && (
          <div className="flex min-h-72 items-center justify-center p-10 text-center">
            <div>
              <div className="text-3xl">⏳</div>
              <p className="mt-3 font-medium text-gray-600">
                Loading your sessions...
              </p>
            </div>
          </div>
        )}

        {!loading && filteredSessions.length > 0 && (
          <div className="grid gap-5 p-6 lg:grid-cols-2">
            {filteredSessions.map((session) => (
              <article
                key={session._id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {session.tutorImage ? (
                      <img
                        src={session.tutorImage}
                        alt={session.tutorName}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-3xl">👩‍🏫</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-orange-700">
                          {session.subject}
                        </p>
                        <h2 className="mt-1 text-xl font-bold text-blue-950">
                          {session.tutorName}
                        </h2>
                      </div>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-800">
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Date</p>
                    <p className="mt-1 text-sm font-semibold text-blue-950">
                      {formatDate(session.sessionDate)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Time</p>
                    <p className="mt-1 text-sm font-semibold text-blue-950">
                      {session.sessionTime}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Session format
                    </p>
                    <p className="mt-1 text-sm font-semibold text-blue-950">
                      {session.sessionType}
                    </p>
                  </div>
                </div>

                {session.status === "upcoming" && (
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(session._id)}
                    disabled={cancellingId === session._id}
                    className="mt-5 w-full rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cancellingId === session._id
                      ? "Cancelling..."
                      : "Cancel Session"}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}

        {!loading && filteredSessions.length === 0 && (
          <div className="flex min-h-96 flex-col items-center justify-center p-10 text-center">
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
        )}
      </div>
    </section>
  );
}

export default MySessions;
