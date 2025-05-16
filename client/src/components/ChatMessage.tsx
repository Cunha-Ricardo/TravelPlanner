import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  avatar?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, avatar }) => {
  // Handle content with lists
  const processContent = (text: string) => {
    // Check if the content contains bullet points
    if (text.includes("•") || text.includes("- ")) {
      const sections = text.split("\n\n");
      
      return sections.map((section, idx) => {
        // Check if this section is a list
        if (section.includes("•") || section.includes("- ")) {
          const listItems = section
            .split("\n")
            .filter(item => item.trim().startsWith("•") || item.trim().startsWith("- "));
          
          if (listItems.length > 0) {
            return (
              <div key={idx}>
                <p className="mb-2">{section.split("\n")[0]}</p>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  {listItems.map((item, i) => (
                    <li key={i}>
                      {item.replace(/^[•-]\s/, '')}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
        }
        
        return <p key={idx} className="mb-2">{section}</p>;
      });
    }
    
    // Split by newlines and render
    return text.split("\n\n").map((paragraph, idx) => (
      <p key={idx} className="mb-2">{paragraph}</p>
    ));
  };

  return (
    <div className={`flex items-start ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/avatar-assistant.png" />
            <AvatarFallback className="bg-primary-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <div
        className={`${
          isUser
            ? "bg-primary-600 text-white"
            : "bg-gray-100 text-gray-800"
        } rounded-lg py-2 px-4 max-w-3xl`}
      >
        {processContent(content)}
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
