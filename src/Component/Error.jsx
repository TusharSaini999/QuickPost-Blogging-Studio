import { Link, useRouteError, isRouteErrorResponse, useLocation } from "react-router";

export default function UniversalError() {
  const error = useRouteError();
  const location = useLocation();
  console.error(error);

  // Decide parent/child based on URL
  const isDashboard = location.pathname.startsWith("/dashboard");

  let title = "Unexpected Error";
  let description = "Something went wrong. Please try again later.";
  let status = 500;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title =
      error.status === 404
        ? "Page Not Found"
        : error.status === 401
        ? "Unauthorized"
        : error.status === 503
        ? "Service Unavailable"
        : "Unexpected Error";
    description = error.statusText || description;
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animated-bg px-6">
      <h1 className="text-[8rem] font-extrabold text-red-500 drop-shadow-lg animate-pulse-slow">
        {status}
      </h1>
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">{description}</p>

      <div className="mt-6 flex gap-4">
        <Link
          to={isDashboard ? "/dashboard" : "/"}
          className="px-6 py-3 bg-red-500 text-white rounded-2xl shadow-md hover:bg-red-600 transition-all hover:animate-button-bounce hover:shadow-glow"
        >
          {isDashboard ? "Back to Dashboard" : "Back Home"}
        </Link>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-800 text-white rounded-2xl shadow-md hover:bg-gray-900 transition-all hover:animate-button-bounce hover:shadow-glow"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
