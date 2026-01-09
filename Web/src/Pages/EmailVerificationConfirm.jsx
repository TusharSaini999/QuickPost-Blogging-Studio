import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Loader from "../Component/Loader";
import PagesLink from "../Component/PagesLink";
import authService from "../Appwrite/auth";
import { useDispatch } from "react-redux";
import { updateEmail } from "../Feature/Auth";
const EmailVerificationConfirm = () => {
    const [params] = useSearchParams();
    const [message, setMessage] = useState("Verifying your email...");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch=useDispatch();
    const userId = params.get("userId");
    const secret = params.get("secret");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const result = await authService.updateVerification(userId, secret);
                if (result) {
                    dispatch(updateEmail());
                    setMessage("Email verified successfully! Redirecting...");
                    setTimeout(() => navigate("/dashboard"), 2000);
                } else {
                    setMessage("Verification failed. Please try again or request a new link.");
                }
            } catch (err) {
                setMessage("Something went wrong during verification.");
            } finally {
                setLoading(false);
            }
        };

        if (userId && secret) {
            verifyEmail();
        } else {
            setMessage("Invalid or missing verification parameters.");
            setLoading(false);
        }
    }, [userId, secret, navigate]);

    return (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
            <Loader value={loading} />
            <div className="max-w-xl w-full bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 space-y-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-500">
                    Email Verification
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-md">{message}</p>
                <PagesLink value="V"/>
            </div>
        </section>
    );
};

export default EmailVerificationConfirm;
