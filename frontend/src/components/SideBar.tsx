import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Info, Home } from 'lucide-react';
import '../styles/SideBar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  function doLogout(event: { preventDefault: () => void }) {
    event.preventDefault();
    localStorage.removeItem('user_data');
    localStorage.removeItem('role');
    localStorage.removeItem('login');
    navigate('/');
    window.location.reload();
  }

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="/QM.png" alt="Logo" className="logo" />
      </div>

      <div className="nav-section">
        <span className="nav-section-label">MAIN MENU</span>
        
        {/* Dashboard Button */}
        <button
          className={`sidebar-button ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <Home size={20} className="sidebar-icon" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="divider" />

      <div className="nav-section">
        <span className="nav-section-label">SETTINGS</span>
        
        {/* About Us Button */}
        <button
          className={`sidebar-button ${location.pathname === '/about-us' ? 'active' : ''}`}
          onClick={() => navigate('/about-us')}
        >
          <Info size={20} className="sidebar-icon" />
          <span>About Us</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-button logout-button" onClick={doLogout}>
          <LogOut size={20} className="sidebar-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
