'use client'
import { Dialog } from '@headlessui/react'
import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (newEvent: any, imageFile: File | null) => Promise<void>
  uploading: boolean
}

export const CreateEventModal = ({ isOpen, onClose, onSubmit, uploading }: CreateEventModalProps) => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    
    const file = e.target.files[0]
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!newEvent.title || !newEvent.description || 
      !newEvent.date || !newEvent.time || 
      !newEvent.location || !selectedFile) {
      toast.error('All fields are required')
      return
    }
    
    await onSubmit(newEvent, selectedFile)
    setNewEvent({ title: '', description: '', date: '', time: '', location: '' })
    setSelectedFile(null)
    setImagePreview(null)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative h-[90vh] z-50 overflow-y-auto noScrollBar">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <Dialog.Panel className="w-full max-w-xs sm:max-w-sm h-[90vh] sm:h-[85vh] md:max-w-lg bg-dark-primary rounded-xl p-4 sm:p-6 border border-[#30363d] overflow-y-auto noScrollBar">
          <Dialog.Title className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-4">Create New Event</Dialog.Title>
          
          <div className="space-y-2 sm:space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
              required
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 sm:h-48 bg-dark-secondary rounded-xl border-2 border-dashed border-[#30363d] flex flex-col items-center justify-center hover:border-theme-primary transition-colors relative"
            >
              {imagePreview ? (
                <Image 
                  src={imagePreview} 
                  alt="Event preview" 
                  fill
                  className="object-cover rounded-xl"
                />
              ) : (
                <>
                  <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-1 sm:mb-2" />
                  <p className="text-gray-400 text-sm sm:text-base">Click to select event image</p>
                </>
              )}
            </button>

            <input
              type="text"
              placeholder="Event Title"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-dark-secondary border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-theme-primary"
              value={newEvent.title}
              onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              required
            />

            <textarea
              placeholder="Description"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-dark-secondary border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-theme-primary resize-none"
              value={newEvent.description}
              onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
              <input
                type="date"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-dark-secondary border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-theme-primary"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                required
              />
              
              <input
                type="time"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-dark-secondary border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-theme-primary"
                value={newEvent.time}
                onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                required
              />
              
              <style>
                {`
                  input[type="time"]::-webkit-calendar-picker-indicator,
                  input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                  }
                `}
              </style>
              
              <input
                type="text"
                placeholder="Location"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-dark-secondary border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-theme-primary"
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>

            <div className="mt-2 sm:mt-4 flex justify-end gap-2 sm:gap-4">
              <button
                onClick={onClose}
                className="px-3 py-2 sm:px-4 sm:py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition-colors"
                disabled={uploading}
              >
                {uploading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}