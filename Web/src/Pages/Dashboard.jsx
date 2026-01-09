import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EmailVerification from "../Component/EmailVerification";
import DashboardOverview from "../Component/DashboardOverview";
function Dashboard() {
    const token = useSelector((s) => s.AuthSlice.status);
    const userData = useSelector((s) => s.AuthSlice.userData);
    const [verification, setVarification] = useState(false);
    const [data, setData] = useState({});
    const [weekData, setWeek] = useState({});
   useEffect(() => {
    if (!token) return;

    setData({
        total: parseInt(userData.prefs.Public || 0) + 
               parseInt(userData.prefs.Private || 0) + 
               parseInt(userData.prefs.Drafts || 0),
        published: parseInt(userData.prefs.Public || 0) + parseInt(userData.prefs.Private || 0),
        drafts: parseInt(userData.prefs.Drafts || 0),
        private: parseInt(userData.prefs.Private || 0),
        public: parseInt(userData.prefs.Public || 0)
    });
    const weekPref = userData.prefs.Week;
    const parsedWeek = typeof weekPref === "string" ? JSON.parse(weekPref) : weekPref || {};
    setWeek(parsedWeek);

    setVarification(!userData?.emailVerification);
}, [token, userData?.emailVerification]);

    return (
        <>
            {
                verification ? (
                    <EmailVerification />
                ) : (
                    <DashboardOverview name={userData?.name} stats={data} week={weekData}/>
                )
            }

        </>
    )
}
export default Dashboard;