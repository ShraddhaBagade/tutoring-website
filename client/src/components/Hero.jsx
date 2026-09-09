import { Link } from "react-router";

function Hero() {
  return (
    <section className="grid items-center gap-10 py-16 md:grid-cols-2">
      {/* Left side: heading, description, and buttons */}
      <div>
        <h1 className="text-4xl font-bold leading-tight text-blue-950 md:text-5xl">
          Personalized Learning, Right in Your Neighborhood.
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Expert offline tutoring for K–12 students. Build confidence and master
          your subjects through personal, focused attention.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/signup"
            className="rounded-full bg-amber-950 px-6 py-3 text-white hover:bg-amber-900">
            Get Started
          </Link>

          <a
            href="#subjects"
            className="rounded-full border border-gray-400 px-6 py-3 text-blue-950 hover:bg-gray-100">
            Explore Subjects
          </a>
        </div>
      </div>

      {/* Right side: tutoring photo */}
      <div>
        <img
          src="/images/tutoring.jpg"
          alt="A tutor helping a student with her studies"
          className="h-96 w-full rounded-xl object-cover shadow-md"
        />
      </div>
    </section>
  );
}

export default Hero;





/*

what is section used for ??
Class	What it does
grid -----	Creates a grid layout
md:grid-cols-2-----	Shows two columns on medium and larger screens
items-center----	Vertically centers the text and photo
gap-10--	Adds space between the columns
py-16	---Adds space above and below the hero
mt-6---	Adds space above an element
leading-tight---	Keeps heading lines close together
h-96---	Gives the photo a fixed height
object-cover---	Fills the photo area, cropping edges if necessary
rounded-xl----	Rounds the photo’s corners


*/
