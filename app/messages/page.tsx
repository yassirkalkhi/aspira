'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/types';
import { collection, query, where, onSnapshot, orderBy, Timestamp, addDoc, getDoc, doc, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Menu, X, Search } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';
import toast from 'react-hot-toast';
import { listenForAuthChanges } from '@/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';

interface Profile {
  id: string;
  username: string;
  avatar: string;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  senderUsername?: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [openedConversation, setOpenedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileSearch, setShowProfileSearch] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(listenForAuthChanges());
  }, [dispatch]);

  const currentUser = useSelector((state: { auth: { user: any } }) => state.auth.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (conversationId: string) => {
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
          scrollToBottom();
        },
        (error) => {
          console.error('Error fetching messages:', error);
          toast.error(error.message);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up listener:', err);
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchConversations = async () => {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUser?.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        async (querySnapshot) => {
          const fetchedConversations = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const participants = doc.data().participants.filter((participant: string) => participant !== currentUser.uid);
              const lastMessage = await fetchLastMessage(doc.id);
              const senderUsername = await fetchUsername(participants[0]);
              return {
                id: doc.id,
                participants,
                lastMessage: lastMessage?.content || 'No messages yet',
                senderUsername: senderUsername || 'Unknown',
              };
            })
          );
          setConversations(fetchedConversations);
          fetchAvatarsForConversations(fetchedConversations);
        },
        (error) => {
          console.error('Error fetching conversations:', error);
          toast.error(error.message);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchLastMessage = async (conversationId: string) => {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return querySnapshot.docs[0].data() as Message;
  };

  const fetchUsername = async (participantId: string) => {
    const q = query(collection(db, 'profiles'), where('id', '==', participantId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return querySnapshot.docs[0].data().username;
  };

  const fetchAvatarsForConversations = async (conversations: Conversation[]) => {
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

  const fetchUserAvatar = async (id: string) => {
    const q = query(collection(db, 'profiles'), where('id', '==', id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return "https://www.gravatar.com/avatar/";
    return querySnapshot.docs[0].data().avatar;
  };

  const fetchProfiles = async (searchQuery: string) => {
    try {
      const profilesRef = collection(db, 'profiles');
      const q = query(profilesRef, where('username', '>=', searchQuery), where('username', '<=', searchQuery + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      const fetchedProfiles = querySnapshot.docs.map((doc) => ({
        id: doc.data().id,
        username: doc.data().username,
        avatar: doc.data().avatar,
      }));
      setProfiles(fetchedProfiles);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

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
        setShowProfileSearch(false);
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
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getReceiverId = async () => {
    if (!openedConversation) throw new Error('No conversation is opened');
    const docRef = doc(db, 'conversations', openedConversation);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    return data?.participants.find((participant: string) => participant !== currentUser?.uid);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !openedConversation) return;
    const receiverId = await getReceiverId();
    setIsSending(true);

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: currentUser.uid,
        receiverId: receiverId,
        content: newMessage,
        timestamp: Timestamp.now(),
        conversationId: openedConversation,
      });

      const senderName = currentUser.email.split('@')[0] || 'Someone';
      await addDoc(collection(db, 'notifications'), {
        content: newMessage,
        header: `New message from ${senderName}`,
        receiveId: receiverId,
        time: Timestamp.now(),
        read: false,
      });

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchConversations();
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    if (openedConversation && currentUser?.uid) {
      let unsubscribe: (() => void) | undefined;
      fetchMessages(openedConversation).then((unsub) => {
        unsubscribe = unsub;
      });
      return () => unsubscribe?.();
    }
  }, [openedConversation, currentUser?.uid]);

  useEffect(() => {
    if (openedConversation) fetchMessages(openedConversation);
    else setMessages([]);
  }, [openedConversation]);

  useEffect(() => {
    if (searchQuery.trim() !== '') fetchProfiles(searchQuery);
    else setProfiles([]);
  }, [searchQuery]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-[calc(100vh-6.7vh)] bg-[#2A2E35] relative">
      <button
        onClick={toggleSidebar}
        className="lg:hidden absolute top-4 left-4 z-50 text-white p-2 rounded-lg bg-[#363B44] hover:bg-[#404650]"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

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
                  <div className="text-sm text-gray-200">{conversation.senderUsername}</div>
                  <div className="text-xs text-gray-400 truncate">{conversation.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <div className="p-4 ">
          <div className="text-center text-gray-400 text-sm pl-12 lg:pl-0">
            End-to-end encryption
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 noScrollBar" ref={messageContainerRef}>
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.senderId !== currentUser?.uid && (
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

        {openedConversation && (
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
                disabled={isSending}
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
        )}
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default withAuth(ChatInterface);
