import { useEffect, useRef, useState } from "react";
import { Upload, Globe, Lock, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { createPost, createPostContext, updatePost, updatePostContext } from "../Feature/Post";
import BundledEditor from "../Editor/BundledEditor";
import { useNavigate, useParams } from "react-router";
import { updateEditPrefs, updatePrefs } from "../Feature/Auth";
import { ID } from "appwrite";
import databaseService from "../Appwrite/databases";

export default function CreatePost() {
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const [prevousPostData, setPrevousPostData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState("Post");
  const [coverPreview, setCoverPreview] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const { id } = useParams();
  const nav = useNavigate();
  const theam = useSelector((state) => state.TheamSlice.value);
  const userData = useSelector((s) => s.AuthSlice.userData);
  const postdata = useSelector((state) => state.PostSlice.AllPost);
  const draftPost = useSelector((state) => state.PostSlice.DraftPost);
  const publicPost = useSelector((state) => state.PostSlice.PublicPost);
  const privatePost = useSelector((state) => state.PostSlice.PrivatePost);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      excerpt: "",
      visibility: "Public",
      tags: [],
      coverImage: null,
      content: "",
    },
  });
  useEffect(() => {
    setLoading(true);
    if (id) {
      if (postdata[id] || draftPost[id] || publicPost[id] || privatePost[id]) {
        let temp;
        if (postdata[id]) {
          temp = postdata[id];
        } else if (draftPost[id]) {
          temp = draftPost[id];
        } else if (publicPost[id]) {
          temp = publicPost[id];
        } else if (privatePost[id]) {
          temp = privatePost[id];
        }
        if (temp) {
          setCoverPreview(temp?.fetureimage);
          reset({
            title: temp?.titles || "Post Title",
            excerpt: temp?.shortDescription,
            visibility: temp?.visibility || "Public",
            tags: temp?.tags || [],
            coverImage: null,
            content: temp?.content || "",
          });
          setPrevousPostData(temp);
        }
      }
    }
    setLoading(false);
  }, [id]);
  const tags = watch("tags");
  const visibility = watch("visibility");

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const content = editorRef.current?.getContent() || "";
      const statusValue = status;

      if (statusValue !== "Draft" && !content.trim()) {
        throw {
          title: "Content Error",
          message: "Content cannot be empty when posting.",
          code: 400,
        };
      }
      if (id && prevousPostData) {
        const payload = {
          $id: id,
          title: formData.title,
          content,
          fetureimage: formData.coverImage,
          status: statusValue,
          userid: userData?.$id,
          Short_Description: formData.excerpt,
          Tags: formData.tags,
          visibility: formData.visibility,
        };
        let newData = databaseService.updatePostPrefs({ prevousData: prevousPostData, currentData: payload, Prefs: { ...userData?.prefs } });
        payload.dataObject = newData;
        payload.prevousData = prevousPostData;
        dispatch(updatePost(payload));
        dispatch(updateEditPrefs(newData));
        let currentTime = new Date().toISOString();
        const dataObjectForStored = {
          name: userData?.name,
          $id: id,
          createdAt: currentTime,
          $updatedAt: currentTime,
          content,
          fetureimage: coverPreview || "https://nyc.cloud.appwrite.io/v1/storage/buckets/68850981002228af6958/files/68b1c838002ea271cbcc/view?project=6884f99f002310f0e0fe",
          shortDescription: formData.excerpt,
          tags: formData.tags,
          titles: formData.title,
          userid: userData?.$id,
          visibility: formData.visibility,
          status: statusValue
        };
        dispatch(updatePostContext({
          $id: id,
          currentData: { [dataObjectForStored.$id]: dataObjectForStored }
        }));
        console.log("In Edit",payload,dataObjectForStored);
        nav(-1);
        setLoading(false);
      } else {
        let documnetId = ID.unique();
        const payload = {
          name: userData?.name,
          documnetId,
          title: formData.title,
          content,
          feturedImage: formData.coverImage,
          status: statusValue,
          userId: userData?.$id,
          Short_Description: formData.excerpt,
          Tags: formData.tags,
          visibility: formData.visibility,
          dataObject: { ...userData?.prefs },
        };
        
        let currentTime = new Date().toISOString();
        const dataObjectForStored = {
          name: userData?.name,
          $id: documnetId,
          createdAt: currentTime,
          $updatedAt: currentTime,
          content,
          fetureimage: coverPreview || "https://nyc.cloud.appwrite.io/v1/storage/buckets/68850981002228af6958/files/68b1c838002ea271cbcc/view?project=6884f99f002310f0e0fe",
          shortDescription: formData.excerpt,
          tags: formData.tags,
          titles: formData.title,
          userid: userData?.$id,
          visibility: formData.visibility,
          status: statusValue
        };
        let newData = databaseService.updatePrefes({ dataObject: userData?.prefs, status: statusValue, visibility: formData.visibility });
        payload.dataObject = newData;
        dispatch(createPost(payload))
        dispatch(updatePrefs(newData));
        dispatch(createPostContext({
          [dataObjectForStored.$id]: dataObjectForStored
        }));
        nav("/dashboard/post");
        setLoading(false);
      }
    } catch (error) {
      console.log("This is come in submit", error);
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag)
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("coverImage", file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      {isLoading ?
        <div className="min-h-screen px-6 py-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 animate-pulse">
          {/* Heading */}
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />

          {/* Cover Image */}
          <div className="mb-6">
            <div className="w-full h-48 rounded-2xl bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>

            {/* Excerpt */}
            <div>
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>

            {/* Tags */}
            <div>
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="flex gap-2 mb-3">
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            </div>

            {/* Visibility */}
            <div>
              <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="flex gap-4">
                <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            </div>

            {/* Editor */}
            <div>
              <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        </div>
        :
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-screen px-6 py-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300"
        >

          {/* Heading */}
          <h1 className="text-3xl font-bold mb-6 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">
            {!id ? "Create a New Post" : "Edit Post"}
          </h1>

          {/* Cover Image */}
          <div className="mb-6">
            {coverPreview ? (
              <div className="relative">
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="w-full max-h-80 rounded-2xl shadow-md"
                />
                <label className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer bg-black/60 text-white hover:bg-black/80 text-sm font-medium">
                  <Upload size={16} />
                  Change
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 cursor-pointer border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <Upload size={28} className="mb-2 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Upload Cover Image (Optional)
                </span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-lg font-semibold mb-2">Post Title</label>
              <input
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 5, message: "Title must be at least 5 characters" },
                  maxLength: { value: 100, message: "Title must not exceed 100 characters" },
                })}
                placeholder="Enter your post title..."
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-600 outline-none"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-lg font-semibold mb-2">Short Description</label>
              <textarea
                {...register("excerpt", {
                  required: "Short description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters" },
                  maxLength: { value: 200, message: "Description must not exceed 200 characters" },
                })}
                placeholder="Write a 2–3 line summary of your post..."
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-600 outline-none"
              />
              {errors.excerpt && <p className="text-red-600 text-sm mt-1">{errors.excerpt.message}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-lg font-semibold mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Press Enter to add tag"
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-600 outline-none"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white dark:bg-red-600 font-medium hover:bg-red-700 transition"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-600 text-red-700 dark:text-red-100 text-sm font-medium"
                  >
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-gray-600 dark:text-gray-300">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-lg font-semibold mb-2">Visibility</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setValue("visibility", "Public")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-md transition ${visibility === "Public"
                    ? "bg-red-500 text-white dark:bg-red-600"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                    }`}
                >
                  <Globe size={18} />
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setValue("visibility", "Private")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-md transition ${visibility === "Private"
                    ? "bg-red-500 text-white dark:bg-red-600"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                    }`}
                >
                  <Lock size={18} />
                  Private
                </button>
              </div>
            </div>

            {/* Editor */}
            <div>
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <BundledEditor
                    key={theam ? "dark" : "light"}
                    value={field.value || ""}
                    onEditorChange={(content) => field.onChange(content)}
                    onInit={(_evt, editor) => (editorRef.current = editor)}
                    init={{
                      height: 500,
                      min_height: 300,
                      branding: false,
                      menubar: false,
                      skin: theam ? "oxide-dark" : "oxide",
                      content_css: theam ? "dark" : "default",
                      placeholder: "Start writing your post here...",
                      plugins: [
                        "advlist",
                        "anchor",
                        "autolink",
                        "autoresize",
                        "autosave",
                        "charmap",
                        "code",
                        "codesample",
                        "directionality",
                        "emoticons",
                        "fullscreen",
                        "help",
                        "image",
                        "importcss",
                        "insertdatetime",
                        "link",
                        "lists",
                        "media",
                        "nonbreaking",
                        "pagebreak",
                        "preview",
                        "quickbars",
                        "searchreplace",
                        "table",
                        "visualblocks",
                        "visualchars",
                        "wordcount",
                      ],
                      toolbar: [
                        "undo redo | preview | cut copy paste pastetext |",
                        "styleselect fontselect fontsizeselect formatselect |",
                        "bold italic underline strikethrough forecolor backcolor removeformat |",
                        "alignleft aligncenter alignright alignjustify | outdent indent |",
                        "bullist numlist checklist | subscript superscript blockquote |",
                        "link unlink anchor image media codesample charmap emoticons insertdatetime pagebreak nonbreaking table |",
                        "ltr rtl visualblocks visualchars searchreplace | help",
                      ].join(" "),
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6 }",
                    }}
                  />
                )}
              />
            </div>

            {/* Buttons */}
            {!prevousPostData ?
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={() => setStatus("Post")}
                  className="px-6 py-2 rounded-xl font-semibold bg-red-500 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-500 text-white shadow-md transition-colors"
                >
                  Publish
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={() => setStatus("Draft")}
                  className="px-6 py-2 rounded-xl font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white shadow-md transition-colors"
                >
                  Drafts
                </button>
              </div>
              :
              ((prevousPostData?.status) == "Post" ?
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={() => setStatus("Post")}
                  className="px-6 py-2 rounded-xl font-semibold bg-red-500 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-500 text-white shadow-md transition-colors"
                >
                  Publish
                </button>
                :
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    onClick={() => setStatus("Post")}
                    className="px-6 py-2 rounded-xl font-semibold bg-red-500 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-500 text-white shadow-md transition-colors"
                  >
                    Publish
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    onClick={() => setStatus("Draft")}
                    className="px-6 py-2 rounded-xl font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white shadow-md transition-colors"
                  >
                    Drafts
                  </button>
                </div>

              )


            }

          </div>
        </form>
      }
    </>
  );
}
