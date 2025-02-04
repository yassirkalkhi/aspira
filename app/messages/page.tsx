'use client';
import React, { useState, useEffect, useRef } from 'react';
import {Message} from '@/types/types'
import { collection, query, where, onSnapshot, orderBy, Timestamp, addDoc, getDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Ensure you have this configuration file
import { Menu, X, Search } from 'lucide-react';



interface Profile {
  id: string; 
  username: string;
  avatar: string;
}


const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<{ id: string; participants: any[] }[]>([]);
  const [openedConversation, setOpenedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileSearch, setShowProfileSearch] = useState(false); // Toggle profile search
  const [profiles, setProfiles] = useState<Profile[]>([]); // Store fetched profiles
  const [searchQuery, setSearchQuery] = useState(''); // Store search query
  const [avatars, setAvatars] = useState<{ [key: string]: string }>({}); // Store avatars for participants

  const currentUser = {
    uid: 'HKStDfpvimUezZ8bn35p',
    username: 'yasserkalkhi',
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages for the opened conversation
  const fetchMessages = async (conversationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedMessages = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Message[];
          setMessages(fetchedMessages);
          setLoading(false);
          scrollToBottom();
        },
        (error) => {
          console.error('Error fetching messages:', error);
          setError(error.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up listener:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Fetch all conversations for the current user
  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUser.uid)
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedConversations = querySnapshot.docs.map((doc) => {
            const participants = doc.data().participants.filter((participant: string) => participant !== currentUser.uid);
            return {
              id: doc.id,
              participants: participants,
            };
          }) as { id: string; participants: any[] }[];
          setConversations(fetchedConversations);
          setLoading(false);
          fetchAvatarsForConversations(fetchedConversations); // Fetch avatars for participants
        },
        (error) => {
          console.error('Error fetching conversations:', error);
          setError(error.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up listener:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Fetch avatars for all participants in conversations
  const fetchAvatarsForConversations = async (conversations: { id: string; participants: any[] }[]) => {
    const avatarMap: { [key: string]: string } = {};

    for (const conversation of conversations) {
      for (const participantId of conversation.participants) {
        if (!avatarMap[participantId]) {
          const avatar = await fetchUserAvatar(participantId);
          avatarMap[participantId] = avatar;
        }
      }
    }

    setAvatars(avatarMap);
  };

  // Fetch user avatar
  const fetchUserAvatar = async (id: string) => {
    const q = query(collection(db, 'profiles'), where('id', '==', id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return "https://www.gravatar.com/avatar/";
    }
    const docSnap = querySnapshot.docs[0];
    return docSnap.exists() ? docSnap.data().avatar : "https://www.gravatar.com/avatar/";
  };

  // Fetch profiles based on search query
  const fetchProfiles = async (searchQuery: string) => {
    try {
      const profilesRef = collection(db, 'profiles');
      const q = query(profilesRef, where('username', '>=', searchQuery), where('username', '<=', searchQuery + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      const fetchedProfiles = querySnapshot.docs.map((doc) => ({
        id: (doc.data() as Profile).id, // Use the `id` field from the `profiles` collection
        username: (doc.data() as Profile).username,
        avatar: doc.data().avatar,
      })) as Profile[];
      setProfiles(fetchedProfiles);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Create a new conversation
  const createConversation = async (participantId: string) => {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const existingConversation = querySnapshot.docs.find((doc) => {
        const participants = doc.data().participants;
        return participants.includes(participantId);
      });

      if (existingConversation) {
        setOpenedConversation(existingConversation.id);
        setShowProfileSearch(false); // Close the profile search
        return;
      }

      const newConversationRef = await addDoc(collection(db, 'conversations'), {
        participants: [currentUser.uid, participantId],
        timestamp: Timestamp.now(),
      });
      setOpenedConversation(newConversationRef.id);
      setShowProfileSearch(false);
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Get the receiver ID for the opened conversation
  const getReceiverId = async () => {
    if (!openedConversation) {
      throw new Error('No conversation is opened');
    }
    const docRef = doc(db, 'conversations', openedConversation);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const receiverId = data?.participants.find((participant: string) => participant !== currentUser.uid);
    console.log(receiverId);
    return receiverId;
  };

  // Send a new message to the opened conversation
  const sendMessage = async () => {
    if (newMessage.trim() === '' || !openedConversation) return;
    const receiverId = await getReceiverId();
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: currentUser.uid,
        receiverId: receiverId,
        content: newMessage,
        timestamp: Timestamp.now(),
        conversationId: openedConversation,
      });

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Fetch conversations when the component mounts
  useEffect(() => {
    fetchConversations();
  }, [currentUser.uid]);

  // Fetch messages when the opened conversation changes
  useEffect(() => {
    if (openedConversation) {
      fetchMessages(openedConversation);
    } else {
      setMessages([]); // Clear messages if no conversation is opened
    }
  }, [openedConversation]);

  // Fetch profiles when the search query changes
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchProfiles(searchQuery);
    } else {
      setProfiles([]); // Clear profiles if the search query is empty
    }
  }, [searchQuery]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-[calc(100vh-6.7vh)] bg-[#2A2E35] relative">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden absolute top-4 left-4 z-50 text-white p-2 rounded-lg bg-[#363B44] hover:bg-[#404650]"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:relative
          w-72 h-full
          bg-[#2A2E35]
          border-r border-gray-700
          transition-transform duration-300
          z-40
          overflow-y-auto
        `}
      >
        <div className="p-4 pt-16 lg:pt-4">
          <h2 className="text-white text-xl mb-4">Messages</h2>
          <button
            onClick={() => setShowProfileSearch(true)}
            className="w-full py-2 bg-[#4B9B9B] text-white rounded-lg hover:bg-[#408B8B] mb-4"
          >
            New Conversation
          </button>
          {showProfileSearch && (
            <div className="mb-4">
              <div className="flex items-center bg-[#363B44] rounded-lg p-2">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search profiles..."
                  className="flex-1 bg-transparent text-white ml-2 focus:outline-none"
                />
              </div>
              <div className="mt-2 space-y-2">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#363B44] cursor-pointer hover:bg-[#404650]"
                    onClick={() => createConversation(profile.id)}
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 bg-cover"
                      style={{ backgroundImage: `url(${profile.avatar})` }}
                    ></div>
                    <div className="text-sm text-gray-200">{profile.username}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#363B44] cursor-pointer hover:bg-[#404650]"
                onClick={() => {
                  setOpenedConversation(conversation.id);
                  setIsSidebarOpen(false);
                }}
              >
                <div className="flex -space-x-2">
                  {conversation.participants.map((participant, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 bg-cover"
                      style={{ backgroundImage: `url(${avatars[participant]})` }}
                    ></div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-200">Message Header</div>
                  <div className="text-xs text-gray-400 truncate">Lorem ipsum text...</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Chat header */}
        <div className="p-4 ">
          <div className="text-center text-gray-400 text-sm pl-12 lg:pl-0">
            End-to-end encryption
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6" ref={messageContainerRef}>
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUser.uid ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.senderId !== currentUser.uid && (
                  <div
                    className="w-8 h-8 rounded-full bg-gray-600 mr-2 flex-shrink-0 bg-cover"
                    style={{ backgroundImage: `url(${avatars[message.senderId]})` }}
                  />
                )}
                <div
                  className={`max-w-[85%] lg:max-w-[70%] rounded-lg p-3 ${
                    message.senderId === currentUser.uid
                      ? 'bg-[#4B9B9B] text-white'
                      : 'bg-[#363B44] text-white'
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-[#2A2E35]">
          <div className="flex items-center max-w-3xl mx-auto">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message Here ..."
              className="flex-1 bg-[#363B44] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#4B9B9B]"
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-3 bg-[#4B9B9B] text-white rounded-lg hover:bg-[#408B8B] flex-shrink-0"
            >
              <svg
                className="w-5 h-5 rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;