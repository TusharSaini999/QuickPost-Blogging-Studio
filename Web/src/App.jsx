import Footer from "./Component/Footer.jsx";
import Header from "./Component/Header.jsx"
import { Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { loginAndFetchPosts, logout, updateName } from './Feature/Auth.js';
import authService from './Appwrite/auth.js';
import Loader from "./Component/Loader.jsx";
import { useLocation } from "react-router";
import { useState, useEffect } from 'react';
import databaseService from "./Appwrite/databases.js";
import { setloading } from "./Feature/Profile.js";
import StatusModal from "./Component/PopupMessage.jsx";
import { getPost } from "./Feature/Post.js";
import ErrorMessage from "./Component/ErrorMessage.jsx";
import { clearError } from "./Feature/Post.js";
import AIAssistantSidebar from "./Component/AIAssistant.jsx";
import { useAIPageContext } from "./Component/AIPageContext.jsx";
// import ai_function from "./Appwrite/ai_function.js";

function App() {
  const { pageAIContext } = useAIPageContext();
  const dispatch = useDispatch();
  const location = useLocation();
  const post = useSelector((state) => state.PostSlice)
  const nav = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [signlogin, setsignlogin] = useState(false);
  const Checklogin = useSelector((state) => state.AuthSlice.check);
  const status = useSelector((state) => state.ProfileSlice.savestatus);
  const historyName = useSelector((state) => state.ProfileSlice.historyName);
  const [showModal, setShowModal] = useState(false);
  const errormessage = useSelector((state) => state.PostSlice.error);
  const [modalInfo, setModalInfo] = useState({
    type: "success",
    title: "",
    description: ""
  });

  const getAssistantPage = (pathname) => {
    if (pathname === "/") return "Home";
    if (pathname === "/login") return "Login";
    if (pathname === "/signup") return "Signup";
    if (pathname === "/forgot") return "Forgot Password";
    if (pathname === "/verify") return "Verify New Password";
    if (pathname === "/verify-email") return "Email Verification";
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/profile") return "Profile Page";
    if (pathname === "/dashboard/create") return "Create Post Page";
    if (pathname.startsWith("/dashboard/post/edit/")) return "Edit Post Page";
    if (pathname.startsWith("/dashboard/post/view/")) return "Post View Page";
    if (pathname === "/dashboard/post") return "Posts Page";
    if (pathname === "/dashboard/post/public") return "Public Posts Page";
    if (pathname === "/dashboard/post/private") return "Private Posts Page";
    if (pathname === "/dashboard/post/drafts") return "Drafts Page";
    if (pathname === "/dashboard/publicPost") return "Public Feed Page";
    if (pathname.startsWith("/dashboard/publicPost/view/")) return "Public Post View Page";
    return "App";
  };

  const getAssistantContext = (pathname) => {
    const currentPage = getAssistantPage(pathname);

    const sharedContext = {
      currentPageOnUser: currentPage,
      pathname,
      routeType: pathname.startsWith("/dashboard") ? "private" : "public",
      loadingSupport: {
        enabled: true,
        guidance: "If content is not loading, identify the section name, what is visible now, and what action the user last clicked.",
      },
    };

    if (currentPage === "Home") {
      return {
        ...sharedContext,
        visibleSections: ["Hero", "About", "Features", "Services", "Contact"],
        quickLinks: ["Login", "Signup", "Explore features", "Contact"],
      };
    }

    if (currentPage === "Posts Page") {
      return {
        ...sharedContext,
        pageVariant: "user-posts",
        pageGoal: "Manage your dashboard posts, sort them, and open them for editing or review.",
        visibleSections: ["Posts Header", "Sort Controls", "Post Cards", "Infinite Scroll"],
        quickLinks: ["Open post", "Edit post", "Delete post", "Change sorting"],
      };
    }

    if (currentPage === "Public Posts Page") {
      return {
        ...sharedContext,
        pageVariant: "user-public-posts",
        pageGoal: "Manage your public dashboard posts and open them for review.",
        visibleSections: ["Posts Header", "Sort Controls", "Post Cards", "Infinite Scroll"],
        quickLinks: ["Open public post", "Edit public post", "Delete public post", "Change sorting"],
      };
    }

    if (currentPage === "Profile Page") {
      return {
        ...sharedContext,
        visibleSections: ["Profile Sidebar", "Profile Details", "Change Password", "Logout"],
        quickLinks: ["Edit profile", "Upload photo", "Change password"],
      };
    }

    if (currentPage === "Public Feed Page") {
      return {
        ...sharedContext,
        pageVariant: "public-feed",
        pageGoal: "Browse public posts, search content, and open a post to read it.",
        visibleSections: ["Feed Header", "Public Cards", "Post View Links"],
        quickLinks: ["Open public post", "Read feed", "Share link"],
      };
    }

    if (currentPage === "Post View Page" || currentPage === "Public Post View Page") {
      return {
        ...sharedContext,
        pageVariant: currentPage === "Public Post View Page" ? "public-post-view" : "user-post-view",
        pageGoal: currentPage === "Public Post View Page"
          ? "Read a public post in detail."
          : "Review a dashboard post in detail.",
        visibleSections: ["Back Button", "Cover Image", "Post Details", "AI Summary", "Article Content"],
        quickLinks: currentPage === "Public Post View Page"
          ? ["Summarize post", "Go back to feed"]
          : ["Summarize post", "Go back to posts", "Edit post"],
      };
    }

    return sharedContext;
  };
  useEffect(() => {
    if (location.pathname == "/login" || location.pathname == "/signup" || location.pathname == "/forgot" || location.pathname == "/verify" || location.pathname == "/verify-email") {
      setsignlogin(true);
    } else {
      setsignlogin(false);
    }
    if (location.pathname != "/") {
      async function Check() {
        setisloading(true);
        dispatch(setloading(true));
        const userData = await authService.checkUser();
        if (userData.success) {
          if (userData.user.prefs?.Profile_Created) {
            dispatch(loginAndFetchPosts(userData.user));
          } else {
            let userID = userData.user.$id;
            let name = userData.user.name;
            let token = await databaseService.createProfile({ userID, name });
            if (token.success) {
              dispatch(loginAndFetchPosts(token.token));
            }
          }
        } else {
          dispatch(logout({ value: true }));
          if (userData.type == "general_unauthorized_scope") {
            localStorage.setItem("isLogin", false);
          }
          if (location.pathname == "/login") {
            console.log("Login");
          } else if (location.pathname == "/signup") {
            console.log("Signup");
          } else if (location.pathname == "/forgot") {
            console.log("Forgot");
          } else if (location.pathname == "/verify") {
            console.log("Verify");
          } else {
            nav("/login")
          }
        }
        setisloading(false);
        dispatch(setloading(false));
      }
      let isLogin = localStorage.getItem("isLogin");
      if (!Checklogin && isLogin == "true") {
        Check();
      }
      else if (isLogin != "true") {
        if (location.pathname == "/login") {
          console.log("Login");
        } else if (location.pathname == "/signup") {
          console.log("Signup");
        } else if (location.pathname == "/forgot") {
          console.log("Forgot");
        } else if (location.pathname == "/verify") {
          console.log("Verify");
        } else {
          nav("/login")
        }
      }
    }
  }, [location]);

  useEffect(() => {
    if (location?.pathname != "/") {
      window.scrollTo(0, 0);
    }
  }, [location?.pathname])
  // useEffect(() => {
  //   const make = async () => {
  //     const res = await ai_function.aiMetaDataGenerator({
  //       "title": "Understanding React Hooks",
  //       "shortDescription": "A beginner-friendly guide to React Hooks with examples",
  //       "keywords": ["react", "react hooks", "javascript"],
  //       "content": "React Hooks are a powerful feature introduced in React 16.8 that allow developers to use state and other React features without writing class components. Hooks like useState and useEffect help manage component logic in a cleaner and more reusable way. In this article, we explore how React Hooks work, why they are useful, and how to use them effectively with practical examples."
  //     });
  //     console.log(res);
  //   }
  //   make();
  // }, [])
  useEffect(() => {
    if (status === "Completed") {
      console.log("Complete the work");

    } else if (status === "Error") {
      dispatch(updateName(historyName));
      setModalInfo({
        type: "error",
        title: "Profile Update Failed",
        description: "Your profile wasn’t updated. Please check your connection and try again."
      });
      setShowModal(true);

      const timer = setTimeout(() => setShowModal(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (errormessage != null) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errormessage])
  return (
    <>

      {!signlogin && <Header />}
      <StatusModal
        show={showModal}
        onClose={() => setShowModal(false)}
        type={modalInfo.type}
        title={modalInfo.title}
        description={modalInfo.description}
        cancelText="Close"
      />
      <ErrorMessage message={errormessage} />
      <Loader value={isloading} />
      <Outlet />
      <AIAssistantSidebar
        fullPage={false}
        page={getAssistantPage(location.pathname)}
        pageContext={{
          ...getAssistantContext(location.pathname),
          ...(pageAIContext || {}),
        }}
      />
      {!signlogin && <Footer />}
    </>
  )
}

export default App;