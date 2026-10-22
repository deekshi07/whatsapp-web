import React, { useEffect, useState } from "react";
import API from "./api";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

export default function App(){
  const [grouped, setGrouped] = useState({});
  const [selectedWaId, setSelectedWaId] = useState(null);

  useEffect(() => {
    fetchGrouped();
    const iv = setInterval(fetchGrouped, 3000); // poll frequently for demo real-time
    return () => clearInterval(iv);
  }, []);

  async function fetchGrouped(){
    try{
      const res = await API.get("/messages");
      setGrouped(res.data);
      if(!selectedWaId){
        const keys = Object.keys(res.data);
        if(keys.length) setSelectedWaId(keys[0]);
      }
    }catch(err){
      console.error("fetch grouped err", err);
    }
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <div className="w-80 border-r bg-white">
        <div className="p-4 font-bold text-xl">WhatsApp Clone</div>
        <ChatList grouped={grouped} onSelect={setSelectedWaId} selected={selectedWaId}/>
      </div>
      <div className="flex-1">
        <ChatWindow waId={selectedWaId} grouped={grouped}/>
      </div>
    </div>
  );
}
