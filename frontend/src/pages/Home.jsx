import Navbar from "../components/Navbar";
import homeImg from "../assets/home1.jpg";
import About from "../components/About";
import Contact from "../components/Contact";
import Doctors from "../components/Doctors";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = ["Guiding you to the nearest care"];

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
        className="relative min-h-screen flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${homeImg})` }}
      >
        <Navbar />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-white/10 z-10" />

        <div className="flex flex-col items-center justify-center flex-1 w-full px-6 md:px-12 lg:px-24 py-20 z-20 relative min-h-[70vh] mt-12">
          {/* Text Content */}
          <div className="w-full md:w-2/3 lg:w-1/2 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg leading-tight mb-4 whitespace-nowrap">
              Welcome to 
              <span
                className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400 bg-clip-text text-transparent drop-shadow-md"
                style={{ WebkitTextStroke: '0.5px rgba(0,0,0,0.08)' }}
              >
                 MediQuick
              </span>
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg leading-tight min-h-[3.5rem] flex items-center justify-center">
              <span>
                {typewriterText}
                <span className="animate-pulse inline-block w-1 h-8 align-middle bg-white ml-1 rounded-sm" />
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mt-6 max-w-xl mx-auto leading-relaxed">
              MediQuick connects patients and doctors instantly, ensuring you get the care you need, wherever you are.
            </p>
            <p className="text-md sm:text-lg text-white/80 mt-2 max-w-xl mx-auto leading-relaxed">
              We're dedicated to your wellbeing and committed to your care.
            </p>

            {/* <motion.div
              className="flex flex-wrap gap-4 justify-center mt-8"
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
            </motion.div> */}
          </div>
        </div>
      </div>

      <About />
      <Contact />
      <Footer />
    </>
  );
}

export default Home;
