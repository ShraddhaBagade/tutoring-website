import { useState } from "react";
import { Link } from "react-router";
import tutors from "../../data/tutors";

function BookSession() {
  const [selectedSubject, setSelectedSubject] = useState("");

  const subjects = [...new Set(tutors.map((tutor) => tutor.subject))];

  const matchingTutors = selectedSubject
    ? tutors.filter((tutor) => tutor.subject === selectedSubject)
    : [];

  return (
    <section className="py-10">
      {/* Heading */}
      <div>
        <p className="font-semibold uppercase tracking-wide text-orange-600">
          Schedule a lesson
        </p>

        <h1 className="mt-2 text-3xl font-bold text-blue-950">
          Book a Session
        </h1>

        <p className="mt-2 max-w-2xl text-gray-600">
          Choose the subject you need help with, select a tutor, and then pick
          an available date and time.
        </p>
      </div>

      {/* Progress steps */}
      <div className="mt-8 grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-950 font-bold text-white">
            1
          </span>

          <div>
            <p className="font-semibold text-blue-950">Choose Tutor</p>

            <p className="text-sm text-gray-500">Current step</p>
          </div>
        </div>

        <div className="flex items-center gap-3 opacity-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
            2
          </span>

          <div>
            <p className="font-semibold text-blue-950">Select Time</p>

            <p className="text-sm text-gray-500">Date and time</p>
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

      {/* Subject selection */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-blue-950">
          What subject do you need help with?
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => setSelectedSubject(subject)}
              className={
                selectedSubject === subject
                  ? "rounded-full bg-blue-950 px-5 py-3 font-semibold text-white shadow-sm"
                  : "rounded-full border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:border-blue-950 hover:text-blue-950"
              }>
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Initial instruction */}
      {!selectedSubject && (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="text-4xl">📚</div>

          <h2 className="mt-4 text-xl font-bold text-blue-950">
            Select a subject to continue
          </h2>

          <p className="mt-2 text-gray-500">
            Available tutors will appear here after you choose a subject.
          </p>
        </div>
      )}

      {/* Matching tutors */}
      {selectedSubject && (
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-950">
                Choose Your Tutor
              </h2>

              <p className="mt-1 text-gray-600">
                Tutors available for {selectedSubject}
              </p>
            </div>

            <p className="text-sm font-medium text-gray-500">
              {matchingTutors.length} found
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matchingTutors.map((tutor) => (
              <article
                key={tutor.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative">
                  <img
                    src={tutor.image}
                    alt={`${tutor.name}, ${tutor.subject} tutor`}
                    className="h-52 w-full object-cover"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-green-700 shadow">
                    ● Available
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-sm font-semibold text-orange-700">
                    {tutor.subject}
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-blue-950">
                    {tutor.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {tutor.experience} of experience
                  </p>

                  <p className="mt-4 text-sm font-semibold text-blue-950">
                    Next available: {tutor.nextAvailable}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {tutor.times.slice(0, 3).map((time) => (
                      <span
                        key={time}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-gray-700">
                        {time}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/dashboard/tutors/${tutor.id}/schedule`}
                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700">
                    Select Tutor
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default BookSession;
