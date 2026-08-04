import React from "react";
import { Link } from "react-router";
const Hero = () => (
  <section className="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-12 flex items-center">
    <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 w-full">

      {/* Text Content */}
      <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-red-700 dark:text-red-400 leading-tight">
          Welcome to <span className="text-red-600 dark:text-red-300">Quick Post Studio</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-800 dark:text-gray-300">
          Your ultimate blogging studio. Craft compelling stories, share your expertise, and build an audience with our sleek, distraction-free writing environment. Quick Post empowers creators to turn ideas into beautifully formatted blogs in seconds.
        </p>
        <div className="flex justify-center md:justify-start">
          <Link
            to="/login"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end">
        <img
          src="/Logo/HeroMain.webp"
          alt="Woman posting on computer"
          className="w-full max-w-[500px] md:max-w-full h-auto drop-shadow-xl object-contain"
        />
      </div>
    </div>
  </section>
);

export default Hero;
