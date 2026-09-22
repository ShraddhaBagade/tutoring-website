import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiUrl } from "../../config/api";

const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const sessionTimes = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function ManageAvailability() {
  const [availableDays, setAvailableDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function getAvailability() {
      try {
        const response = await fetch(apiUrl("/api/tutors/me/profile"), {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load availability.");
          return;
        }

        setAvailableDays(data.tutor.availableDays || []);
        setTimes(data.tutor.times || []);
      } catch {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    getAvailability();
  }, []);

  function toggleDay(day) {
    setAvailableDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((currentDay) => currentDay !== day)
        : [...currentDays, day],
    );

    setMessage("");
    setError("");
  }

  function toggleTime(time) {
    setTimes((currentTimes) =>
      currentTimes.includes(time)
        ? currentTimes.filter((currentTime) => currentTime !== time)
        : [...currentTimes, time],
    );

    setMessage("");
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(apiUrl("/api/tutors/me/availability"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          availableDays,
          times,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to update availability.");
        return;
      }

      setAvailableDays(data.tutor.availableDays || []);
      setTimes(data.tutor.times || []);
      setMessage("Availability saved successfully.");
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p className="font-medium text-gray-600">
          Loading your availability...
        </p>
      </section>
    );
  }

  if (error && availableDays.length === 0 && times.length === 0) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-3xl font-bold text-blue-950">
          Availability unavailable
        </h1>

        <p className="mt-3 text-gray-600">{error}</p>

        <Link
          to="/dashboard/tutor"
          className="mt-6 inline-block font-semibold text-blue-700 hover:underline">
          Return to Tutor Dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className="py-10">
      <Link
        to="/dashboard/tutor"
        className="font-semibold text-blue-700 hover:underline">
        ← Back to Tutor Dashboard
      </Link>

      <div className="mt-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="font-semibold uppercase tracking-wide text-orange-600">
            Tutor schedule
          </p>

          <h1 className="mt-2 text-3xl font-bold text-blue-950">
            Manage Availability
          </h1>

          <p className="mt-2 max-w-2xl leading-7 text-gray-600">
            Select the weekdays and one-hour session times that students can
            book with you.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-fit rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300">
          {saving ? "Saving..." : "Save Availability"}
        </button>
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

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold text-blue-950">
            Available Weekdays
          </h2>

          <p className="mt-2 text-gray-600">
            Students cannot book you on days that are not selected.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {workingDays.map((day) => {
              const selected = availableDays.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={
                    selected
                      ? "flex items-center justify-between rounded-xl border-2 border-blue-950 bg-blue-50 px-5 py-4 text-left font-semibold text-blue-950"
                      : "flex items-center justify-between rounded-xl border border-gray-300 px-5 py-4 text-left font-medium text-gray-600 hover:border-blue-950"
                  }>
                  {day}

                  <span>{selected ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        </article>

        <aside className="rounded-2xl bg-blue-950 p-6 text-white shadow-sm">
          <p className="font-semibold text-orange-200">Current Summary</p>

          <div className="mt-6">
            <p className="text-sm text-blue-200">Available days</p>

            <p className="mt-2 text-2xl font-bold">{availableDays.length}</p>
          </div>

          <div className="mt-6 border-t border-white/20 pt-6">
            <p className="text-sm text-blue-200">Available time slots</p>

            <p className="mt-2 text-2xl font-bold">{times.length}</p>
          </div>

          <p className="mt-6 border-t border-white/20 pt-6 text-sm leading-6 text-blue-100">
            Students will only be able to choose your selected days and times.
          </p>
        </aside>
      </div>

      <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-blue-950">
          Available Session Times
        </h2>

        <p className="mt-2 text-gray-600">
          Each selected time represents a one-hour tutoring session.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sessionTimes.map((time) => {
            const selected = times.includes(time);

            return (
              <button
                key={time}
                type="button"
                onClick={() => toggleTime(time)}
                className={
                  selected
                    ? "rounded-xl border-2 border-blue-950 bg-blue-950 px-4 py-4 font-semibold text-white"
                    : "rounded-xl border border-gray-300 bg-white px-4 py-4 font-semibold text-blue-950 hover:border-blue-950 hover:bg-blue-50"
                }>
                {time}
              </button>
            );
          })}
        </div>
      </article>
    </section>
  );
}

export default ManageAvailability;
