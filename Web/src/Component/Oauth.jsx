import { Github, CircleUserRound } from "lucide-react";
import authService from "../Appwrite/auth";

const OAuthLogin = () => {
  async function handelSubmit(value) {
    try {
      let main = await authService.createOathAccount({ value: value });
      if (main) {
        console.log("data enter", main);
      } else {
        console.log("Error: ", main);
      }
    } catch (error) {
      console.log("Error in forntend", error);
    }
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Google Login */}
        <button
          onClick={() => (handelSubmit("google"))}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300 font-medium"
        >
          <CircleUserRound className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

        {/* GitHub Login */}
        <button
          onClick={() => (handelSubmit("github"))}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300 font-medium"
        >
          <Github className="w-5 h-5" />
          <span>Continue with GitHub</span>
        </button>
      </div>
    </div>
  );
};

export default OAuthLogin;
