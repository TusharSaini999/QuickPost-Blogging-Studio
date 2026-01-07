import { useState, useEffect, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from "../Feature/TheamMode";
import { Link as RouteLink, NavLink as RouteNavLink, useLocation } from "react-router";
import { Link as ScroolLink, scroller } from "react-scroll";
import Logout from "./Logout";


const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theam = useSelector((state) => state.TheamSlice.value);
  const [active, setActive] = useState("Home");
  const login = useSelector((state) => state.AuthSlice.userData);
  const token = useSelector((s) => s.AuthSlice.status);
  const userData = useSelector((s) => s.AuthSlice.userData);
  const [verification, setVarification] = useState(true);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false); // close on outside click
      }
    }

    function handleScroll() {
      setMobileMenuOpen(false); // close on scroll
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  useEffect(() => {
    if (!token) return;
    console.log("User Data:", userData);

    setVarification(!userData?.emailVerification);
  }, [token, userData?.emailVerification]);

  useEffect(() => {
    if (location.pathname == "/") {
      let localactive = localStorage.getItem("active");
      if (localactive) {
        setActive(localactive);
        if (localactive != "Home") {
          scroller.scrollTo(localactive, {
            duration: 500,
            delay: 10,
            smooth: true
          });
        }
      } else {
        localStorage.setItem("active", active);
      }
    }
  }, [])

  const handelActive = (activepara) => {
    setActive(activepara);
    localStorage.setItem("active", activepara);
    setMobileMenuOpen(false);
  }

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header>
        <nav className="w-full bg-gray-100 border-gray-100 px-4 lg:px-6 py-2.5 dark:bg-gray-900 fixed top-0 z-20">
          <div className="outline-none flex flex-wrap justify-between items-center mx-auto max-w-screen-xl" ref={menuRef}>
            {/* Logo */}
            {location.pathname == "/" ?
              (
                <ScroolLink className="flex items-center cursor-pointer" to="Hero" smooth={true} duration={500} onClick={() => handelActive("Home")}>
                  <img
                    src={theam ? "/Logo/Darklogo.png" : "/Logo/lightlogo.png"}
                    alt="Logo"
                    className="w-28 sm:w-32 md:w-35 lg:w-38 h-auto"
                  />
                </ScroolLink>
              ) : (
                <RouteLink onClick={() => (setMobileMenuOpen(false))} className="flex items-center cursor-pointer" to="/dashboard">
                  <img
                    src={theam ? "/Logo/Darklogo.png" : "/Logo/lightlogo.png"}
                    alt="Logo"
                    className="w-28 sm:w-32 md:w-35 lg:w-38 h-auto"
                  />
                </RouteLink>
              )
            }
            <div className="flex items-center lg:order-2 space-x-2">

              {/* Theam BTN */}
              <button
                onClick={() => { dispatch(setMode()); setMobileMenuOpen(false) }}

                className="outline-none text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                title="Toggle Theme"
              >
                {theam ? <Sun size={20} /> : <Moon size={20} />}
              </button>


              {/* Login BTN /Logout BTN*/}
              {location.pathname == "/" ?
                (<RouteLink
                  to="/login"
                  className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 cursor-pointer"
                >
                  Log-in
                </RouteLink>)

                :
                (login && (
                  (<Logout />)
                ))
              }


              {/* Menu BTN */}
              <button
                onClick={toggleMenu}
                type="button"
                className="outline-none inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}

              >
                <span className="sr-only" >Open main menu</span>
                <svg
                  className={`w-6 h-6 ${mobileMenuOpen ? "hidden" : "block"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <svg
                  className={`w-6 h-6 ${mobileMenuOpen ? "block" : "hidden"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>


            </div>

            {/* Menu and Nav */}
            <div
              className={`${mobileMenuOpen ? "flex" : "hidden"
                } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
              id="mobile-menu"
            >
              <ul className="w-full text-center flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                {location.pathname == "/" ? (
                  <>
                    <ScroolLink to="Hero" className={`block py-2 pr-4 pl-3 border-b border-gray-100 ${active == "Home" ? "text-red-500 dark:text-red-400" : "text-black dark:text-white"} hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-red-400 lg:p-0  dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 dark:hover:text-red-300 cursor-pointer`} duration={500} smooth={true} onClick={() => handelActive("Home")}>
                      Home
                    </ScroolLink>
                    <ScroolLink to="About" className={`block py-2 pr-4 pl-3 border-b border-gray-100 ${active == "About" ? "text-red-500 dark:text-red-400" : "text-black dark:text-white"} hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-red-400 lg:p-0  dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 dark:hover:text-red-300 cursor-pointer`} duration={500} smooth={true} onClick={() => handelActive("About")}>
                      About
                    </ScroolLink>
                    <ScroolLink to="Features" className={`block py-2 pr-4 pl-3 border-b border-gray-100 ${active == "Features" ? "text-red-500 dark:text-red-400" : "text-black dark:text-white"} hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-red-400 lg:p-0  dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 dark:hover:text-red-300 cursor-pointer`} duration={500} smooth={true} onClick={() => handelActive("Features")}>
                      Features
                    </ScroolLink>
                    <ScroolLink to="Services" className={`block py-2 pr-4 pl-3 border-b border-gray-100 ${active == "Services" ? "text-red-500 dark:text-red-400" : "text-black dark:text-white"} hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-red-400 lg:p-0  dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 dark:hover:text-red-300 cursor-pointer`} duration={500} smooth={true} onClick={() => handelActive("Services")}>
                      Services
                    </ScroolLink>
                    <ScroolLink to="Contact" className={`block py-2 pr-4 pl-3 border-b border-gray-100 ${active == "Contact" ? "text-red-500 dark:text-red-400" : "text-black dark:text-white"} hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-red-400 lg:p-0  dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 dark:hover:text-red-300 cursor-pointer`} duration={500} smooth={true} onClick={() => handelActive("Contact")}>
                      Contact
                    </ScroolLink>
                  </>
                ) : (!verification &&
                  <>
                    <RouteNavLink
                      to="/dashboard"
                      end
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-red-400 lg:p-0 dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 dark:hover:text-red-300 ${isActive
                          ? "text-red-500 dark:text-red-400"
                          : "text-black dark:text-white"}`
                      }
                    >
                      Home
                    </RouteNavLink>
                    <RouteNavLink
                      to="/dashboard/profile"
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-red-400 lg:p-0 dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 dark:hover:text-red-300 ${isActive ? "text-red-500 dark:text-red-400" : "text-black dark:text-white"}`
                      }
                    >
                      Profile
                    </RouteNavLink>
                    <RouteNavLink
                      to="/dashboard/create"
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-red-400 lg:p-0 dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 dark:hover:text-red-300 ${isActive ? "text-red-500 dark:text-red-400" : "text-black dark:text-white"}`
                      }
                    >
                      Create Post
                    </RouteNavLink>
                    <RouteNavLink
                      to="/dashboard/post"
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-red-400 lg:p-0 dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 dark:hover:text-red-300 ${isActive ? "text-red-500 dark:text-red-400" : "text-black dark:text-white"}`
                      }
                    >
                      My Post
                    </RouteNavLink>
                    <RouteNavLink
                      to="/dashboard/post/publicpost"
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-red-400 lg:p-0 dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 dark:hover:text-red-300 ${isActive ? "text-red-500 dark:text-red-400" : "text-black dark:text-white"}`
                      }
                    >
                      Public Post
                    </RouteNavLink>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className="h-15"></div>
    </>
  );
};

export default Header;
