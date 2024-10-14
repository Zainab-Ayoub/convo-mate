import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0";

export default withMiddlewareAuthRequired();

export const config = {
    matcher: ["/api/chat/:path*"],
};