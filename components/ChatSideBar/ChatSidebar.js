import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect } from "react";

export const ChatSidebar = () => {
    const [chatList, setChatList] = useState([]); 
    useEffect(() => {
      const loadChatList = async () => {
        const response = await fetch(`/api/chat/getChatList`, {
          method: 'POST',
        });
        const json = await response.json();
        console.log("CHAT LIST: ", json);
        setChatList(json?.chats || [])
      };
      loadChatList();
    }, []);

    return (
      <div className="flex flex-col overflow-hidden bg-deepNavy text-offWhite">
        <Link href="/chat" className="side-menu-item">
          <FontAwesomeIcon icon={faPlus}/> New Chat
        </Link>
        <div className="flex-1 overflow-auto bg-slate-500"> 
          {chatList.map((chat) => (
            <Link 
              key={chat._id} 
              href={`/chat/${chat._id}`
              }>{chat.title}</Link>
          ))}
        </div>     
        <Link href="/api/auth/logout" className="side-menu-item">Logout</Link>     
      </div>
    )
};