# 📧 Contact Email Function (NodeMailer)

This Appwrite **Node.js Function** sends a confirmation email to users when they submit the **QuickPost contact form**.
It uses **NodeMailer with SMTP** to deliver a professional HTML email with a plain-text fallback.

---

## 🚀 Features

* 📩 Sends confirmation email on contact form submission
* 🎨 HTML + plain text email support
* 🌙 Dark mode–friendly email design
* 🔐 Secure SMTP credentials via environment variables
* ⚡ Fast & lightweight Appwrite Function

---

## 🧰 Usage

### GET `/`

Trigger this route when a user submits the contact form.

#### 📥 Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### 📤 Success Response (200)

```json
{
  "success": true
}
```

#### ❌ Error Response (400 / 500)

```json
{
  "success": false,
  "error": "Email field is missing"
}
```

---

## 🛠️ Tech Stack

* **Runtime:** Node.js 18
* **Mailer:** NodeMailer
* **Platform:** Appwrite Functions
* **Email Type:** HTML + Plain Text

---

## ⚙️ Configuration

| Setting       | Value          |
| ------------- | -------------- |
| Runtime       | Node.js (18.0) |
| Entrypoint    | `src/main.js`  |
| Build Command | `npm install`  |
| Permissions   | `any`          |
| Timeout       | 15 seconds     |

---

## 🔒 Environment Variables

Configure these variables in **Appwrite → Functions → Settings → Variables**

```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=support@quickpost.tusharsaini.tech
SMTP_PASS=your_email_password
SMTP_FROM=support@quickpost.tusharsaini.tech
```

---

## 📂 Project Structure

```txt
contact-email/
├─ src/
│  └─ main.js
├─ package.json
└─ README.md
```

---

## 🧠 Future Enhancements

* Admin notification email
* Contact request logging
* Retry logic for failed emails
* Rate limiting per user or IP
* Multi-language email templates

---

## ❤️ Built For

**QuickPost** – Fast & Smart Blogging Platform
Powered by **Appwrite + Node.js**
