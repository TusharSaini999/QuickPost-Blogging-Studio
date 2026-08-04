import React from "react";

const About = () => {
    return (
        <section className="bg-gray-100 dark:bg-gray-900 pt-10 pb-10">

            <div className="py-16 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2">
                    <img
                        src="/Logo/About.webp"
                        alt="About Quick Post Illustration"
                        className="w-full h-auto dark:shadow-gray-900"
                    />
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">
                        About Quick Post Studio
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        <strong>Quick Post Studio</strong> is a modern blogging platform tailored for writers, developers, and creators who want to share their insights with the world. We provide a feature-rich, distraction-free environment that puts your content front and center.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mt-4 leading-relaxed">
                        From drafting your first post with the help of AI assistants to publishing and engaging with readers, Quick Post Studio is designed to make the entire blogging lifecycle intuitive and enjoyable. Create, manage, and scale your personal or professional blog with ease.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
