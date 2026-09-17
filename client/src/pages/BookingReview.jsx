import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

function BookingReview() {
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    tutor,
    selectedDate,
    selectedTime,
    sessionType = "Online",
  } = location.state || {};

  if (!tutor || !selectedDate || !selectedTime) {
    return (
      <section className="py-20 text-center">
        <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
          <div className="text-4xl">📅</div>

          <h1 className="mt-4 text-2xl font-bold text-blue-950">
            No booking selected
          </h1>

          <p className="mt-3 text-gray-600">
            Choose a tutor, date, and time before reviewing your booking.
          </p>

          <Link
            to="/dashboard/book"
            className="mt-6 inline-flex rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white hover:bg-blue-900">
            Start a Booking
          </Link>
        </div>
      </section>
    );
  }

  const formattedDate = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  async function handleConfirmBooking() {
    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          tutorId: tutor.id,
          tutorName: tutor.name,
          tutorImage: tutor.image,
          subject: tutor.subject,
          sessionType,
          sessionDate: selectedDate,
          sessionTime: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "The booking could not be confirmed.");
        setMessageType("error");
        return;
      }

      setMessage("Your session has been booked successfully!");
      setMessageType("success");

      navigate("/dashboard/sessions", {
        state: {
          bookingCreated: true,
          booking: data.booking,
        },
      });
    } catch {
      setMessage(
        "Cannot connect to the server. Make sure the backend is running.",
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-10">
      {/* Progress */}
      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-3">
        <div className="flex items-center gap-3 opacity-60">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
            ✓
          </span>

          <div>
            <p className="font-semibold text-blue-950">Choose Tutor</p>

            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-3 opacity-60">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
            ✓
          </span>

          <div>
            <p className="font-semibold text-blue-950">Select Time</p>

            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
            3
          </span>

          <div>
            <p className="font-semibold text-blue-950">Review</p>

            <p className="text-sm text-blue-700">Current step</p>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="mt-10">
        <p className="font-semibold uppercase tracking-wide text-orange-600">
          Final step
        </p>

        <h1 className="mt-2 text-3xl font-bold text-blue-950">
          Review Your Booking
        </h1>

        <p className="mt-2 text-gray-600">
          Confirm that the tutor and schedule details are correct.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Booking details */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2 md:p-8">
          <h2 className="text-xl font-bold text-blue-950">Session Details</h2>

          <div className="mt-6 flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
            <img
              src={tutor.image}
              alt={`${tutor.name}, ${tutor.subject} tutor`}
              className="h-24 w-24 rounded-2xl object-cover"
            />

            <div>
              <p className="text-sm font-semibold text-orange-700">
                {tutor.subject}
              </p>

              <h3 className="mt-1 text-xl font-bold text-blue-950">
                {tutor.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {tutor.experience} of experience
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <dt className="text-sm text-gray-500">Session date</dt>

              <dd className="mt-2 font-bold text-blue-950">{formattedDate}</dd>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <dt className="text-sm text-gray-500">Session time</dt>

              <dd className="mt-2 font-bold text-blue-950">{selectedTime}</dd>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <dt className="text-sm text-gray-500">Session type</dt>

              <dd className="mt-2 font-bold text-blue-950">{sessionType}</dd>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <dt className="text-sm text-gray-500">Status</dt>

              <dd className="mt-2 font-bold text-orange-700">
                Awaiting confirmation
              </dd>
            </div>
          </dl>

          {message && (
            <div
              className={
                messageType === "error"
                  ? "mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                  : "mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
              }>
              {message}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
              ← Change Schedule
            </button>

            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400">
              {isSubmitting ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl bg-blue-950 p-6 text-white shadow-sm">
          <p className="font-semibold text-orange-200">Booking Summary</p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm text-blue-200">Tutor</p>

              <p className="mt-1 font-semibold">{tutor.name}</p>
            </div>

            <div>
              <p className="text-sm text-blue-200">Subject</p>

              <p className="mt-1 font-semibold">{tutor.subject}</p>
            </div>

            <div>
              <p className="text-sm text-blue-200">Date</p>

              <p className="mt-1 font-semibold">{formattedDate}</p>
            </div>

            <div>
              <p className="text-sm text-blue-200">Time</p>

              <p className="mt-1 font-semibold">{selectedTime}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm leading-6 text-blue-200">
              Your selected session will be saved securely after you confirm the
              booking.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default BookingReview;
