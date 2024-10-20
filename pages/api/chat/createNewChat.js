import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const { message } = req.body;

    // Validate message data
    if (!message || typeof message !== "string" || message.length > 200) {
      return res.status(422).json({
        message: "Message is required and must be less than 200 characters",
      });
    }

    // Construct the new message object
    const newUserMessage = {
      role: "user",
      content: message,
    };

    // Get MongoDB client and database
    const client = await clientPromise;
    const db = client.db("ConvoMate");

    // Insert the new chat into the "chats" collection
    const chat = await db.collection("chats").insertOne({
      userId: user.sub,
      messages: [newUserMessage],
      title: message, // Chat title is the first user message for now
    });

    // Respond with the newly created chat's ID, messages, and title
    return res.status(200).json({
      _id: chat.insertedId.toString(),
      messages: [newUserMessage],
      title: message,
    });
  } catch (e) {
    console.error("ERROR OCCURRED IN CREATE NEW CHAT: ", e); // More detailed error logging
    return res.status(500).json({
      message: "An error occurred when creating a new chat",
    });
  }
}
