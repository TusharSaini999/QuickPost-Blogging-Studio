import { Link as RouteLink } from "react-router";

function ActionButton({ children, icon , to}) {

  return (
    <RouteLink
     to={to}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm 
                 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:border-red-300 hover:text-red-600 hover:shadow-md 
                 focus:outline-none focus:ring-2 focus:ring-gray-300 
                 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:text-red-400"
    >
      {icon} {children}
    </RouteLink>
  );
}

export default ActionButton;
