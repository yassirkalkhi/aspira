import { useState } from 'react';
import { X, Send, Smile } from 'lucide-react';

const ChatBox = ({ userId, onClose, messages }) => {
    const [newMessage, setNewMessage] = useState('');
    
    const currentChat = messages.find(msg => msg.id === userId);
    
    if (!currentChat) return null;

    const handleSend = (e) => {
      e.preventDefault();
      if (newMessage.trim()) {
        // Add message handling logic here
        setNewMessage('');
      }
    };
  
    return (
      <div className="fixed bottom-0 right-4 w-80 bg-white dark:bg-[#2F2F2F] rounded-t-lg shadow-lg z-50">
        <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img src={currentChat.user.avatar} alt="User" className="h-8 w-8 rounded-full" />
              {currentChat.user.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 
                             ring-2 ring-white dark:ring-[#2F2F2F]"></span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {currentChat.user.name}
              </h3>
              {!currentChat.user.isOnline && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {currentChat.user.lastSeen}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>
  
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {currentChat.conversation.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender === 'me' 
                  ? 'bg-gray-900 dark:bg-black text-white' 
                  : 'bg-gray-100 dark:bg-[#18181A] text-gray-900 dark:text-gray-100'
              }`}>
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">{message.time}</span>
              </div>
            </div>
          ))}
        </div>
  
        <form onSubmit={handleSend} className="p-3 border-t dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <Smile className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 dark:bg-[#18181A] rounded-full px-4 py-2 text-sm"
            />
            <button type="submit" disabled={!newMessage.trim()} 
                    className="text-gray-900 dark:text-gray-100 hover:text-gray-700 
                             dark:hover:text-gray-300 disabled:opacity-50">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    );
  };
export default ChatBox;