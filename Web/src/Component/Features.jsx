import React from "react";

const Features = () => {
  return (
    <section className="bg-white dark:bg-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-6">
          Features of Quick Post Studio
        </h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12 text-base sm:text-lg">
          Discover the powerful tools that make{" "}
          <span className="text-red-600 dark:text-red-400 font-semibold">
            Quick Post Studio
          </span>{" "}
          the perfect platform for writing, sharing, and discovering great content.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "AI-Powered Assistant",
              description:
                "Automatically generate article summaries and SEO metadata using our advanced built-in AI capabilities.",
            },
            {
              title: "Global Post Feed",
              description:
                "Discover fresh content and connect with other creators by browsing the public global feed.",
            },
            {
              title: "Secure Authentication",
              description:
                "Log in quickly and safely with OAuth support and reliable email verification powered by Appwrite.",
            },
            {
              title: "Creator Dashboard",
              description:
                "Monitor your content and track your performance metrics from a clean, centralized dashboard.",
            },
            {
              title: "Dark Mode Ready",
              description:
                "Write and read comfortably at any time of day with a fully integrated toggle for dark and light themes.",
            },
            {
              title: "Profile Management",
              description:
                "Customize your public persona, manage your published posts, and update your security settings with ease.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
