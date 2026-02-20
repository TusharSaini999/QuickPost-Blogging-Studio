import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import OAuthLogin from "../Component/Oauth";
import { useForm } from 'react-hook-form';
import Loader from "../Component/Loader"
import { loginAndFetchPosts, logout } from "../Feature/Auth";
import { useDispatch, useSelector } from "react-redux";
import authService from "../Appwrite/auth";
import PagesLink from "../Component/PagesLink";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const logindata = useSelector((state) => state.AuthSlice.status);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  useEffect(() => {
    if (logindata) {
      navigate("/dashboard");
    }
  }, [logindata])

  const signupFun = async (Data) => {
    setMessage("");
    delete Data.Confirmpassword;
    try {
      setisloading(true);
      let respones = await authService.createAccount(Data);
      if (respones.success) {
        let userData = await authService.checkUser();
        if (userData.success) {
          console.log("User data In Signup:", userData);
          dispatch(loginAndFetchPosts(userData.user));
          reset();
          navigate("/dashboard")
        }
        else {
          setMessage(userData.message);
        }
      } else {
        if (respones.type == "user_session_already_exists") {
          let re = await authService.logout();
          if (re.status) {
            dispatch(logout({ value: true }));
            setMessage(respones.message + " Please try again.");
          }
        } else {
          setMessage(respones.message);
        }
      }
    } catch (error) {
      setMessage("Please check your Network connection and try again.")
    }
    finally {
      setisloading(false);
      setTimeout(() => {
        setMessage("")
      }, 5000)
    }
  }
  const password = watch("password");
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <Loader value={isloading} />
      <div className="max-w-7xl w-full bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-xl flex flex-col md:flex-row transition duration-300 overflow-hidden">

        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="Logo/Signup.png"
            alt="Signup Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 space-y-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-500">
              Create an Account
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Join Quick Post today by filling the details below.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(signupFun)}>
            {/* Full Name */}
            <div>
              <label className="block text-gray-800 dark:text-gray-300 mb-1 text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Please enter your name.",
                  maxLength: { value: 30, message: "Name should be 30 characters or fewer." }
                })}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-700 dark:focus:ring-red-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-800 dark:text-gray-300 mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                {...register("email", {
                  required: "Please enter your email.",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address." }
                })}
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-700 dark:focus:ring-red-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            {/* Password */}
            <div>
              <label className="block text-gray-800 dark:text-gray-300 mb-1 text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Please enter your password",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-700 dark:focus:ring-red-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>


            {/* Confirm Password */}
            <div>
              <label className="block text-gray-800 dark:text-gray-300 mb-1 text-sm font-medium">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("Confirmpassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-700 dark:focus:ring-red-500"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.Confirmpassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Confirmpassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white bg-red-600 dark:bg-red-500 hover:bg-red-500 dark:hover:bg-red-400 font-semibold transition duration-300"
              disabled={isloading}
            >
              Sign Up
            </button>

            <div className="w-full font-semibold text-red-500">
              {message}
            </div>

            <OAuthLogin />
          </form>

          <PagesLink value={"S"} />
        </div>
      </div>
    </section>
  );

};

export default Signup;
