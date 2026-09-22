import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiUrl } from "../../config/api";

function TutorLessonNotes() {
  const [bookings, setBookings] = useState([]);
  const [notes, setNotes] = useState([]);

  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [lessonSummary, setLessonSummary] = useState("");
  const [progressUpdate, setProgressUpdate] = useState("");
  const [homeworkReminder, setHomeworkReminder] = useState("");
  const [classVideoUrl, setClassVideoUrl] = useState("");
  const [classNotesUrl, setClassNotesUrl] = useState("");
  const [privateTutorNotes, setPrivateTutorNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadClassNotes() {
      try {
        const [bookingsResponse, notesResponse] = await Promise.all([
          fetch( apiUrl("/api/bookings/tutor-bookings"), {
            credentials: "include",
          }),
          fetch( apiUrl("/api/lesson-notes/tutor"), {
            credentials: "include",
          }),
        ]);

        const bookingsData = await bookingsResponse.json();
        const notesData = await notesResponse.json();

        if (!bookingsResponse.ok) {
          setError(
            bookingsData.message || "Unable to load completed sessions."
          );
          return;
        }

        if (!notesResponse.ok) {
          setError(notesData.message || "Unable to load class notes.");
          return;
        }

        setBookings(
          (bookingsData.bookings || []).filter(
            (booking) => booking.status === "completed"
          )
        );

        setNotes(notesData.notes || []);
      } catch {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadClassNotes();
  }, []);

  const selectedBooking = bookings.find(
    (booking) => booking._id === selectedBookingId
  );

  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function handleBookingChange(bookingId) {
    setSelectedBookingId(bookingId);
    setError("");
    setMessage("");

    const existingNote = notes.find(
      (note) => note.booking?._id === bookingId
    );

    setLessonSummary(existingNote?.lessonSummary || "");
    setProgressUpdate(existingNote?.progressUpdate || "");
    setHomeworkReminder(existingNote?.homeworkReminder || "");
    setClassVideoUrl(existingNote?.classVideoUrl || "");
    setClassNotesUrl(existingNote?.classNotesUrl || "");
    setPrivateTutorNotes(existingNote?.privateTutorNotes || "");
  }

  async function handleSaveClassNotes(event) {
    event.preventDefault();

    if (!selectedBooking) {
      setError("Select a completed session first.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
         apiUrl("/api/lesson-notes/${selectedBooking._id}"),
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonSummary,
            progressUpdate,
            homeworkReminder,
            classVideoUrl,
            classNotesUrl,
            privateTutorNotes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to save class notes.");
        return;
      }

      const existingNote = notes.find(
        (note) => note.booking?._id === selectedBooking._id
      );

      const savedNote = {
        ...data.lessonNote,
        booking: existingNote?.booking || {
          _id: selectedBooking._id,
          subject: selectedBooking.subject,
          sessionDate: selectedBooking.sessionDate,
          sessionTime: selectedBooking.sessionTime,
        },
        student: existingNote?.student || selectedBooking.student,
      };

      setNotes((currentNotes) =>
        existingNote
          ? currentNotes.map((note) =>
              note._id === existingNote._id ? savedNote : note
            )
          : [savedNote, ...currentNotes]
      );

      setMessage("Class notes saved successfully.");
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="py-10">
      <div>
        <Link
          to="/dashboard/tutor"
          className="text-sm font-semibold text-blue-700 hover:underline"
        >
          ← Back to Tutor Dashboard
        </Link>

        <p className="mt-6 font-semibold uppercase tracking-wide text-orange-600">
          Teaching workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold text-blue-950">
          Class Notes
        </h1>

        <p className="mt-2 text-gray-600">
          Record class content, learning progress, resources, and homework.
        </p>
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
          onSubmit={handleSaveClassNotes}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1"
        >
          <h2 className="text-xl font-bold text-blue-950">
            Add Class Notes
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Class Notes can be added only after you complete a session.
          </p>

          <div className="mt-6">
            <label
              htmlFor="completed-session"
              className="text-sm font-semibold text-blue-950"
            >
              Completed session
            </label>

            <select
              id="completed-session"
              value={selectedBookingId}
              onChange={(event) => handleBookingChange(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select a completed session</option>

              {bookings.map((booking) => (
                <option key={booking._id} value={booking._id}>
                  {booking.student?.fullName} — {booking.subject}
                </option>
              ))}
            </select>
          </div>

          {selectedBooking && (
            <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm">
              <p className="font-semibold text-blue-950">
                {selectedBooking.student?.fullName}
              </p>

              <p className="mt-1 text-gray-600">
                {selectedBooking.subject} ·{" "}
                {formatDate(selectedBooking.sessionDate)}
              </p>
            </div>
          )}

          <div className="mt-5">
            <label
              htmlFor="class-notes"
              className="text-sm font-semibold text-blue-950"
            >
              Class Notes
            </label>

            <textarea
              id="class-notes"
              value={lessonSummary}
              onChange={(event) => setLessonSummary(event.target.value)}
              required
              rows="5"
              maxLength="3000"
              placeholder="What was taught during this class?"
              className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="progress-update"
              className="text-sm font-semibold text-blue-950"
            >
              Progress update <span className="font-normal">(shared)</span>
            </label>

            <textarea
              id="progress-update"
              value={progressUpdate}
              onChange={(event) => setProgressUpdate(event.target.value)}
              rows="3"
              maxLength="2000"
              placeholder="Example: Strong progress with algebraic equations."
              className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="homework-reminder"
              className="text-sm font-semibold text-blue-950"
            >
              Homework reminder <span className="font-normal">(shared)</span>
            </label>

            <textarea
              id="homework-reminder"
              value={homeworkReminder}
              onChange={(event) => setHomeworkReminder(event.target.value)}
              rows="3"
              maxLength="2000"
              placeholder="Example: Complete Algebra Practice 1."
              className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="class-video-url"
              className="text-sm font-semibold text-blue-950"
            >
              Class video link <span className="font-normal">(optional)</span>
            </label>

            <input
              id="class-video-url"
              type="url"
              value={classVideoUrl}
              onChange={(event) => setClassVideoUrl(event.target.value)}
              placeholder="Google Drive, Loom, or YouTube link"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="class-material-url"
              className="text-sm font-semibold text-blue-950"
            >
              Class material / PDF link{" "}
              <span className="font-normal">(optional)</span>
            </label>

            <input
              id="class-material-url"
              type="url"
              value={classNotesUrl}
              onChange={(event) => setClassNotesUrl(event.target.value)}
              placeholder="Google Drive PDF or document link"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="private-tutor-notes"
              className="text-sm font-semibold text-blue-950"
            >
              Private tutor notes
            </label>

            <textarea
              id="private-tutor-notes"
              value={privateTutorNotes}
              onChange={(event) =>
                setPrivateTutorNotes(event.target.value)
              }
              rows="3"
              maxLength="2000"
              placeholder="Visible only to you."
              className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={saving || bookings.length === 0}
            className="mt-6 w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {saving ? "Saving..." : "Save Class Notes"}
          </button>
        </form>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-blue-950">
              Saved Class Notes
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Private tutor notes are visible only to you.
            </p>
          </div>

          {loading && (
            <div className="p-10 text-center text-gray-600">
              Loading class notes...
            </div>
          )}

          {!loading && !error && notes.length === 0 && (
            <div className="p-10 text-center">
              <div className="text-4xl">📘</div>

              <h3 className="mt-4 text-xl font-bold text-blue-950">
                No Class Notes yet
              </h3>

              <p className="mt-2 text-gray-600">
                Complete a session, then add Class Notes for the student.
              </p>
            </div>
          )}

          {!loading && notes.length > 0 && (
            <div className="divide-y divide-gray-100">
              {notes.map((note) => (
                <article key={note._id} className="p-6">
                  <p className="text-sm font-semibold text-orange-700">
                    {note.student?.fullName || "Student"}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-blue-950">
                    {note.booking?.subject || "Tutoring Session"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {note.booking?.sessionDate
                      ? formatDate(note.booking.sessionDate)
                      : "Completed session"}
                    {note.booking?.sessionTime
                      ? ` · ${note.booking.sessionTime}`
                      : ""}
                  </p>

                  <div className="mt-5 space-y-5">
                    <div>
                      <p className="font-semibold text-blue-950">
                        Class Notes
                      </p>

                      <p className="mt-1 whitespace-pre-wrap leading-7 text-gray-600">
                        {note.lessonSummary}
                      </p>
                    </div>

                    {note.progressUpdate && (
                      <div className="rounded-xl bg-blue-50 p-4">
                        <p className="font-semibold text-blue-950">
                          Progress Update
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-gray-700">
                          {note.progressUpdate}
                        </p>
                      </div>
                    )}

                    {note.homeworkReminder && (
                      <div className="rounded-xl bg-orange-50 p-4">
                        <p className="font-semibold text-orange-800">
                          Homework Reminder
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-orange-900">
                          {note.homeworkReminder}
                        </p>
                      </div>
                    )}

                    {(note.classVideoUrl || note.classNotesUrl) && (
                      <div className="flex flex-wrap gap-3">
                        {note.classVideoUrl && (
                          <a
                            href={note.classVideoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-blue-50 px-4 py-2 font-semibold text-blue-700 hover:underline"
                          >
                            Watch Class Video →
                          </a>
                        )}

                        {note.classNotesUrl && (
                          <a
                            href={note.classNotesUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-orange-50 px-4 py-2 font-semibold text-orange-700 hover:underline"
                          >
                            Open Class Material →
                          </a>
                        )}
                      </div>
                    )}

                    {note.privateTutorNotes && (
                      <div className="rounded-xl border border-dashed border-gray-300 p-4">
                        <p className="font-semibold text-gray-700">
                          Private Tutor Notes
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-gray-600">
                          {note.privateTutorNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TutorLessonNotes;