import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EmailVerification from "../Component/EmailVerification";
import DashboardOverview from "../Component/DashboardOverview";
import { useAIPageContext } from "../Component/AIPageContext";
function Dashboard() {
    const token = useSelector((s) => s.AuthSlice.status);
    const userData = useSelector((s) => s.AuthSlice.userData);
    const { setPageAIContext } = useAIPageContext();
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

    useEffect(() => {
        if (!userData) return;

        setPageAIContext({
            currentPageOnUser: "Dashboard",
            dashboardSummary: { welcomeMessage: `Welcome back, ${userData?.name || "User"}` },
            visibleSections: ["Top Navigation", "Dashboard Overview", "Post Statistics", "Quick Links", "Post Charts"],
            quickLinks: ["New Post", "All Posts", "My Public Post", "My Private Post", "Drafts Post", "All Public Post"],
        });

        return () => setPageAIContext(null);
    }, [userData, setPageAIContext]);

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