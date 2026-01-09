import Footer from "./Component/Footer.jsx";
import Header from "./Component/Header.jsx"
import { Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, updateName } from './Feature/Auth.js';
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

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const post=useSelector((state)=>state.PostSlice)
  const nav = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [signlogin, setsignlogin] = useState(false);
  const Checklogin = useSelector((state) => state.AuthSlice.check);
  const status = useSelector((state) => state.ProfileSlice.savestatus);
  const historyName = useSelector((state) => state.ProfileSlice.historyName);
  const [showModal, setShowModal] = useState(false);
  const errormessage=useSelector((state) => state.PostSlice.error);
  const [modalInfo, setModalInfo] = useState({
    type: "success",
    title: "",
    description: ""
  });
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
          dispatch(getPost({userId:userData.user?.$id,defaults: true}));
          console.log(post);
          if (userData.user.prefs?.Profile_Created) {
            dispatch(login(userData.user));
          } else {
            let userID = userData.user.$id;
            let name = userData.user.name;
            let token = await databaseService.createProfile({ userID, name });
            if (token.success) {
              dispatch(login(token.token));
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
  }, [location])
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

  useEffect(()=>{
    if(errormessage!=null){
    const timer = setTimeout(() =>{
      dispatch(clearError());
    } , 3000);
    return () => clearTimeout(timer);
    }
  },[errormessage])
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
      {!signlogin && <Footer />}
    </>
  )
}

export default App;