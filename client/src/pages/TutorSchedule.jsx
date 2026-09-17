import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

import tutors from "../data/tutors";
function convertTimeToMinutes(time) {
  const [clockTime, period] = time.split(" ");
  const [hourValue, minuteValue] = clockTime.split(":").map(Number);

  let hour = hourValue;

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return hour * 60 + minuteValue;
}
function getMinimumBookingDate(nextAvailable) {
  const minimumDate = new Date();

  minimumDate.setHours(0, 0, 0, 0);

  if (nextAvailable?.toLowerCase() === "tomorrow") {
    minimumDate.setDate(minimumDate.getDate() + 1);
  }

  while (minimumDate.getDay() === 0 || minimumDate.getDay() === 6) {
    minimumDate.setDate(minimumDate.getDate() + 1);
  }

  return minimumDate;
}
function TutorSchedule() {
  const [bookedByDate, setBookedByDate] = useState({});
  const [calendarAvailabilityLoading, setCalendarAvailabilityLoading] =
    useState(true);
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const [dateError, setDateError] = useState("");

  const tutor = tutors.find((item) => item.id === Number(tutorId));

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedTime, setSelectedTime] = useState("");

  const [sessionType, setSessionType] = useState("Online");

  const [calendarOpen, setCalendarOpen] = useState(false);

  const [bookedTimes, setBookedTimes] = useState([]);
  const [timesLoading, setTimesLoading] = useState(false);

  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  const isWeekday = currentDay >= 1 && currentDay <= 5;

  const isWorkingHours = currentHour >= 8 && currentHour < 20;

  const tutorIsOnline = isWeekday && isWorkingHours;
  function convertDateToValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleCalendarSelect(date) {
    if (!date) {
      return;
    }

    setSelectedDate(convertDateToValue(date));
    setSelectedTime("");
    setDateError("");
    setCalendarOpen(false);
  }

  const selectedCalendarDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`)
    : undefined;
  useEffect(() => {
    async function getBookedTimes() {
      if (!selectedDate || !tutor) {
        setBookedTimes([]);
        return;
      }

      setTimesLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/availability?tutorId=${tutor.id}&date=${selectedDate}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setDateError(data.message || "Unable to retrieve available times.");
          return;
        }

        setBookedTimes(data.bookedTimes);
        setDateError("");
      } catch {
        setDateError("Cannot retrieve the tutor's availability.");
      } finally {
        setTimesLoading(false);
      }
    }

    getBookedTimes();
  }, [selectedDate, tutor]);

  useEffect(() => {
    async function getCalendarAvailability() {
      if (!tutor) {
        return;
      }

      const startDate = convertDateToValue(new Date());

      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/calendar-availability?tutorId=${tutor.id}&startDate=${startDate}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setDateError(
            data.message || "Unable to retrieve calendar availability.",
          );
          return;
        }

        setBookedByDate(data.bookedByDate);
      } catch {
        setDateError("Cannot retrieve the tutor's calendar availability.");
      } finally {
        setCalendarAvailabilityLoading(false);
      }
    }

    getCalendarAvailability();
  }, [tutor]);

  if (!tutor) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-3xl font-bold text-blue-950">Tutor not found</h1>

        <p className="mt-3 text-gray-600">
          This tutor may no longer be available.
        </p>

        <Link
          to="/dashboard/tutors"
          className="mt-6 inline-block font-semibold text-blue-700 hover:underline">
          ← Return to Tutors
        </Link>
      </section>
    );
  }
  const minimumBookingDate = getMinimumBookingDate(tutor.nextAvailable);
  const availableTimes = tutor.times.filter((time) => {
    const minutes = convertTimeToMinutes(time);

    return minutes >= 480 && minutes < 1200;
  });

  function getBookableTimesForDate(date) {
    const dateValue = convertDateToValue(date);
    const bookedTimesForDate = bookedByDate[dateValue] || [];

    const todayValue = convertDateToValue(new Date());
    const currentTime = new Date();

    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    return availableTimes.filter((time) => {
      const timeMinutes = convertTimeToMinutes(time);

      const hasPassed =
        dateValue === todayValue && timeMinutes <= currentMinutes;

      const isBooked = bookedTimesForDate.includes(time);

      return !hasPassed && !isBooked;
    });
  }
  function findNextAvailability() {
    const candidateDate = new Date(minimumBookingDate);

    for (let index = 0; index < 45; index += 1) {
      const day = candidateDate.getDay();

      if (day !== 0 && day !== 6) {
        const times = getBookableTimesForDate(candidateDate);

        if (times.length > 0) {
          return {
            date: new Date(candidateDate),
            time: times[0],
          };
        }
      }

      candidateDate.setDate(candidateDate.getDate() + 1);
    }

    return null;
  }

  const nextAvailability = calendarAvailabilityLoading
    ? null
    : findNextAvailability();

  function isDateFullyUnavailable(date) {
    const day = date.getDay();

    if (day === 0 || day === 6) {
      return true;
    }

    if (date < minimumBookingDate) {
      return true;
    }

    return getBookableTimesForDate(date).length === 0;
  }

  function isPastTimeSlot(time) {
    if (!selectedDate) {
      return false;
    }

    const todayValue = convertDateToValue(new Date());

    if (selectedDate !== todayValue) {
      return false;
    }

    const currentTime = new Date();

    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    const slotMinutes = convertTimeToMinutes(time);

    return slotMinutes <= currentMinutes;
  }

  function isBookedTimeSlot(time) {
    return bookedTimes.includes(time);
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
        sessionType,
      },
    });
  }

  function formatSelectedDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
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
        className="text-sm font-semibold text-blue-700 hover:underline">
        ← Back to Tutors
      </Link>

      {/* Booking progress */}
      <div className="mt-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-3">
        <div className="flex items-center gap-3 opacity-60">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
            ✓
          </span>

          <div>
            <p className="font-semibold text-blue-950">Choose Tutor</p>

            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
            2
          </span>

          <div>
            <p className="font-semibold text-blue-950">Select Time</p>

            <p className="text-sm text-blue-700">Current step</p>
          </div>
        </div>

        <div className="flex items-center gap-3 opacity-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
            3
          </span>

          <div>
            <p className="font-semibold text-blue-950">Review</p>

            <p className="text-sm text-gray-500">Confirm details</p>
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

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
        {/*  tutor profile */}
        <aside className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-28">
          <div className="grid sm:grid-cols-2 lg:grid-cols-1">
            <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50">
              <img
                src={tutor.image}
                alt={`${tutor.name}, ${tutor.subject} tutor`}
                className="h-full w-full object-contain object-center"
              />

              <span
                className={
                  tutorIsOnline
                    ? "absolute left-4 top-4 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 shadow"
                    : "absolute left-4 top-4 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600 shadow"
                }>
                {tutorIsOnline ? "● Online now" : "● Offline"}
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-950">
                    {tutor.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {tutor.experience} of experience
                  </p>
                </div>

                <span className="shrink-0 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
                  ★ {tutor.rating || "4.9"}
                </span>
              </div>

              {/* Compact information */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-gray-500">Session</p>

                  <p className="mt-1 text-sm font-bold text-blue-950">
                    One-to-one
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-gray-500">Next available</p>

                  <p className="mt-1 text-sm font-bold text-green-700">
                    {calendarAvailabilityLoading
                      ? "Checking..."
                      : nextAvailability
                        ? `${formatSelectedDate(
                            convertDateToValue(nextAvailability.date),
                          )}, ${nextAvailability.time}`
                        : "No availability"}
                  </p>
                </div>
              </div>

              {/* Short description */}
              <div className="mt-5 border-t border-gray-100 pt-5">
                <h3 className="font-bold text-blue-950">About {tutor.name}</h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {tutor.bio ||
                    `${tutor.name} provides clear, personalized ${tutor.subject.toLowerCase()} lessons designed around each student's learning needs.`}
                </p>
              </div>

              {/* Compact approach */}
              <div className="mt-5 border-t border-gray-100 pt-5">
                <h3 className="font-bold text-blue-950">Teaching Style</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-950">
                    ✓ Personalized lessons
                  </span>

                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-950">
                    ✓ Guided practice
                  </span>

                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-950">
                    ✓ Clear explanations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Schedule form */}
        {/* Professional booking form */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Booking header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-950 to-blue-800 px-6 py-6 text-white md:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-orange-200">
                  Book your lesson
                </p>

                <h2 className="mt-1 text-2xl font-bold">Select Your Session</h2>

                <p className="mt-2 text-sm text-blue-100">
                  Choose the format, date, and available time.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                Step 2 of 3
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Session format */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-blue-950">Session Format</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose how you want to attend.
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  60 minutes
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSessionType("Online")}
                  className={
                    sessionType === "Online"
                      ? "rounded-xl border-2 border-blue-950 bg-blue-50 p-4 text-left"
                      : "rounded-xl border border-gray-300 bg-white p-4 text-left hover:border-blue-400"
                  }>
                  <span className="text-xl">💻</span>

                  <span className="mt-2 block font-bold text-blue-950">
                    Online
                  </span>

                  <span className="mt-1 block text-xs text-gray-500">
                    Video tutoring session
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSessionType("In Person")}
                  className={
                    sessionType === "In Person"
                      ? "rounded-xl border-2 border-blue-950 bg-blue-50 p-4 text-left"
                      : "rounded-xl border border-gray-300 bg-white p-4 text-left hover:border-blue-400"
                  }>
                  <span className="text-xl">📍</span>

                  <span className="mt-2 block font-bold text-blue-950">
                    In Person
                  </span>

                  <span className="mt-1 block text-xs text-gray-500">
                    Meet at the tutoring location
                  </span>
                </button>
              </div>
            </div>

            {/* Date */}
            <div className="mt-8 border-t border-gray-100 pt-7">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-white">
                  1
                </span>

                <div>
                  <h3 className="font-bold text-blue-950">Select a Date</h3>

                  <p className="text-sm text-gray-500">
                    Choose a future date for your lesson.
                  </p>
                </div>
              </div>

              <div className="relative mt-4">
                <button
                  id="session-date"
                  type="button"
                  onClick={() => setCalendarOpen((current) => !current)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left transition hover:border-blue-950 focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Session date
                    </p>

                    <p
                      className={
                        selectedDate
                          ? "mt-1 font-semibold text-blue-950"
                          : "mt-1 text-gray-500"
                      }>
                      {selectedDate
                        ? formatSelectedDate(selectedDate)
                        : "Choose an available date"}
                    </p>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">
                    📅
                  </span>
                </button>

                {calendarOpen && (
                  <div className="absolute left-0 top-full z-30 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                    <DayPicker
                      animate
                      mode="single"
                      selected={selectedCalendarDate}
                      onSelect={handleCalendarSelect}
                      startMonth={minimumBookingDate}
                      disabled={[
                        {
                          before: minimumBookingDate,
                        },
                        {
                          dayOfWeek: [0, 6],
                        },
                        isDateFullyUnavailable,
                      ]}
                    />

                    <div className="mt-2 border-t border-gray-100 pt-3 text-center text-xs text-gray-500">
                      Sessions are available Monday through Friday
                    </div>
                  </div>
                )}

                {dateError && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {dateError}
                  </p>
                )}
              </div>
            </div>

            {/* Time */}
            <div className="mt-8 border-t border-gray-100 pt-7">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-white">
                  2
                </span>

                <div>
                  <h3 className="font-bold text-blue-950">Select a Time</h3>

                  <p className="text-sm text-gray-500">
                    Times are shown in your local timezone.
                  </p>
                </div>
              </div>

              {!selectedDate && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-slate-50 p-5">
                  <span className="text-2xl">📅</span>

                  <p className="text-sm text-gray-500">
                    Choose a date to see available times.
                  </p>
                </div>
              )}

              {selectedDate && (
                <>
                  <p className="mt-5 text-sm font-semibold text-gray-500">
                    Available times
                  </p>

                  {timesLoading ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-5 text-center text-sm text-gray-500">
                      Checking available times...
                    </div>
                  ) : (
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {availableTimes.map((time) => {
                        const isPassed = isPastTimeSlot(time);

                        const isBooked = !isPassed && isBookedTimeSlot(time);
                        const isDisabled = isBooked || isPassed;

                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setSelectedTime(time)}
                            className={
                              isBooked
                                ? "cursor-not-allowed rounded-xl border border-red-200 bg-red-50 px-3 py-3 font-semibold text-red-600"
                                : isPassed
                                  ? "cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-3 py-3 font-semibold text-gray-400"
                                  : selectedTime === time
                                    ? "rounded-xl border-2 border-blue-950 bg-blue-950 px-3 py-3 font-semibold text-white shadow-sm"
                                    : "rounded-xl border border-gray-300 bg-white px-3 py-3 font-semibold text-blue-950 transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
                            }>
                            <span className="block">{time}</span>

                            {isBooked && (
                              <span className="mt-1 block text-xs">Booked</span>
                            )}

                            {isPassed && !isBooked && (
                              <span className="mt-1 block text-xs">Passed</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Booking summary */}
            <div className="mt-8 border-t border-gray-100 pt-7">
              <h3 className="font-bold text-blue-950">Booking Summary</h3>

              <div className="mt-4 rounded-2xl bg-slate-50 p-5">
                <dl className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-gray-500">Tutor</dt>

                    <dd className="text-right text-sm font-semibold text-blue-950">
                      {tutor.name}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-gray-500">Subject</dt>

                    <dd className="text-right text-sm font-semibold text-blue-950">
                      {tutor.subject}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-gray-500">Format</dt>

                    <dd className="text-right text-sm font-semibold text-blue-950">
                      {sessionType}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-gray-500">Date</dt>

                    <dd className="text-right text-sm font-semibold text-blue-950">
                      {selectedDate
                        ? formatSelectedDate(selectedDate)
                        : "Not selected"}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-gray-500">Time</dt>

                    <dd className="text-right text-sm font-semibold text-blue-950">
                      {selectedTime || "Not selected"}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4">
                    <dt className="font-bold text-blue-950">Session price</dt>

                    <dd className="text-lg font-bold text-blue-950">Free</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <Link
                to="/dashboard/tutors"
                className="flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 sm:w-1/3">
                Back
              </Link>

              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedDate || !selectedTime}
                className="flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none sm:w-2/3">
                Continue to Review →
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>🔒</span>
              Your booking information is securely protected.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TutorSchedule;
