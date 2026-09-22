import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiUrl } from "../../config/api";

function TutorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingBookingId, setUpdatingBookingId] = useState("");

  useEffect(() => {
    async function getTutorBookings() {
      try {
        const response = await fetch(
           apiUrl("/api/bookings/tutor-bookings"),
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load your sessions.");
          return;
        }

        setBookings(data.bookings || []);
      } catch {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    getTutorBookings();
  }, []);

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "upcoming"
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  async function handleCompleteBooking(bookingId) {
    const shouldComplete = window.confirm(
      "Mark this session as completed? Only do this after the lesson has taken place."
    );

    if (!shouldComplete) {
      return;
    }

    setUpdatingBookingId(bookingId);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
         apiUrl("/api/bookings/tutor-bookings/${bookingId}/complete"),
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to update this session.");
        return;
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId ? data.booking : booking
        )
      );

      setMessage(data.message);
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setUpdatingBookingId("");
    }
  }

  async function handleCancelBooking(bookingId) {
    const cancellationReason = window.prompt(
      "Why are you cancelling this session? This message will be visible to the student."
    );

    if (cancellationReason === null) {
      return;
    }

    setUpdatingBookingId(bookingId);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
         apiUrl("/api/bookings/tutor-bookings/${bookingId}/cancel"),
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cancellationReason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to cancel this session.");
        return;
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId ? data.booking : booking
        )
      );

      setMessage(data.message);
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setUpdatingBookingId("");
    }
  }

  return (
    <section className="py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-semibold uppercase tracking-wide text-orange-600">
            Tutor workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-blue-950">
            Tutor Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            View your scheduled lessons and manage your availability.
          </p>
        </div>

        <Link
          to="/dashboard/tutor/availability"
          className="inline-flex w-fit rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white hover:bg-blue-900"
        >
          Manage Availability
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Upcoming sessions</p>

          <p className="mt-2 text-3xl font-bold text-blue-950">
            {upcomingBookings.length}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Lessons scheduled with students.
          </p>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Completed sessions</p>

          <p className="mt-2 text-3xl font-bold text-green-700">
            {completedBookings.length}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Lessons you have confirmed as complete.
          </p>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Availability</p>

          <p className="mt-2 text-xl font-bold text-green-700">Active</p>

          <Link
            to="/dashboard/tutor/availability"
            className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline"
          >
            Update schedule →
          </Link>
        </article>
      </div>

      {message && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 font-medium text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-blue-950">
            Upcoming Sessions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Confirm completed lessons or cancel a session when necessary.
          </p>
        </div>

        {loading && (
          <div className="p-10 text-center text-gray-600">
            Loading your sessions...
          </div>
        )}

        {!loading && !error && upcomingBookings.length === 0 && (
          <div className="p-10 text-center">
            <div className="text-4xl">📅</div>

            <h3 className="mt-4 text-xl font-bold text-blue-950">
              No upcoming sessions yet
            </h3>

            <p className="mt-2 text-gray-600">
              When students book with you, their sessions will appear here.
            </p>
          </div>
        )}

        {!loading && upcomingBookings.length > 0 && (
          <div className="divide-y divide-gray-100">
            {upcomingBookings.map((booking) => {
              const isUpdating = updatingBookingId === booking._id;

              return (
                <article
                  key={booking._id}
                  className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <p className="font-bold text-blue-950">
                      {booking.student?.fullName || "Student"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {booking.student?.email || "Student email unavailable"}
                    </p>

                    <p className="mt-3 text-sm font-semibold text-orange-700">
                      {booking.subject}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="rounded-xl bg-slate-50 px-5 py-4 sm:text-right">
                      <p className="font-bold text-blue-950">
                        {formatDate(booking.sessionDate)}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {booking.sessionTime} · One-to-one session
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleCompleteBooking(booking._id)}
                        className="rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {isUpdating ? "Updating..." : "Mark Completed"}
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleCancelBooking(booking._id)}
                        className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default TutorDashboard;