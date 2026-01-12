# ⚡ AI Tools Node.js Function

A starter Node.js function for AI-powered operations such as content summarization, metadata generation, and interactive chat. Edit `src/main.js` to customize your AI tools. 🚀

---

## 🧰 Endpoints

### 1. GET /summary-ai

Generates a concise summary from the provided text.

**Request:**

```json
{
  "text": "Your input text here..."
}
```

**Response:**

```json
{
  "summary": "A concise summary of your input text."
}
```

---

### 2. POST /ai-metadata-generator

Generates metadata for content including title, tags, and description.

**Request:**

```json
{
  "content": "Your content here..."
}
```

**Response:**

```json
{
  "title": "Generated Title",
  "tags": ["tag1", "tag2"],
  "description": "A short description of the content."
}
```

---

### 3. POST /chat

Handles AI chat messages and returns interactive responses.

**Request:**

```json
{
  "message": "Hello AI, help me with a task."
}
```

**Response:**

```json
{
  "reply": "Sure! Here's how you can approach it..."
}
```

---

## ⚠️ Error Handling

* Only `POST` requests are allowed. All other methods return a 405 error.
* Unknown routes return a 404 error.

**Example Responses:**

```json
{ "error": "Only POST allowed" }
```

```json
{ "success": false, "error": "Route not found" }
```

---

## ⚙️ Configuration

| Setting           | Value         |
| ----------------- | ------------- |
| Runtime           | Node (18.0)   |
| Entrypoint        | `src/main.js` |
| Build Commands    | `npm install` |
| Permissions       | any           |
| Timeout (Seconds) | 15            |

---

## 📌 Features

* Content Summarization
* Metadata Generation for SEO
* Interactive AI Chat
* Simple REST API interface
* Easy to extend for additional AI functionalities

---

## 📝 Getting Started

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Edit `src/main.js` to customize endpoints.
4. Deploy on your preferred Node.js environment or Appwrite.

---

## 💡 Tips

* Ensure all requests are `POST` as other methods are restricted.
* Validate input data to improve AI response quality.
* Use the metadata generator to optimize content for search engines.
* Combine chat with summarization to create interactive summaries.

## ❤️ Built For

**QuickPost** – Fast & Smart Blogging Platform
Powered by **Appwrite + Node.js**