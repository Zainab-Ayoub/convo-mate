import Head from "next/head";
import { ChatSidebar } from "components/ChatSideBar";
import { useState } from "react";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from "uuid";
import { Message } from "components/message";

export default function ChatPage() {
  const [ incomingMessage, setIncomingMessage ] = useState("");
  const [ messageText, setMessageText ] = useState("");
  const [ newChatMessages, setNewChatMessages ] = useState([]);
  const [ generatingResponse, setGeneratingResponse ] = useState(false);

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
    console.log("MESSAGE TEXT: ", messageText);
  
    try {
      const response = await fetch(`/api/chat/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });
  
      if (!response.body) {
        console.error("No response body found");
        return;
      }
  
      const reader = response.body.getReader();
      await streamReader(reader, (message) => {
        console.log("MESSAGE: ", message); // Log each part of the stream
        setIncomingMessage(s => `${s}${message.content}`);
      });
    } catch (error) {
      console.error("Error while submitting message:", error); // Log errors
    }
  };
  

  return (
    <>
      <Head>
        <title>New chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className="flex flex-col bg-navy">
          <div className="flex-1 text-offWhite">
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
              <fieldset className="flex gap-2">
                <textarea 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Send a message..." 
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
