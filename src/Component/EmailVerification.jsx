import React, {  useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../Appwrite/auth";
import Loader from "./Loader";
const EmailVerification = ({ onSubmitHandler }) => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = async (data) => {
        setMessage("");
        setIsLoading(true);
        try {
            const response = await authService.emailVarification();
            console.log(response)
            if (response.status) {
                setIsLoading(false);
                setMessage("Your Email has been sent successfully For Verification!");
                reset();
            } else {
                setIsLoading(false);
                setMessage(response.message);
            }
        } catch (error) {
            setIsLoading(false);
            setMessage("Failed to send email. Please try again.");
        } finally {
            setTimeout(() => setMessage(""), 5000);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
            <Loader value={isLoading} />
            <div className="max-w-xl w-full bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-500">
                        Verify Your Email
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                        Enter your email address to receive a verification link.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <button
                        type="submit"
                        className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition w-full font-semibold ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                Sending
                                <span className="dot-flash ml-1"></span>
                            </>
                        ) : (
                            "Send Email Verification"
                        )}
                    </button>

                    <div className={`transition w-full font-semibold ${message === "Your Email has been sent successfully For Verification!" ? "text-green-600" : "text-red-500"}`}>
                        {message}
                    </div>
                </form>
            </div >
        </section >
    );
};

export default EmailVerification;
