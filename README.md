# 📝 QuickPost Blogging Studio

**QuickPost** is a modern, full-featured blogging platform built with **React, Vite, and Appwrite**, designed for fast, secure, and AI-assisted content creation and management.

---

## ✨ Highlights

* ⚡ Fast performance with **Vite + React**
* 🔐 Secure authentication using **Appwrite**
* 🖋️ Rich text editing with **TinyMCE**
* 🌙 Light & Dark mode support
* 📱 Fully responsive, mobile-first design
* 🤖 AI-assisted content creation
* 📊 Analytics-ready dashboard
* 🔄 Real-time data synchronization

---

## 🚀 Features

### 🔐 Authentication

* Email & password signup / login
* Secure sessions with Appwrite
* Email verification & session handling

### 📝 Post Management

* Create, edit, delete, and publish posts
* Public, private, and draft visibility
* Auto-save drafts while writing
* Media uploads (images & assets)

### ✍️ Rich Text Editor

* TinyMCE-powered editor
* Formatting, links, images, and embeds
* Markdown-friendly content support

### 📊 Dashboard

* Centralized post management
* Quick publish, edit, and delete actions
* Post activity overview

### 👤 Profile Management

* Update profile details
* Manage account settings

### 🤖 AI Assistance (New)

* AI-powered content suggestions
* Post title & summary generation
* Writing assistance inside the editor

### 🎨 UI & UX

* Clean, modern interface with Tailwind CSS
* Light / Dark mode toggle
* Fully responsive layout

### 🔄 Real-Time Updates

* Live data synchronization using Appwrite
* Instant UI updates without refresh

---

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* React Router
* Redux Toolkit
* Tailwind CSS

### Backend & Services

* Appwrite

  * Authentication
  * Database
  * Storage
  * Real-time API

### Tools & Libraries

* TinyMCE – Rich text editor
* Lucide React – Icons
* Recharts – Charts & analytics

---

## 📋 Prerequisites

* Node.js **v16 or higher**
* npm or yarn
* Appwrite (Cloud or Self-Hosted)

---

## 🧱 Application Architecture

```text
User
 │
 │ HTTP Requests
 ▼
Frontend (React + Vite)
 │ ├─ UI Components (Tailwind CSS)
 │ ├─ State Management (Redux Toolkit)
 │ └─ Routing (React Router)
 │
 ▼
Backend (Appwrite)
 │ ├─ Authentication
 │ ├─ Database (Posts, Users)
 │ └─ Storage (Images, Media)
 │
 ▼
Real-Time Sync & API Responses
```

---

## 🌳 Project Folder Structure

```
PostApp/
├── Functions/
│   ├── ai-tools/         # AI utilities (chat, metadata, summaries)
│   └── contact-email/    # Email handling function
└── Web/                  # Frontend (React + Vite)
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── client_secret.json
    ├── eslint.config.js
    ├── index.html
    ├── public/
    │   └── Logo/
    │       └──site.webmanifest
    ├── node_modules/
    ├── package-lock.json
    ├── package.json
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── Appwrite/       # Appwrite service logic
        ├── Component/      # Reusable UI components
        ├── Configenv/      # Environment config
        ├── Editor/         # TinyMCE editor integration
        ├── Feature/        # Redux slices
        ├── Pages/          # Application pages
        └── Store/          # Redux store setup
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

## 📄 License

This project is licensed under the **GNU General Public License v3.0**.

---

## 📦 Documentation
- [Appwrite Setup Guide](./APPWRITE.md)

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
