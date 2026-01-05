import Hero from "../Component/Hero";
import About from "../Component/About";
import Features from "../Component/Features";
import Services from "../Component/Services";
import Contact from "../Component/Contact";
import { Element } from "react-scroll";
const Home = () => {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">

      <Element name="Hero">
        <Hero />
      </Element>

      <Element name="About">
        <About />
      </Element>

      <Element name="Features">
        <Features />
      </Element>

      <Element name="Services">
        <Services />
      </Element>
      
      <Element name="Contact">
        <Contact />
      </Element>
    </main>
  );
};

export default Home;
