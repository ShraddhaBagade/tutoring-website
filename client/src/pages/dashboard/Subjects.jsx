import { Link } from "react-router";

const subjects = [
  {
    name: "Mathematics",
    icon: "∑",
    color: "bg-blue-100 text-blue-700",
    description:
      "Build confidence in arithmetic, algebra, geometry, trigonometry, and calculus.",
    topics: ["Algebra", "Geometry", "Calculus"],
  },
  {
    name: "Science",
    icon: "⚗",
    color: "bg-green-100 text-green-700",
    description:
      "Understand scientific concepts through clear explanations and practical examples.",
    topics: ["Physics", "Chemistry", "Biology"],
  },
  {
    name: "Social Studies",
    icon: "🌍",
    color: "bg-orange-100 text-orange-700",
    description:
      "Explore history, geography, civics, economics, and cultures around the world.",
    topics: ["History", "Geography", "Civics"],
  },
  {
    name: "Computer Skills",
    icon: "</>",
    color: "bg-purple-100 text-purple-700",
    description:
      "Develop essential computer knowledge, digital literacy, and programming skills.",
    topics: ["Programming", "Web Skills", "Technology"],
  },
  {
    name: "English",
    icon: "Aa",
    color: "bg-rose-100 text-rose-700",
    description:
      "Improve reading, writing, grammar, communication, and literary understanding.",
    topics: ["Grammar", "Writing", "Reading"],
  },
];

function Subjects() {
  return (
    <section className="py-10">
      {/* Page heading */}
      <div>
        <p className="font-semibold uppercase tracking-wide text-orange-600">
          Explore and learn
        </p>

        <h1 className="mt-2 text-3xl font-bold text-blue-950 md:text-4xl">
          Choose a Subject
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Select the subject where you need support and find an
          experienced tutor who can help you reach your goals.
        </p>
      </div>

      {/* Subject cards */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <article
            key={subject.name}
            className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold ${subject.color}`}
            >
              {subject.icon}
            </div>

            <h2 className="mt-6 text-2xl font-bold text-blue-950">
              {subject.name}
            </h2>

            <p className="mt-3 flex-1 leading-7 text-gray-600">
              {subject.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {subject.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-gray-600"
                >
                  {topic}
                </span>
              ))}
            </div>

            <Link
              to={`/dashboard/tutors?subject=${encodeURIComponent(
                subject.name
              )}`}
              className="mt-7 flex items-center justify-between border-t border-gray-100 pt-5 font-semibold text-blue-950 group-hover:text-orange-600"
            >
              <span>Find Tutors</span>
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>

      {/* Help section */}
      <div className="mt-10 flex flex-col justify-between gap-5 rounded-2xl bg-blue-950 p-8 text-white md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold">
            Not sure which subject to choose?
          </h2>

          <p className="mt-2 text-blue-100">
            Browse all tutors and choose one based on their
            experience and availability.
          </p>
        </div>

        <Link
          to="/dashboard/tutors"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
        >
          Browse All Tutors
        </Link>
      </div>
    </section>
  );
}

export default Subjects;