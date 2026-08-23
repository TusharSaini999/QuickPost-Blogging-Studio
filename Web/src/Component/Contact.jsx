import React, { useState } from "react";
import { Globe, Mail, Github, Activity } from "lucide-react";
import databaseService from "../Appwrite/databases";
import { useForm } from 'react-hook-form';
const ContactUs = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isloading, setisloading] = useState(false);
    const [message, setMessage] = useState("");
    const onSubmit = async (data) => {
        setisloading(true);
        try {
            const result = await databaseService.createReq({
                ...data,
                createdAt: new Date().toUTCString()
            });

            if (result) {
                reset();
                setMessage("Your message has been sent successfully!");
            } else {
                setMessage("Unable to send your message. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage("Something went wrong while sending your message. Please check your connection and try again.");
        } finally {
            setisloading(false);
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }
    };


    return (
        <section className="bg-white dark:bg-gray-800 py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-red-600 dark:text-red-400 mb-4">
                    Contact Us
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                    {/* Contact Details */}
                    <div className="space-y-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Have a question or need assistance? We're here to help you with anything you need.
                            Whether it's a general inquiry, technical issue, or feedback, don't hesitate to reach out.
                            Our team is dedicated to providing you with timely and helpful responses.
                            Just fill out the form or contact us directly — your message matters to us.
                            We’ll make sure to get back to you as soon as possible with the support you need.
                        </p>


                        <div className="flex items-start gap-4">
                            <Globe className="text-red-500 mt-1" size={24} />
                            <div>
                                <a href="https://quickpostai.tusharsaini.tech/" target="_blank" rel="noopener noreferrer">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-red-500 transition-colors inline-block">Official Website</h4>
                                </a>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                    Visit the QuickPost homepage to explore features, create content, and access the latest updates.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Mail className="text-red-500 mt-1" size={24} />
                            <div>
                                <a href="mailto:support@quickpostai.tusharsaini.tech">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-red-500 transition-colors inline-block">Support Email</h4>
                                </a>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                    <a href="mailto:support@quickpostai.tusharsaini.tech" className="text-red-600 dark:text-red-400 hover:underline">support@quickpostai.tusharsaini.tech</a>
                                    <br />
                                    Reach out to us directly for help, questions, or feedback.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Github className="text-red-500 mt-1" size={24} />
                            <div>
                                <a href="https://github.com/TusharSaini999/QuickPost-Blogging-Studio" target="_blank" rel="noopener noreferrer">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-red-500 transition-colors inline-block">GitHub Repository</h4>
                                </a>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                    Browse the source code, report issues, contribute to development, and track project progress.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Activity className="text-green-500 mt-1" size={24} />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                    System Status
                                    <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 rounded-full">All systems operational</span>
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                    Check the current service status, uptime, scheduled maintenance, and any ongoing incidents.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl shadow-md space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                {...register("name", {
                                    required: "Please enter your name.",
                                    maxLength: {
                                        value: 30,
                                        message: "Name should be 30 characters or fewer."
                                    }
                                })}
                                placeholder="Your Name"
                                className="w-full p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                {...register("email", {
                                    required: "Please enter your email address.",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Please enter a valid email address."
                                    }
                                })}
                                placeholder="you@example.com"
                                className="w-full p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Message Field */}
                        <div>
                            <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-1">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="4"
                                {...register("message", {
                                    required: "Please write your message.",
                                    maxLength: {
                                        value: 10000,
                                        message: "Message is too long. Please keep it under 10,000 characters."
                                    }
                                })}
                                placeholder="Your message"
                                className="w-full p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            ></textarea>
                            {errors.message && (
                                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition w-full font-semibold ${isloading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isloading}
                        >
                            {isloading ? (
                                <>
                                    Sending
                                    <span className="dot-flash ml-1"></span>
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </button>

                        {/* Message Status */}
                        <div className={`transition w-full font-semibold ${message === "Your message has been sent successfully!" ? "text-green-600" : "text-red-500"}`}>
                            {message}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;
