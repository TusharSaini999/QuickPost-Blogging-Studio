import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 dark:text-white text-center py-4 px-6">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Quick Post. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
