import { useState } from 'react';
import { 
  Search,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="w-full fixed top-0 shadow-sm bg-white dark:bg-dark-secondary z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1">
              <Link to="/" className="flex-shrink-0">
                <span className="text-xl font-bold text-black dark:text-white">
                  Aspira
                </span>
              </Link>
              <div className="relative flex-1 max-w-[300px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  className="w-full h-9 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-[#2F2F2F] text-black dark:text-white placeholder-gray-500"
                  placeholder="Search..."
                />
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/jobs" className="text-sm text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
                  Jobs
                </Link>
                <Link to="/events" className="text-sm text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
                  Events
                </Link>
              </nav>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/messages" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
                <MessageSquare className="h-5 w-5" />
              </Link>
              <Link to="/notifications" className="relative text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  5
                </span>
              </Link>
            </div>
            <div className="relative ms-8 mt-2">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-9 w-9 rounded-full bg-gray-200 ring-2 ring-transparent transition-all duration-200"
              >
                <img
                  src="https://github.com/shadcn.png"
                  alt="Profile"
                  className="h-full w-full rounded-full"
                />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border bg-white dark:bg-[#2F2F2F] border-gray-100 dark:border-gray-700">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#18181A] text-gray-600 dark:text-gray-300">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link  to="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#18181A] text-gray-600 dark:text-gray-300">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-[#18181A]">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
    </>
  );
};

export default Header;
