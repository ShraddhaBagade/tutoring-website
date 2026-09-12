import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import tutors from "../data/tutors";

function TutorSchedule() {
  const { tutorId } = useParams();
  const navigate = useNavigate();

  const tutor = tutors.find(
    (item) => item.id === Number(tutorId)
  );

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedTime, setSelectedTime] =
    useState("");

  const today = new Date()
    .toISOString()
    .split("T")[0];

  if (!tutor) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-3xl font-bold text-blue-950">
          Tutor not found
        </h1>

        <p className="mt-3 text-gray-600">
          This tutor may no longer be available.
        </p>

        <Link
          to="/dashboard/tutors"
          className="mt-6 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Return to Tutors
        </Link>
      </section>
    );
  }

  function handleContinue() {
    if (!selectedDate || !selectedTime) {
      return;
    }

    navigate("/dashboard/booking/review", {
      state: {
        tutor,
        selectedDate,
        selectedTime,
      },
    });
  }

  function formatSelectedDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    return new Date(
      `${dateValue}T00:00:00`
    ).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <section className="py-10">
      <Link
        to="/dashboard/tutors"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to Tutors
      </Link>

      {/* Booking progress */}
      <div className="mt-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-3">
        <div className="flex items-center gap-3 opacity-60">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
            ✓
          </span>

          <div>
            <p className="font-semibold text-blue-950">
              Choose Tutor
            </p>

            <p className="text-sm text-gray-500">
              Completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
            2
          </span>

          <div>
            <p className="font-semibold text-blue-950">
              Select Time
            </p>

            <p className="text-sm text-blue-700">
              Current step
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 opacity-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
            3
          </span>

          <div>
            <p className="font-semibold text-blue-950">
              Review
            </p>

            <p className="text-sm text-gray-500">
              Confirm details
            </p>
          </div>
        </div>
      </div>

      {/* Page heading */}
      <div className="mt-10">
        <p className="font-semibold uppercase tracking-wide text-orange-600">
          Select your schedule
        </p>

        <h1 className="mt-2 text-3xl font-bold text-blue-950">
          Choose a Date and Time
        </h1>

        <p className="mt-2 text-gray-600">
          Select a convenient time for your tutoring session.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Tutor summary */}
        <aside className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <img
            src={tutor.image}
            alt={`${tutor.name}, ${tutor.subject} tutor`}
            className="h-64 w-full object-cover"
          />

          <div className="p-6">
            <p className="text-sm font-semibold text-orange-700">
              {tutor.subject}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-blue-950">
              {tutor.name}
            </h2>

            <p className="mt-2 text-gray-500">
              {tutor.experience} of experience
            </p>

            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-sm text-gray-500">
                Next available
              </p>

              <p className="mt-1 font-semibold text-green-700">
                {tutor.nextAvailable}
              </p>
            </div>

            <Link
              to={`/dashboard/tutors/${tutor.id}`}
              className="mt-5 inline-block text-sm font-semibold text-blue-700 hover:underline"
            >
              View tutor profile
            </Link>
          </div>
        </aside>

        {/* Schedule form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2 md:p-8">
          <div>
            <label
              htmlFor="session-date"
              className="text-lg font-bold text-blue-950"
            >
              1. Select a Date
            </label>

            <p className="mt-1 text-sm text-gray-500">
              Past dates cannot be selected.
            </p>

            <input
              id="session-date"
              type="date"
              min={today}
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setSelectedTime("");
              }}
              className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-bold text-blue-950">
              2. Select a Time
            </h2>

            {!selectedDate && (
              <div className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-gray-500">
                Select a date above to view available times.
              </div>
            )}

            {selectedDate && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {tutor.times.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() =>
                      setSelectedTime(time)
                    }
                    className={
                      selectedTime === time
                        ? "rounded-xl border border-blue-950 bg-blue-950 px-4 py-3 font-semibold text-white shadow-sm"
                        : "rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-blue-950 hover:border-blue-950 hover:bg-blue-50"
                    }
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-medium text-blue-700">
                Your selected session
              </p>

              <p className="mt-2 text-lg font-bold text-blue-950">
                {formatSelectedDate(selectedDate)}
              </p>

              <p className="mt-1 font-semibold text-blue-950">
                {selectedTime} with {tutor.name}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-between">
            <Link
              to="/dashboard/tutors"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back
            </Link>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedDate || !selectedTime}
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Continue to Review →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TutorSchedule;