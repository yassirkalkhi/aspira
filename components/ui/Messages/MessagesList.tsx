'use client';
import { collection, query, where, orderBy, onSnapshot, limit, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { listenForAuthChanges } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";

const MessagesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
      dispatch(listenForAuthChanges());
        }, [dispatch]);
  const currentUser = useSelector((state: { auth: { user: any } }) => state.auth.user);

 
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);

  const messagesRef = collection(db, "messages");
  const q = currentUser?.uid && query(messagesRef,where("receiverId", "==", currentUser?.uid),orderBy('timestamp', 'desc'),limit(6));
  const [messagesSnapshot, messagesLoading, messagesError] = useCollection(q || null);

  useEffect(() => {
    if (messagesSnapshot?.docs) {
      const senderMessages: { [key: string]: any } = {};
  
      messagesSnapshot.docs.forEach((messageDoc) => {
        const message = messageDoc.data();
        const userQuery = query(
          collection(db, "profiles"),
          where("id", "==", message.senderId)
        );
        onSnapshot(userQuery, (querySnapshot) => {
          querySnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            if (userData) {
              if (
                !senderMessages[message.senderId] ||
                senderMessages[message.senderId].timestamp < message.timestamp
              ) {
                senderMessages[message.senderId] = {
                  ...message,
                  id: messageDoc.id,
                  senderAvatar: userData.avatar,
                  senderName: userData.username,
                  senderIsOnline: userData.isOnline,
                  senderUsername: userData.username,
                };
              }
              const latestMessages = Object.values(senderMessages);
              setMessages(latestMessages);
            }
          });
        });
      });
    }
  }, [messagesSnapshot]);

  return (
    <div className="bg-dark-primary rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#c9d1d9]">Messages</h2>
        <Link href="/messages" className="text-[#c9d1d9] hover:bg-[#161b22] p-2 rounded-lg transition-colors">
          <MessageSquare className="h-5 w-5" />
        </Link>
      </div>
      {!currentUser && <p className="text-gray-400">Sign in to view messages.</p>}
      {messagesLoading && <p className="text-gray-400">Loading messages...</p>}
      {messagesError && <p className="text-red-500">Error Getting messages !</p>}
      {messages.length === 0 && currentUser && !messagesLoading && (
        <p className="text-gray-400">No messages found.</p>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          onClick={() => router.push('/messages')}
          className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-dark-secondary p-2 rounded-lg transition-colors"
        >     
          <div className="relative">
            <div className="h-8 w-8 rounded-full object-cover bg-center bg-cover" style={{backgroundImage: `url(${message.senderAvatar || "https://placehold.co/600x400?text=Hello\nWorld"})`}}></div>
            <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ${message.senderIsOnline ? 'bg-[#238636]' : 'bg-gray-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#c9d1d9] truncate">
              {message.senderUsername || "Unknown"}
            </p>
            <p className="text-xs text-[#8b949e] truncate">
              {message.content}
            </p>
          </div>
          <div className="text-xs text-[#8b949e]">
            {new Date(message.timestamp?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}

      <Link
        href="/messages"
        className="mt-2 flex items-center justify-between p-3 text-sm font-medium text-[#c9d1d9]  hover:bg-dark-secondary rounded-lg transition-colors group"
      >
        <span>Show all messages</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default MessagesList;
