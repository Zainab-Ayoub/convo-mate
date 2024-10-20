import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  console.log("IN HERE!");
  try {
    const { chatId: chatIdFromParam, message } = await req.json();

    // Validate message data
    if (!message || typeof message !== "string" || message.length > 200) {
      return new Response(
        JSON.stringify({
          message: "Message is required and must be less than 200 characters",
        }),
        {
          status: 422,
        }
      );
    }

    let chatId = chatIdFromParam;
    let newChatId;
    let chatMessages = [];

    const initialChatMessage = {
      role: "system",
      content:
        "Your name is Convo Mate. An incredibly intelligent and quick-thinking AI, that always replies with an enthusiastic and positive energy. You were created by WebDevEducation. Your response must be formatted as markdown.",
    };

    // If chatId exists, add message to existing chat, otherwise create new chat
    if (chatId) {
      const response = await fetch(
        `${req.headers.get("origin")}/api/chat/addMessageToChat`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: req.headers.get("cookie"),
          },
          body: JSON.stringify({
            chatId,
            role: "user",
            content: message,
          }),
        }
      );

      const json = await response.json();
      if (response.status !== 200) {
        return new Response(
          JSON.stringify({ error: "Failed to add message to chat" }),
          { status: 500 }
        );
      }

      chatMessages = json.chat.messages || [];
    } else {
      const response = await fetch(
        `${req.headers.get("origin")}/api/chat/createNewChat`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: req.headers.get("cookie"),
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      const json = await response.json();
      if (response.status !== 200) {
        return new Response(
          JSON.stringify({ error: "Failed to create new chat" }),
          { status: 500 }
        );
      }

      chatId = json._id;
      newChatId = json._id;
      chatMessages = json.messages || [];
    }

    // Include messages, reverse them and cap them by token limit
    const messagesToInclude = [];
    chatMessages.reverse();
    let usedTokens = 0;

    for (let chatMessage of chatMessages) {
      const messageTokens = chatMessage.content.length / 4; // Rough token estimation
      usedTokens += messageTokens;

      if (usedTokens <= 2000) {
        messagesToInclude.push(chatMessage);
      } else {
        break;
      }
    }

    messagesToInclude.reverse();

    // OpenAI API streaming call with the included messages
    const stream = await OpenAIEdgeStream(
      "https://api.openai.com/v1/chat/completions",
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [initialChatMessage, ...messagesToInclude],
          stream: true,
        }),
      },
      {
        onBeforeStream: ({ emit }) => {
          if (newChatId) {
            emit(newChatId, "newChatId");
          }
        },
        onAfterStream: async ({ fullContent }) => {
          // Once the response is complete, save the assistant message to chat
          await fetch(`${req.headers.get("origin")}/api/chat/addMessageToChat`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              cookie: req.headers.get("cookie"),
            },
            body: JSON.stringify({
              chatId,
              role: "assistant",
              content: fullContent,
            }),
          });
        },
      }
    );

    // Return the stream as the response
    return new Response(stream);
  } catch (e) {
    console.error("Error in sendMessage:", e);
    return new Response(
      JSON.stringify({ message: "An error occurred in sendMessage" }),
      {
        status: 500,
      }
    );
  }
}
