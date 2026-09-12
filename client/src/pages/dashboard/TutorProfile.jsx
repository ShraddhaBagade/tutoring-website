import { Link, useParams } from "react-router";
import tutors from "../../data/tutors";

function TutorProfile() {
  const { tutorId } = useParams();

  const tutor = tutors.find(
    (item) => item.id === Number(tutorId)
  );

  if (!tutor) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-3xl font-bold text-blue-950">
          Tutor not found
        </h1>

        <p className="mt-3 text-gray-600">
          This tutor may no longer be available.
        </p>

        <Link
          to="/dashboard/tutors"
          className="mt-6 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Return to Tutors
        </Link>
      </section>
    );
  }

  return (
    <section className="py-10">
      <Link
        to="/dashboard/tutors"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to Tutors
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-3">
          {/* Tutor information */}
          <div className="bg-blue-950 p-8 text-white">
            <img
              src={tutor.image}
              alt={`${tutor.name}, ${tutor.subject} tutor`}
              className="h-72 w-full rounded-2xl object-cover"
            />

            <div className="mt-6">
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-orange-200">
                {tutor.subject}
              </span>

              <h1 className="mt-4 text-3xl font-bold">
                {tutor.name}
              </h1>

              <p className="mt-2 text-blue-100">
                {tutor.experience} of tutoring experience
              </p>

              <p className="mt-4 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                ● Available for booking
              </p>
            </div>
          </div>

          {/* Tutor details */}
          <div className="p-8 lg:col-span-2 lg:p-10">
            <p className="font-semibold uppercase tracking-wide text-orange-600">
              About the tutor
            </p>

            <h2 className="mt-2 text-2xl font-bold text-blue-950">
              Learn with {tutor.name}
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-gray-600">
              {tutor.name} helps students understand
              {` ${tutor.subject.toLowerCase()} `}
              through clear explanations, guided practice,
              and lessons adapted to each student’s learning
              needs.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-gray-500">
                  Subject
                </p>

                <p className="mt-1 font-bold text-blue-950">
                  {tutor.subject}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-gray-500">
                  Experience
                </p>

                <p className="mt-1 font-bold text-blue-950">
                  {tutor.experience}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-gray-500">
                  Next available
                </p>

                <p className="mt-1 font-bold text-green-700">
                  {tutor.nextAvailable}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-blue-950">
                Available Times
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                {tutor.times.map((time) => (
                  <span
                    key={time}
                    className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-950"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/dashboard/tutors/${tutor.id}/schedule`}
                className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
              >
                Book a Session
              </Link>

              <Link
                to="/dashboard/tutors"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Browse Other Tutors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TutorProfile;