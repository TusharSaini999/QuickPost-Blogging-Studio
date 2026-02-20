import React from "react";
import { Plus, FileText, CheckCircle2, FileEdit, Lock, Unlock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import ActionButton from "./ActionButton";
import KpiCard from "./KpiCard";
import AIAssistantSidebar from "./AIAssistant";
import { Link as RouteLink } from "react-router";

function getLast4WeeksWithEmptyBars(weekPrefs) {
  const weeksObj = typeof weekPrefs === "string" ? JSON.parse(weekPrefs) : { ...weekPrefs };
  const TOTAL_WEEKS = 52;
  function getISOWeekNumber(date) {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((tempDate - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
      )
    );
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentWeekNum = getISOWeekNumber(today);

  const result = [];

  for (let i = 3; i >= 0; i--) {
    let weekNum = currentWeekNum - i;
    let weekYear = currentYear;

    if (weekNum <= 0) {
      weekNum += TOTAL_WEEKS;
      weekYear -= 1;
    }

    const weekKey = `${weekYear}${weekNum.toString().padStart(2, "0")}`;

    result.push({
      week: `Week ${4 - i}`, // bar labels Week 1 → Week 4
      posts: weeksObj[weekKey] ? parseInt(weeksObj[weekKey]) : 0
    });
  }

  return result;
}


export default function DashboardOverview({
  name = "User_Name",
  stats = { total: 0, published: 0, drafts: 0, private: 0, public: 0 },
  week = {
    "202533": 0,
    "202534": 0,
    "202535": 0,
    "202536": 0
  }
}) {
  const pieData = [
    { name: "Public", value: stats.public },
    { name: "Private", value: stats.private },
    { name: "Drafts", value: stats.drafts }
  ];

  const COLORS = ["#ef4444", "#f97316", "#3b82f6"];

  const barData = getLast4WeeksWithEmptyBars(week);
  return (
    <div className="min-h-screen w-full bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <header className="backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-red-700 via-red-600 to-red-500 dark:from-red-600 dark:via-red-500 dark:to-red-400 bg-clip-text text-transparent">
              Welcome, {name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Here’s your dashboard overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <RouteLink
              to="/dashboard/create"
              className="inline-flex items-center gap-2 rounded-2xl text-white bg-red-500 hover:bg-red-600 font-medium text-sm px-4 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Create New Post</span>
            </RouteLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <AIAssistantSidebar fullPage={false} page={"Dashboard"} AICall={() => { }} />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <KpiCard title="Total Posts" value={stats.total} icon={<FileText className="h-6 w-6" />} tooltip="All posts you’ve created" />
          <KpiCard title="Published" value={stats.published} icon={<CheckCircle2 className="h-6 w-6" />} tooltip="Live posts visible to everyone" />
          <KpiCard title="Drafts" value={stats.drafts} icon={<FileEdit className="h-6 w-6" />} tooltip="Saved drafts not yet published" />
          <KpiCard title="Public" value={stats.public} icon={<Unlock className="h-6 w-6" />} tooltip="Publicly visible posts" />
          <KpiCard title="Private" value={stats.private} icon={<Lock className="h-6 w-6" />} tooltip="Only you can see these" />
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <h2 className="mb-3 text-lg font-semibold text-red-600 dark:text-red-400">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <ActionButton icon={<Plus className="h-5 w-5" />} to={"/dashboard/create"}>New Post</ActionButton>
            <ActionButton icon={<FileText className="h-5 w-5" />} to={"/dashboard/post"}>All Posts</ActionButton>
            <ActionButton icon={<Unlock className="h-5 w-5" />} to={"/dashboard/post/public"}>My Public Post</ActionButton>
            <ActionButton icon={<Lock className="h-5 w-5" />} to={"/dashboard/post/private"}>My Private Post</ActionButton>
            <ActionButton icon={<FileEdit className="h-5 w-5" />} to={"/dashboard/post/drafts"}>Drafts Post</ActionButton>
            <ActionButton icon={<CheckCircle2 className="h-5 w-5" />} to={"/dashboard/publicpost"}>All Public Post</ActionButton>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold text-red-600 dark:text-red-400">Post Distribution</h2>
            <div className="relative w-full h-[250px]">
              {pieData.every(item => item.value === 0) ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                  No posts yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold text-red-6000 dark:text-red-400">Posts Created Per Week</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="posts" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}
