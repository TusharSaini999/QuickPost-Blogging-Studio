# 📝 QuickPost Blogging Studio

PostApp is a **modern, full‑featured blogging platform** built with **React, Vite, and Appwrite**. It enables users to create, manage, and publish blog content through a fast, secure, and responsive interface.

---

## ✨ Highlights

* ⚡ Fast performance with Vite + React
* 🔐 Secure authentication using Appwrite
* 🖋️ Rich text editing with TinyMCE
* 🌙 Light / Dark mode support
* 📱 Fully responsive design
* 🤖 AI‑assisted content creation

---

## 🚀 Features

* **Authentication**

  * Email & password login/signup
  * Secure sessions and email verification

* **Post Management**

  * Create, edit, delete, and publish posts
  * Public, private, and draft visibility

* **Rich Text Editor**

  * TinyMCE‑powered editor
  * Media, formatting, and links support

* **Dashboard**

  * Manage posts and view activity
  * Quick publish and edit actions

* **Profile Management**

  * Update user profile details

* **UI & UX**

  * Clean interface with Tailwind CSS
  * Mobile‑first responsive layout

* **Real‑Time Updates**

  * Live synchronization using Appwrite

---

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* React Router
* Redux Toolkit
* Tailwind CSS

### Backend & Services

* Appwrite (Authentication, Database, Storage)

### Tools & Libraries

* TinyMCE – Rich text editor
* Lucide React – Icons
* Recharts – Charts

---

## 📋 Prerequisites

* Node.js v16 or higher
* npm or yarn
* Appwrite (Cloud or Self‑Hosted)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/TusharSaini999/QuickPost-Blogging-Studio.git
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Setup

Configure your Appwrite project credentials in the environment files.

### 4️⃣ Start Development Server

```bash
npm run dev
```

### 5️⃣ Build for Production

```bash
npm run build
npm run preview
```

---

## 🧱 Project Architecture (Graphic)

```text
User
 │
 │  HTTP Requests
 ▼
Frontend (React + Vite)
 │  ├─ UI Components (Tailwind CSS)
 │  ├─ State Management (Redux Toolkit)
 │  └─ Routing (React Router)
 │
 ▼
Backend (Appwrite)
 │  ├─ Authentication
 │  ├─ Database (Posts, Users)
 │  └─ Storage (Images, Media)
 │
 ▼
Real-Time Sync & API Responses
```

> 📌 This diagram represents the high-level working flow of **PostApp**, showing how the frontend communicates with Appwrite services.

---

## 🌳 Project Folder Tree Structure

```
postapp/
├── src/
│   ├── Appwrite/        # Appwrite service configuration
│   ├── Component/       # Reusable UI components
│   ├── Configenv/       # Environment variables
│   ├── Editor/          # Rich text editor logic
│   ├── Feature/         # Redux slices (state management)
│   ├── Pages/           # Application pages
│   └── Store/           # Redux store setup
│
├── public/              # Static assets
├── Document/            # Project documentation
├── Logo/                # Logos & manifest files
├── dist/                # Production build output
└── README.md            # Project documentation
```

---

## 🔧 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

## 🌐 Appwrite Setup

1. Create a project in Appwrite
2. Enable Email/Password authentication
3. Create databases for posts and users
4. Configure storage for media uploads
5. Update environment credentials

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0**.

---

## 🙏 Acknowledgments

* Appwrite – Backend as a Service
* React – UI Library
* Vite – Build Tool
* Tailwind CSS – Styling
* TinyMCE – Rich text editor

---

### 👨‍💻 Author

**Tushar Saini**
