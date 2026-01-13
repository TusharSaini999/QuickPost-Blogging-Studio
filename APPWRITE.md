# Appwrite Setup Guide – QuickPost ⚙️

This document describes how to configure **Appwrite** for the **QuickPost** blogging platform. It covers authentication, database collections, storage buckets, environment variables, and cloud functions.

---

## 1. Create Appwrite Project

1. Open the Appwrite Console
2. Click **Create Project**
3. Project name: `QuickPost`
4. Save the **Project ID**

---

## 2. Authentication Setup 🔐

### Enable Email / Password

1. Go to **Auth → Settings**
2. Enable **Email / Password authentication**
3. Optional but recommended:

   * Email verification
   * Password recovery

### Authentication Flow

* User signup
* User login
* Session-based auth
* Each user is linked to a profile using `userID`

---

## 3. Database Setup

1. Navigate to **Databases**
2. Create a new database
3. Database ID: `quickpost-db`

---

## 4. Collections 📦

Create the following collections exactly as defined below.

---

### Articles Collection (`articles`)

Used to store blog posts.

#### Schema

| Column Name      | Type     | Size / Options   | Required |
| ---------------- | -------- | ---------------- | -------- |
| titles           | string   | 255              | Yes      |
| content          | string   | 1073741820       | Yes      |
| fetureimage      | string   | 1000             | No       |
| fetureimageid    | string   | 400              | No       |
| userid           | string   | 255              | Yes      |
| visibility       | enum     | public, private  | Yes      |
| status           | enum     | draft, published | Yes      |
| shortDescription | string   | 200              | Yes      |
| tags[]           | string[] | 30               | No       |
| name             | string   | 30               | Yes      |
| createdAt        | string   | 30               | Yes      |
| $createdAt       | datetime | system           | Auto     |
| $updatedAt       | datetime | system           | Auto     |

#### Permissions

* Read: `any`
* Create: `users`
* Update: `users`
* Delete: `users`

---

### Contact Collection (`contact`)

Stores contact form submissions.

#### Schema

| Column Name | Type     | Size   | Required |
| ----------- | -------- | ------ | -------- |
| name        | string   | 30     | Yes      |
| email       | email    | —      | Yes      |
| message     | string   | 10000  | Yes      |
| createdAt   | string   | 50     | Yes      |
| $createdAt  | datetime | system | Auto     |
| $updatedAt  | datetime | system | Auto     |

#### Permissions

* Create: `any`
* Read: `admins`

---

### Profile Collection (`profile`)

Stores extended user profile data.

#### Schema

| Column Name | Type     | Size   | Required |
| ----------- | -------- | ------ | -------- |
| phone       | string   | 10     | No       |
| dob         | string   | 30     | No       |
| gender      | string   | 10     | No       |
| website     | url      | —      | No       |
| bio         | string   | 300    | No       |
| expertise   | string   | 500    | No       |
| profileID   | string   | 1000   | Yes      |
| userID      | string   | 500    | Yes      |
| location    | string   | 300    | No       |
| fileId      | string   | 100    | Yes      |
| $createdAt  | datetime | system | Auto     |
| $updatedAt  | datetime | system | Auto     |

#### Permissions

* Read: `users`
* Create: `users`
* Update: `users`

---

## 5. Storage Bucket 🗂️

### Images Bucket (`images`)

Used for article images and profile avatars.

1. Go to **Storage → Create Bucket**
2. Bucket ID: `images`
3. Permissions:

   * Read: `any`
   * Create: `users`
   * Update: `users`
   * Delete: `users`

Allowed file types:

* jpg
* jpeg
* png
* webp

---

## 6. Environment Variables

Create a `.env` file and configure the following:

```
# Appwrite Configuration
VITE_APPWRITE_URL="https://cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID="your_appwrite_project_id"
VITE_APPWRITE_DB_ID="your_appwrite_database_id"
VITE_APPWRITE_COLLECTION_ID="your_posts_collection_id"
VITE_APPWRITE_COLLECTION_CONTECT_ID="your_contacts_collection_id"
VITE_APPWRITE_COLLECTION_PROFILE_ID="your_profiles_collection_id"
VITE_APPWRITE_BUKET_ID="your_bucket_id"
VITE_APPWRITE_FUNCTION_AITOOL="your_ai_function_id"

# Redirect URLs
VITE_REDIRECT_SUCCESS="http://localhost:5173/dashboard"
VITE_REDIRECT_FAILURE="http://localhost:5173/login"
VITE_REDIRECT_PASSWORD="http://localhost:5173/reset-password"
VITE_REDIRECT_EMAIL="http://localhost:5173/verify-email"
```

Do not commit `.env` files to version control.

---

## 7. Appwrite Functions 🧩

QuickPost uses Appwrite Cloud Functions for backend processing.

### Folder Structure

```
Functions/
└── ai-tools/
    ├── package.json
    ├── README.md
    └── src/
        ├── main.js
        ├── ai_chat.js
        └── ai_metadata_generator.js
```

### Deployment Steps

1. Go to **Functions → Create Function**
2. Runtime: Node.js 18
3. Entry point: `src/main.js`
4. Configure required environment variables
5. Deploy the function

Functions are used to:

* Generate AI content
* Generate metadata
* Process articles

---

## 8. Verification Checklist

* Authentication works (signup / login)
* Profile is created and updated correctly
* Articles can be created and read
* Images upload to the bucket
* Functions execute without errors

---

## Setup Complete

The Appwrite backend for **QuickPost** is now fully configured.

If issues occur, check Appwrite logs and collection permissions first.
