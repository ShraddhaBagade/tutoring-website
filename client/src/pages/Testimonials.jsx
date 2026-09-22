import { apiUrl } from "../config/api";


function Testimonials() {
  return (
    <div className="rounded-xl bg-violet-50 px-6 py-12">
      {/* Section heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-950">
          What Families Say
        </h2>

        <p className="mt-3 text-gray-600">
          See how personalized tutoring can help students grow
          in confidence.
        </p>
      </div>

      {/* Testimonial cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {/* Testimonial 1 */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-amber-500" aria-label="5 out of 5 stars">
            ★★★★★
          </p>

          <p className="mt-4 text-gray-600">
            “The tutor explained mathematics in a way my daughter
            could finally understand. She is now much more confident
            in class.”
          </p>

          <div className="mt-6">
            <h3 className="font-bold text-blue-950">
              Priya M.
            </h3>

            <p className="text-sm text-gray-500">
              Parent of a Grade 8 student
            </p>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-amber-500" aria-label="5 out of 5 stars">
            ★★★★★
          </p>

          <p className="mt-4 text-gray-600">
            “Science used to feel confusing, but the lessons made
            every topic much easier. I also feel more prepared for
            my tests.”
          </p>

          <div className="mt-6">
            <h3 className="font-bold text-blue-950">
              Ethan R.
            </h3>

            <p className="text-sm text-gray-500">
              Grade 10 student
            </p>
          </div>
        </div>

        {/* Testimonial 3 */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-amber-500" aria-label="5 out of 5 stars">
            ★★★★★
          </p>

          <p className="mt-4 text-gray-600">
            “Our tutor is patient, dependable, and always prepared.
            My son’s reading and writing have improved noticeably.”
          </p>

          <div className="mt-6">
            <h3 className="font-bold text-blue-950">
              Maria L.
            </h3>

            <p className="text-sm text-gray-500">
              Parent of a Grade 6 student
            </p>
          </div>
        </div>
      </div>

      {/* Demo notice */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Sample testimonials for demonstration purposes.
      </p>
    </div>
  );
}

export default Testimonials;