import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

const PostView = () => {
    const navigate=useNavigate();
    const { id } = useParams();
    const postdata = useSelector((state) => state.PostSlice.AllPost);
    const draftPost = useSelector((state) => state.PostSlice.DraftPost);
    const publicPost=useSelector((state) => state.PostSlice.PublicPost);
    const privatePost=useSelector((state) => state.PostSlice.PrivatePost);
    const GlobalPost=useSelector((state)=>state.GobalSlice.posts)
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        if (postdata[id] || draftPost[id] || publicPost[id] || privatePost[id] || GlobalPost[id]) {
            let temp;
            if(postdata[id]){
                temp=postdata[id];
            }else if(draftPost[id]){
                temp=draftPost[id];
            }else if(publicPost[id]){
                temp=publicPost[id];
            }else if(privatePost[id]){
                temp=privatePost[id];
            }else if(GlobalPost[id]){
                temp=GlobalPost[id];
            }
            
            let visibility = "";
            if (temp?.status == "Post") {
                visibility = temp?.visibility;
            } else {
                visibility = "Drafts"
            }
            setPost({
                author: temp?.name,
                createdAt: temp?.createdAt,
                updatedAt: temp?.$updatedAt,
                title: temp?.titles,
                description: temp?.shortDescription,
                visibility: visibility,
                tags: temp?.tags,
                coverImageUrl: temp?.fetureimage,
                htmlContent: temp?.content,
            })
        }
        setLoading(false)
    }, [postdata])


    const createdDate = post?.createdAt ? new Date(post?.createdAt).toLocaleString() : "-";
    const updatedDate = post?.updatedAt ? new Date(post?.updatedAt).toLocaleString() : "-";

    return (
        <>
            {loading ? (
                <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 animate-pulse" >
                    <div className="w-full h-full">
                        <div className="relative w-full h-80 md:h-96 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-b-2xl" />

                        <div className="w-full px-6 py-10 md:px-16 lg:px-32 xl:px-30 space-y-10">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />

                            <aside className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 mb-8 space-y-6">
                                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded-md" />

                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                                        {Array(4)
                                            .fill(0)
                                            .map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded-md"
                                                />
                                            ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {Array(3)
                                            .fill(0)
                                            .map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"
                                                />
                                            ))}
                                    </div>
                                    <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded-md w-full" />
                                </div>
                            </aside>

                            <div className="space-y-4">
                                {Array(6)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-full"
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div >

            ) : (

                <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

                    <div className="w-full h-full">
                        {post?.coverImageUrl && (
                            <div className="relative w-full h-80 md:h-96 overflow-hidden">
                                {/* Back Button (floating on image) */}
                                <button
                                    onClick={() => navigate(-1)}
                                    className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 
                       text-sm font-medium rounded-full 
                       bg-white/80 dark:bg-gray-800/70 
                       text-gray-700 dark:text-gray-200 
                       backdrop-blur-sm shadow-md 
                       hover:bg-white dark:hover:bg-gray-700 
                       transition"
                                >
                                    ← Back
                                </button>
                                <img
                                    src={post?.coverImageUrl}
                                    alt={`Cover image for: ${post?.title}`}
                                    className="w-full h-full object-cover rounded-b-2xl shadow-md"
                                />
                            </div>
                        )}


                        {/* Content Section */}
                        <div className="w-full px-6 py-10 md:px-16 lg:px-32 xl:px-30 space-y-10 bg-white dark:bg-gray-900 transition-colors duration-300">

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                                {post?.title}
                            </h1>

                            {/* Post Details */}
                            <aside className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 mb-8">
                                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">
                                    Post Details
                                </h2>

                                {/* Meta + Tags + Description */}
                                <div className="space-y-4">
                                    {/* Meta Info */}
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <p>
                                            <span className="font-semibold">Author:</span> {post?.author}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Created:</span>{" "}
                                            <span className="italic">{createdDate}</span>
                                        </p>
                                        <p>
                                            <span className="font-semibold">Last Updated:</span>{" "}
                                            <span className="italic">{updatedDate}</span>
                                        </p>
                                        <p>
                                            <span className="font-semibold">Visibility:</span>{" "}
                                            <span
                                                className={`font-medium px-2 py-0.5 rounded-md ${post?.visibility === "Public"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : post?.visibility === "Private" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    }`}
                                            >
                                                {post?.visibility}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Tags */}
                                    {post?.tags && post?.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {post?.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Description */}
                                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed border-l-4 border-red-500 pl-4 italic">
                                        {post?.description}
                                    </p>
                                </div>
                            </aside>


                            {/* HTML Content */}
                            <article className="prose prose-lg max-w-none dark:prose-invert">
                                {parse(post?.htmlContent || "")}
                            </article>
                        </div>
                    </div>
                </div>

            )
            }
        </>
    );
};

export default PostView;
