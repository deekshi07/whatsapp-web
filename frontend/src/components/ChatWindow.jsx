import React, { useEffect, useState } from "react";
import API from "../api";

function StatusIcon({ status }) {
  if (status === "read") return <span title="read">✓✓</span>;
  if (status === "delivered") return <span title="delivered">✓✓</span>;
  return <span title="sent">✓</span>;
}

export default function ChatWindow({ waId, grouped, setWaId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showChat, setShowChat] = useState(false); // for mobile view

  useEffect(() => {
    if (waId) {
      fetchChat();
      const iv = setInterval(fetchChat, 3000);
      return () => clearInterval(iv);
    } else {
      setMessages([]);
    }
  }, [waId]);

  async function fetchChat() {
    try {
      const res = await API.get(`/messages/${waId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const newMsg = {
      message_id: `local-${Date.now()}`,
      from: "918329446654", // our number in demo
      wa_id: waId,
      contact_name: grouped?.[waId]?.contact_name || "",
      timestamp: String(Math.floor(Date.now() / 1000)),
      text: text.trim(),
      status: "sent",
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, newMsg]);
    setText("");

    try {
      await API.post("/messages", newMsg);
    } catch (err) {
      console.error("send err", err);
    }
  }

  // Auto-scroll when messages change
  useEffect(() => {
    const messagesDiv = document.getElementById("messages");
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-[350px_1fr] bg-[#efeae2]">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r bg-white ${
          showChat && window.innerWidth < 768 ? "hidden" : ""
        }`}
      >
        <div className="p-4 border-b font-bold text-lg bg-[#f0f2f5]">Chats</div>
        <div className="flex-1 overflow-auto">
          {Object.keys(grouped || {}).map((id) => (
            <div
              key={id}
              className={`p-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer ${
                waId === id ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setWaId(id);
                if (window.innerWidth < 768) setShowChat(true);
              }}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${
                  grouped?.[id]?.contact_name || id
                }&background=random`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="font-semibold truncate">
                  {grouped?.[id]?.contact_name || id}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {grouped?.[id]?.last_message || ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      <section
        className={`flex flex-col ${
          !showChat && window.innerWidth < 768 ? "hidden" : ""
        }`}
      >
        {/* Header */}
        <div className="p-3 border-b bg-[#f0f2f5] flex items-center gap-3 shadow-sm">
          {/* Back button for mobile */}
          {window.innerWidth < 768 && (
            <button
              onClick={() => setShowChat(false)}
              className="text-xl text-gray-600"
            >
              ←
            </button>
          )}
          <img
            src={`https://ui-avatars.com/api/?name=${
              grouped?.[waId]?.contact_name || waId
            }&background=random`}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold">
              {waId ? grouped?.[waId]?.contact_name || waId : "Select a chat"}
            </div>
            <div className="text-xs text-gray-500">{waId}</div>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-auto p-4 bg-chat-pattern chat-scroll"
          id="messages"
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-600 mt-10">No messages</div>
          )}
          <div className="space-y-3">
            {messages.map((m) => {
              const isFromMe =
                m.from === "918329446654" || String(m.from) === "918329446654";
              return (
                <div
                  key={m.message_id}
                  className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] px-3 py-2 rounded-lg shadow-sm ${
                      isFromMe
                        ? "bg-[#d9fdd3] text-black"
                        : "bg-white text-black"
                    }`}
                  >
                    <div className="text-sm">{m.text}</div>
                    <div className="text-[10px] mt-1 flex items-center justify-end text-gray-500">
                      <span>
                        {new Date(Number(m.timestamp) * 1000).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </span>
                      {isFromMe && <StatusIcon status={m.status} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="p-3 bg-[#f0f2f5] flex items-center gap-3 border-t"
        >
          <button type="button" className="text-gray-600">
            😊
          </button>
          <button type="button" className="text-gray-600">
            📎
          </button>
          <input
            className="flex-1 rounded-full px-4 py-2 text-sm border-none outline-none bg-white shadow-sm"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="text-green-600 font-bold">🎤</button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-full"
          >
            ➤
          </button>
        </form>
      </section>
    </div>
  );
}
