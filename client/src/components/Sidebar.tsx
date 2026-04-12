import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes.constants';
import { 
  Home, 
  BookOpen, 
  Megaphone, 
  Briefcase, 
  Terminal, 
  BarChart2,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Home', path: ROUTES.DASHBOARD, icon: <Home size={18} /> },

    { name: 'Announcements', path: ROUTES.ANNOUNCEMENTS, icon: <Megaphone size={18} /> },
    { name: 'Jobs Board', path: ROUTES.JOB_PORTAL, icon: <Briefcase size={18} /> },
    { name: 'Playground', path: ROUTES.CODE_PLAYGROUND, icon: <Terminal size={18} /> },
    { name: 'Leaderboard', path: ROUTES.LEADERBOARD, icon: <BarChart2 size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span>NI</span>
          <span>AT</span>
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">NxtWave Institute of</span>
          <span className="sidebar-logo-subtitle">Advanced Technologies</span>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar-search-wrapper">
        <div className="sidebar-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search for 'Arrays'" />
        </div>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === ROUTES.DASHBOARD}
            className={({ isActive }) => 
              `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
            }
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || 'User'}</span>
            <span className="sidebar-user-campus">{user?.campus || 'Campus'}</span>
          </div>
          <ChevronRight size={14} className="sidebar-chevron" />
        </div>
        <button onClick={handleLogout} className="sidebar-logout">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
