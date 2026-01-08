import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './Pages/Home.jsx'
import { createBrowserRouter, RouterProvider } from "react-router";
import store from './Store/Store.js';
import { Provider, useSelector } from 'react-redux';
import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import NewPassword from './Pages/NewPassword.jsx';
import EmailVerificationConfirm from './Pages/EmailVerificationConfirm.jsx';
import Profile from './Pages/Profile.jsx';
import UniversalError from './Component/Error.jsx';
import Edit from './Pages/Edit.jsx';
import Post from './Pages/Post.jsx';
import PostView from './Pages/PostView.jsx';
import PublicPosts from './Pages/Test.jsx'

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    errorElement: <UniversalError />,
    children: [
      {
        path: "",
        Component: Home
      },
      {
        path: "login",
        Component: Login
      },
      {
        path: "signup",
        Component: Signup,
      },
      {
        path: "forgot",
        Component: ForgotPassword,
      },
      {
        path: "verify",
        Component: NewPassword,
      },
      {
        path: "verify-email",
        Component: EmailVerificationConfirm,
      }
    ]
  },
  {
    path: "/dashboard",
    Component: App,
    errorElement: <UniversalError />,
    children: [
      {
        path: "",
        Component: Dashboard
      },
      {
        path: "profile",
        Component: Profile
      },
      {
        path: "create",
        Component: Edit
      },
      {
        path: "post",
        children: [
          {
            path: "",
            element: < Post type='all'/>
          },
          {
            path: "public",
            element: < Post type='public' />
          },
          {
            path: "private",
            element: < Post type='private' />
          },
          {
            path: "drafts",
            element: < Post type='drafts' />
          },
          {
            path: "view/:id",
            Component:PostView
          },
          {
            path: "edit/:id",
            Component:Edit
          }
        ]
      },
      {
        path:"publicPost",
        Component:PublicPosts
      }
    ]
  }

]);

const ThemeProvider = ({ children }) => {
  const theme = useSelector((state) => state.TheamSlice.value);

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      {children}
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </Provider>
);
