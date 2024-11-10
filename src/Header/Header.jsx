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
import ProfileDropdown from '../components/ProfileDropdown/ProfileDropdown';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <>
      <header className="w-full fixed top-0 shadow-sm bg-white dark:bg-dark-primary z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1">
              <Link to="/" className="flex-shrink-0">
                <span className="text-xl font-bold  text-theme-primary">
                  Aspira
                </span>
              </Link>
              <div className="relative flex-1 max-w-[300px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8b949e]" />
                <input
                  type="text"
                  className="w-full h-9 pl-10 pr-4 rounded-lg 
                           bg-gray-100 dark:bg-dark-secondary
                           text-black dark:text-[#c9d1d9] 
                           placeholder-gray-500 dark:placeholder-[#8b949e]
                           border border-transparent dark:border-[#30363d]
                          focus:ring-1 "
                  placeholder="Search..."
                />
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/jobs" 
                      className="text-sm text-gray-600 hover:text-black 
                               dark:text-[#8b949e] dark:hover:text-[#c9d1d9]">
                  Jobs
                </Link>
                <Link to="/events" 
                      className="text-sm text-gray-600 hover:text-black 
                               dark:text-[#8b949e] dark:hover:text-[#c9d1d9]">
                  Events
                </Link>
              </nav>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/messages" 
                    className="text-gray-600 hover:text-black 
                             dark:text-[#8b949e] dark:hover:text-[#c9d1d9]">
                <MessageSquare className="h-5 w-5" />
              </Link>
              <Link to="/notifications" 
                    className="relative text-gray-600 hover:text-black 
                             dark:text-[#8b949e] dark:hover:text-[#c9d1d9]">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white 
                              text-xs rounded-full h-4 w-4 flex items-center 
                              justify-center font-medium">
                  5
                </span>
              </Link>
            </div>
            <div className="relative ms-8 mt-2">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-9 w-9 rounded-full bg-gray-200 dark:bg-[#21262d] 
                         ring-2 ring-transparent transition-all duration-200"
              >
                <img
                  src="https://github.com/shadcn.png"
                  alt="Profile"
                  className="h-full w-full rounded-full"
                />
              </button>
              <ProfileDropdown isOpen={isProfileOpen} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>
      
    </>
  );
};

export default Header;
