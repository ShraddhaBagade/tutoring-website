function Tutors() {
  return (
    <div>
      {/* Section heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-950">Meet Our Tutors</h2>

        <p className="mt-3 text-gray-600">
          Learn from experienced tutors who make difficult topics easier.
        </p>
      </div>

      {/* Tutor cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {/* Tutor 1 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <img
            src="/images/tutors/math-tutor.png"
            alt="Sarah Mitchell, Mathematics tutor"
            className="mx-auto h-32 w-32 rounded-full object-cover"
          />

          <h3 className="mt-4 text-xl font-bold text-blue-950">
            Sarah Mitchell
          </h3>

          <p className="mt-1 font-medium text-amber-900">Mathematics Tutor</p>

          <p className="mt-3 text-gray-600">
            Helps students understand algebra, geometry, trigonometry, and
            calculus.
          </p>

          <p className="mt-4 text-sm font-semibold text-gray-700">
            8 years of experience
          </p>
        </div>

        {/* Tutor 2 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">

          <img
            src="/images/tutors/english-tutor.png"
            alt="Daniel Johnson, Mathematics tutor"
            className="mx-auto h-32 w-32 rounded-full object-cover"
          />

          <h3 className="mt-4 text-xl font-bold text-blue-950">
            Daniel Johnson
          </h3>

          <p className="mt-1 font-medium text-amber-900">Science Tutor</p>

          <p className="mt-3 text-gray-600">
            Teaches biology, chemistry, and physics using clear, practical
            examples.
          </p>

          <p className="mt-4 text-sm font-semibold text-gray-700">
            6 years of experience
          </p>
        </div>

        {/* Tutor 3 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
           <img
            src="/images/tutors/social-studies-tutor.png"
            alt="Emily Rodriguez, Mathematics tutor"
            className="mx-auto h-32 w-32 rounded-full object-cover"
          />

          <h3 className="mt-4 text-xl font-bold text-blue-950">
            Emily Rodriguez
          </h3>

          <p className="mt-1 font-medium text-amber-900">English Tutor</p>

          <p className="mt-3 text-gray-600">
            Supports students with reading, grammar, essay writing, and
            communication skills.
          </p>

          <p className="mt-4 text-sm font-semibold text-gray-700">
            7 years of experience
          </p>
        </div>





        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
           <img
            src="/images/tutors/science-tutor.png"
            alt="Josh Math, Mathematics tutor"
            className="mx-auto h-32 w-32 rounded-full object-cover"
          />

          <h3 className="mt-4 text-xl font-bold text-blue-950">
            Josh Math
          </h3>

          <p className="mt-1 font-medium text-amber-900">English Tutor</p>

          <p className="mt-3 text-gray-600">
            Supports students with reading, grammar, essay writing, and
            communication skills.
          </p>

          <p className="mt-4 text-sm font-semibold text-gray-700">
            9 years of experience
          </p>
        </div>


        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
           <img
            src="/images/tutors/language-tutor.png"
            alt="Emily Rodriguez, Mathematics tutor"
            className="mx-auto h-32 w-32 rounded-full object-cover"
          />

          <h3 className="mt-4 text-xl font-bold text-blue-950">
            Daniel D'souza
          </h3>

          <p className="mt-1 font-medium text-amber-900">Language Tutor</p>

          <p className="mt-3 text-gray-600">
            Supports students with reading, grammar, essay writing, and
            communication skills.
          </p>

          <p className="mt-4 text-sm font-semibold text-gray-700">
            10 years of experience
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
           <img
            src="/images/tutors/computer-tutor.png"
            alt="Rachael Diaz, Mathematics tutor"
            className="mx-auto h-32 w-32 rounded-full object-cover"
          />

          <h3 className="mt-4 text- backdrop:xl font-bold text-blue-950">
            Rachael Diaz
          </h3>

          <p className="mt-1 font-medium text-amber-900">Computer Tutor</p>

          <p className="mt-3 text-gray-600">
            Supports students with reading, grammar, essay writing, and
            communication skills.
          </p>

          <p className="mt-4 text-sm font-semibold text-gray-700">
            11 years of experience
          </p>
        </div>
      </div>
    </div>
  );
}

export default Tutors;
