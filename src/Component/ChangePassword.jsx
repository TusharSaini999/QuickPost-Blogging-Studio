import { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../Appwrite/auth";

export default function ChangePassword() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const [loading, setloading] = useState(false);
    const [error, setError] = useState("");
    const newPassword = watch("newPassword");

    const onSubmit = async (data) => {
        try {
            setloading(true);
            let oldpassword = data.oldPassword;
            let password = data.newPassword;
            let res = await authService.updatePasswordProfile({ oldpassword, password });

            if (res.status) {
                setError("Password updated successfully!");
            } else {
                setError(res.message || "Server error. Please try again.");
            }
        } catch (error) {
            setError(error.message || "Something went wrong.");
        } finally {
            setloading(false);
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    };

    return (
        <main className="w-full sm:w-4/5 bg-white dark:bg-gray-800 p-6 sm:p-8 overflow-y-auto flex justify-center items-center">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    Change Password
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* New Password */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                            Old Password
                        </label>
                        <input
                            type="password"
                            {...register("oldPassword", {
                                required: "Old password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
              focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                        {errors.oldPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            {...register("newPassword", {
                                required: "New password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
              focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === newPassword || "Passwords do not match",
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
              focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition w-full font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                Updating
                                <span className="dot-flash ml-1"></span>
                            </>
                        ) : (
                            "Update Password"
                        )}
                    </button>
                    <div className={`transition w-full font-semibold ${error === "Password updated successfully!" ? "text-green-600" : "text-red-500"}`}>
                        {error}
                    </div>
                </form>
            </div>
        </main>
    );
}
