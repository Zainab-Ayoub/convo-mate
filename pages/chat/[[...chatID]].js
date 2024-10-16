import Head from "next/head";
import { ChatSidebar } from "components/ChatSideBar";
import { useState, useEffect } from "react";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from "uuid";
import { Message } from "components/message";
import { useRouter } from "next/router";

export default function ChatPage({ chatId }) {
  const [ newChatId, setNewChatId ] = useState(null);
  const [ incomingMessage, setIncomingMessage ] = useState("");
  const [ messageText, setMessageText ] = useState("");
  const [ newChatMessages, setNewChatMessages ] = useState([]);
  const [ generatingResponse, setGeneratingResponse ] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    if (!generatingResponse && newChatId) {
      setNewChatId(null);
      router.push(`/chat/${newChatId}`);
    }
  }, [newChatId, generatingResponse, router]);

  useEffect(() => {
    console.log("ChatPage rendered");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratingResponse(true);
    setNewChatMessages(prev => {
      const newChatMessages = [...prev, 
      {
        _id: uuid(),
        role: "user",
        content: messageText, 
      },
    ];
    return newChatMessages;
    });
    setMessageText("");
   // console.log("NEW CHAT: ", json);
    
    const response = await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: messageText }),
    });
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    await streamReader(reader, (message) => {
      console.log("MESSAGE: ", message);
      if (condition) {
        setNewChatId(message.content);
      } else {
        setIncomingMessage((s) => `${s}${message.content}`); 
      }
    });
    setGeneratingResponse(false);
  };
  

  return (
    <>
      <Head>
        <title>New chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar chatId={chatId} />
        <div className="flex flex-col overflow-hidden bg-navy">
          <div className="flex-1 overflow-scroll text-offWhite">
            {newChatMessages.map(message => {
              <Message 
                key={message._id} 
                role={message.role}
                content={message.content}
              />
            })}
            {!!incomingMessage && (
            <Message 
                role="assistant"
                content={incomingMessage}
              />
            )}
          </div>
          <footer className="bg-navy p-10">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={generatingResponse ? "" : "Send a message..."}
                  className="w-full resize-none rounded-md bg-purple p-2 text-offWhite border-transparent focus:border-deepNavy focus:outline-none focus:ring-2 focus:ring-deepNavy" />
                <button 
                  type="submit" 
                  className="btn"
                >
                  Send
                </button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const chatId = ctx.params?.chatId?.[0] || null;
  return {
    props: {
      chatId,
    },
  };
};