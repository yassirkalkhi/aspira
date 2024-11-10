import { User, Settings, LogOut, HelpCircle, Moon, Star, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileDropdown = ({ isOpen, onLogout, onThemeToggle, isDarkMode }) => {
  if (!isOpen) return null;

  const menuSections = [
    {
      items: [
        { icon: User, label: 'Profile', to: '/profile' },
        { icon: Settings, label: 'Settings', to: '/settings' },
      ]
    },
    {
      items: [
        { icon: Star, label: 'Starred', to: '/starred' },
        { icon: GitBranch, label: 'Your projects', to: '/projects' },
      ]
    },
    {
      items: [
        {
          icon: Moon,
          label: isDarkMode ? 'Light mode' : 'Dark mode',
          onClick: onThemeToggle,
          isButton: true
        },
        { icon: HelpCircle, label: 'Help & Support', to: '/help' },
      ]
    },
    {
      items: [
        {
          icon: LogOut,
          label: 'Logout',
          onClick: onLogout,
          isButton: true,
          isDanger: true
        }
      ]
    }
  ];

  const MenuItem = ({ icon: Icon, label, to, onClick, isButton, isDanger }) => {
    const baseClasses = `
      w-full flex items-center gap-3 px-4 py-3
      ${isDanger ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-[#c9d1d9]'}
      hover:bg-gray-100 dark:hover:bg-[#1f2428]
      transition-colors duration-150
    `;

    return isButton ? (
      <button onClick={onClick} className={baseClasses}>
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </button>
    ) : (
      <Link to={to} className={baseClasses}>
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg 
                    bg-white dark:bg-[#161b22] 
                    border border-gray-100 dark:border-[#30363d]
                    py-1 z-50">
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {sectionIndex > 0 && (
            <div className="h-px bg-gray-200 dark:bg-[#30363d] my-1" />
          )}
          {section.items.map((item) => (
            <MenuItem key={item.label} {...item} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProfileDropdown; 