'use client'
import { Search, Plus } from 'lucide-react'

interface EventsHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onOpenModal: () => void
}

export const EventsHeader = ({ searchQuery, onSearchChange, onOpenModal }: EventsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
      <div className="relative w-full md:max-w-xl">
        <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-2 bg-dark-primary border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-theme-primary"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button
        onClick={onOpenModal}
        className="w-full md:w-auto px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create Event
      </button>
    </div>
  )
}