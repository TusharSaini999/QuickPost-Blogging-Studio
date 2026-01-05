import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { update, updateHistoryName } from "../Feature/Profile";
import { saveData } from "../Feature/Profile";
import { updateName } from "../Feature/Auth";
function Myprofile({ profilephoto, isEdit }) {
    const [preFormData, setPreformData] = useState();
    const [edit, setEdit] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.AuthSlice?.userData);
    const status = useSelector((state) => state.ProfileSlice.savestatus);

    const joined = userData?.$createdAt
        ? new Date(userData.$createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        })
        : "";
    const name = userData?.name || "";
    const email = userData?.email || "";
    const user = useSelector((state) => state.ProfileSlice?.profileData);
    const fileid = user?.fileid;
    const photourl = user?.photo;
    const dobValue = watch("dob", user?.dob);
    const skill = watch("expertise", user?.expertise);


    const handleEdit = async (data) => {
        console.log("Form Data", data);
        let documentID = userData.prefs?.Profile_Document;
        let prevname = userData.name;
        if (prevname == data.name) {
            dispatch(updateHistoryName(prevname));
            console.log(prevname, data.name)
            data.name = "";
        } else {
            console.log(prevname, data.name)
            dispatch(updateHistoryName(prevname));
            dispatch(updateName(data.name));
        }
        let dob = new Date(data.dob);
        let newdob;
        if (dob == "Invalid Date") {
            newdob = "";
        } else {
            newdob = dob.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        }
        data.dob = newdob;
        const constext = {
            phone: data.phone,
            gender: data.gender,
            dob: data.dob,
            bio: data.bio,
            expertise: data.expertise,
            location: data.location,
            website: data.website,
            fileid: fileid,
        };
        if (profilephoto) {
            constext.photo = URL.createObjectURL(profilephoto);
        } else {
            constext.photo = photourl;
        }
        const prevousData = {
            bio: user.bio,
            dob: user.dob,
            expertise: user.expertise,
            gender: user.gender,
            location: user.location,
            name: name,
            phone: user.phone,
            website: user.website
        };
        setPreformData(prevousData);
        dispatch(update(constext));
        isEdit(false);
        setEdit(false);
        const radydata = {
            documentID: documentID,
            Name: data.name,
            Phone: data.phone,
            Dob: data.dob,
            Gender: data.gender,
            Location: data.location,
            Website: data.website,
            Bio: data.bio,
            Expertise: data.expertise,
            ProfileFile: profilephoto,
            FileId: fileid
        };
        dispatch(saveData(radydata));
    };
    useEffect(() => {
        if (status == "Error") {
            reset(preFormData);
        }
    }, [status])
    return (
        <main className="w-full sm:w-4/5 bg-white dark:bg-gray-800 p-6 sm:p-8 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700 mx-auto">
                <form onSubmit={handleSubmit(handleEdit)}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            Profile
                        </h2>
                        {edit ? (
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setEdit(false); reset(); isEdit(false) }}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <p
                                onClick={() => {
                                    if (status !== "Pending") {  // prevent click when pending
                                        setEdit(true);
                                        isEdit(true);
                                    }
                                }}
                                disabled={status === "Pending"}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer text-white 
                                    ${status === "Pending"
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                                    }`}
                            >
                               Edit
                            </p>

                        )}
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-4 text-gray-700 dark:text-gray-200 text-sm sm:text-base">
                        {/* Name */}
                        {edit ? (
                            <p>
                                <strong>Name: </strong>
                                <input
                                    type="text"
                                    {...register("name", {
                                        maxLength: {
                                            value: 30,
                                            message: "Name must be less than 30 characters"
                                        },
                                        required: "Name is required"
                                    })}
                                    defaultValue={name}
                                    className="ml-2 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                                 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                />
                            </p>
                        ) : (
                            <p><strong>Name: </strong>{name}</p>
                        )}
                        {errors.name && (<div className="text-red-500">{errors.name.message}</div>)}

                        {/* Email */}
                        <p><strong>Email:</strong> {email}</p>

                        {/* Phone */}
                        {edit ? (
                            <p>
                                <strong>Phone: </strong>
                                <input
                                    type="number"
                                    {...register("phone", {
                                        maxLength: {
                                            value: 10,
                                            message: "Phone number must be exactly 10 digits"
                                        },
                                        minLength: {
                                            value: 10,
                                            message: "Phone number must be exactly 10 digits"
                                        }
                                    })}
                                    defaultValue={user?.phone}
                                    className="ml-2 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                                 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                />
                            </p>
                        ) : (
                            <p><strong>Phone: </strong>{user?.phone || "Not Provided"}</p>
                        )}
                        {errors.phone && (<div className="text-red-500">{errors.phone.message}</div>)}

                        {/* DOB */}
                        <div className="flex gap-10">
                            {edit ? (
                                <p>
                                    <strong>DOB: </strong>
                                    <input
                                        type="date"
                                        defaultValue={
                                            user?.dob
                                                ? new Date(user?.dob).toISOString().split("T")[0]
                                                : ""
                                        }
                                        {...register("dob", {
                                            validate: (value) => {
                                                const today = new Date();
                                                const birthDate = new Date(value);
                                                if (birthDate > today) {
                                                    return "Date of birth cannot be in the future";
                                                }
                                                const age =
                                                    today.getFullYear() - birthDate.getFullYear() -
                                                    (today.getMonth() < birthDate.getMonth() ||
                                                        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
                                                        ? 1
                                                        : 0);
                                                if (age < 13) return "You must be at least 13 years old";
                                                if (age > 100) return "Please enter a valid date of birth";
                                                return true;
                                            }
                                        })}
                                        className="ml-2 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 
                                    bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                                    focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    />
                                </p>
                            ) : (
                                <p><strong>DOB: </strong>{user?.dob || "Not Provided"}</p>
                            )}

                            <p><strong>Age: </strong>
                                {new Date().getFullYear() - new Date(dobValue).getFullYear()}
                            </p>
                        </div>
                        {errors.dob && (<div className="text-red-500">{errors.dob.message}</div>)}

                        {/* Gender */}
                        {edit ? (
                            <p>
                                <strong>Gender: </strong>
                                <select
                                    {...register("gender")}
                                    defaultValue={user?.gender || ""}
                                    className="ml-2 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 
                                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                                focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </p>
                        ) : (
                            <p><strong>Gender:</strong> {user?.gender || "Not Provided"}</p>
                        )}

                        {/* Location */}
                        {edit ? (
                            <p>
                                <strong>Location: </strong>
                                <input
                                    type="text"
                                    {...register("location", {
                                        maxLength: {
                                            value: 100,
                                            message: "Location must be less than 100 characters"
                                        }
                                    })}
                                    defaultValue={user?.location}
                                    className="ml-2 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                                 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                />
                            </p>
                        ) : (
                            <p><strong>Location: </strong>{user?.location || "Not Provided"}</p>
                        )}
                        {errors.location && (<div className="text-red-500">{errors.location.message}</div>)}

                        {/* Portfolio */}
                        {edit ? (
                            <p>
                                <strong>Portfolio: </strong>
                                <input
                                    type="url"
                                    {...register("website", {
                                        pattern: {
                                            value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/,
                                            message: "Please enter a valid URL"
                                        }
                                    })}
                                    defaultValue={user?.website || ""}
                                    placeholder="https://your-portfolio.com"
                                    className="ml-2 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 
        bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
        focus:outline-none focus:ring-2 focus:ring-red-500 transition w-64"
                                />
                            </p>
                        ) : (
                            <p>
                                <strong>Portfolio:</strong>
                                {user?.website ? (
                                    <a
                                        href={user?.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-red-500 hover:underline ml-1"
                                    >
                                        {user?.website}
                                    </a>
                                ) : " Not Provided"}
                            </p>
                        )}
                        {errors.website && (<div className="text-red-500">{errors.website.message}</div>)}

                        {/* Bio */}
                        {edit ? (
                            <p className="flex flex-col">
                                <strong>Bio: </strong>
                                <textarea
                                    {...register("bio", {
                                        maxLength: {
                                            value: 300,
                                            message: "Bio cannot exceed 300 characters"
                                        }
                                    })}
                                    defaultValue={user?.bio || ""}
                                    placeholder="Tell something about yourself..."
                                    className="mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                                focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none w-full sm:w-2/3"
                                    rows={4}
                                />
                            </p>
                        ) : (
                            <p>
                                <strong>Bio:</strong> {user?.bio || "Not Provided"}
                            </p>
                        )}
                        {errors.bio && (<div className="text-red-500">{errors.bio.message}</div>)}

                        {/* Skill */}
                        <div>
                            <strong>Expertise:</strong>
                            {edit ? (
                                <>
                                    <input
                                        {...register("expertise")}
                                        defaultValue={user?.expertise}
                                        placeholder="Enter skills, separated by commas (e.g., React, Node.js, PHP)"
                                        className="mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                                     focus:outline-none focus:ring-2 focus:ring-red-500 transition w-full sm:w-2/3 resize-none"
                                    />
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {skill?.split(",").map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                                            >
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {skill ? (skill.split(",").map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                                        >
                                            {skill.trim()}
                                        </span>
                                    ))) : ("Not Provided")}
                                </div>
                            )}
                        </div>
                        {errors.expertise && (<div className="text-red-500">{errors.expertise.message}</div>)}

                        {/* Join Date */}
                        <p><strong>Joined:</strong> {joined || "N/A"}</p>
                    </div>
                </form>
            </div>
        </main>
    );

}

export default Myprofile;
