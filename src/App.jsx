import "./index.css";
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import BottomNav from './components/ui/BottomNav';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Messages = lazy(() => import('./pages/Messages'));
const Events = lazy(() => import('./pages/Events'));
const Jobs = lazy(() => import('./pages/Jobs'));

// Custom loader component
const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

function App() {
  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (

      <BrowserRouter>
        <div className="min-h-screen pb-16 md:pb-0">
          <Header />
          <main className="pt-16">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/events" element={<Events />} />
                <Route path="/jobs" element={<Jobs />} />
              </Routes>
            </Suspense>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>

  );
}

export default App;
