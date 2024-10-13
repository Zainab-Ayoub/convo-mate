import Head from "next/head";
import { ChatSidebar } from "components/ChatSideBar";
import { useState } from "react";
import { streamReader } from "openai-edge-stream";

export default function ChatPage() {
  const [ messageText, setMessageText ] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("MESSAGE TEXT: ", messageText);
    const response = await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        "content-type": "application/json", 
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
    })
  };

  return (
    <>
      <Head>
        <title>New chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className="flex flex-col bg-navy">
          <div className="flex-1">chat window</div>
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
