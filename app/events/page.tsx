'use client'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { listenForAuthChanges } from '@/features/auth/authSlice'
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp, updateDoc, arrayUnion, arrayRemove, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CarouselSection } from '@/components/ui/events/CarouselSection'
import { EventCard } from '@/components/ui/events/EventCard'
import { EventsHeader } from '@/components/ui/events/EventsHeader'
import { CreateEventModal } from '@/components/ui/events/CreateEventModal'
import toast from 'react-hot-toast'
import axios from 'axios'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizerId: string
  organizerName: string
  attendees: string[]
  imageUrl: string
  timestamp: Date
}

const EventsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: { auth: { user: any } }) => state.auth.user)
  const [events, setEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    dispatch(listenForAuthChanges())
    const unsubscribe = onSnapshot(
      query(collection(db, 'events'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const fetchedEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        })) as Event[]
        setEvents(fetchedEvents)
      }
    )
    return () => unsubscribe()
  }, [dispatch])

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    try {
      setUploading(true)
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      )
      return response.data.secure_url
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error("Image upload failed")
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleCreateEvent = async (newEventData: any, imageFile: File | null) => {
    if (!user?.uid || !imageFile) return
    
    try {
      const imageUrl = await uploadImage(imageFile)
      if (!imageUrl) return

      await addDoc(collection(db, 'events'), {
        ...newEventData,
        imageUrl,
        organizerId: user.uid,
        organizerName: user.email?.split('@')[0] || "Anonymous",
        attendees: [],
        timestamp: Timestamp.now()
      })
      toast.success('Event created successfully!')
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Error creating event')
    }
  }

  const handleAttendEvent = async (eventId: string) => {
    if (!user || !user.email) {
      toast.error("You must be logged in to attend events")
      return
    }

    try {
      const eventRef = doc(db, 'events', eventId)
      await updateDoc(eventRef, {
        attendees: arrayUnion(user.email)
      })
      toast.success("You've successfully joined this event!")
    } catch (error) {
      console.error("Error updating attendance:", error)
      toast.error("Failed to join event")
    }
  }

  const handleUnattendEvent = async (eventId: string) => {
    if (!user || !user.email) {
      toast.error("You must be logged in to unattend events")
      return
    }

    try {
      const eventRef = doc(db, 'events', eventId)
      await updateDoc(eventRef, {
        attendees: arrayRemove(user.email)
      })
      toast.success("You've successfully left this event!")
    } catch (error) {
      console.error("Error updating attendance:", error)
      toast.error("Failed to leave event")
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to cancel this event?")) return
    
    try {
      await deleteDoc(doc(db, 'events', eventId))
      toast.success("Event deleted successfully")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    }
  }

  return (
    <div className="min-h-screen bg-dark-secondary pt-8 p-8 md:pt-0">
      <CarouselSection />
      
      <section className="min-h-screen bg-dark-secondary p-6">
        <div className="max-w-7xl mx-auto">
          <EventsHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenModal={() => setIsModalOpen(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                user={user}
                onAttend={handleAttendEvent}
                onUnattend={handleUnattendEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>

          <CreateEventModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateEvent}
            uploading={uploading}
          />
        </div>
      </section>
    </div>
  )
}

export default EventsPage