import Link from "next/link";

export const ChatSidebar = () => {
    return (
      <div className="bg-deepNavy text-offWhite">
        <Link href="/api/auth/logout">Logout</Link>     
      </div>
    )
};