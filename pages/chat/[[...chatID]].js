import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>New chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className="flex flex-col bg-navy">
          <div className="flex-1">chat window</div>
          <footer className="bg-purple p-10">footer</footer>
        </div>
      </div>
    </>
  );
}
