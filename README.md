# 📱 WhatsApp Web Clone (Local Demo)

This project is a **WhatsApp Web Clone** built as a local demo to simulate the core functionality of WhatsApp Web without actually sending messages through the WhatsApp Business API. It consists of a **FastAPI backend** connected to **MongoDB Atlas** for storing and retrieving chat data, and a **React + TailwindCSS frontend** that replicates the clean and responsive WhatsApp Web interface. The system processes simulated webhook payloads (messages and status updates) to display real-time conversations grouped by user (`wa_id`), complete with contact names, timestamps, and message status indicators (sent ✓, delivered ✓✓, read ✓✓). Users can select a chat to view all its messages and send new messages through an input box, which appear instantly in the conversation UI and are stored in the database for persistence. This application demonstrates webhook data handling, API design, and a modern reactive user interface, making it an excellent reference for full-stack development with real-time messaging concepts.

---

## 📌 Features
- Process webhook payloads (messages + statuses) and store in MongoDB.
- Group chats by `wa_id` with contact info.
- Display all messages in a clean WhatsApp-style UI.
- Status indicators for each message.
- Responsive design for desktop and mobile.
- Send message demo — stored locally, no real WhatsApp send.

---

## 🛠 Tech Stack
**Backend**
- [FastAPI](https://fastapi.tiangolo.com/)
- [PyMongo](https://pymongo.readthedocs.io/)
- [certifi](https://pypi.org/project/certifi/)
- MongoDB Atlas

**Frontend**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

---

## 📂 Project Structure
whatsapp/
├── backend/
│ ├── app.py # FastAPI backend
│ ├── process_webhook.py # Task 1 payload processor
│ ├── .env # MongoDB URI
│ └── payloads/ # JSON payloads
└── frontend/
├── src/
│ ├── App.jsx
│ ├── api.js
│ ├── components/
│ │ ├── ChatList.jsx
│ │ └── ChatWindow.jsx
└── tailwind.config.js

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo
```bash
git clone https://github.com/<your-username>/whatsapp-web-clone.git
cd whatsapp
2️⃣ Backend Setup
cd backend
uv venv
uv pip install fastapi uvicorn pymongo certifi python-dotenv
Create .env file:
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority&tls=true
Replace <username>, <password>, and <cluster-url> with your Atlas credentials.
Whitelist your IP in Atlas Network Access.
Run payload processor (Task 1):

bash
Copy
Edit
uv run python process_webhook.py
Run backend API:

bash
Copy
Edit
uv run python -m uvicorn app:app --reload --port 8000
3️⃣ Frontend Setup
bash
Copy
Edit
cd ../frontend
npm create vite@latest .   # Choose React
npm install
npm install axios tailwindcss postcss autoprefixer
npx tailwindcss init -p
Edit tailwind.config.js:

js
Copy
Edit
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"
],
theme: { extend: {} },
plugins: [],
Run frontend:

bash
Copy
Edit
npm run dev
🔗 API Endpoints
GET /messages → All chats grouped by wa_id

GET /messages/{wa_id} → Messages for one chat

POST /messages → Add a message

GET /health → Health check

🚀 Roadmap
Real-time updates via WebSockets

Search chats & messages

Profile pictures in chat list

Dark mode

📝 License
MIT License. Free to use & modify.


