import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

function BookingReview() {
  const location = useLocation();
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  const booking = location.state;

  if (
    !booking?.tutor ||
    !booking?.selectedDate ||
    !booking?.selectedTime
  ) {
    return (
      <section className="min-h-screen py-12 text-center">
        <h1 className="text-3xl font-bold text-blue-950">
          No booking selected
        </h1>

        <p className="mt-3 text-gray-600">
          Please select a tutor, date and time first.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-block font-semibold text-blue-700 hover:underline"
        >
          Return to Dashboard
        </Link>
      </section>
    );
  }

  const { tutor, selectedDate, selectedTime } = booking;

  function handleConfirmBooking() {
    setMessage(
      "Your selection is ready. We will connect it to MongoDB next."
    );
  }

  return (
    <section className="min-h-screen py-10">
      <Link
        to={`/tutors/${tutor.id}/schedule`}
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Change Date or Time
      </Link>

      <div className="mx-auto mt-8 max-w-2xl">
        <div className="text-center">
          <p className="font-semibold text-orange-700">
            Final Step
          </p>

          <h1 className="mt-2 text-3xl font-bold text-blue-950">
            Review Your Booking
          </h1>

          <p className="mt-2 text-gray-600">
            Confirm that your session details are correct.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
            <img
              src={tutor.image}
              alt={tutor.name}
              className="h-20 w-20 rounded-full object-cover"
            />

            <div>
              <h2 className="text-xl font-bold text-blue-950">
                {tutor.name}
              </h2>

              <p className="text-orange-700">
                {tutor.subject}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Student</span>
              <span className="font-semibold text-blue-950">
                {user.fullName}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Date</span>
              <span className="font-semibold text-blue-950">
                {selectedDate}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Time</span>
              <span className="font-semibold text-blue-950">
                {selectedTime}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Session Type</span>
              <span className="font-semibold text-blue-950">
                In-Person Tutoring
              </span>
            </div>
          </div>

          {message && (
            <p className="mt-6 rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-700">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={handleConfirmBooking}
            className="mt-6 w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </section>
  );
}

export default BookingReview;