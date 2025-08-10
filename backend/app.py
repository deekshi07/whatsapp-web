import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi

# Load environment variables
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    load_dotenv(env_path)

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("❌ MONGO_URI not found in .env")
    sys.exit(1)

# Connect to MongoDB Atlas
try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=10000)
    client.admin.command("ping")
    db = client["whatsapp"]
    collection = db["processed_messages"]
    print("✅ Connected to MongoDB Atlas")
except Exception as e:
    print(f"❌ Could not connect to MongoDB: {e}")
    print("Check your MONGO_URI, network connection, and IP whitelist in Atlas.")
    sys.exit(1)

app = FastAPI(title="WhatsApp Web Clone API")

# CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/messages")
def get_messages():
    pipeline = [
        {"$sort": {"timestamp": 1}},
        {
            "$group": {
                "_id": "$wa_id",
                "contact_name": {"$first": "$contact_name"},
                "messages": {
                    "$push": {
                        "message_id": "$message_id",
                        "from": "$from",
                        "timestamp": "$timestamp",
                        "text": "$text",
                        "status": "$status",
                    }
                }
            }
        },
        {"$project": {"wa_id": "$_id", "contact_name": 1, "messages": 1, "_id": 0}}
    ]
    result = list(collection.aggregate(pipeline))
    return {r["wa_id"]: {"contact_name": r.get("contact_name"), "messages": r["messages"]} for r in result}

@app.get("/messages/{wa_id}")
def get_chat(wa_id: str):
    docs = list(collection.find({"wa_id": wa_id}).sort("timestamp", 1))
    return docs

@app.post("/messages")
def create_message(msg: dict):
    res = collection.insert_one(msg)
    return {"inserted_id": str(res.inserted_id)}

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/messages")
def create_message(msg: dict):
    res = collection.insert_one(msg)
    return {"inserted_id": str(res.inserted_id)}