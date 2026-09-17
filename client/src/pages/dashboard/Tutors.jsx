import { Link, useSearchParams } from "react-router";
import { useState } from "react";
import tutors from "../../data/tutors";

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

  const [searchTerm, setSearchTerm] = useState("");

  const requestedSubject = searchParams.get("subject") || "All";

  const selectedSubject = subjects.includes(requestedSubject)
    ? requestedSubject
    : "All";

  function handleSubjectChange(subject) {
    if (subject === "All") {
      setSearchParams({});
      return;
    }

    setSearchParams({
      subject,
    });
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

        <p className="font-medium text-gray-500">
          {filteredTutors.length}{" "}
          {filteredTutors.length === 1 ? "tutor" : "tutors"} found
        </p>
      </div>

      {/* Tutor search */}
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

      {/* Subject filters */}
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

      {/* Tutor cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTutors.map((tutor) => (
          <article
            key={tutor.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            {/* Clickable tutor-card content */}
            <Link
              to={`/dashboard/tutors/${tutor.id}/schedule`}
              className="group block"
              aria-label={`Book a session with ${tutor.name}`}>
              <div className="relative overflow-hidden">
                <img
                  src={tutor.image}
                  alt={`${tutor.name}, ${tutor.subject} tutor`}
                  className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-green-700 shadow">
                  ● Available
                </span>

                <span className="absolute bottom-4 left-4 rounded-full bg-blue-950 px-3 py-1 text-sm font-semibold text-white">
                  {tutor.subject}
                </span>
              </div>

              <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-blue-950 group-hover:text-blue-700">
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

                <div className="mt-5 border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-blue-950">
                      Next available
                    </p>

                    <p className="text-sm font-semibold text-green-700">
                      {tutor.nextAvailable}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {tutor.times.slice(0, 3).map((time) => (
                      <span
                        key={time}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-blue-950">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-5 text-sm font-semibold text-blue-700">
                  Click card to view availability and book →
                </p>
              </div>
            </Link>

            {/* Separate booking button */}
            <div className="px-6 pb-6">
              <Link
                to={`/dashboard/tutors/${tutor.id}/schedule`}
                className="flex w-full items-center justify-center rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700">
                Book Session
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredTutors.length === 0 && (
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
