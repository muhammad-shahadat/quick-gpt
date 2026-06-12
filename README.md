# 🚀 Quick-GPT - AI Powered Chat & Image Generation App

Quick-GPT is a full-stack AI application built with the **MERN** stack, featuring real-time AI chatting and image generation capabilities. It includes a robust authentication system, credit-based usage, and a sleek dark/light mode UI.

---

## 🌐 Live Demo
- **Frontend:** [https://shahadat-quick-gpt.netlify.app](https://shahadat-quick-gpt.netlify.app)
- **Backend:** [https://quick-gpt-server-qbhl.onrender.com](https://quick-gpt-server-qbhl.onrender.com)

> **Note:** The server is hosted on a free Render tier. If it's inactive, please allow **30-60 seconds** for the initial "cold start."

---

## 📸 Screenshots

### ☀️ Light Mode
![Dashboard Light Mode](./screenshots/dashboard-light.png)

### 🌙 Dark Mode
![Dashboard Dark Mode](./screenshots/dashboard-dark.png)

### 🌙 Dark Mode
![Credits Page](./screenshots/credit-dark.png)

### ☀️ Light Mode
![Chat Box](./screenshots/chatbox-light.png)

![Login Page](./screenshots/login.png)

### Responsive View
![Mobile View](./screenshots/mobile.png)

---

## ✨ Key Features

- **🔐 Advanced Auth:** Secure authentication using JWT (Access + Refresh Token with rotation), HTTP-only cookies, email verification via Nodemailer, and Guest Login for quick access.
- **💬 AI Chatbot:** Real-time conversational AI with message history persistence using MongoDB.
- **🖼️ Image Generation:** AI-powered image creation (Integration in progress).
- **💳 Credit System:** Users get limited credits per day/account to interact with the AI (Payment integration in progress).
- **🌓 UI/UX:** Fully responsive design with **Dark/Light Mode** support and smooth animations.
- **⚡ Performance:** Optimized state management with **React Query** for seamless data fetching and caching.

---

## 🧠 Challenges & Learnings

### ⚡ Mastering Server-State with React Query
This was my first time using **TanStack Query (React Query)**, and it significantly improved how I handle server data. 
- **Mutations & Queries:** I learned to manage complex asynchronous states, such as using `useMutation` for chat interactions and `useQuery` for fetching chat history.
- **Cache Management:** Understanding how to invalidate queries and sync the cache after a new message or chat creation was a major learning curve that resulted in a much smoother UI.

### 🛡️ UX-Driven Error & Loading Handling
Instead of leaving the user in the dark during slow responses, I focused on high-quality UX:
- **Graceful Error Handling:** I implemented logic to catch API errors (like Gemini's rate limits) and display user-friendly notifications using **React Hot Toast**.
- **Cold Start Strategy:** To tackle Render's free tier "cold starts," I built a custom loading sequence that informs users about the server's status, preventing them from thinking the app is broken.

### 🔐 Secure Auth Flow & State Sync
Implementing a persistent authentication system that stays in sync with a global state was challenging. I learned to handle secure JWT flows and ensured that during logout, both the **Local State** and **React Query Cache** are completely cleared to maintain data privacy.

### 🌐 Monorepo Deployment & CORS
Configuring a monorepo (Frontend & Backend in one repo) for separate deployment platforms (Netlify & Render) taught me a lot about Environment Variables, CORS policies, and ensuring secure communication between cross-origin domains.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **React Query** (Server State Management)
- **Lucide React** (Icons)
- **React Hot Toast** (Notifications)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database)
- **Passport & JSON Web Token (JWT)** (Authentication)
- **CORS & Dotenv** (Security & Config)

---

## 🗄️ Database Schema (MongoDB ER Diagram)

```mermaid
erDiagram
    PLAN ||--o{ USER : assigned_to
    USER ||--o{ CHAT : creates
    CHAT ||--o{ MESSAGE : contains
    

    USER {
        ObjectId _id
        string name
        string email
        string password
        boolean isActive
        ObjectId plan
        date createdAt
        date updatedAt
    }
    PLAN {
        ObjectId _id
        string name
        number maxChatsPerDay
        number maxMessagesPerChat
        number contextWindow
        number price
        date createdAt
        date updatedAt
    }
    CHAT {
        ObjectId _id
        ObjectId user
        string title
        boolean isArchived
        date createdAt
        date updatedAt
    }

    MESSAGE {
        ObjectId _id
        ObjectId chat
        string role
        string content
        boolean isImage
        number tokenUsage
        date createdAt
        date updatedAt
    }

    
```
---

## 📁 Project Structure (Monorepo)

```text
├── client/                # Frontend React application
│   ├── src/hooks/         # Custom hooks (Auth, Chat)
│   ├── src/components/    # Reusable UI components
│   └── ...
└── server/                # Backend Node.js API
    ├── models/            # MongoDB Schemas
    ├── routes/            # API Endpoints
    └── controllers/       # Business Logic
```
---
## 🚀 Installation & Local Setup

### 📋 Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Atlas account or local Compass
- **Git**: Installed on your machine

### 1. Clone the repository:
```bash
git clone https://github.com/muhammad-shahadat/quick-gpt
cd quick-gpt
```
### 2. Setup Backend
```bash
cd server
npm install
```
#### Create a .env file inside the server/ folder and add:
```bash

PORT=3000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development

# Brevo mailer system configuration
BREVO_SMTP_API_KEY=

# JSON Web Token configurations
JWT_ACTIVATION_KEY=
JWT_ACCESS_KEY=
JWT_REFRESH_KEY=

CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key

# ImageKit configurations
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# Stripe payment configurations
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET_KEY=

```
#### Then start the backend server:
```bash
npm start
```

### 3. Import Postman Collection
```text

quick-gpt/
├── server/
├── client/
├── postman/
│   └── QuickGpt.postman_collection.json
└── README.md
```
The API requests used for seeding and testing are available in:

```text
postman/QuickGpt.postman_collection.json
```

Import the collection into Postman:

1. Open Postman
2. Click Import
3. Select `postman/QuickGpt.postman_collection.json`
4. Run the requests

#### 📌 Testing Options:
- **1.🌐 Live Server (Recommended):** If you want to test against the live demo server instead of localhost, replace `http://localhost:3000` with `https://quick-gpt-server-qbhl.onrender.com` in Postman request URLs. All API endpoints will work immediately without any local setup.
- **2.💻 Local Machine:** To test completely locally, keep http://localhost:3000 (Make sure your local backend server and MongoDB are running).


### 4. Execute Postman API Requests in Order
> ℹ️ **Note:** The application automatically seeds the initial subscription plans (Basic, Pro, Premium) into your database on the first server startup (`npm start`). You don't need to run any manual database scripts. 
#### Execute the following requests **in order** from Postman:

```text
QuickGpt/
├── authRoute/
│   ├── POST /register            <-- 1. Create a new user account
│   ├── GET /activate/verify      <-- 2. Verify account via Email Token
│   ├── POST /login               <-- 3. Login to receive HttpOnly cookies/tokens
│   ├── POST /refresh-token
│   └── POST /logout
│
├── userRoute/
│   └── GET /profile
│
├── chatRoute/
│   ├── POST /create-chat          <-- 4. Establish a new chat session
│   ├── POST /send-message        <-- 5. Send a chat message to AI
│   ├── POST /generate-image
│   ├── GET /chats
│   └── DELETE /chat/:id
│
├── messageRoute/
│   └── GET /messages
│
├── imageRoute/
│   └── GET /published-images
│
├── planRoute/
│   └── GET /plans                <-- 6. Fetch the automatically seeded plans
│
└── paymentRoute/
    ├── POST /create-checkout-session
    └── POST /verify-payment

```

### 5. Setup Frontend
#### Split terminal and go back root dir using `cd ..` then run:
```bash
cd client
npm install
```
#### create a .env file (optional) and add: 
```bash
VITE_API_BASE_URL=http://localhost:3000
```
#### Then run the frontend:
```bash
npm run dev
```

---
## 🛠️ Troubleshooting

- **Server Delay (Cold Start):** As this project is hosted on Render's free tier, the first request might take **30-60 seconds** to wake up the server. Subsequent requests will be much faster.

- **AI Response Issues (Gemini API Rate Limit):** I am using the **Gemini Free API tier**, which has rate limits (RPM - Requests Per Minute). If the AI doesn't respond or shows an error, please wait a minute and try again. Occasionally, the free tier may experience downtime or high latency.

- **CORS Issues:** If you encounter CORS errors locally, verify that your `.env` file in the server directory has the correct `CLIENT_URL` (e.g., `http://localhost:5173`).

---
## 👨‍💻 Author
### Shahadat Hossain
- **GitHub:** [https://github.com/muhammad-shahadat](https://github.com/muhammad-shahadat)
- **Email:** [shahadat6640@gmail.com](mailto:shahadat6640@gmail.com)


---


