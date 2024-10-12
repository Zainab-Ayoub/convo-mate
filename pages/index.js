import Head from "next/head";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { isLoading, error, user } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>ConvoMate - Login or Signup</title>
      </Head>
      <div className="flex min-h-screen w-full items-center justify-center bg-navy text-white text-center">
        <div>
          {!!user && (
            <Link
              href="/api/auth/logout"
              className="rounded-md bg-offWhite px-4 py-2 text-navy hover:bg-gray"
            >
              Logout
            </Link>
          )}

          {!user && (
            <>
              <Link
                href="/api/auth/login"
                className="rounded-md bg-offWhite px-4 py-2 text-navy hover:bg-gray"
              >
                Login
              </Link>
              <Link
                href="/api/auth/signup"
                className="rounded-md bg-offWhite px-4 py-2 text-navy hover:bg-gray"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
