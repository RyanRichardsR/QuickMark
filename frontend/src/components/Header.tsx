// Header.jsx
import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import '../styles/Header.css';

const Header = () => {
  // State to store user data
  const [user, setUser] = useState({ firstName: '', lastName: '', role: '' });

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        role: parsedUser.role || '',
      });
    }
  }, []);

  //Changes the header text depending on page
  const currentTitle = location.pathname === '/about-us' ? 'About Us' : 'Dashboard';


  return (
    <header className="header">
      <div className="header-container">
        {/* Left section with title */}
        <div className="header-left">
          <h1 className="title">{currentTitle}</h1>
        </div>

        {/* Right section with user profile */}
        <div className="header-right">
          {/* User profile */}
          <div className="user-profile">
            <div className="avatar">
              <User className="avatar-icon" />
            </div>
            <div className="user-info">
              <span className="user-name">
                {user.firstName} {user.lastName}
              </span>
              <span className="user-role">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
