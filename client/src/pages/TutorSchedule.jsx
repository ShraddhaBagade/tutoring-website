import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { apiUrl } from "../config/api";

function convertTimeToMinutes(time) {
  const [timePart, period] = time.split(" ");
  const [hourText, minuteText] = timePart.split(":");

  let hour = Number(hourText);
  const minute = Number(minuteText);

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return hour * 60 + minute;
}

function getFirstWorkingDate() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

function getWeekdayName(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function TutorSchedule() {
  const { tutorId } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [tutorLoading, setTutorLoading] = useState(true);
  const [tutorError, setTutorError] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("Online");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [bookedTimes, setBookedTimes] = useState([]);
  const [bookedByDate, setBookedByDate] = useState({});
  const [timesLoading, setTimesLoading] = useState(false);
  const [dateError, setDateError] = useState("");

  const minimumBookingDate = getFirstWorkingDate();

  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  useEffect(() => {
    async function getTutor() {
      try {
        setTutorLoading(true);
        setTutorError("");

        const response = await fetch(apiUrl(`/api/tutors/${tutorId}`));

        const data = await response.json();

        if (!response.ok) {
          setTutorError(data.message || "Unable to load tutor details.");
          return;
        }

        setTutor(data.tutor);
      } catch {
        setTutorError("Cannot connect to the server.");
      } finally {
        setTutorLoading(false);
      }
    }

    getTutor();
  }, [tutorId]);
  const tutorIsOnline =
    currentDay >= 1 &&
    currentDay <= 5 &&
    currentMinutes >= 8 * 60 &&
    currentMinutes < 20 * 60;

  function convertDateToValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleCalendarSelect(date) {
    if (!date || isDateFullyUnavailable(date)) {
      return;
    }

    const dateValue = convertDateToValue(date);

    setSelectedDate(dateValue);
    setSelectedTime("");
    setCalendarOpen(false);
    setDateError("");
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
          apiUrl(
            `/api/bookings/availability?tutorId=${tutor.tutorId}&date=${selectedDate}`,
          ),
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setBookedTimes([]);
          return;
        }

        setBookedTimes(data.bookedTimes || []);
      } catch {
        setBookedTimes([]);
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

      try {
        const startDate = convertDateToValue(minimumBookingDate);

        const response = await fetch(
          apiUrl(
            `/api/bookings/calendar-availability?tutorId=${tutor.tutorId}&startDate=${startDate}`,
          ),
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        setBookedByDate(data.bookedByDate || {});
      } catch {
        setBookedByDate({});
      }
    }

    getCalendarAvailability();
  }, [tutor]);

  if (tutorLoading) {
    return (
      <section className="py-20 text-center">
        <p className="font-medium text-gray-600">Loading tutor details...</p>
      </section>
    );
  }

  if (tutorError || !tutor) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-3xl font-bold text-blue-950">Tutor not found</h1>

        <p className="mt-3 text-gray-600">
          {tutorError || "This tutor is no longer available."}
        </p>

        <Link
          to="/dashboard/tutors"
          className="mt-6 inline-block font-semibold text-blue-700 hover:underline">
          Return to Tutors
        </Link>
      </section>
    );
  }

  const availableTimes = tutor.times.filter((time) => {
    const minutes = convertTimeToMinutes(time);

    return minutes >= 9 * 60 && minutes < 18 * 60;
  });

  function isPastTimeSlot(time) {
    if (!selectedDate) {
      return false;
    }

    const todayValue = convertDateToValue(new Date());

    if (selectedDate !== todayValue) {
      return false;
    }

    return convertTimeToMinutes(time) <= currentMinutes;
  }

  function isBookedTimeSlot(time) {
    return bookedTimes.includes(time);
  }

  function getBookableTimesForDate(date) {
    const dateValue = convertDateToValue(date);
    const todayValue = convertDateToValue(new Date());

    const weekdayName = getWeekdayName(date);

    if (!tutor.availableDays?.includes(weekdayName)) {
      return [];
    }

    const reservedTimes = bookedByDate[dateValue] || [];

    return availableTimes.filter((time) => {
      const isReserved = reservedTimes.includes(time);

      if (isReserved) {
        return false;
      }

      if (dateValue === todayValue) {
        return convertTimeToMinutes(time) > currentMinutes;
      }

      return true;
    });
  }

  function isDateFullyUnavailable(date) {
    const day = date.getDay();

    if (day === 0 || day === 6) {
      return true;
    }

    const dateValue = convertDateToValue(date);
    const minimumDateValue = convertDateToValue(minimumBookingDate);

    if (dateValue < minimumDateValue) {
      return true;
    }

    return getBookableTimesForDate(date).length === 0;
  }

  function formatSelectedDate() {
    if (!selectedDate) {
      return "Select a date";
    }

    return new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function handleContinue() {
    if (!selectedDate || !selectedTime) {
      setDateError("Please select both a date and an available time.");
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

  return (
    <section className="py-8 md:py-10">
      <Link
        to="/dashboard/tutors"
        className="inline-flex items-center font-semibold text-blue-700 hover:text-blue-950 hover:underline">
        ← Back to Tutors
      </Link>

      <div className="mt-6 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <div className="flex items-center gap-3 opacity-70">
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

        <div className="flex items-center gap-3 opacity-60">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold text-gray-500">
            3
          </span>

          <div>
            <p className="font-semibold text-blue-950">Review</p>
            <p className="text-sm text-gray-500">Next step</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="font-semibold uppercase tracking-wide text-orange-600">
          Book a session
        </p>

        <h1 className="mt-2 text-3xl font-bold text-blue-950">
          Choose your session time
        </h1>

        <p className="mt-2 text-gray-600">
          Select a weekday and an available one-hour session.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <aside className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative flex justify-center bg-gradient-to-br from-blue-50 to-violet-100 px-6 pb-8 pt-10">
            <img
              src={tutor.image}
              alt={`${tutor.name}, ${tutor.subject} tutor`}
              className="h-40 w-40 rounded-full border-4 border-white object-cover object-center shadow-lg"
            />

            <span
              className={
                tutorIsOnline
                  ? "absolute left-5 top-5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700 shadow-sm"
                  : "absolute left-5 top-5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-600 shadow-sm"
              }>
              {tutorIsOnline ? "● Online now" : "● Currently offline"}
            </span>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-orange-700">{tutor.subject}</p>

                <h2 className="mt-1 text-2xl font-bold text-blue-950">
                  {tutor.name}
                </h2>

                <p className="mt-1 text-gray-500">
                  {tutor.experience} of experience
                </p>
              </div>

              <span className="rounded-xl bg-orange-50 px-3 py-2 font-semibold text-orange-700">
                ★ 4.9
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Session</p>
                <p className="mt-1 font-bold text-blue-950">One-to-one</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="mt-1 font-bold text-blue-950">60 minutes</p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="font-bold text-blue-950">
                About {tutor.name.split(" ")[0]}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                {tutor.name} provides clear, personalized{" "}
                {tutor.subject.toLowerCase()} lessons designed around each
                student&apos;s learning needs.
              </p>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="font-bold text-blue-950">Teaching Style</h3>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-950">
                  ✓ Personalized lessons
                </span>

                <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-950">
                  ✓ Guided practice
                </span>

                <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-950">
                  ✓ Clear explanations
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="rounded-t-2xl bg-blue-950 p-6 text-white">
            <p className="text-sm font-semibold text-orange-200">
              Your booking
            </p>

            <h2 className="mt-1 text-2xl font-bold">Session Details</h2>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              Weekdays only, with one-hour sessions from 9:00 AM to 6:00 PM.
            </p>
          </div>

          <div className="p-6">
            <div>
              <p className="font-bold text-blue-950">Session format</p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSessionType("Online")}
                  className={
                    sessionType === "Online"
                      ? "rounded-xl border-2 border-blue-950 bg-blue-50 px-4 py-3 font-semibold text-blue-950"
                      : "rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-600 hover:border-blue-950"
                  }>
                  Online
                </button>

                <button
                  type="button"
                  onClick={() => setSessionType("In Person")}
                  className={
                    sessionType === "In Person"
                      ? "rounded-xl border-2 border-blue-950 bg-blue-50 px-4 py-3 font-semibold text-blue-950"
                      : "rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-600 hover:border-blue-950"
                  }>
                  In person
                </button>
              </div>
            </div>

            <div className="relative mt-7">
              <p className="font-bold text-blue-950">Choose a date</p>

              <button
                type="button"
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="mt-3 flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left font-medium text-blue-950 hover:border-blue-950">
                <span>{formatSelectedDate()}</span>
                <span className="text-xl">📅</span>
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
                      { before: minimumBookingDate },
                      { dayOfWeek: [0, 6] },
                      isDateFullyUnavailable,
                    ]}
                  />

                  <p className="mt-2 text-center text-xs text-gray-500">
                    Weekdays only. Fully booked dates are disabled.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between gap-4">
                <p className="font-bold text-blue-950">Available times</p>

                {selectedDate && (
                  <span className="text-sm font-medium text-gray-500">
                    One-hour sessions
                  </span>
                )}
              </div>

              {!selectedDate && (
                <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-gray-500">
                  Choose a date to view available session times.
                </div>
              )}

              {selectedDate && timesLoading && (
                <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-gray-500">
                  Checking available times...
                </div>
              )}

              {selectedDate && !timesLoading && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {availableTimes.map((time) => {
                    const isPast = isPastTimeSlot(time);
                    const isBooked = !isPast && isBookedTimeSlot(time);
                    const isSelected = selectedTime === time;
                    const isDisabled = isPast || isBooked;

                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedTime(time);
                          setDateError("");
                        }}
                        className={
                          isBooked
                            ? "flex h-20 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 font-semibold text-red-700"
                            : isPast
                              ? "flex h-20 flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-100 font-semibold text-gray-400"
                              : isSelected
                                ? "flex h-20 flex-col items-center justify-center rounded-xl border border-blue-950 bg-blue-950 font-semibold text-white shadow-sm"
                                : "flex h-20 flex-col items-center justify-center rounded-xl border border-gray-300 bg-white font-semibold text-blue-950 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700"
                        }>
                        <span>{time}</span>

                        {isBooked && (
                          <span className="mt-1 text-xs font-medium">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {dateError && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                {dateError}
              </p>
            )}

            <div className="mt-7 rounded-2xl bg-slate-50 p-5">
              <h3 className="font-bold text-blue-950">Booking Summary</h3>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Tutor</dt>
                  <dd className="text-right font-semibold text-blue-950">
                    {tutor.name}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Subject</dt>
                  <dd className="text-right font-semibold text-blue-950">
                    {tutor.subject}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Format</dt>
                  <dd className="text-right font-semibold text-blue-950">
                    {sessionType}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Date</dt>
                  <dd className="text-right font-semibold text-blue-950">
                    {selectedDate ? formatSelectedDate() : "Not selected"}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Time</dt>
                  <dd className="text-right font-semibold text-blue-950">
                    {selectedTime || "Not selected"}
                  </dd>
                </div>

                <div className="flex justify-between gap-4 border-t border-gray-200 pt-3">
                  <dt className="font-semibold text-blue-950">Session price</dt>
                  <dd className="font-bold text-blue-950">Free</dd>
                </div>
              </dl>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/3 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                Back
              </button>

              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedDate || !selectedTime}
                className="w-2/3 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300">
                Continue to Review →
              </button>
            </div>

            <p className="mt-5 text-center text-sm text-gray-500">
              🔒 Your booking information is securely protected.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TutorSchedule;
