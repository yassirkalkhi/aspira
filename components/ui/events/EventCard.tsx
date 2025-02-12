'use client'
import { Calendar, Clock, Users } from 'lucide-react'
import Image from 'next/image'

interface Event {
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
}

interface EventCardProps {
  event: Event
  user: any
  onAttend: (eventId: string) => void
  onUnattend: (eventId: string) => void
  onDelete: (eventId: string) => void
}

export const EventCard = ({ event, user, onAttend, onUnattend, onDelete }: EventCardProps) => {
  return (
    <div className="bg-dark-primary rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
      <div className="relative h-64">
        <Image 
          src={event.imageUrl} 
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80">
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <p className="text-gray-300 text-sm mt-1">{event.organizerName}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-4 text-gray-400 mb-4">
          <div className="flex items-center gap-2 bg-dark-secondary px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 bg-dark-secondary px-3 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center gap-2 bg-dark-secondary px-3 py-1 rounded-full">
            <Users className="w-4 h-4" />
            <span className="text-sm">{event.attendees.length} attendees</span>
          </div>
        </div>
        
        <p className="text-gray-300 mb-4 line-clamp-3">{event.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-400 text-sm">{event.location}</span>
          <div className="flex items-center gap-4">
            {event.organizerId === user?.uid && (
              <button
                onClick={() => onDelete(event.id)}
                className="px-4 py-2 bg-red-500/10 text-red-300 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Cancel
              </button>
            )}
           
            {event.attendees.includes(user?.email || '') ? (
              <button
                onClick={() => onUnattend(event.id)}
                className="px-4 py-2 bg-theme-primary/30 text-theme-primary rounded-lg hover:bg-theme-primary/40 transition-colors"
              >
                Unattend
              </button>
            ) : (
              <button
                onClick={() => onAttend(event.id)}
                className="px-4 py-2 bg-theme-primary/10 text-theme-primary rounded-lg hover:bg-theme-primary/20 transition-colors"
                disabled={!user}
              >
                Attend
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}