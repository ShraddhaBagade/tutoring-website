import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiUrl } from "../../config/api";

function TutorAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [resourceLink, setResourceLink] = useState("");

  const [openReviewId, setOpenReviewId] = useState("");
  const [tutorFeedback, setTutorFeedback] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadAssignmentData() {
      try {
        const [assignmentsResponse, bookingsResponse] = await Promise.all([
          fetch( apiUrl("/api/assignments/tutor"), {
            credentials: "include",
          }),
          fetch( apiUrl("/api/bookings/tutor-bookings"), {
            credentials: "include",
          }),
        ]);

        const assignmentsData = await assignmentsResponse.json();
        const bookingsData = await bookingsResponse.json();

        if (!assignmentsResponse.ok) {
          setError(assignmentsData.message || "Unable to load assignments.");
          return;
        }

        if (!bookingsResponse.ok) {
          setError(bookingsData.message || "Unable to load your students.");
          return;
        }

        setAssignments(assignmentsData.assignments || []);

        const validBookings = (bookingsData.bookings || []).filter(
          (booking) => booking.status !== "cancelled" && booking.student?._id,
        );

        setBookings(validBookings);
      } catch {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadAssignmentData();
  }, []);

  const selectedBooking = bookings.find(
    (booking) => booking._id === selectedBookingId,
  );

  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getAssignmentMeta(assignment) {
    const dueDate = new Date(`${assignment.dueDate}T00:00:00`);
    dueDate.setHours(23, 59, 59, 999);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const dayAfterTomorrowStart = new Date(tomorrowStart);
    dayAfterTomorrowStart.setDate(dayAfterTomorrowStart.getDate() + 1);

    const isAwaitingSubmission = assignment.status === "assigned";

    const isOverdue = isAwaitingSubmission && dueDate < todayStart;

    const isDueToday =
      isAwaitingSubmission && dueDate >= todayStart && dueDate < tomorrowStart;

    const isDueTomorrow =
      isAwaitingSubmission &&
      dueDate >= tomorrowStart &&
      dueDate < dayAfterTomorrowStart;

    return {
      isOverdue,
      isDueToday,
      isDueTomorrow,
    };
  }

  function getStatusClasses(status) {
    if (status === "overdue") {
      return "bg-red-100 text-red-700";
    }

    if (status === "submitted") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "reviewed") {
      return "bg-green-100 text-green-700";
    }

    return "bg-orange-100 text-orange-700";
  }

  function openReviewForm(assignment) {
    setOpenReviewId(assignment._id);
    setTutorFeedback(assignment.tutorFeedback || "");
    setError("");
    setMessage("");
  }

  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow.toISOString().split("T")[0];
  }

  function isFutureWeekday(dateString) {
    if (!dateString) {
      return false;
    }

    const selectedDate = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime())) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDay = selectedDate.getDay();

    return selectedDate > today && selectedDay !== 0 && selectedDay !== 6;
  }

  function isValidHttpsUrl(value) {
    try {
      const url = new URL(value);

      return url.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function handleCreateAssignment(event) {
    event.preventDefault();

    if (!selectedBooking) {
      setError("Select a student session first.");
      return;
    }

    if (!isFutureWeekday(dueDate)) {
      setError("Choose a future weekday for the due date.");
      return;
    }

    if (resourceLink.trim() && !isValidHttpsUrl(resourceLink.trim())) {
      setError("Resource link must begin with https://");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch( apiUrl("/api/assignments"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedBooking.student._id,
          bookingId: selectedBooking._id,
          title,
          instructions,
          dueDate,
          resourceLink,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create the assignment.");
        return;
      }

      setAssignments((currentAssignments) => [
        data.assignment,
        ...currentAssignments,
      ]);

      setSelectedBookingId("");
      setTitle("");
      setInstructions("");
      setDueDate("");
      setResourceLink("");
      setMessage("Assignment created successfully.");
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReviewAssignment(event, assignmentId) {
    event.preventDefault();

    if (!tutorFeedback.trim()) {
      setError("Add feedback before marking this assignment as reviewed.");
      return;
    }

    setReviewing(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
         apiUrl("/api/assignments/${assignmentId}/review"),
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tutorFeedback,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to review the assignment.");
        return;
      }

      setAssignments((currentAssignments) =>
        currentAssignments.map((assignment) =>
          assignment._id === assignmentId
            ? {
                ...assignment,
                ...data.assignment,
                student: assignment.student,
                booking: assignment.booking,
              }
            : assignment,
        ),
      );

      setOpenReviewId("");
      setTutorFeedback("");
      setMessage(data.message);
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setReviewing(false);
    }
  }

  return (
    <section className="py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Link
            to="/dashboard/tutor"
            className="text-sm font-semibold text-blue-700 hover:underline">
            ← Back to Tutor Dashboard
          </Link>

          <p className="mt-6 font-semibold uppercase tracking-wide text-orange-600">
            Learning workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-blue-950">Assignments</h1>

          <p className="mt-2 text-gray-600">
            Create work for your students and review their submissions.
          </p>
        </div>
      </div>

      {message && (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 font-medium text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleCreateAssignment}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="text-xl font-bold text-blue-950">Create Assignment</h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Assign work to a student from one of your sessions.
          </p>

          <div className="mt-6">
            <label
              htmlFor="student-session"
              className="text-sm font-semibold text-blue-950">
              Student session
            </label>

            <select
              id="student-session"
              value={selectedBookingId}
              onChange={(event) => setSelectedBookingId(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100">
              <option value="">Select a student</option>

              {bookings.map((booking) => (
                <option key={booking._id} value={booking._id}>
                  {booking.student.fullName} — {booking.subject}
                </option>
              ))}
            </select>
          </div>

          {selectedBooking && (
            <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm">
              <p className="font-semibold text-blue-950">
                {selectedBooking.student.fullName}
              </p>

              <p className="mt-1 text-gray-600">
                {selectedBooking.subject} ·{" "}
                {formatDate(selectedBooking.sessionDate)}
              </p>
            </div>
          )}

          <div className="mt-5">
            <label
              htmlFor="assignment-title"
              className="text-sm font-semibold text-blue-950">
              Assignment title
            </label>

            <input
              id="assignment-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Algebra practice worksheet"
              required
              maxLength="120"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="assignment-instructions"
              className="text-sm font-semibold text-blue-950">
              Instructions
            </label>

            <textarea
              id="assignment-instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="Explain what the student needs to complete."
              required
              rows="5"
              maxLength="3000"
              className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="assignment-due-date"
              className="text-sm font-semibold text-blue-950">
              Due date
            </label>

            <input
              id="assignment-due-date"
              type="date"
              value={dueDate}
              min={getTomorrowDate()}
              onChange={(event) => setDueDate(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Choose a future weekday. Weekend due dates are not allowed.
            </p>
          </div>

          <div className="mt-5">
            <label
              htmlFor="resource-link"
              className="text-sm font-semibold text-blue-950">
              Resource link <span className="font-normal">(optional)</span>
            </label>

            <input
              id="resource-link"
              type="url"
              value={resourceLink}
              onChange={(event) => setResourceLink(event.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || bookings.length === 0}
            className="mt-6 w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300">
            {submitting ? "Creating..." : "Create Assignment"}
          </button>
        </form>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-blue-950">
              Your Assignments
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review submitted work and provide useful feedback.
            </p>
          </div>

          {loading && (
            <div className="p-10 text-center text-gray-600">
              Loading assignments...
            </div>
          )}

          {!loading && !error && assignments.length === 0 && (
            <div className="p-10 text-center">
              <div className="text-4xl">📝</div>

              <h3 className="mt-4 text-xl font-bold text-blue-950">
                No assignments created yet
              </h3>

              <p className="mt-2 text-gray-600">
                Create your first assignment for one of your students.
              </p>
            </div>
          )}

          {!loading && assignments.length > 0 && (
            <div className="divide-y divide-gray-100">
              {assignments.map((assignment) => {
                const reviewFormOpen = openReviewId === assignment._id;

                const { isOverdue, isDueToday, isDueTomorrow } =
                  getAssignmentMeta(assignment);

                const displayStatus = isOverdue ? "overdue" : assignment.status;

                return (
                  <article key={assignment._id} className="p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <p className="text-sm font-semibold text-orange-700">
                          {assignment.student?.fullName || "Student"}
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-blue-950">
                          {assignment.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {assignment.instructions}
                        </p>
                      </div>

                      <span
                        className={`h-fit rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(
                          displayStatus,
                        )}`}>
                        {isOverdue ? "Overdue" : assignment.status}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm">
                      <p
                        className={`rounded-lg px-3 py-2 ${
                          isOverdue
                            ? "bg-red-50 font-semibold text-red-700"
                            : "bg-slate-100 text-blue-950"
                        }`}>
                        Due: {formatDate(assignment.dueDate)}
                      </p>

                      {isOverdue && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 font-semibold text-red-700">
                          Overdue — awaiting student submission
                        </p>
                      )}

                      {isDueToday && (
                        <p className="rounded-lg bg-orange-50 px-3 py-2 font-semibold text-orange-700">
                          Due today
                        </p>
                      )}

                      {isDueTomorrow && (
                        <p className="rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700">
                          Due tomorrow
                        </p>
                      )}

                      {assignment.resourceLink && (
                        <a
                          href={assignment.resourceLink}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700 hover:underline">
                          Open resource →
                        </a>
                      )}
                    </div>

                    {assignment.status === "submitted" && (
                      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                        <p className="font-semibold text-blue-950">
                          Student Submission
                        </p>

                        <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-700">
                          {assignment.submissionText ||
                            "No written response was provided."}
                        </p>

                        {assignment.submissionLink && (
                          <a
                            href={assignment.submissionLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
                            Open student submission →
                          </a>
                        )}
                      </div>
                    )}

                    {assignment.status === "reviewed" && (
                      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
                        <p className="font-semibold text-green-800">
                          Feedback sent to student
                        </p>

                        <p className="mt-2 whitespace-pre-wrap leading-7 text-green-900">
                          {assignment.tutorFeedback}
                        </p>
                      </div>
                    )}

                    {assignment.status === "submitted" && !reviewFormOpen && (
                      <button
                        type="button"
                        onClick={() => openReviewForm(assignment)}
                        className="mt-6 rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white hover:bg-blue-900">
                        Review & Feedback
                      </button>
                    )}

                    {reviewFormOpen && (
                      <form
                        onSubmit={(event) =>
                          handleReviewAssignment(event, assignment._id)
                        }
                        className="mt-6 rounded-xl bg-slate-50 p-5">
                        <label
                          htmlFor={`feedback-${assignment._id}`}
                          className="text-lg font-bold text-blue-950">
                          Feedback for {assignment.student?.fullName}
                        </label>

                        <textarea
                          id={`feedback-${assignment._id}`}
                          value={tutorFeedback}
                          onChange={(event) =>
                            setTutorFeedback(event.target.value)
                          }
                          rows="5"
                          maxLength="3000"
                          required
                          placeholder="Give clear, helpful feedback to the student."
                          className="mt-4 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
                        />

                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="submit"
                            disabled={reviewing}
                            className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300">
                            {reviewing
                              ? "Saving..."
                              : "Mark Reviewed & Send Feedback"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setOpenReviewId("")}
                            className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-white">
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TutorAssignments;
