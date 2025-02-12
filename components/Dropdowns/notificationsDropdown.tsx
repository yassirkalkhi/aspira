'use client'
import { Bell, User } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { listenForAuthChanges } from '@/features/auth/authSlice'
import {  collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'


interface Notification {
  id: string
  content: string
  header: string
  time: string
  read: boolean
  receiveId: string
}

const NotificationsDropdown = () => {
  const dispatch = useDispatch<AppDispatch>()
  const Router = useRouter();
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  useEffect(() => {
    dispatch(listenForAuthChanges())
  }, [dispatch])
   const user = useSelector((state: { auth: { user: any } }) => state.auth.user)
  

  useEffect(() => {
    if (!user?.uid) return
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('receiveId', '==', user.uid),
      orderBy('time', 'desc')
    )

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const fetchedNotifications: Notification[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        fetchedNotifications.push({
          id: doc.id,
          content: data.content,
          header: data.header,
          time: data.time?.toDate().toLocaleString() || 'Now',
          read: data.read,
          receiveId: data.receiveId
        })
      })
      setNotifications(fetchedNotifications)
    })

    return () => unsubscribe()
  }, [user?.uid, db])

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center text-sm font-medium text-center focus:outline-none hover:text-white text-gray-400"
      >
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
          <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"/>
        </svg>
        {notifications.length > 0 && (
          <div className="absolute block w-3 h-3 bg-red-500 border-2 rounded-full -top-0.5 start-2.5 border-gray-900"></div>
        )}
      </button>

      {isOpen && (
        <div onClick={()=> {Router.replace('/notifications')}} className="z-20 absolute top-20 right-20 w-full max-w-sm divide-y rounded-lg shadow-sm bg-gray-700 divide-gray-600">
          <div className="block px-4 py-2 font-medium text-center rounded-t-lg bg-gray-700 text-white">
            Notifications
          </div>
          <div className="divide-y divide-gray-700">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex px-4 py-3 hover:bg-gray-600">
                <div className="shrink-0">
                  <User className="rounded-full w-11 h-11 bg-gray-800 text-gray-400 p-2" />
                  <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-theme-primary border rounded-full border-gray-800">
                    <Bell className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="w-full ps-3">
                  <div className="text-sm mb-1.5 text-gray-400">
                    {notification.header}: "{notification.content}"
                  </div>
                  <div className="text-xs text-theme-primary">{notification.time}</div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">No new notifications</div>
            )}
          </div>
          <Link
            href="/notifications"
            className="block py-2 text-sm font-medium text-center rounded-b-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            <div className="inline-flex items-center">
              <svg className="w-4 h-4 me-2 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
              </svg>
              View all
            </div>
          </Link>
        </div>
      )}
    </>
  )
}

export default NotificationsDropdown