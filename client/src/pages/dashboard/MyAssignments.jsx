import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiUrl } from "../../config/api";

function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [openAssignmentId, setOpenAssignmentId] = useState("");
  const [submissionText, setSubmissionText] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function getAssignments() {
      try {
        const response = await fetch(
           apiUrl("/api/assignments/student"),
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load assignments.");
          return;
        }

        setAssignments(data.assignments || []);
      } catch {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    getAssignments();
  }, []);

  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
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

    const isOverdue =
      isAwaitingSubmission && dueDate < todayStart;

    const isDueToday =
      isAwaitingSubmission &&
      dueDate >= todayStart &&
      dueDate < tomorrowStart;

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

  function openSubmissionForm(assignment) {
    setOpenAssignmentId(assignment._id);
    setSubmissionText(assignment.submissionText || "");
    setSubmissionLink(assignment.submissionLink || "");
    setError("");
    setMessage("");
  }

  async function handleSubmitAssignment(event, assignmentId) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
         apiUrl("/api/assignments/${assignmentId}/submit"),
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submissionText,
            submissionLink,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to submit assignment.");
        return;
      }

      setAssignments((currentAssignments) =>
        currentAssignments.map((assignment) =>
          assignment._id === assignmentId
            ? {
                ...assignment,
                ...data.assignment,
                tutor: assignment.tutor,
                booking: assignment.booking,
              }
            : assignment
        )
      );

      setOpenAssignmentId("");
      setMessage(data.message);
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-semibold uppercase tracking-wide text-orange-600">
            Learning workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-blue-950">
            My Assignments
          </h1>

          <p className="mt-2 text-gray-600">
            View your assigned work, submit your answers, and read tutor
            feedback.
          </p>
        </div>

        <Link
          to="/dashboard/sessions"
          className="inline-flex w-fit rounded-xl border border-gray-300 px-5 py-3 font-semibold text-blue-950 hover:bg-white"
        >
          View My Sessions
        </Link>
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

      {loading && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
          Loading assignments...
        </div>
      )}

      {!loading && !error && assignments.length === 0 && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <div className="text-4xl">📝</div>

          <h2 className="mt-4 text-xl font-bold text-blue-950">
            No assignments yet
          </h2>

          <p className="mt-2 text-gray-600">
            Assignments from your tutors will appear here.
          </p>
        </div>
      )}

      {!loading && assignments.length > 0 && (
        <div className="mt-8 space-y-6">
          {assignments.map((assignment) => {
            const submissionFormOpen =
              openAssignmentId === assignment._id;

            const { isOverdue, isDueToday, isDueTomorrow } =
              getAssignmentMeta(assignment);

            const displayStatus = isOverdue
              ? "overdue"
              : assignment.status;

            return (
              <article
                key={assignment._id}
                className={`rounded-2xl border bg-white p-6 shadow-sm ${
                  isOverdue
                    ? "border-red-200"
                    : "border-gray-200"
                }`}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <p className="font-semibold text-orange-700">
                      {assignment.booking?.subject || "Tutoring Assignment"}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-blue-950">
                      {assignment.title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Assigned by{" "}
                      {assignment.tutor?.fullName || "Your tutor"}
                    </p>
                  </div>

                  <span
                    className={`h-fit rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(
                      displayStatus
                    )}`}
                  >
                    {isOverdue ? "Overdue" : assignment.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 border-y border-gray-100 py-6 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold text-blue-950">
                      Instructions
                    </p>

                    <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-600">
                      {assignment.instructions}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-4 ${
                      isOverdue ? "bg-red-50" : "bg-slate-50"
                    }`}
                  >
                    <p className="text-sm text-gray-500">Due date</p>

                    <p className="mt-1 font-bold text-blue-950">
                      {formatDate(assignment.dueDate)}
                    </p>

                    {isOverdue && (
                      <p className="mt-2 text-sm font-semibold text-red-700">
                        Overdue — submit your work as soon as possible.
                      </p>
                    )}

                    {isDueToday && (
                      <p className="mt-2 text-sm font-semibold text-orange-700">
                        Due today
                      </p>
                    )}

                    {isDueTomorrow && (
                      <p className="mt-2 text-sm font-semibold text-blue-700">
                        Due tomorrow
                      </p>
                    )}

                    {assignment.resourceLink && (
                      <a
                        href={assignment.resourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
                      >
                        Open resource →
                      </a>
                    )}
                  </div>
                </div>

                {assignment.status === "reviewed" && (
                  <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
                    <p className="font-semibold text-green-800">
                      Tutor Feedback
                    </p>

                    <p className="mt-2 whitespace-pre-wrap leading-7 text-green-900">
                      {assignment.tutorFeedback ||
                        "Your tutor reviewed this work."}
                    </p>
                  </div>
                )}

                {assignment.status !== "reviewed" &&
                  !submissionFormOpen && (
                    <button
                      type="button"
                      onClick={() => openSubmissionForm(assignment)}
                      className="mt-6 rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
                    >
                      {assignment.status === "submitted"
                        ? "Edit Submission"
                        : "Submit Assignment"}
                    </button>
                  )}

                {submissionFormOpen && (
                  <form
                    onSubmit={(event) =>
                      handleSubmitAssignment(event, assignment._id)
                    }
                    className="mt-6 rounded-xl bg-slate-50 p-5"
                  >
                    <h3 className="text-lg font-bold text-blue-950">
                      Your Submission
                    </h3>

                    <div className="mt-4">
                      <label
                        htmlFor={`submission-text-${assignment._id}`}
                        className="text-sm font-semibold text-blue-950"
                      >
                        Written response
                      </label>

                      <textarea
                        id={`submission-text-${assignment._id}`}
                        value={submissionText}
                        onChange={(event) =>
                          setSubmissionText(event.target.value)
                        }
                        rows="5"
                        maxLength="5000"
                        placeholder="Write your answer or explain your completed work."
                        className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor={`submission-link-${assignment._id}`}
                        className="text-sm font-semibold text-blue-950"
                      >
                        Submission link{" "}
                        <span className="font-normal">(optional)</span>
                      </label>

                      <input
                        id={`submission-link-${assignment._id}`}
                        type="url"
                        value={submissionLink}
                        onChange={(event) =>
                          setSubmissionLink(event.target.value)
                        }
                        placeholder="https://..."
                        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {submitting ? "Submitting..." : "Submit Work"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpenAssignmentId("")}
                        className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-white"
                      >
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
    </section>
  );
}

export default MyAssignments;