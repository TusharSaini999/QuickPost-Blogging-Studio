import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import OAuthLogin from "../Component/Oauth";
import { useForm } from 'react-hook-form';
import { login, logout } from "../Feature/Auth";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Component/Loader"
import authService from "../Appwrite/auth";
import PagesLink from "../Component/PagesLink";
const Login = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const logindata = useSelector((state) => state.AuthSlice.status);

  useEffect(() => {
    if (logindata) {
      navigate("/dashboard");
    }
  }, [logindata])
  const onlogin = async (Data) => {
    setMessage("");
    setisloading(true);
    try {
      let respones = await authService.login(Data);
      if (respones.success) {
        let userData = await authService.checkUser();
        if (userData.success) {
          console.log("User data In SignIn:", userData);
          dispatch(login(userData.user));
          reset();
          navigate("/dashboard");
        }
        else {
          setMessage(userData.message);
        }
      } else {
        console.log("login", respones);
        if (respones.type == "user_session_already_exists") {
          let re = await authService.logout();
          if (re.status) {
            dispatch(logout({ value: true }));
            setMessage(respones.message + " Please try again.");
          }
        }else{
          setMessage(respones.message);
        }
      }
    } catch (error) {
      setMessage("Please check your Network connection and try again.")
    } finally {
      setisloading(false);
      setTimeout(() => {
        setMessage("")
      }, 5000);
    }
  }


  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <Loader value={isloading} />
      <div className="max-w-6xl w-full bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row transition duration-300">

        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="/Logo/Login.png"
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-500">
              Login to Quick Post
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onlogin)}>
            {/* Email */}
            <div>
              <label className="block text-gray-800 dark:text-gray-300 mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                {
                ...register("email", {
                  required: "Please enter your email.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address."
                  }
                })
                }
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-700 dark:focus:ring-red-500"

              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-800 dark:text-gray-300 mb-1 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Please enter your password",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  },
                })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-700 dark:focus:ring-red-500"

              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <div className="text-right">
              <Link
                to="/forgot"
                className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isloading}
              className="w-full py-2.5 mt-1 rounded-lg text-white bg-red-600 dark:bg-red-500 hover:bg-red-500 dark:hover:bg-red-400 font-semibold transition duration-300"
            >
              Sign In
            </button>
            <div className="transition w-full font-semibold text-red-500">
              {message}
            </div>
            <OAuthLogin />
          </form>

          {/* Sign Up and Home Links */}
          <PagesLink value="L" />
        </div>
      </div>
    </section>
  );
};

export default Login;
