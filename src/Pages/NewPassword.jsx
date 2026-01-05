import React, { useState ,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import authService from '../Appwrite/auth';
import { useNavigate, useSearchParams } from 'react-router';
import { useSelector } from "react-redux";
const NewPassword = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logindata = useSelector((state) => state.AuthSlice.status);
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    if (logindata) {
      navigate("/dashboard");
    }
  }, [logindata])
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.updatePassword({ userId, secret, password: data.password });
      if (response.status) {
        setLoading(false);
        setMessage("Your password has been updated successfully!");
        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 5000);
      } else {
        setLoading(false);
        setMessage(response.message);
        setTimeout(() => {
          setMessage("");
        }, 5000);
      }
    } catch (err) {
      setLoading(false);
      setMessage("Something went wrong. Try again.");
      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 3000);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-xl p-10 space-y-6">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-500 text-center">Set New Password</h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">New Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
              className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none"
              placeholder="Enter new password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                validate: (value) => value === watch("password") || "Passwords do not match"
              })}
              className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none"
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition w-full font-semibold ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <>
                Updating
                <span className="dot-flash ml-1"></span>
              </>
            ) : (
              "Update"
            )}
          </button>
          <div className={`transition w-full font-semibold ${message === "Your password has been updated successfully!" ? "text-green-600" : "text-red-500"}`}>
            {message}
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewPassword;
