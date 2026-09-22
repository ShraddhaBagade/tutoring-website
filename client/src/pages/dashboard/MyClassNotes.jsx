import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiUrl } from "../../config/api";

function MyClassNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getClassNotes() {
      try {
        const response = await fetch(
           apiUrl("/api/lesson-notes/student"),
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load class notes.");
          return;
        }

        setNotes(data.notes || []);
      } catch {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    getClassNotes();
  }, []);

  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <section className="py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-semibold uppercase tracking-wide text-orange-600">
            Learning workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-blue-950">
            My Class Notes
          </h1>

          <p className="mt-2 text-gray-600">
            Review what was covered in your completed tutoring sessions.
          </p>
        </div>

        <Link
          to="/dashboard/sessions"
          className="inline-flex w-fit rounded-xl border border-gray-300 px-5 py-3 font-semibold text-blue-950 hover:bg-white"
        >
          View My Sessions
        </Link>
      </div>

      {loading && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
          Loading class notes...
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <div className="text-4xl">📘</div>

          <h2 className="mt-4 text-xl font-bold text-blue-950">
            No class notes yet
          </h2>

          <p className="mt-2 text-gray-600">
            Your tutor’s shared class notes will appear here after a completed
            session.
          </p>
        </div>
      )}

      {!loading && !error && notes.length > 0 && (
        <div className="mt-8 space-y-6">
          {notes.map((note) => (
            <article
              key={note._id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p className="font-semibold text-orange-700">
                    {note.booking?.subject || "Tutoring Session"}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-blue-950">
                    Class Notes
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {note.tutor?.fullName || "Your tutor"}
                    {note.booking?.sessionDate
                      ? ` · ${formatDate(note.booking.sessionDate)}`
                      : ""}
                    {note.booking?.sessionTime
                      ? ` · ${note.booking.sessionTime}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 border-y border-gray-100 py-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <p className="font-semibold text-blue-950">
                    What Was Taught
                  </p>

                  <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-600">
                    {note.lessonSummary}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Session</p>

                  <p className="mt-1 font-bold text-blue-950">
                    {note.booking?.sessionDate
                      ? formatDate(note.booking.sessionDate)
                      : "Completed session"}
                  </p>
                </div>
              </div>

              {note.progressUpdate && (
                <div className="mt-6 rounded-xl bg-blue-50 p-5">
                  <p className="font-semibold text-blue-950">
                    Progress Update
                  </p>

                  <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">
                    {note.progressUpdate}
                  </p>
                </div>
              )}

              {note.homeworkReminder && (
                <div className="mt-5 rounded-xl bg-orange-50 p-5">
                  <p className="font-semibold text-orange-800">
                    Homework Reminder
                  </p>

                  <p className="mt-2 whitespace-pre-wrap leading-7 text-orange-900">
                    {note.homeworkReminder}
                  </p>
                </div>
              )}

              {(note.classVideoUrl || note.classNotesUrl) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {note.classVideoUrl && (
                    <a
                      href={note.classVideoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white hover:bg-blue-900"
                    >
                      Watch Class Video →
                    </a>
                  )}

                  {note.classNotesUrl && (
                    <a
                      href={note.classNotesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
                    >
                      Open Class Material →
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyClassNotes;