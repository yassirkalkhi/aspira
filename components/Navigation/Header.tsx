import { 
  Search,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import  Link  from 'next/link';
import ProfileDropdown from '@/components/Dropdowns/profileDropdown';
import NotificationsDropdown from '@/components/Dropdowns/notificationsDropdown';
import Button from '../ui/shadcn/ui/Button';

const Header = () => {
  const user = {
    uid : 'id1'
  }
  const handleLogout = () => {
   
    console.log('Logging out...');
  };

  return (
    <>
      <header className="w-full fixed top-0 shadow-sm bg-dark-primary z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1">
              <Link href="/" className="flex-shrink-0">
                <span className="text-xl font-bold  text-theme-primary">
                  Aspira
                </span>
              </Link>
              <div className="relative flex-1 max-w-[300px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8b949e]" />
                <input
                  type="text"
                  className="w-full h-9 pl-10 pr-4 rounded-lg 
                           bg-dark-secondary
                           text-[#c9d1d9] 
                           placeholder-[#8b949e]
                           border-[#30363d]
                          focus:ring-1 "
                  placeholder="Search..."
                />
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/jobs" 
                      className="text-sm text-[#8b949e] hover:text-[#c9d1d9]">
                  Jobs
                </Link>
                <Link href="/events" 
                      className="text-sm 
                               text-[#8b949e] hover:text-[#c9d1d9]">
                  Events
                </Link>
              </nav>
            </div>
           {user.uid ? <>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/messages"  className="text-[#8b949e] hover:text-[#c9d1d9]">
                <MessageSquare className="h-5 w-5" />
              </Link>
              <NotificationsDropdown/>
            </div>
            <div className="relative ms-8 mt-2">
              <ProfileDropdown  />
            </div></> :
           <Button text='Join Us' callback={()=>{}}/>}

          </div>
        </div>
      </header>
      
    </>
  );
};

export default Header;
