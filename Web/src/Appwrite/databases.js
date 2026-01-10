import env from "../Configenv/env";
import { Client, ID, Databases, Storage, Query } from "appwrite";
import authService from "./auth";


export class DatabaseService {
    client = new Client();
    databases;
    bucket;
    constructor() {
        this.client.setEndpoint(env.APPWRITE_URL).setProject(env.APPWRITE_PROJECT_ID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }
    getYearWeek() {
        const now = new Date();
        const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
        const dayNum = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
        return `${date.getUTCFullYear()}${weekNo}`;
    }

    updateWeekObject(weekPrefs) {
        let weeks = typeof weekPrefs === "string" ? JSON.parse(weekPrefs) : { ...weekPrefs };

        const currentWeek = this.getYearWeek();

        if (weeks[currentWeek] !== undefined) {
            weeks[currentWeek] = parseInt(weeks[currentWeek]) + 1;
        } else {
            weeks[currentWeek] = 1;
            const firstKey = Object.keys(weeks)[0];
            delete weeks[firstKey];
        }

        return weeks;
    }
    //Document Services
    updatePrefes({ dataObject, status, visibility }) {
        let copyDataObject = { ...dataObject };
        if (status == "Post") {
            if (visibility == "Public") {
                copyDataObject.Public = parseInt(copyDataObject.Public) + 1;
            } else if (visibility == "Private") {
                copyDataObject.Private = parseInt(copyDataObject.Private) + 1;
            } else {
                const error = new Error("Error To Update the Count");
                error.type = "Count_Error";
                error.code = 500;
                throw error;
            }
        } else if (status == "Draft") {
            copyDataObject.Drafts = parseInt(copyDataObject.Drafts) + 1;
        } else {
            const error = new Error("Error To Update the Count");
            error.type = "Count_Error";
            error.code = 500;
            throw error;
        }
        let newWeek = this.updateWeekObject(copyDataObject.Week)
        copyDataObject.Week = JSON.stringify(newWeek);
        return copyDataObject;
    }
    decrementPost({ dataObject, status, visibility }) {
        let copyDataObject = { ...dataObject };
        copyDataObject.Public = Number(copyDataObject.Public) || 0;
        copyDataObject.Private = Number(copyDataObject.Private) || 0;
        copyDataObject.Drafts = Number(copyDataObject.Drafts) || 0;

        if (status === "Post") {
            if (visibility === "Public" && copyDataObject.Public > 0) {
                copyDataObject.Public -= 1;
            } else if (visibility === "Private" && copyDataObject.Private > 0) {
                copyDataObject.Private -= 1;
            }
        } else if (status === "Draft" && copyDataObject.Drafts > 0) {
            copyDataObject.Drafts -= 1;
        }

        return copyDataObject;
    }
    updatePostPrefs({ prevousData = {}, currentData = {}, Prefs = {} }) {
        let newDataPrefs = { ...Prefs };
        let prevousStatus = prevousData?.status;
        let prevousVisibilty = prevousData?.visibility;
        let currentStatus = currentData?.status;
        let currentVisibilty = currentData?.visibility;

        if (prevousStatus === "Draft" && currentStatus === "Draft") {
            return newDataPrefs;
        }
        if (prevousStatus === "Post" && currentStatus === "Draft") {
            return newDataPrefs;
        }
        if (prevousStatus == "Draft" && currentStatus == "Post") {
            newDataPrefs.Drafts -= 1;
            if (prevousVisibilty == "Public" && currentVisibilty == "Public") {
                newDataPrefs.Public += 1;
            } else if (prevousVisibilty == "Private" && currentVisibilty == "Private") {
                newDataPrefs.Private += 1;
            } else if (prevousVisibilty == "Private" && currentVisibilty == "Public") {
                newDataPrefs.Private -= 1;
                newDataPrefs.Public += 1;
            } else if (prevousVisibilty == "Public" && currentVisibilty == "Private") {
                newDataPrefs.Private += 1;
                newDataPrefs.Public -= 1;
            }
        } else if (prevousStatus == "Post" && currentStatus == "Post") {
            if (prevousVisibilty == "Private" && currentVisibilty == "Public") {
                newDataPrefs.Private -= 1;
                newDataPrefs.Public += 1;
            } else if (prevousVisibilty == "Public" && currentVisibilty == "Private") {
                newDataPrefs.Private += 1;
                newDataPrefs.Public -= 1;
            }
        }
        return newDataPrefs;
    }
    async createPost({ name, documnetId, title, content, feturedImage, status, userId, Short_Description, Tags, visibility, dataObject }) {
        console.log("In BAckend", title, content, feturedImage, status, userId, Short_Description, Tags, visibility, dataObject)
        try {
            let data = {
                name,
                titles: title,
                content: content,
                status: status,
                userid: userId,
                visibility: visibility,
                shortDescription: Short_Description,
                tags: Tags
            }
            data.createdAt = new Date().toISOString();
            let fileRes;
            if (feturedImage) {
                let imageID = ID.unique();
                fileRes = await this.createPhoto({
                    File: feturedImage,
                    FileId: imageID
                });
                if (fileRes.success) {
                    let imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${env.APPWRITE_BUKET_ID}/files/${imageID}/view?project=${env.APPWRITE_PROJECT_ID}`;
                    data.fetureimage = imageUrl;
                    data.fetureimageid = imageID;
                } else {
                    const error = new Error("Image Uploade Error");
                    error.type = "Image_Upload_Error";
                    error.code = 500;
                    throw error;
                }
            } else {
                data.fetureimage = "https://nyc.cloud.appwrite.io/v1/storage/buckets/68850981002228af6958/files/68b1c838002ea271cbcc/view?project=6884f99f002310f0e0fe";
            }
            let document = await this.databases.createDocument(
                env.APPWRITE_DB_ID,
                env.APPWRITE_COLLECTION_ID,
                documnetId,
                data
            )
            if (document) {
                let mainUpdateLable = await authService.updateLabels({ dataObject: dataObject });
                if (mainUpdateLable.status) {
                    return {
                        success: true,
                        document,
                        user: mainUpdateLable.data
                    }
                }
            } else {
                const error = new Error("Server Side Error");
                error.type = "Server_Error";
                error.code = 500;
                throw error;
            }
        } catch (err) {
            return {
                success: false,
                type: err.type,
                code: err.code,
                message: err.message
            }
        }
    }

    async getAllTypePost({
        userId,
        lastIds = {},
        types = "all", //"all" | "public" | "private" | "drafts" |
        limit = 9,
        defaults = false
    }) {
        try {
            const base = [
                Query.orderDesc("createdAt"),
                Query.limit(limit),
                Query.equal("userid", userId),
            ];
            let allCur = lastIds?.all || null;
            let publicCur = lastIds?.public || null;
            let privateCur = lastIds?.private || null;
            let draftsCur = lastIds?.draft || null;
            let allPost = { documents: [] };
            let publicPost = { documents: [] };
            let privatePost = { documents: [] };
            let draftPost = { documents: [] };


            if (defaults || types == "all") {
                let query = [...base, Query.notEqual("status", "Deleted")]
                if (!defaults) {//This is Second to N call
                    query = [...query, Query.cursorAfter(lastIds.all)];

                }
                allPost = await this.databases.listDocuments(
                    env.APPWRITE_DB_ID,
                    env.APPWRITE_COLLECTION_ID,
                    query
                );
                if (allPost.documents.length === limit) {
                    allCur = allPost.documents[allPost.documents.length - 1].$id;
                } else {
                    allCur = null;
                }
                console.log("Call in the API", allPost, "Curcser logic", allCur);
            }
            if (defaults || types == "public") {
                let query = [...base, Query.equal("visibility", "Public"), Query.equal("status", "Post")]
                if (!defaults) {//This is Second to N call
                    query = [...query, Query.cursorAfter(lastIds.public)];

                }
                publicPost = await this.databases.listDocuments(
                    env.APPWRITE_DB_ID,
                    env.APPWRITE_COLLECTION_ID,
                    query
                );
                if (publicPost.documents.length === limit) {
                    publicCur = publicPost.documents[publicPost.documents.length - 1].$id;
                } else {
                    publicCur = null;
                }
                console.log("Call in the API", publicPost, "Curcser logic", publicCur);
            }
            if (defaults || types == "private") {
                let query = [...base, Query.equal("visibility", "Private"), Query.equal("status", "Post")]
                if (!defaults) {//This is Second to N call
                    query = [...query, Query.cursorAfter(lastIds.private)];
                }
                privatePost = await this.databases.listDocuments(
                    env.APPWRITE_DB_ID,
                    env.APPWRITE_COLLECTION_ID,
                    query
                );
                if (privatePost.documents.length === limit) {
                    privateCur = privatePost.documents[privatePost.documents.length - 1].$id;
                } else {
                    privateCur = null;
                }
                console.log("Call in the API", privatePost, "Curcser logic", privateCur);
            }
            if (defaults || types == "drafts") {
                let query = [...base, Query.equal("status", "Draft")]
                if (!defaults) {//This is Second to N call
                    query = [...query, Query.cursorAfter(lastIds.draft)];
                }
                draftPost = await this.databases.listDocuments(
                    env.APPWRITE_DB_ID,
                    env.APPWRITE_COLLECTION_ID,
                    query
                );
                if (draftPost.documents.length === limit) {
                    draftsCur = draftPost.documents[draftPost.documents.length - 1].$id;
                } else {
                    draftsCur = null;
                }
                console.log("Call in the API", draftPost, "Curcser logic", draftsCur);
            }

            return {
                success: true,
                allPost,
                publicPost,
                privatePost,
                draftPost,
                cursors: {
                    all: allCur,
                    public: publicCur,
                    private: privateCur,
                    draft: draftsCur,
                }
            };

        } catch (error) {
            return {
                success: false,
                type: error.type || "Server_Error",
                code: error.code || 500,
                message: error.message || "Something went wrong",
            };

        }
    }

    async updatePost({ title, content, fetureimage, status, userid, Short_Description, visibility, $id, Tags, dataObject, PrevousData }) {
        try {
            console.log({ title, content, fetureimage, status, userid, Short_Description, visibility, $id, Tags, dataObject, PrevousData });
            let data = {
                titles: title,
                content: content,
                status: status,
                userid: userid,
                visibility: visibility,
                shortDescription: Short_Description,
                tags: Tags
            };
            if (PrevousData?.status == "Draft" && status == "Post") {
                data.createdAt = new Date().toISOString();
            }
            let fileRes;
            let imageUrl = null;
            if (fetureimage) {
                let imageID = ID.unique();
                fileRes = await this.createPhoto({
                    File: fetureimage,
                    FileId: imageID
                });
                if (fileRes.success) {
                    imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${env.APPWRITE_BUKET_ID}/files/${imageID}/view?project=${env.APPWRITE_PROJECT_ID}`;
                    data.fetureimage = imageUrl;
                    data.fetureimageid = imageID;
                } else {
                    const error = new Error("Image Uploade Error");
                    error.type = "Image_Upload_Error";
                    error.code = 500;
                    throw error;
                }
            }
            let document = await this.databases.updateDocument(
                env.APPWRITE_DB_ID,
                env.APPWRITE_COLLECTION_ID,
                $id,
                data
            )
            if (document) {
                let mainUpdateLable = await authService.updateLabels({ dataObject });
                if (mainUpdateLable.status) {
                    return {
                        success: true,
                        document
                    }
                }
            } else {
                const error = new Error("Server Side Error");
                error.type = "Server_Error";
                error.code = 500;
                throw error;
            }
        } catch (err) {
            console.log(err)
            return {
                success: false,
                type: err.type,
                code: err.code,
                message: err.message
            }
        }
    }
    async deletePost({ documnetId, dataObject, status, visibility }) {
        try {
            let delResp = await this.databases.updateDocument(
                env.APPWRITE_DB_ID,
                env.APPWRITE_COLLECTION_ID,
                documnetId,
                { status: "Deleted" }
            )
            if (delResp) {
                let mainUpdateLable = await authService.updateLabels({ dataObject });
                if (mainUpdateLable.status) {
                    return {
                        success: true,
                        delResp
                    }
                }
            } else {
                const error = new Error("Error in Delete a Post");
                error.type = "Delete_Error";
                error.code = 500;
                throw error;
            }
        } catch (err) {
            return {
                success: false,
                type: err.type,
                code: err.code,
                message: err.message
            }
        }
    }

    async getPublicPosts({ lastDocumentId = null, limit = 9, search = "" }) {
        console.log(search);
        try {
            const queries = [
                Query.equal("status", "post"),
                Query.equal("visibility", "public"),
                Query.orderDesc("$updatedAt"),
                Query.limit(limit),
            ];

            if (lastDocumentId) {
                queries.push(Query.cursorAfter(lastDocumentId));
            }
            var edit=false;
            if (search && search.trim() !== "") {
                queries.push(Query.search("titles", search));
                edit=true;
            }

            const res = await this.databases.listDocuments(
                env.APPWRITE_DB_ID,
                env.APPWRITE_COLLECTION_ID,
                queries
            );

            var lastId = lastDocumentId;
            if (res.documents.length < limit) {
                lastId = null;
            } else {
                lastId = res.documents[res.documents.length - 1].$id ?? null
            }
            return {
                success: true,
                list: res.documents,
                lastId: lastId,
                searchmode:edit
            };
        } catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }




    //Profile
    getRandomColor() {
        const colors = [
            // Vibrant
            "#F44336", "#E91E63", "#9C27B0", "#3F51B5",
            "#2196F3", "#03A9F4", "#00BCD4", "#009688",
            "#4CAF50", "#8BC34A", "#CDDC39", "#FFC107",
            "#FF9800", "#FF5722", "#795548", "#607D8B",

            // Extra pastel & modern shades
            "#FFB6C1", "#FF69B4", "#BA68C8", "#9575CD",
            "#64B5F6", "#4DD0E1", "#81C784", "#AED581",
            "#DCE775", "#FFF176", "#FFD54F", "#FFB74D",
            "#FF8A65", "#A1887F", "#90A4AE"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    //genrate the Image
    async generateAvatarFile({ name }) {
        const size = 128;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = size;
        canvas.height = size;

        // Background circle
        const bgColor = this.getRandomColor();
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Initials
        const safeName = (name || "").trim();
        const parts = safeName.split(/\s+/).filter(Boolean);
        const initials = parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : (parts[0]?.[0] || "?").toUpperCase();

        // Dynamic font size
        const fontSize = initials.length === 1 ? size * 0.6 : size * 0.5;
        ctx.font = `bold ${fontSize}px Sans-Serif`;
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic"; // better for manual centering

        // Measure text to adjust Y position
        const metrics = ctx.measureText(initials);
        const actualHeight =
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        const x = size / 2;
        const y = size / 2 + (actualHeight / 2 - metrics.actualBoundingBoxDescent);

        ctx.fillText(initials, x, y);

        // Convert to File
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const file = new File([blob], "avatar.png", { type: "image/png" });
                resolve(file);
            }, "image/png", 0.9);
        });
    }



    async createProfile({ userID, name }) {
        try {
            console.log("Profile", 1);
            const FileId = ID.unique();
            let ProfileID;
            const File = await this.generateAvatarFile({
                name: name
            })
            console.log("Profile", 2, File);
            let res = await this.createPhoto({
                FileId,
                File
            })
            console.log("Profile", 3, res);
            if (res.success) {
                console.log("profile 4")
                ProfileID = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${env.APPWRITE_BUKET_ID}/files/${FileId}/view?project=${env.APPWRITE_PROJECT_ID}`
            } else {
                throw new error({
                    type: "Error_Upload_Image",
                    code: 500,
                    message: "Error come in the uploading the image"
                })
            }
            let UserID = userID;
            let data = await this.databases.createDocument(
                env.APPWRITE_DB_ID,
                env.APPWRITE_COLLECTION_PROFILE_ID,
                ID.unique(),
                { ProfileID, UserID, FileId }
            );
            console.log(2);
            console.log(data);
            if (data) {
                console.log("A")
                let documentID = data.$id;
                let newToken = await authService.updateLabels({ documentID });
                console.log("AB", newToken)
                if (newToken.status) {
                    return {
                        success: true,
                        token: newToken.data,
                    }
                }
            }
        } catch (error) {
            return {
                success: false,
                type: error.type,
                message: error.message
            };
        }
    }

    async getProfile({ documentID }) {
        try {
            let document = await this.databases.getDocument(
                env.APPWRITE_DB_ID,
                env.APPWRITE_COLLECTION_PROFILE_ID,
                documentID
            )
            if (document) {
                return {
                    success: true,
                    document
                }
            }
        } catch (error) {
            return {
                success: false,
                type: error.type,
                message: error.message
            };
        }
    }
    async updateProfile({
        documentID,
        Name,
        Phone,
        Dob,
        Gender,
        Location,
        Website,
        Bio,
        Expertise,
        ProfileFile,
        FileId
    }) {
        console.log("Enter in Profile Update");
        try {
            let res;
            //  Step 1: Update name in auth service
            if (Name) {
                try {
                    console.log("Updating name in Auth...");
                    let nameResult = await authService.updateName({ name: Name });
                    if (!nameResult.status) {
                        throw {
                            type: "AuthError",
                            message: "Failed to update name in Auth Service"
                        };
                    }
                } catch (err) {
                    return {
                        success: false,
                        type: err.type || "AuthError",
                        message: err.message || "Error updating name"
                    };
                }
            }

            //  Step 2: Prepare profile data
            let updateData = { Phone, Dob, Gender, Bio, Expertise, Location };
            if (Website && Website.trim() !== "") {
                updateData.Website = Website;
            }

            //  Step 3: Handle profile photo
            if (ProfileFile) {
                try {
                    console.log("Resizing image...");
                    ProfileFile = await this.resizeImage(ProfileFile, 800, 800, 0.8);

                    console.log("Deleting old file...");
                    const repdel = await this.deleteFile({ FileId });

                    if (!repdel.success) {
                        throw {
                            type: repdel.type || "FileDeleteError",
                            message: repdel.message || "Failed to delete old file"
                        };
                    }

                    FileId = ID.unique();
                    console.log("Uploading new file...");
                    const upload = await this.createPhoto({ FileId, File: ProfileFile });

                    if (!upload.success) {
                        throw {
                            type: "FileUploadError",
                            message: "Failed to upload new profile image"
                        };
                    }

                    updateData.ProfileID = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${env.APPWRITE_BUKET_ID}/files/${FileId}/view?project=${env.APPWRITE_PROJECT_ID}`;
                    updateData.FileId = FileId;

                } catch (err) {
                    return {
                        success: false,
                        type: err.type || "FileError",
                        message: err.message || "Error while processing profile photo"
                    };
                }
            }

            //  Step 4: Update profile document
            try {
                console.log("Updating document in DB...");
                res = await this.databases.updateDocument(
                    env.APPWRITE_DB_ID,
                    env.APPWRITE_COLLECTION_PROFILE_ID,
                    documentID,
                    updateData
                );

                if (!res) {
                    throw {
                        type: "DatabaseError",
                        message: "Database update failed"
                    };
                }
            } catch (err) {
                return {
                    success: false,
                    type: err.type || "DatabaseError",
                    message: err.message || "Error updating profile in DB"
                };
            }

            //  Step 5: Return success
            return { success: true, document: res, FileId };

        } catch (error) {
            console.error("Unexpected error in updateProfile:", error);
            return {
                success: false,
                type: error.type || "UnknownError",
                message: error.message || "Unexpected error occurred"
            };
        }
    }


    async resizeImage(file, maxWidth, maxHeight, quality) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    blob => {
                        if (!blob) {
                            reject(new Error('Image compression failed'));
                            return;
                        }
                        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }




    // Storage Services

    async createPhoto({ FileId, File }) {
        try {
            const res = await this.bucket.createFile(
                env.APPWRITE_BUKET_ID,
                FileId,
                File
            );

            if (res) {
                return {
                    success: true,
                    file: res
                };
            } else {
                return {
                    success: false,
                    type: "Technical_Error",
                    code: 500,
                    message: "Server Side Error"
                };
            }
        } catch (error) {
            return {
                success: false,
                type: error.type,
                code: error.code,
                message: error.message
            };
        }
    }

    async deleteFile({ FileId }) {
        console.log("Delete", FileId)
        try {
            const res = await this.bucket.deleteFile(
                env.APPWRITE_BUKET_ID,
                FileId
            );

            if (res) {
                return {
                    success: true,
                    file: res
                };
            } else {
                return {
                    success: false,
                    type: "Technical_Error",
                    code: 500,
                    message: "Server Side Error"
                };
            }
        } catch (error) {
            return {
                success: false,
                type: error.type,
                code: error.code,
                message: error.message
            };
        }
    }

    //Contact us services
    async createReq({ name, email, message, createdAt }) {
        try {
            return this.databases.createDocument(
                env.APPWRITE_DB_ID,
                env.APPWRITE_COLLECTION_CONTECT_ID,
                ID.unique(),
                {
                    name,
                    email,
                    message,
                    createdAt
                }
            );
        } catch (error) {
            throw error;
        }
    }
};

const databaseService = new DatabaseService();

export default databaseService;