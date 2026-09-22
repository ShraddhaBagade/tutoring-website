import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { apiUrl } from "../../config/api";

function AdminTutorApplications() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionTutorId, setActionTutorId] = useState(null);

  useEffect(() => {
    async function getPendingApplications() {
      try {
        const response = await fetch(apiUrl("/api/tutors/admin/pending"), {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load applications.");
          return;
        }

        setApplications(data.tutors || []);
      } catch {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    getPendingApplications();
  }, []);

  async function handleApplicationAction(tutorId, action) {
    const actionLabel = action === "approve" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel} this tutor application?`
    );

    if (!confirmed) {
      return;
    }

    setActionTutorId(tutorId);
    setError("");

    try {
      const response = await fetch(
        apiUrl(`/api/tutors/admin/${tutorId}/${action}`),
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to update application.");
        return;
      }

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application.tutorId !== tutorId
        )
      );
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setActionTutorId(null);
    }
  }

  if (user?.accountType !== "admin") {
    return (
      <section className="py-20 text-center">
        <h1 className="text-3xl font-bold text-blue-950">
          Admin access required
        </h1>

        <p className="mt-3 text-gray-600">
          You do not have permission to view tutor applications.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-block font-semibold text-blue-700 hover:underline"
        >
          Return to Dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-semibold uppercase tracking-wide text-orange-600">
            Admin area
          </p>

          <h1 className="mt-2 text-3xl font-bold text-blue-950">
            Tutor Applications
          </h1>

          <p className="mt-2 text-gray-600">
            Review applications before tutors become visible to students.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex w-fit rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-white"
        >
          ← Student Dashboard
        </Link>
      </div>

      {loading && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="font-medium text-gray-600">
            Loading tutor applications...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">✓</div>

          <h2 className="mt-4 text-2xl font-bold text-blue-950">
            No pending applications
          </h2>

          <p className="mt-2 text-gray-600">
            New tutor applications will appear here for review.
          </p>
        </div>
      )}

      {!loading && applications.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {applications.map((tutor) => (
            <article
              key={tutor._id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex gap-5 p-6">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="h-20 w-20 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <p className="font-semibold text-orange-700">
                    {tutor.subject}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-blue-950">
                    {tutor.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {tutor.experience} of experience
                  </p>

                  <p className="mt-2 break-all text-sm text-gray-600">
                    {tutor.email || "Email not provided"}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 px-6 py-5">
                <p className="leading-7 text-gray-600">
                  {tutor.bio || "No introduction provided."}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    disabled={actionTutorId === tutor.tutorId}
                    onClick={() =>
                      handleApplicationAction(
                        tutor.tutorId,
                        "approve"
                      )
                    }
                    className="flex-1 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {actionTutorId === tutor.tutorId
                      ? "Updating..."
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    disabled={actionTutorId === tutor.tutorId}
                    onClick={() =>
                      handleApplicationAction(
                        tutor.tutorId,
                        "reject"
                      )
                    }
                    className="flex-1 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminTutorApplications;