import React, { useState } from "react";
import authService from "../Appwrite/auth";
import { logout } from "../Feature/Auth";
import { useDispatch } from "react-redux";
import StatusModal from "./PopupMessage";
import { useNavigate } from "react-router";
import Loader from "./Loader";
function Logout({ logouttype = "current" })  {
    const [isloading, setisloading] = useState(false);
    const [pop, setpop] = useState(false);
    const [poptitle, setpoptitle] = useState("");
    const [popdesc, setpopdesc] = useState("");
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [type, settype] = useState("success");
    async function onlogout() {
        try {
            setisloading(true)
            let resp = await authService.logout({ type:logouttype });
            setisloading(false)
            if (resp.status) {
                console.log("Logout")
                setpoptitle("Logout Successful");
                if (logouttype == "current") {
                    setpopdesc("You have been successfully logged out.");
                } else {
                    setpopdesc("You have been logged out from all devices successfully.");
                }

                settype("success");
                setpop(true);
                setTimeout(() => {
                    dispatch(logout({ value: true }));
                    setpop(false);
                    nav("/login")
                }, 1000);
            } else {
                if (resp.type == "general_unauthorized_scope") {
                    setpoptitle("Already Logged Out");
                    setpopdesc("You are already logged out.");
                    settype("error");
                    setpop(true);
                    setTimeout(() => {
                        dispatch(logout({ value: true }));
                        setpop(false);
                        nav("/login");
                    }, 3000);
                } else {
                    setpoptitle("Logout Failed");
                    setpopdesc(resp.Message || "Something went wrong during logout.");
                    settype("error");
                    setpop(true);
                    setTimeout(() => {
                        setpop(false);
                    }, 3000);
                }
            }

        } catch (error) {
            setpoptitle("Network Error");
            setpopdesc(error.message || "An unexpected error occurred.");
            settype("error");
            setpop(true);
            setTimeout(() => {
                setpop(false);
            }, 3000);
        }
    }

    return (
        <>
            {logouttype == "current" ? (
                <button
                    type="button"
                    disabled={isloading}
                    onClick={onlogout}
                    className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Logout
                </button>
            ) : (
                <button
                    className="w-full sm:w-auto flex-1 text-center text-sm font-medium py-2 px-4 rounded border border-red-500 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                    disabled={isloading}
                    onClick={onlogout}
                >
                    Logout All Devices
                </button>
            )}
            <StatusModal
                show={pop}
                title={poptitle}
                description={popdesc}
                onClose={() => {
                    setpop(false)
                    setpoptitle("");
                    setpopdesc("");
                }}
                type={type}
            />
            <Loader value={isloading} />
        </>
    )
}
export default Logout;