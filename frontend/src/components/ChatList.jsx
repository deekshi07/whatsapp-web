import React from "react";

export default function ChatList({ grouped, onSelect, selected }){
  const entries = Object.entries(grouped || {});
  return (
    <div>
      {entries.length === 0 && <div className="p-4 text-gray-500">No chats yet</div>}
      {entries.map(([wa_id, data]) => {
        const lastMsg = data.messages?.length ? data.messages[data.messages.length - 1] : null;
        return (
          <div
            key={wa_id}
            onClick={() => onSelect(wa_id)}
            className={`p-4 cursor-pointer hover:bg-gray-50 flex items-center ${selected === wa_id ? "bg-gray-100" : ""}`}
          >
            <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-black mr-3">
              {data.contact_name ? data.contact_name[0] : wa_id.slice(-2)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="font-medium">{data.contact_name || wa_id}</div>
                <div className="text-xs text-gray-400">{lastMsg?.timestamp ? new Date(Number(lastMsg.timestamp) * 1000).toLocaleTimeString() : ""}</div>
              </div>
              <div className="text-sm text-gray-500 truncate">{lastMsg?.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
