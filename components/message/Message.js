import { useUser } from "@auth0/nextjs-auth0/client"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export const Message = ({role, content}) => {
    const { user } = useUser();
    console.log("USER: ", user);
    return <div 
      className={`grid grid-cols-[30px_1fr] gap-5 p-5
        ${role === "assistant" ? "bg-purple" : ""}
      `}>
        <div>
            {role === "user" && !!user && (
                <Image
                  src={user.picture}
                  width={30}
                  height={30}
                  alt="User avatar"
                  className="rounded-sm shadow-sm shadow-black/50"
                />
            )}
            {role === "assistant" && (
              <div className="flex h-[30px] w-[30px] 
                              items-center justify-center 
                              rounded-sm shadow-sm 
                              shadow-black/50"
                              bg-deepNavy
              >
                <FontAwesomeIcon icon={faRobot} />
              </div>
            )} 
        </div>
        <div className="prose prose-invert">
          <ReactMarkdown>
            {content}  
          </ReactMarkdown>
        </div>
    </div>
}