import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Card from "../Component/Card";
import { ArrowUp, ArrowDown, Calendar, RefreshCcw } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGlobalPosts } from "../Feature/GlobalPost";
import CardSkeleton from "../Component/CardSkeleton";
import { clearSearchPosts } from "../Feature/GlobalPost"

function PublicPosts() {
  const loading = useSelector((state) => state.GobalSlice?.loading);
  const lastId = useSelector((state) => state.GobalSlice?.cursor);
  const InitialReq = useSelector((state) => state.GobalSlice?.InitialReq) || false;
  const serachLastId = useSelector((state) => state.GobalSlice?.searchcursor);
  const dispatch = useDispatch();
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("updated");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("Page");
  const postData = useSelector((state) =>
    mode === "Page"
      ? state.GobalSlice?.posts
      : state.GobalSlice?.searchpost
  );
  // const fetchPosts = ({ limit = 9 }) => {
  //   // Stop fetch if loading or lastId is null (no more posts)
  //   if (loading || lastId === null) return;
  //   dispatch(fetchGlobalPosts({ limit, lastDocumentId: lastId }));
  // };
  const handleSearch = () => {
    setMode("Search");
    dispatch(fetchGlobalPosts({ limit: 6, search: search }));
  }
  // Initial load
  useEffect(() => {
    if (!InitialReq) {
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

    const handleSearch = () => {
      if (loading || serachLastId === null) return;

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        dispatch(fetchGlobalPosts({ limit: 6, lastDocumentId: serachLastId, search: search }));
      }
    };
    if (mode == "Page") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleSearch);
      return () => window.removeEventListener("scroll", handleSearch);
    }
  }, [lastId, loading, serachLastId, mode, search]);


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
  useEffect(() => {
    if (search.trim() === "") {
      setMode("Page");
    }
  }, [search]);
  // Whenever mode switches, clear search posts if going back to Page mode
  useEffect(() => {
    if (mode === "Page") {
      dispatch(clearSearchPosts());
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors p-6">

      {/* Header */}
      <header className="mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* LEFT: Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Public Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage, edit and track all your posts here.
            </p>
          </div>

          {/* RIGHT: Search + Sort */}
          <div className="flex items-center gap-3 w-full sm:w-auto">

            {/* Search */}
            <div className="flex items-center gap-2 w-full sm:w-auto max-w-md">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full sm:w-64 px-4 py-2 rounded-lg border
                     border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-900
                     text-gray-800 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500"
                value={search}
                onChange={(e) => (setSearch(e?.target?.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim()) {
                    setMode("Search"); // switch mode to search
                    dispatch(fetchGlobalPosts({ limit: 6, search })); // trigger search
                  }
                }}
              />
              {mode === "Search" ? (
                // X / Clear button
                <button
                  onClick={() => {
                    setSearch("");   // clear input
                    setMode("Page"); // reset mode
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white font-semibold"
                >
                  ✕
                </button>
              ) : (
                // Search button
                <button
                  onClick={() => {
                    if (!search.trim()) return;
                    setMode("Search");
                    dispatch(fetchGlobalPosts({ limit: 6, search }));
                  }}
                  disabled={!search.trim()}
                  className={`px-4 py-2 rounded-lg text-white font-semibold 
    ${!search.trim()
                      ? "bg-gray-400 dark:bg-gray-800 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    }`}
                >
                  Search
                </button>

              )}


            </div>

            {/* Sort */}
            <div className="shrink-0">
              <button className="flex items-center overflow-hidden rounded-lg border
                           bg-white dark:bg-gray-900
                           border-gray-200 dark:border-gray-700 shadow-sm">
                <div
                  onClick={() =>
                    setSortBy((p) => (p === "created" ? "updated" : "created"))
                  }
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer
                       text-black dark:text-white
                       hover:bg-red-50 dark:hover:bg-gray-800 transition-colors"
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
                  className="flex items-center justify-center px-3 py-2 cursor-pointer
                       border-l border-gray-200 dark:border-gray-700
                       text-red-500 dark:text-red-600
                       hover:bg-red-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {sortOrder === "asc" ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                </div>
              </button>
            </div>

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
        {mode=="Page" && lastId === null && Object.keys(postData).length > 0 && (
          <p className="text-center text-gray-400 mt-6">
            No more posts to load.
          </p>
        )}
        {mode == "Search" && serachLastId === null && (
          <p className="text-center text-gray-400 mt-6">
            No posts found for your search.
          </p>
        )}

        {/* Empty */}
        {mode == "Page"&& !loading && Object.keys(postData).length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            No public posts yet.
          </p>
        )}
      </main>
    </div>

  );
}

export default PublicPosts;
