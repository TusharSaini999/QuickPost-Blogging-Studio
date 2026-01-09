import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import Card from "../Component/Card";
import { ArrowUp, ArrowDown, Calendar, RefreshCcw } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGlobalPosts } from "../Feature/GlobalPost";
import CardSkeleton from "../Component/CardSkeleton";

function PublicPosts() {
  const postData = useSelector((state) => state.GobalSlice?.posts);
  const loading = useSelector((state) => state.GobalSlice?.loading);
  const lastId = useSelector((state) => state.GobalSlice?.cursor);
  const InitialReq=useSelector((state)=>state.GobalSlice.InitialReq);
  const dispatch = useDispatch();
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("updated");
  const navigate = useNavigate();

  const fetchPosts = ({ limit = 9 }) => {
    // Stop fetch if loading or lastId is null (no more posts)
    if (loading || lastId === null) return;
    dispatch(fetchGlobalPosts({ limit, lastDocumentId: lastId }));
  };

  // Initial load
  useEffect(() => {
    if(!InitialReq){
    dispatch(fetchGlobalPosts({ limit: 9 }));
    }
  }, []);

  // Infinite scroll
  useEffect(() => {
  const handleScroll = () => {
    if (loading || lastId === null) return;

    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 300
    ) {
      dispatch(fetchGlobalPosts({ limit: 6, lastDocumentId: lastId }));
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastId, loading]);


  // -----------------------------
  // Sort posts
  // -----------------------------
  const sortedPosts = Object.entries(postData).sort(([, a], [, b]) => {
    const dateA =
      sortBy === "created"
        ? new Date(a.$createdAt)
        : new Date(a.$updatedAt);
    const dateB =
      sortBy === "created"
        ? new Date(b.$createdAt)
        : new Date(b.$updatedAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors p-6">

      {/* Header */}
      <header className="mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Public Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage, edit and track all your posts here.
            </p>
          </div>

          <div className="shrink-0">
            <button className="flex items-center overflow-hidden rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
              <div
                onClick={() =>
                  setSortBy((p) => (p === "created" ? "updated" : "created"))
                }
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
                onClick={() =>
                  setSortOrder((p) => (p === "asc" ? "desc" : "asc"))
                }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map(([id, post]) => (
            <Card
              key={id}
              postType="Public"
              imageLink={post.fetureimage}
              title={post.titles}
              authorName={post.name}
              updatedAt={post.$updatedAt}
              shortDescription={post.shortDescription}
              onClick={() => navigate(`/dashboard/post/view/${id}`)}
              editmode={false}
            />
          ))}

          {/* Skeletons */}
          {loading &&
            [...Array(6)].map((_, i) => (
              <CardSkeleton key={`skeleton-${i}`} />
            ))}
        </div>

        {/* No more */}
        {lastId === null && Object.keys(postData).length > 0 && (
          <p className="text-center text-gray-400 mt-6">
            No more posts to load.
          </p>
        )}

        {/* Empty */}
        {!loading && Object.keys(postData).length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            No public posts yet.
          </p>
        )}
      </main>
    </div>

  );
}

export default PublicPosts;
