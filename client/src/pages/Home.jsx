import Subjects from "./Subjects";
import Tutors from "./Tutors";
import WhyUs from "./WhyUs";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import Hero from "../components/Hero";

function Home() {
  return (
    <div>
      <Hero />

      <section id="subjects" className="scroll-mt-48 py-16">
        <Subjects />
      </section>

      <section id="tutors" className="scroll-mt-48 py-16">
        <Tutors />
      </section>

      <section id="why-us" className="scroll-mt-48 py-16">
        <WhyUs />
      </section>

      <section id="testimonials" className="scroll-mt-48 py-16">
        <Testimonials />
      </section>

      <section id="contact" className="scroll-mt-48 py-16">
        <Contact />
      </section>
    </div>
  );
}

export default Home;
