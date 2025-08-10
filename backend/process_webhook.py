import os
import json
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi
import sys

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("❌ MONGO_URI not found in .env")
    sys.exit(1)

# Connect to MongoDB with TLS CA file
try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=10000)
    client.admin.command("ping")  # test connection
    db = client["whatsapp"]
    collection = db["processed_messages"]
    print("✅ Connected to MongoDB Atlas")
except Exception as e:
    print(f"❌ Could not connect to MongoDB: {e}")
    print("Check your MONGO_URI, network connection, and IP whitelist in Atlas.")
    sys.exit(1)

# Path to JSON payload files
PAYLOADS_DIR = Path(__file__).parent / "payloads"

def insert_message(msg, contact_name, wa_id):
    if not collection.find_one({"message_id": msg["id"]}):
        doc = {
            "message_id": msg["id"],
            "from": msg["from"],
            "wa_id": wa_id,
            "contact_name": contact_name,
            "timestamp": msg["timestamp"],
            "text": msg.get("text", {}).get("body"),
            "status": "sent"
        }
        collection.insert_one(doc)
        print(f"Inserted message {msg['id']}")
    else:
        print(f"Message {msg['id']} already exists")

def update_status(status_obj):
    msg_id = status_obj.get("meta_msg_id") or status_obj.get("id")
    new_status = status_obj["status"]

    result = collection.update_one({"message_id": msg_id}, {"$set": {"status": new_status}})
    if result.modified_count > 0:
        print(f"Updated message {msg_id} to '{new_status}'")
    else:
        print(f"No match for status update {msg_id}")

def process_file(payload):
    try:
        entry = payload["metaData"]["entry"][0]
        changes = entry["changes"][0]
        value = changes["value"]

        if "messages" in value and not "statuses" in value:
            contact_name = value["contacts"][0]["profile"]["name"]
            wa_id = value["contacts"][0]["wa_id"]
            for msg in value["messages"]:
                insert_message(msg, contact_name, wa_id)

        elif "statuses" in value:
            for status in value["statuses"]:
                update_status(status)

    except Exception as e:
        print(f"Error processing file: {e}")

def main():
    if not PAYLOADS_DIR.exists():
        print(f"Missing folder: {PAYLOADS_DIR}")
        return

    for file in PAYLOADS_DIR.glob("*.json"):
        with open(file, "r", encoding="utf-8") as f:
            payload = json.load(f)
            process_file(payload)

if __name__ == "__main__":
    main()
