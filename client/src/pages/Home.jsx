import Subjects from "./Subjects";
import HomeTutors from "./HomeTutors";
import WhyUs from "./Whyus";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import Hero from "../components/Hero";
import { apiUrl } from "../config/api";
function Home() {
  return (
    <div>
      <Hero />

      <section id="subjects" className="scroll-mt-48 py-16">
        <Subjects />
      </section>

      <section id="tutors" className="scroll-mt-48 py-16">
        <HomeTutors />
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
