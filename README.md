<div align="center">

# 📱 WhatsApp Web Full-Stack Simulator

**A full-stack WhatsApp Web simulation engine featuring a FastAPI backend with MongoDB Atlas persistence and a reactive React 18 & Tailwind CSS client.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Overview](#-overview) • [Architecture](#-architecture) • [Features](#-features) • [Quickstart](#-quickstart-guide) • [API Endpoints](#-api-endpoints)

</div>

---

## 💡 Overview

This project implements an end-to-end full-stack messaging simulator replicating the core UX and data flow of WhatsApp Web. It ingests simulated webhook payloads (messages and delivery status receipts), normalizes conversation threads by phone ID (`wa_id`), and renders an authentic, responsive WhatsApp Web interface.

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph DataIngestion["Webhook & Event Pipeline"]
        Webhook[Simulated Webhook Payloads] --> Processor[process_webhook.py]
        Processor --> MongoAtlas[(MongoDB Atlas Database)]
    end

    subgraph BackendAPI["Backend Service (FastAPI)"]
        FastAPIServer[app.py API Server] --> MongoAtlas
    end

    subgraph ClientUI["Frontend Client (React 18 / Tailwind)"]
        ChatList["Chat List (Conversations grouped by wa_id)"]
        ChatWindow["Chat Window & Message Feed"]
        StatusIndicators["Delivery Receipts (Sent, Delivered, Read)"]
    end

    FastAPIServer -->|REST API / JSON| ChatList
    FastAPIServer -->|REST API / JSON| ChatWindow
```

---

## ✨ Features

- **📨 Webhook Payload Processing**: Parses incoming message and status receipt events into persistent MongoDB collections.
- **👥 Contact Grouping**: Automatically groups and sorts conversations by sender `wa_id` with timestamps.
- **✔️ Message Receipt Statuses**: Visual checkmark indicators reflecting message progression (`sent ✓`, `delivered ✓✓`, `read ✓✓`).
- **📱 Pixel-Perfect UI**: Authentic WhatsApp Web styling built with React 18, Vite, and Tailwind CSS.
- **🛡️ Secure Environment**: Credentials decoupled from source control via `.env.example`.

---

## 🚀 Quickstart Guide

### 1. Clone the Repository
```bash
git clone https://github.com/deekshi07/whatsapp-web.git
cd whatsapp-web
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt # or uv pip install fastapi uvicorn pymongo certifi python-dotenv
```

Configure backend `.env`:
```bash
cp .env.example .env
```
Provide your MongoDB Atlas connection string in `.env`.

Process sample webhook events and launch API:
```bash
python process_webhook.py
python -m uvicorn app:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** to interact with the web client.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/messages` | Returns all conversation threads grouped by `wa_id` |
| `GET` | `/messages/{wa_id}` | Retrieves chronological message history for a specific contact |
| `POST` | `/messages` | Appends a new outgoing simulated message to the conversation |
| `GET` | `/health` | Health check endpoint returning backend status |

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
