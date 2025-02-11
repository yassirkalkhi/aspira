'use client';
import { Search, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import ProfileDropdown from '@/components/Dropdowns/ProfileDropdown';
import NotificationsDropdown from '@/components/Dropdowns/NotificationsDropdown';
import Button from '../ui/shadcn/ui/Button';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Algolia from './Search/Algolia';




const Header = () => {
  const Router = useRouter();
  const handleRedirect = () => {Router.push('/signup')} 
  const { user } = useSelector((state: { auth: { user: any } }) => state.auth);
  
  return (
    <>
      <header className="w-full shadow-sm bg-dark-primary z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1">
              <Link href="/" className="flex-shrink-0">
                <span className="text-xl font-bold text-theme-primary ">Aspira</span>
              </Link>
              {/* Search Input Wrapper */}
              <Algolia/>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/jobs" className="text-sm text-gray-400 hover:text-white">Jobs</Link>
                <Link href="/events" className="text-sm text-gray-400 hover:text-white">Events</Link>
              </nav>
            </div>
            {user?.uid ? (
              <>
                <div className="hidden md:flex items-center gap-6">
                  <Link href="/messages" className="text-gray-400 hover:text-white">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                  <NotificationsDropdown />
                </div>
                <div className="relative ms-8 mt-2">
                  <ProfileDropdown />
                </div>
              </>
            ) : (
              <Button text="Join Us" callback={handleRedirect} />
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
