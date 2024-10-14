import Link from "next/link";
import { useEffect } from "react";

export const ChatSidebar = () => {
    useEffect(() => {
      const loadChatList = async () => {
        const response = await fetch(`/api/chat/getChatList`, {
          method: 'POST',
        });
        const json = await response.json();
        console.log("CHAT LIST: ", json);
      };
      loadChatList();
    }, [])
    return (
      <div className="bg-deepNavy text-offWhite">
        <Link href="/api/auth/logout">Logout</Link>     
      </div>
    )
};