'use client'
import { Bell } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import MessagesList from '@/components/ui/Messages/MessagesList';
import UserProfile from '@/components/ui/Profile/UserProfile';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { listenForAuthChanges } from '@/features/auth/authSlice';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import withAuth from '@/components/auth/withAuth';

interface Notification {
  id: string;
  content: string;
  header: string;
  time: string;
  read: boolean;
  receiveId: string;
}

const Notifications = () => { 
  const dispatch = useDispatch<AppDispatch>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    dispatch(listenForAuthChanges());
  }, [dispatch]);
  const user = useSelector((state: { auth: { user: any } }) => state.auth.user);


  useEffect(() => {
    if (!user?.uid) return;

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('receiveId', '==', user.uid),
      orderBy('time', 'desc')
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const fetchedNotifications: Notification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedNotifications.push({
          id: doc.id,
          content: data.content,
          header: data.header,
          time: new Date(data.time?.seconds * 1000).toLocaleString() || 'No time',
          read: data.read || false,
          receiveId: data.receiveId
        });
      });
      setNotifications(fetchedNotifications);
    });

    return () => unsubscribe();
  }, [user?.uid, db]);

  return (
    <div className="w-full bg-dark-secondary min-h-screen flex gap-6 p-6">
      <UserProfile />
      
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full bg-dark-primary border border-[#30363d] rounded-lg p-4 h-[80vh] overflow-y-auto noScrollBar">
          <h2 className="text-xl text-white/70 font-semibold mb-4">Notifications</h2>
          {notifications.map(notification => (
            <div key={notification.id} className="flex items-center gap-4 p-3 bg-dark-secondary border border-[#30363d] rounded-md mb-3">
              <Bell className='text-white w-5 h-5' />
              <div className='w-full'>
                <p className="text-white font-semibold flex-1 mb-1">{notification.header}</p>
                <p className="text-xs text-gray-400 flex-1">{notification.content}</p>
              </div>
              <span className="text-xs text-gray-400">{notification.time}</span>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-gray-400 text-center mt-4">No notifications found</p>
          )}
        </div>
      </div>
      
      <div className="hidden lg:block w-72 bg-dark-primary rounded-lg self-start">
        <MessagesList />
      </div>
    </div>
  );
};

export default withAuth(Notifications);