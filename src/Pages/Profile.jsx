import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import Myprofile from "../Component/Myprofile";
import databaseService from "../Appwrite/databases";
import { update, setloading } from "../Feature/Profile";
import { useDispatch, useSelector } from "react-redux";
import ProfileSkeleton from "../Component/ProfileSkeleton";
import ChangePassword from "../Component/ChangePassword";
import Logout from "../Component/Logout";
function Profile() {
  const [btn, setBtn] = useState("Profile");
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState("");
  const userData = useSelector((state) => state.AuthSlice);
  const user = useSelector((state) => state.ProfileSlice?.profileData);
  const loading = useSelector((state) => state.ProfileSlice.loading);
  const dispatch = useDispatch();
  function onEdit(bool) {
    if (bool) {
      setEdit(true);
    } else {
      setEdit(false);
      setImage("");
    }
  }
  useEffect(() => {
    async function getData() {
      try {
        let documentid = userData.userData.prefs?.Profile_Document;
        dispatch(setloading(true));
        let rep = await databaseService.getProfile({ documentID: documentid });
        if (rep.success) {
          const data = {
            phone: rep.document.Phone || "",
            gender: rep.document.Gender || "",
            dob: rep.document.Dob || "",
            bio: rep.document.Bio || "",
            expertise: rep.document.Expertise || "",
            location: rep.document.Location || "",
            website: rep.document.Website || "",
            photo: rep.document.ProfileID,
            fileid: rep.document.FileId || "",
          };
          dispatch(update(data));
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setloading(false));
      }
    }
    if (userData.status && !user) {
      getData();
    }

  }, [userData.status]);

  return (
    <div className="min-h-[calc(100vh-60px-52px)] flex flex-col sm:flex-row overflow-hidden">

      {/* Sidebar */}
      <aside className="w-full sm:w-1/5 bg-gray-100 dark:bg-gray-900 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 flex flex-col items-center px-4 py-6 sm:py-10">

        <div className="flex flex-col items-center relative">
          {/* Profile Image */}
          {loading ? (
            // Skeleton circle for image
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
          ) : image != "" ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-red-600 dark:border-red-500 shadow-lg object-cover"
            />
          ) : (
            <img
              src={user?.photo}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-red-600 dark:border-red-500 shadow-lg object-cover"
            />
          )}

          {edit && !loading && (
            <>
              <input
                type="file"
                accept="image/*"
                id="upload-photo"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                  }
                }}
              />
              <label
                htmlFor="upload-photo"
                className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white p-2 rounded-full shadow-lg cursor-pointer transition"
                title="Upload Photo"
              >
                <Camera size={18} />
              </label>
            </>
          )}
        </div>

        {loading ? (
          // Skeleton for name
          <div className="mt-4 w-32 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        ) : (
          <h1 className="mt-4 text-lg sm:text-xl font-bold text-red-600 dark:text-red-500">
            {userData.userData?.name}
          </h1>
        )}

        <div className="flex flex-col sm:flex-col gap-2 mt-6 w-full">
          {["Profile", "Change Password"].map((label) => (
            <button
              key={label}
              className={`w-full sm:w-auto flex-1 text-center text-sm font-medium py-2 px-4 rounded transition ${btn === label
                  ? "bg-red-600 text-white shadow"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white"
                }`}
              onClick={() => {
                setBtn(label);
                onEdit(false);
              }}
              disabled={loading}
            >
              {label === "Profile" ? "My Profile" : "Change Password"}
            </button>
          ))}

         <Logout logouttype={"all"}/>
        </div>

      </aside>


      {/* Right Panel */}
      {btn === "Profile" &&
        (loading ?
          (
            <ProfileSkeleton />
          ) :
          <Myprofile
            profilephoto={image}
            isEdit={onEdit}
          />
        )
      }
      {btn === "Change Password" &&
        <ChangePassword />
      }
    </div>
  );
}

export default Profile;
