import { useEffect, useState, useRef } from "react";
import Card from "../Component/Card";
import { useSelector, useDispatch } from "react-redux";
import CardSkeleton from "../Component/CardSkeleton";
import { deletePost, getPost } from "../Feature/Post";
import StatusModal from "../Component/PopupMessage";
import databaseService from "../Appwrite/databases";
import { removePostCount } from "../Feature/Auth";
import { deletePostContext } from "../Feature/Post";
import { useNavigate } from "react-router";
import { ArrowUp, ArrowDown, Calendar, RefreshCcw } from "lucide-react";

function Post({ type = "all" }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userData = useSelector((s) => s.AuthSlice.userData);
    const postSlice = useSelector((s) => s.PostSlice);
    const loading = useSelector((s) => s.PostSlice.getloading);
    const [data, setData] = useState({});
    const [title, setTitle] = useState("All Post");
    const [showModal, setShowModal] = useState(false);

    const [sortOrder, setSortOrder] = useState("desc");
    const [sortBy, setSortBy] = useState("updated");

    const [loadingMore, setLoadingMore] = useState(false); 

    const [modalData, setModalData] = useState({
        type: "success",
        title: "",
        description: "",
        cancelText: "Close",
        confirmText: "Confirm",
        onConfirm: null
    });

    const onDelete = (id, status, visibility) => {
        setModalData({
            type: "delete",
            title: "Delete Confirmation",
            description: "Are you sure you want to delete post?",
            cancelText: "Cancel",
            confirmText: "Yes, Delete",
            onConfirm: () => {
                confirmDelete(id, status, visibility);
                setShowModal(false);
            }
        });
        setShowModal(true);
    };

    const confirmDelete = (id, status, visibility) => {
        try {
            let dataObject = { ...userData?.prefs };
            let newData = databaseService.decrementPost({
                dataObject,
                status,
                visibility
            });

            dispatch(removePostCount(newData));
            dispatch(deletePostContext({ id, status, visibility }));
            dispatch(deletePost({ documnetId: id, dataObject: newData, status, visibility }));
        } catch (error) {
            console.log(error);
        }
    };

    // -----------------------------
    // Set posts based on type
    // -----------------------------
    useEffect(() => {
        if (postSlice.getStatus === "Error") {
            dispatch(getPost({ userId: userData?.$id,defaults: true }));
        }

        if (type === "all") {
            setData({ ...postSlice.AllPost });
            setTitle("My Posts");
        } else if (type === "public") {
            setData({ ...postSlice.PublicPost });
            setTitle("My Public Posts");
        } else if (type === "private") {
            setData({ ...postSlice.PrivatePost });
            setTitle("My Private Posts");
        } else if (type === "drafts") {
            setData({ ...postSlice.DraftPost });
            setTitle("My Draft Posts");
        }
    }, [postSlice, type]);

    // -----------------------------
    // Load more function
    // -----------------------------
    const loadMore = async () => {
        console.log("Call when scroll", postSlice?.cursors);
        if (loadingMore) return;
        const cursor = postSlice?.cursors?.[type];
        if (!cursor) return;

        setLoadingMore(true);
        try {
            await dispatch(
                getPost({
                    userId: userData?.$id,
                    lastIds: postSlice?.cursors,
                    defaults: false,
                    types: type,
                    limit: 3,
                })
            ).unwrap();
        } catch (err) {
            console.log("Error loading more posts:", err);
        } finally {
            setLoadingMore(false);
        }
    };

    // -----------------------------
    // Infinite scroll trigger
    // -----------------------------
    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = window.innerHeight;

            // When user scrolls near bottom, load more posts
            if (scrollTop + clientHeight >= scrollHeight - 300) {
                loadMore();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [postSlice?.cursors, type, loadingMore]);

    // -----------------------------
    // Sort posts
    // -----------------------------
    const sortedPosts = Object.entries(data).sort(([, a], [, b]) => {
        const dateA = sortBy === "created" ? new Date(a.$createdAt) : new Date(a.$updatedAt);
        const dateB = sortBy === "created" ? new Date(b.$createdAt) : new Date(b.$updatedAt);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors p-6">
            {/* Header */}
            <header className="mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage, edit and track all your posts here.</p>
                    </div>

                    <div className="shrink-0">
                        <button className="flex items-center overflow-hidden rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
                            <div
                                onClick={() => setSortBy((p) => (p === "created" ? "updated" : "created"))}
                                className="flex items-center gap-2 px-4 py-2 cursor-pointer select-none text-black dark:text-white hover:bg-red-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                {sortBy === "created" ? (
                                    <>
                                        <Calendar className="text-red-500 dark:text-red-700" size={16} />
                                        <span className="font-medium">Created</span>
                                    </>
                                ) : (
                                    <>
                                        <RefreshCcw className="text-red-500 dark:text-red-700" size={16} />
                                        <span className="font-medium">Updated</span>
                                    </>
                                )}
                            </div>

                            <div
                                onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
                                className="flex items-center justify-center px-3 py-2 cursor-pointer select-none border-l border-gray-200 dark:border-gray-700 text-red-500 dark:text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                {sortOrder === "asc" ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Posts */}
            <main>
                {loading && !(postSlice?.InitialReq) ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : sortedPosts.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedPosts.map(([id, post]) =>
                            post.status === "Draft" ? (
                                <Card
                                    key={id}
                                    postType="Draft"
                                    imageLink={post.fetureimage}
                                    title={post.titles}
                                    authorName={post.name}
                                    updatedAt={post.$updatedAt}
                                    shortDescription={post.shortDescription}
                                    delet={() => onDelete(id, post.status, post.visibility)}
                                    onClick={() => navigate(`/dashboard/post/view/${id}`)}
                                    onEdit={() => navigate(`/dashboard/post/edit/${id}`)}
                                />
                            ) : (
                                <Card
                                    key={id}
                                    postType={post.visibility}
                                    imageLink={post.fetureimage}
                                    title={post.titles}
                                    authorName={post.name}
                                    updatedAt={post.$updatedAt}
                                    shortDescription={post.shortDescription}
                                    delet={() => onDelete(id, post.status, post.visibility)}
                                    onClick={() => navigate(`/dashboard/post/view/${id}`)}
                                    onEdit={() => navigate(`/dashboard/post/edit/${id}`)}
                                />
                            )
                        )}

                        {/* Loading skeleton for paging */}
                        {loadingMore &&
                            [...Array(3)].map((_, i) => <CardSkeleton key={`loading-${i}`} />)}
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-10">No posts found.</p>
                )}
                {!postSlice.cursor?.[type] && (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-10">
                        You’ve reached the end.
                    </p>
                )}

            </main>

            <StatusModal
                show={showModal}
                onClose={() => setShowModal(false)}
                type={modalData.type}
                title={modalData.title}
                description={modalData.description}
                cancelText={modalData.cancelText}
                confirmText={modalData.confirmText}
                onConfirm={modalData.onConfirm}
            />
        </div>
    );
}

export default Post;
