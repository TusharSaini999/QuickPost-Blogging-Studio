import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white py-6 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side */}
        <div className="text-xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
          Quick Post
        </div>
        
        {/* Center */}
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
          Crafted with <span className="text-red-500 animate-pulse text-lg">❤️</span> by Tushar Saini
        </div>
        
        {/* Right Side */}
        <div className="text-sm text-gray-500 dark:text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
