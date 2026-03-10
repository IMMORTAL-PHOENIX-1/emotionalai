# MindfulBot — Mental Health Therapist Chatbot

A full-stack application providing an empathetic AI-powered mental health chatbot with mood tracking, crisis detection, guided breathing exercises, and an analytics dashboard.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT & bcryptjs
- **AI Logic**: Custom keyword-based sentiment analysis with a rich empathetic response database (No external API keys required).

## Features
- 💬 **Empathetic Chat interface**: Simulates therapeutic presence with typing indicators, intelligent responses, and follow-up questions.
- 🚦 **Crisis Detection**: Automatically identifies high-risk keywords (e.g., suicide, self-harm) and immediately responds with emergency hotline numbers (e.g., iCall, Vandrevala Foundation) and supportive messages.
- 😊 **Mood Tracking**: Users log their emotional state at the start of a session (with a 1-10 intensity score).
- 📊 **Wellness Dashboard**: Visualizes mood trends over time using Recharts and displays usage statistics.
- 🌬️ **Breathing Exercises**: Integrated 4-7-8 breathing technique animation tool to help ground users experiencing anxiety.
- 🌓 **Dark Mode**: Fully implemented automatic and manual dark/light themes.
- 🔒 **Security**: JWT authentication, hashed passwords, API rate-limiting via `express-rate-limit`.

## Project Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on `mongodb://localhost:27017` or change the `MONGO_URI` in `server/.env`)

### 1. Server Configuration
```bash
cd server
npm install
```
Start the backend server (runs on `http://localhost:5000`):
```bash
npm start
# or for development: npm run dev
```

### 2. Client Configuration
Open a new terminal tab:
```bash
cd client
npm install
```
Start the frontend client (runs on `http://localhost:5173`):
```bash
npm run dev
```

### 3. Usage
- Go to `http://localhost:5173` in your browser.
- Register a new account.
- Select a mood to start a new chat session.
- Type away or try the breathing exercise! Type "I want to hurt myself" to trigger the crisis detection system.

## Folder Structure
```
server/             # Backend code
 ├── models/        # Mongoose schema (User, ChatSession, Message)
 ├── controllers/   # Auth and Chat business logic
 ├── routes/        # Express API routers
 ├── middleware/    # JWT protect, Rate limiters
 └── utils/         # aiEngine.js (Sentiment & Bot Reply Generator)

client/             # Frontend UI code
 ├── src/
 │   ├── api/       # Axios instance with interceptors
 │   ├── components/# Reusable UI (Chat bubble, Navbar, MoodSelector, etc.)
 │   ├── context/   # React Context (Auth, Theme)
 │   └── pages/     # Login, Register, Chat, Dashboard
```
