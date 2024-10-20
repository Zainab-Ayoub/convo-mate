import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";

export default async function handler(req, res) {
  try {
    const session = await getSession(req, res);
    console.log('Session:', session); // Log session to ensure it's retrieved

    if (!session || !session.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { user } = session;
    const client = await clientPromise;
    console.log('Connected to MongoDB:', !!client); // Log MongoDB connection status

    const db = client.db("ConvoMate");
    const chats = await db.collection("chats")
      .find(
        { userId: user.sub }, // Make sure userId is correctly formatted
        { projection: { userId: 0, messages: 0 } }
      )
      .sort({ _id: -1 })
      .toArray();

    console.log('Chats fetched:', chats); // Log fetched chats

    res.status(200).json({ chats });
  } catch (e) {
    console.error('Error fetching chat list:', e); // Log the error message
    res.status(500).json({ message: "An error occurred when getting the chat list", error: e.message });
  }
}
