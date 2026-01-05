import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import authService from '../Appwrite/auth';
import { useNavigate, Link } from 'react-router';
import PagesLink from '../Component/PagesLink';
import StatusModal from '../Component/PopupMessage';
import { useSelector } from "react-redux";
const ForgotPassword = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalContent, setModalContent] = useState({ title: "", description: "" });
  const logindata = useSelector((state) => state.AuthSlice.status);
  const navigate = useNavigate();
  useEffect(() => {
    if (logindata) {
      navigate("/dashboard");
    }
  }, [logindata])
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.sendPasswordReset(data);
      if (response.status) {
        setModalType("success");
        setModalContent({
          title: "Email Sent!",
          description: "A password reset link has been sent to your email.",
        });
        reset();
      } else {
        setModalType("error");
        setModalContent({
          title: "Failed to Send",
          description: response.message || "Unable to send password reset email. Try again later.",
        });
      }
    } catch (error) {
      setModalType("error");
      setModalContent({
        title: "Server Error",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setModalVisible(true);
    }
  };


  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-xl p-10 space-y-6">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-500 text-center">Forgot Password</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
          Please enter the email address associated with your account. We will send you a secure link to reset your password and regain access to your account.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-gray-800 dark:text-gray-300 mb-1 text-sm font-medium">
              Email
            </label>
            <input
              type="text"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address"
                }
              })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-700 dark:focus:ring-red-500"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

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
              "Send Reset Link"
            )}
          </button>
          <PagesLink value='F' />
          <StatusModal
            show={modalVisible}
            onClose={() => setModalVisible(false)}
            type={modalType}
            title={modalContent.title}
            description={modalContent.description}
          />

        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
