function WhyUs() {
  return (
    <div>
      {/* Section heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-950">
          Why Choose Us?
        </h2>

        <p className="mt-3 text-gray-600">
          Personal support, experienced tutors, and lessons designed
          around every student.
        </p>
      </div>

      {/* Benefits */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Benefit 1 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
            👥
          </div>

          <h3 className="mt-5 text-xl font-bold text-blue-950">
            Face-to-Face Learning
          </h3>

         левера
          <p className="mt-3 text-gray-600">
            Students receive direct support and can ask questions
            throughout every lesson.
          </p>
        </div>

        {/* Benefit 2 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
            📚
          </div>

          <h3 className="mt-5 text-xl font-bold text-blue-950">
            Personalized Lessons
          </h3>

          <p className="mt-3 text-gray-600">
            Each lesson is adapted to the student’s grade, learning
            style,, and academic goals.
          </p>
        </div>

        {/* Benefit 3 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
            🎓
          </div>

          <h3 className="mt-5 text-xl font-bold text-blue-950">
            Experienced Tutors
          </h3>

          <p className="mt-3 text-gray-600">
            Learn from knowledgeable tutors who explain difficult
            topics clearly and patiently.
          </p>
        </div>

        {/* Benefit 4 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-2xl">
            🕒
          </div>

          <h3 className="mt-5 text-xl font-bold text-blue-950">
            Flexible Scheduling
          </h3>

          <p className="mt-3 text-gray-600">
            Choose convenient after-school or weekend sessions that
            work with your family’s schedule.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhyUs;