import { useRef } from "react";

function Subjects() {
  const subjectsRef = useRef(null);

  function scrollSubjects(direction) {
    const container = subjectsRef.current;

    if (!container || container.children.length < 2) return;

    const firstCard = container.children[0];
    const secondCard = container.children[1];

    // One card's width plus the gap beside it
    const distance = secondCard.offsetLeft - firstCard.offsetLeft;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    container.scrollBy({
      left: direction === "right" ? distance : -distance,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <div className="rounded-xl bg-violet-50 px-6 py-12">
      {/* Section heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-950">
          Comprehensive Subjects
        </h2>

        <p className="mt-3 text-gray-600">
          Build your understanding with personalized subject support.
        </p>
      </div>

      {/* Subject cards */}
      <div className="mt-10 flex items-center gap-2 md:gap-4">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollSubjects("left")}
          aria-label="Scroll subjects left"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-950 text-xl text-white hover:bg-amber-900">
          ←
        </button>

        {/* Scrollable cards */}
        <div
          ref={subjectsRef}
          role="region"
          aria-label="Tutoring subjects"
          tabIndex={0}
          className="
    relative grid min-w-0 flex-1 grid-flow-col
    auto-cols-full gap-6 overflow-x-auto
    snap-x snap-mandatory py-2
    sm:auto-cols-[calc((100%_-_1.5rem)/2)]
    lg:auto-cols-[calc((100%_-_3rem)/3)]
    xl:auto-cols-[calc((100%_-_4.5rem)/4)]
  ">
          <div className="aspect-square min-w-0 snap-start overflow-y-auto rounded-xl bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-blue-950">Mathematics</h3>
            <p className="mt-3 text-gray-600">
              Strengthen your skills in arithmetic, algebra, geometry, and
              problem-solving.
            </p>
          </div>

          <div className="aspect-square min-w-0 snap-start overflow-y-auto rounded-xl bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-blue-950">Science</h3>
            <p className="mt-3 text-gray-600">
              Explore biology, chemistry, and physics with clear explanations
              and practical examples.
            </p>
          </div>

          <div className="aspect-square min-w-0 snap-start overflow-y-auto rounded-xl bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-blue-950">Social Studies</h3>
            <p className="mt-3 text-gray-600">
              Understand history, geography, civics, and economics through
              everyday examples.
            </p>
          </div>

          <div className="aspect-square min-w-0 snap-start overflow-y-auto rounded-xl bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-blue-950">Computer Skills</h3>
            <p className="mt-3 text-gray-600">
              Learn computer basics, digital skills, and introductory coding
              through practical activities.
            </p>
          </div>

          <div className="aspect-square min-w-0 snap-start overflow-y-auto rounded-xl bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-blue-950">English</h3>
            <p className="mt-3 text-gray-600">
              Improve reading comprehension, grammar, essay writing, and
              literary analysis.
            </p>
          </div>

          <div className="aspect-square min-w-0 snap-start overflow-y-auto rounded-xl bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-blue-950">Languages</h3>
            <p className="mt-3 text-gray-600">
              Develop vocabulary, pronunciation, and confidence in everyday
              conversations.
            </p>
          </div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollSubjects("right")}
          aria-label="Scroll subjects right"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-950 text-xl text-white hover:bg-amber-900">
          →
        </button>
      </div>
    </div>
  );
}

export default Subjects;

/*

bg-violet-50----	Gives the section a light lavender background
text-center	--- Centers the heading and introduction
mt-10 --	Adds space above the cards
grid --	Arranges the cards in a grid
gap-6 --	Adds space between cards
sm:grid-cols-2 --	Shows two columns on smaller tablets and wider screens
lg:grid-cols-4--	Shows four columns on large screens
p-6 --	Adds padding inside each card
shadow-sm --	Adds a subtle shadow

Class	Purpose
h-64 w-64	Gives each card equal height and width
shrink-0	Prevents cards and arrows from becoming narrower
items-center	Centers the arrows vertically beside the cards
min-w-0 flex-1	Makes the scrollable area fit between the arrows
overflow-y-auto	Keeps card text accessible if enlarged text needs extra space
Class	Purpose
flex	Places the cards in one horizontal row
overflow-x-auto	Allows sideways scrolling
w-64	Gives each card a consistent width
shrink-0	Prevents cards from squeezing together
pb-4	Leaves space below the cards for the scrollbar


*/
