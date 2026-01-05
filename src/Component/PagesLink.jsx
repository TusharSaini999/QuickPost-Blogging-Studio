import { Link } from "react-router";
function PagesLink({ value = "L" }) {
    return (
        <>
            <div className="flex justify-between gap-4 text-center text-sm text-gray-600 dark:text-gray-300">
                {value == "F" ?
                    (
                        <p>
                            <Link
                                to="/login"
                                className="text-red-600 dark:text-red-400 font-medium hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    ) : (
                        <p>
                            <Link
                                to="/"
                                className="text-red-600 dark:text-red-400 font-medium hover:underline"
                            >
                                Home
                            </Link>
                        </p>
                    )
                }

                {value == "L" || value == "F" ?
                    (
                        <p>
                            Don’t have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-red-600 dark:text-red-400 font-medium hover:underline"
                            >
                                Sign up
                            </Link>

                        </p>
                    )
                    : value == "S" && (
                        <p>
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-red-600 dark:text-red-400 font-medium hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    )
                }

            </div>
        </>
    )
}
export default PagesLink;