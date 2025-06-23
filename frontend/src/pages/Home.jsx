import Navbar from "../components/Navbar";
import img from "../assets/header_back2.jpg";
import homeImg from "../assets/home1.png";
import About from "./About";
import Contact from "../components/Contact";
import Doctors from "../components/Doctors";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = ["Your Health, Your Location, One Connection."];

function useTypewriter(text, speed = 1000, pause = 1200) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    if (index < phrases[phraseIdx].length) {
      const timeout = setTimeout(() => {
        setDisplayed(phrases[phraseIdx].slice(0, index + 1));
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIndex(0);
        setPhraseIdx((phraseIdx + 1) % phrases.length);
        setDisplayed("");
      }, pause);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [index, phraseIdx]);

  return displayed;
}

function Home() {
  const typewriterText = useTypewriter(phrases, 60, 2000);

  return (
    <>
      <div
        id="home"
        className="relative bg-gradient-to-b from-blue-100 to-blue-200 bg-cover bg-center min-h-screen flex flex-col"
        // style={{ backgroundImage: `url(${img})` }}
      >
        <Navbar />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-white/5 z-10" />

        <div className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 w-full px-6 md:px-12 lg:px-24 py-24 z-20 relative">
          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg leading-tight min-h-[3.5rem]">
              <span>
                {typewriterText}
                <span className="animate-pulse inline-block w-1 h-10 align-middle bg-white ml-1 rounded-sm" />
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mt-6 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Connecting patients and doctors, no matter the distance.
            </p>
            <p className="text-md sm:text-lg text-white/80 mt-2 max-w-xl mx-auto md:mx-0 leading-relaxed">
              We're dedicated to your wellbeing and committed to your care.
            </p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center md:justify-start mt-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <a
                  href="#contact"
                  className="px-6 py-3 bg-transparent text-white rounded border-2 border-white hover:bg-opacity-30 hover:backdrop-filter hover:backdrop-blur-lg hover:bg-gradient-to-r hover:from-sky-300 hover:via-sky-400 hover:to-sky-500 transition duration-300 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(56,189,248)]"
                >
                  Get Started
                </a>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <a
                  href="#about"
                  className="px-6 py-3 bg-white text-black rounded border-2 border-black hover:bg-opacity-30 hover:backdrop-filter hover:backdrop-blur-lg hover:bg-gradient-to-r hover:from-sky-300 hover:via-sky-400 hover:to-sky-500 transition duration-300 hover:border-sky-600 hover:shadow-[5px_5px_0px_0px_rgb(56,189,248)]"
                >
                  Learn More
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Image with Framer Motion */}
          <div className="w-full md:w-1/2 flex justify-center">
            <motion.img
              src={homeImg}
              alt="Telehealth"
              className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full h-auto drop-shadow-xl"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, type: "spring", stiffness: 80 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.97, rotate: -2 }}
            />
          </div>
        </div>
      </div>

      <About />
      <Doctors />
      <Contact />
      <Footer />
    </>
  );
}

export default Home;
