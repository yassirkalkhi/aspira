import { MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MessagesList = ({ messages, onChatOpen }) => {
    return (
      <div className="bg-white dark:bg-[#2F2F2F] rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-black dark:text-white">Messages</h2>
          <Link 
            to="/messages" 
            className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 
                     dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
          </Link>
        </div>
        
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => onChatOpen(message.id)}
            className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-50 
                     dark:hover:bg-[#18181A] p-2 rounded-lg transition-colors"
          >
            <div className="relative">
              <img 
                src={message.user.avatar} 
                alt="User" 
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full 
                            ${message.user.isOnline ? 'bg-green-500' : 'bg-gray-300'}
                            ring-2 ring-white dark:ring-[#2F2F2F]`} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {message.user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {message.lastMessage}
              </p>
            </div>
            {message.unreadCount > 0 && (
              <span className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
                           text-xs font-medium rounded-full h-5 w-5 
                           flex items-center justify-center">
                {message.unreadCount}
              </span>
            )}
          </div>
        ))}

        <Link
          to="/messages"
          className="mt-2 flex items-center justify-between p-3 text-sm font-medium 
                   text-gray-900 dark:text-gray-100 hover:bg-gray-50 
                   dark:hover:bg-[#18181A] rounded-lg transition-colors group"
        >
          <span>Show all messages</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  };
  
export default MessagesList;