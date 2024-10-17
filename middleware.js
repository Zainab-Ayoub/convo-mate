import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0";

const middleware = async (req, res, next) => {
    const user = req.user; // Assuming req.user is where the user object is stored

    // Log the user object for debugging
    console.log("User object: ", user);

    if (!user || !user.sub) {
        console.error("User is not authenticated or 'sub' is missing.");
        return res.status(401).send("Unauthorized");
    }

    // ... existing middleware logic ...

    next();
};

export default withMiddlewareAuthRequired(middleware);

export const config = {
    matcher: ["/api/chat/:path*", "/chat/:path*"],
};
