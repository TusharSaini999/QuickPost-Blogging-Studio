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
                        About Quick Post
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        <strong>Quick Post</strong> is a modern platform built for creators who want to share
                        thoughts, insights, or stories effortlessly. Whether you're a writer crafting blogs,
                        a developer showcasing your work, or just someone who loves sharing updates, Quick Post
                        offers a clean, fast, and distraction-free space.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mt-4 leading-relaxed">
                        With a focus on performance, simplicity, and responsive design, Quick Post makes content
                        creation feel natural—on any device, at any time.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
