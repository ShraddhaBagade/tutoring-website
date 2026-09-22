import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { apiUrl } from "../../config/api";

function Tutors() {
  const subjects = [
    "All",
    "Mathematics",
    "Science",
    "Social Studies",
    "Computer Skills",
    "English",
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  const [tutors, setTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestedSubject = searchParams.get("subject") || "All";

  const selectedSubject = subjects.includes(requestedSubject)
    ? requestedSubject
    : "All";

  useEffect(() => {
    async function getTutors() {
      try {
        const response = await fetch( apiUrl("/api/tutors"));

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load tutors.");
          return;
        }

        setTutors(data.tutors || []);
      } catch {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    getTutors();
  }, []);

  function handleSubjectChange(subject) {
    if (subject === "All") {
      setSearchParams({});
      return;
    }

    setSearchParams({ subject });
  }

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSubject =
      selectedSubject === "All" || tutor.subject === selectedSubject;

    const searchValue = searchTerm.trim().toLowerCase();

    const matchesSearch =
      tutor.name.toLowerCase().includes(searchValue) ||
      tutor.subject.toLowerCase().includes(searchValue);

    return matchesSubject && matchesSearch;
  });

  return (
    <section className="py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-semibold uppercase tracking-wide text-orange-600">
            Expert guidance
          </p>

          <h1 className="mt-2 text-3xl font-bold text-blue-950">
            Find the Right Tutor
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Browse experienced tutors and select one who matches your learning
            needs.
          </p>
        </div>

        {!loading && !error && (
          <p className="font-medium text-gray-500">
            {filteredTutors.length}{" "}
            {filteredTutors.length === 1 ? "tutor" : "tutors"} found
          </p>
        )}
      </div>

      <div className="mt-8">
        <label htmlFor="tutor-search" className="sr-only">
          Search tutors
        </label>

        <div className="relative max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          <input
            id="tutor-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by tutor name or subject"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-12 outline-none transition focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
          />

          {searchTerm && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-blue-950">
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {subjects.map((subject) => (
          <button
            key={subject}
            type="button"
            onClick={() => handleSubjectChange(subject)}
            className={
              selectedSubject === subject
                ? "rounded-full bg-blue-950 px-5 py-2.5 font-medium text-white shadow-sm"
                : "rounded-full border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 hover:border-blue-950 hover:text-blue-950"
            }>
            {subject}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="font-medium text-gray-600">Loading tutors...</p>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="font-bold text-red-700">Unable to load tutors</h2>

          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTutors.map((tutor) => (
            <Link
              key={tutor._id}
              to={`/dashboard/tutors/${tutor.tutorId}/schedule`}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              aria-label={`View availability for ${tutor.name}`}>
              <div className="relative overflow-hidden">
                <img
                  src={tutor.image}
                  alt={`${tutor.name}, ${tutor.subject} tutor`}
                  className="h-64 w-full object-cover object-center transition duration-300 group-hover:scale-105"
                />

                <span className="absolute bottom-4 left-4 rounded-full bg-blue-950 px-3 py-1 text-sm font-semibold text-white">
                  {tutor.subject}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-blue-950 transition group-hover:text-blue-700">
                      {tutor.name}
                    </h2>

                    <p className="mt-2 text-gray-500">
                      {tutor.experience} of experience
                    </p>
                  </div>

                  <span className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
                    ★ 4.9
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <p className="font-semibold text-blue-950">
                    View availability
                  </p>

                  <span className="text-lg font-semibold text-orange-600">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && filteredTutors.length === 0 && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <div className="text-4xl">🔎</div>

          <h2 className="mt-4 text-xl font-bold text-blue-950">
            No tutors found
          </h2>

          <p className="mt-2 text-gray-600">
            Try another name or select a different subject.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSearchParams({});
            }}
            className="mt-5 rounded-lg bg-blue-950 px-5 py-3 font-semibold text-white hover:bg-blue-900">
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}

export default Tutors;
