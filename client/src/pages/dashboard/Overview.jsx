import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { apiUrl } from "../../config/api";

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

function isFutureSession(booking) {
  const sessionDate = new Date(`${booking.sessionDate}T00:00:00`);
  const [clockTime, period] = booking.sessionTime.split(" ");
  const [hourValue, minuteValue] = clockTime.split(":").map(Number);

  let hour = hourValue;

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  sessionDate.setHours(hour, minuteValue, 0, 0);

  return sessionDate > new Date();
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function Overview() {
  const { user } = useAuth();

  const [tutors, setTutors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [classNotes, setClassNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const rawFirstName = user?.fullName?.split(" ")[0] || "Student";

  const firstName =
    rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [tutorsResponse, bookingsResponse, assignmentsResponse, notesResponse] =
          await Promise.all([
            fetch (apiUrl("/api/tutors")),
            fetch( apiUrl("/api/bookings/my-bookings"), {
              credentials: "include",
            }),
            fetch( apiUrl("/api/assignments/student"), {
              credentials: "include",
            }),
            fetch( apiUrl("/api/lesson-notes/student"), {
              credentials: "include",
            }),
          ]);

        const [
          tutorsData,
          bookingsData,
          assignmentsData,
          notesData,
        ] = await Promise.all([
          tutorsResponse.json(),
          bookingsResponse.json(),
          assignmentsResponse.json(),
          notesResponse.json(),
        ]);

        if (
          !tutorsResponse.ok ||
          !bookingsResponse.ok ||
          !assignmentsResponse.ok ||
          !notesResponse.ok
        ) {
          setError("Some dashboard information could not be loaded.");
          return;
        }

        setTutors(tutorsData.tutors || []);
        setBookings(bookingsData.bookings || []);
        setAssignments(assignmentsData.assignments || []);
        setClassNotes(notesData.notes || []);
      } catch {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter(
          (booking) =>
            booking.status === "upcoming" && isFutureSession(booking)
        )
        .sort((firstBooking, secondBooking) => {
          const firstDate = new Date(
            `${firstBooking.sessionDate}T00:00:00`
          ).getTime();

          const secondDate = new Date(
            `${secondBooking.sessionDate}T00:00:00`
          ).getTime();

          if (firstDate !== secondDate) {
            return firstDate - secondDate;
          }

          return (
            convertTimeToMinutes(firstBooking.sessionTime) -
            convertTimeToMinutes(secondBooking.sessionTime)
          );
        }),
    [bookings]
  );

  const nextSession = upcomingBookings[0];

  const assignmentsToDo = assignments.filter(
    (assignment) =>
      assignment.status === "assigned" ||
      assignment.status === "submitted"
  );

  const recentClassNotes = classNotes.slice(0, 2);
  const recommendedTutors = tutors.slice(0, 3);

  const subjectsCount = new Set(
    tutors.map((tutor) => tutor.subject)
  ).size;

  return (
    <div className="py-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 to-blue-800 px-8 py-12 text-white shadow-lg md:px-12">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/30" />

        <div className="absolute -bottom-28 right-52 h-56 w-56 rounded-full bg-orange-300/20" />

        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-orange-200">
              Student Dashboard
            </p>

            <h1 className="mt-6 text-3xl font-bold md:text-4xl">
              Welcome back, {firstName}!
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-blue-100">
              Keep track of your lessons, assignments, and Class Notes in one
              place.
            </p>
          </div>

          <Link
            to="/dashboard/tutors"
            className="inline-flex w-fit items-center justify-center rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-700"
          >
            Find a Tutor →
          </Link>
        </div>
      </section>

      {loading && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="font-medium text-gray-600">
            Loading your dashboard...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="font-bold text-red-700">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-500">
                    Upcoming Sessions
                  </p>

                  <p className="mt-3 text-4xl font-bold text-blue-950">
                    {upcomingBookings.length}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-100 p-3 text-2xl">
                  📅
                </div>
              </div>

              <Link
                to="/dashboard/sessions"
                className="mt-6 inline-block font-semibold text-blue-700 hover:underline"
              >
                View sessions →
              </Link>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-500">
                    Assignments to Review
                  </p>

                  <p className="mt-3 text-4xl font-bold text-blue-950">
                    {assignmentsToDo.length}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-100 p-3 text-2xl">
                  📝
                </div>
              </div>

              <Link
                to="/dashboard/assignments"
                className="mt-6 inline-block font-semibold text-orange-700 hover:underline"
              >
                View assignments →
              </Link>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-500">
                    Available Subjects
                  </p>

                  <p className="mt-3 text-4xl font-bold text-blue-950">
                    {subjectsCount}
                  </p>
                </div>

                <div className="rounded-xl bg-violet-100 p-3 text-2xl">
                  📚
                </div>
              </div>

              <Link
                to="/dashboard/subjects"
                className="mt-6 inline-block font-semibold text-violet-700 hover:underline"
              >
                Explore subjects →
              </Link>
            </article>
          </section>

          <section className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-semibold uppercase tracking-wide text-orange-600">
                      Keep learning
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-blue-950">
                      Your Assignments
                    </h2>
                  </div>

                  <Link
                    to="/dashboard/assignments"
                    className="text-sm font-semibold text-blue-700 hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {assignmentsToDo.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="text-3xl">✅</div>

                    <h3 className="mt-3 font-bold text-blue-950">
                      You are all caught up
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      New assignments from your tutors will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {assignmentsToDo.slice(0, 2).map((assignment) => (
                      <article
                        key={assignment._id}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div>
                            <p className="text-sm font-semibold text-orange-700">
                              {assignment.booking?.subject || "Assignment"}
                            </p>

                            <h3 className="mt-1 text-lg font-bold text-blue-950">
                              {assignment.title}
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                              Due {formatDate(assignment.dueDate)}
                            </p>
                          </div>

                          <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                            {assignment.status}
                          </span>
                        </div>

                        <Link
                          to="/dashboard/assignments"
                          className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
                        >
                          Open assignment →
                        </Link>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-semibold uppercase tracking-wide text-orange-600">
                      Learning record
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-blue-950">
                      Recent Class Notes
                    </h2>
                  </div>

                  <Link
                    to="/dashboard/class-notes"
                    className="text-sm font-semibold text-blue-700 hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {recentClassNotes.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="text-3xl">📖</div>

                    <h3 className="mt-3 font-bold text-blue-950">
                      No Class Notes yet
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Your tutor can add notes after a completed session.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {recentClassNotes.map((note) => (
                      <article
                        key={note._id}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                      >
                        <p className="text-sm font-semibold text-orange-700">
                          {note.booking?.subject || "Tutoring Session"}
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-blue-950">
                          Class Notes
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                          {note.lessonSummary}
                        </p>

                        <Link
                          to="/dashboard/class-notes"
                          className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
                        >
                          Read Class Notes →
                        </Link>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-semibold uppercase tracking-wide text-orange-600">
                      Explore tutors
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-blue-950">
                      Recommended Tutors
                    </h2>
                  </div>

                  <Link
                    to="/dashboard/tutors"
                    className="text-sm font-semibold text-blue-700 hover:underline"
                  >
                    View all
                  </Link>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {recommendedTutors.map((tutor) => (
                    <article
                      key={tutor._id}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <img
                        src={tutor.image}
                        alt={`${tutor.name}, ${tutor.subject} tutor`}
                        className="h-40 w-full object-cover object-center"
                      />

                      <div className="p-5">
                        <p className="text-sm font-semibold text-orange-700">
                          {tutor.subject}
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-blue-950">
                          {tutor.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {tutor.experience} of experience
                        </p>

                        <Link
                          to={`/dashboard/tutors/${tutor.tutorId}/schedule`}
                          className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
                        >
                          View schedule →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <aside>
              <p className="font-semibold uppercase tracking-wide text-orange-600">
                Your schedule
              </p>

              <h2 className="mt-2 text-2xl font-bold text-blue-950">
                Next Session
              </h2>

              {nextSession ? (
                <div className="mt-5 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-orange-700">
                    {nextSession.subject}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-blue-950">
                    {nextSession.tutorName}
                  </h3>

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="font-bold text-blue-950">
                      {formatDate(nextSession.sessionDate)}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {nextSession.sessionTime} · {nextSession.sessionType}
                    </p>
                  </div>

                  <Link
                    to="/dashboard/sessions"
                    className="mt-5 inline-block text-sm font-semibold text-blue-700 hover:underline"
                  >
                    View session details →
                  </Link>
                </div>
              ) : (
                <div className="mt-5 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-2xl">
                    📅
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-blue-950">
                    No session scheduled
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Book a session and your next lesson will appear here.
                  </p>

                  <Link
                    to="/dashboard/tutors"
                    className="mt-6 rounded-lg bg-blue-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900"
                  >
                    Book a Session
                  </Link>
                </div>
              )}
            </aside>
          </section>
        </>
      )}
    </div>
  );
}

export default Overview;