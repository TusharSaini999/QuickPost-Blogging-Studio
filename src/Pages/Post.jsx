import { useEffect, useState } from "react";
import Card from "../Component/Card";
import { useSelector, useDispatch } from "react-redux";
import CardSkeleton from "../Component/CardSkeleton";
import { deletePost, getPost } from "../Feature/Post";
import StatusModal from "../Component/PopupMessage";
import databaseService from "../Appwrite/databases";
import { removePostCount } from "../Feature/Auth";
import { deletePostContext } from "../Feature/Post";
import { useNavigate } from "react-router";
function Post({ type = "all" }) {
    const navigate=useNavigate();
    const userData = useSelector((s) => s.AuthSlice.userData);
    const postSlice = useSelector((s) => s.PostSlice);
    const [data, setData] = useState({});
    const loading = useSelector((s) => s.PostSlice.getloading);
    const [title, setTitle] = useState("All Post");
    const [showModal, setShowModal] = useState(false);

    const [modalData, setModalData] = useState({
        type: "success",
        title: "",
        description: "",
        cancelText: "Close",
        confirmText: "Confirm",
        onConfirm: null
    });
    const dispatch = useDispatch();
    const onDelete = (id, status, visibility) => {
        setModalData({
            type: "delete",
            title: "Delete Confirmation",
            description: `Are you sure you want to delete post?`,
            cancelText: "Cancel",
            confirmText: "Yes, Delete",
            onConfirm: () => {
                conformDelete(id, status, visibility);
                setShowModal(false);
            }
        });
        setShowModal(true);
    }
    const conformDelete = (id, status, visibility) => {
        try {
            let dataObject = { ...userData?.prefs };
            console.log(1,dataObject);
            let newData = databaseService.decrementPost({
                dataObject,
                status,
                visibility
            })
            console.log(1,newData);
            dispatch(removePostCount(newData));
            dispatch(deletePostContext({ id, status, visibility }));
            dispatch(deletePost({ documnetId: id, dataObject: newData, status, visibility }));

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (postSlice.getStatus === "Error") {
            dispatch(getPost(userData.user?.$id));
        }

        if (type === "all") {
            setData({ ...postSlice.AllPost });
        } else if (type === "public") {
            setData({ ...postSlice?.PublicPost });
        } else if (type === "private") {
            setData({ ...postSlice?.PrivatePost });
        } else if (type === "drafts") {
            setData({ ...postSlice?.DraftPost });
        }
    }, [postSlice, type]);

    useEffect(() => {
        console.log(data)
    }, [data])
    useEffect(() => {
        if (type == "all") {
            setTitle("My Posts");
        } else if (type == "public") {
            setTitle("My Public Posts");
        } else if (type == "private") {
            setTitle("My Private Posts");
        } else if (type === "drafts") {
            setTitle("My Draft Posts");
        }
    }, [type]);

    return (
        <>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors p-6">
                <header className="mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        {title}
                    </h1 >
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage, edit and track all your posts here.
                    </p>
                </header >

                <main>
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    ) : Object.keys(data).length > 0 ? (
                        <>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(data).map(([id, post]) => (
                                    post.status === "Draft" ? (
                                        <Card
                                            key={id}
                                            postType="Draft"
                                            imageLink={post.fetureimage}
                                            title={post.titles}
                                            updatedAt={post.$updatedAt}
                                            shortDescription={post.shortDescription}
                                            delet={() => onDelete(id, post.status, post.visibility)}
                                            onClick={()=>{
                                                navigate(`/dashboard/post/view/${id}`);
                                            }}
                                            onEdit={()=>{
                                                navigate(`/dashboard/post/edit/${id}`);
                                            }}
                                        />
                                    ) : post.status === "Post" && (
                                        <Card
                                            key={id}
                                            postType={post.visibility}
                                            imageLink={post.fetureimage}
                                            title={post.titles}
                                            updatedAt={post.$updatedAt}
                                            shortDescription={post.shortDescription}
                                            delet={() => onDelete(id, post.status, post.visibility)}
                                            onClick={()=>{
                                                navigate(`/dashboard/post/view/${id}`);
                                            }}
                                            onEdit={()=>{
                                                navigate(`/dashboard/post/edit/${id}`);
                                            }}
                                        />
                                    )
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-10">
                            No posts found.
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

            </div >
        </>

    );
}

export default Post;
