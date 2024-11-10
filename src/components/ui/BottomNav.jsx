import React, { useState } from 'react';
import { 
  Briefcase,
  Calendar,
  Menu as MenuIcon,
  MessageSquare,
  Bell,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BottomNav = () => {
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg bg-white dark:bg-dark-secondary border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-around h-16">
          <Link to="/jobs" className="flex flex-col items-center gap-1 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
            <Briefcase className="h-5 w-5" />
            <span className="text-xs font-medium">Jobs</span>
          </Link>
          <Link to="/events" className="flex flex-col items-center gap-1 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
            <Calendar className="h-5 w-5" />
            <span className="text-xs font-medium">Events</span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsBottomMenuOpen(!isBottomMenuOpen)}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="text-xs font-medium">Menu</span>
            </button>
            {isBottomMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg shadow-lg border bg-white dark:bg-dark-secondary border-gray-100 dark:border-gray-700">
                <Link to="/messages" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#18181A]">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm font-medium">Messages</span>
                </Link>
                <Link to="/notifications" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#18181A]">
                  <Bell className="h-5 w-5" />
                  <span className="text-sm font-medium">Notifications</span>
                </Link>
                <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#18181A]">
                  <Settings className="h-5 w-5" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      {isBottomMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsBottomMenuOpen(false)}
        />
      )}
    </>
  );
};

export default BottomNav;
