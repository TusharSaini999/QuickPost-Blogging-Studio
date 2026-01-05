import React from "react";

const Features = () => {
  return (
    <section className="bg-white dark:bg-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-6">
          Features of Quick Post
        </h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12 text-base sm:text-lg">
          Discover the powerful tools that make{" "}
          <span className="text-red-600 dark:text-red-400 font-semibold">
            Quick Post
          </span>{" "}
          a seamless and efficient platform for sharing ideas and staying connected.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Real-Time Posting",
              description:
                "Instantly publish your thoughts, photos, or updates and see them appear live across the platform.",
            },
            {
              title: "Smart Feed Algorithm",
              description:
                "Our intelligent algorithm prioritizes relevant and trending posts, personalized for each user.",
            },
            {
              title: "Media Support",
              description:
                "Easily share images, videos, and links with high-speed uploading and optimized previews.",
            },
            {
              title: "Dark Mode Ready",
              description:
                "Enjoy a visually pleasing experience with full support for dark and light themes.",
            },
            {
              title: "User Interaction",
              description:
                "Like, comment, and follow — engage with a growing community in real-time.",
            },
            {
              title: "Admin Control",
              description:
                "Secure moderation tools to manage posts, users, and reports from a central dashboard.",
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
