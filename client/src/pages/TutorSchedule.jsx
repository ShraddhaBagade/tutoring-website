import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import tutors from "../data/tutors";

function TutorSchedule() {
  const { tutorId } = useParams();
  const navigate = useNavigate();

  const tutor = tutors.find((item) => item.id === Number(tutorId));

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const today = new Date().toISOString().split("T")[0];

  function handleContinue() {
    navigate("/booking/review", {
      state: {
        tutor,
        selectedDate,
        selectedTime,
      },
    });
  }

  if (!tutor) {
    return (
      <section className="min-h-screen py-12 text-center">
        <h1 className="text-3xl font-bold text-blue-950">Tutor not found</h1>

        <Link
          to="/dashboard"
          className="mt-6 inline-block text-blue-700 hover:underline">
          Return to Dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-10">
      <Link
        to="/dashboard"
        className="text-sm font-semibold text-blue-700 hover:underline">
        ← Back to Dashboard
      </Link>

      <div className="mt-8 grid gap-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:grid-cols-2">
        {/* Tutor image */}
        <div>
          <img
            src={tutor.image}
            alt={tutor.name}
            className="h-72 w-full rounded-xl object-cover"
          />
        </div>

        {/* Schedule selection */}
        <div>
          <p className="font-semibold text-orange-700">{tutor.subject}</p>

          <h1 className="mt-2 text-3xl font-bold text-blue-950">
            {tutor.name}
          </h1>

          <p className="mt-2 text-gray-600">
            {tutor.experience} of tutoring experience
          </p>

          {/* Date selection */}
          <div className="mt-8">
            <label htmlFor="session-date" className="font-bold text-blue-950">
              Select a Date
            </label>

            <input
              id="session-date"
              type="date"
              min={today}
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setSelectedTime("");
              }}
              className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          {/* Time selection */}
          <div className="mt-6">
            <h2 className="font-bold text-blue-950">Select a Time</h2>

            {!selectedDate && (
              <p className="mt-2 text-sm text-gray-500">
                Select a date to view available times.
              </p>
            )}

            {selectedDate && (
              <div className="mt-3 flex flex-wrap gap-3">
                {tutor.times.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setSelectedTime(time);
                    }}
                    className={
                      selectedTime === time
                        ? "rounded-lg border border-blue-950 bg-blue-950 px-4 py-2 text-white"
                        : "rounded-lg border border-blue-200 px-4 py-2 text-blue-950 hover:bg-blue-50"
                    }>
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected schedule */}
          {selectedDate && selectedTime && (
            <div className="mt-6 rounded-lg bg-violet-50 p-4">
              <p className="text-sm text-gray-600">Your selected session</p>

              <p className="mt-1 font-bold text-blue-950">
                {selectedDate} at {selectedTime}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className="mt-6 w-full rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300">
            Continue to Review
          </button>
        </div>
      </div>
    </section>
  );
}

export default TutorSchedule;
