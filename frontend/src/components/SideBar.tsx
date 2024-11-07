import '../styles/SideBar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  // Define the doLogout function inside Sidebar
  function doLogout(event: { preventDefault: () => void; }) {
    event.preventDefault();

    // Clear user data from local storage
    localStorage.removeItem('user_data');

    // Redirect to login page
    navigate('/'); // Redirects to the login page

  }

 
  return (
    <aside className="sidebar">
      {/* Logo at the top */}
      <div className="logo-container">
        <img src="/QM.png" alt="Logo" className="logo" />
      </div>

      {/* Account Icon */}
      <div className="icon-container">
        <span className="account-icon"> </span>

      </div>

      <nav className="nav-links">
        <button className="sidebar-button" onClick={doLogout}>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAURJREFUaEPtWVsSwiAMTG+mJ1NPpjfTZqY4QHk0NNCuhi9nCiG7CckiE4GPCdx/MgBHR9Ai8GsRuBDRbQHFv7XGYzZ0TxnTTqG3lscZO1cievnfNAEwQ479XjjYeQbxHZoAerPPTg8FoEVOTExgV2sTZqe40Y6cMgBbybMIZJiyFEoRwzU/7owwKfSc6zHLhLiCnR4AO83Ou6FZgkuFQuUMpGQCDICcxoEA4PJ9hJLNpVFTCsX5vrWZtcyrRVIMYIQsliji/wPA7ECnkB9e2EPsg4Auow4IdCNzIKClROpcwIm5+FzAyummlt/Sopc14kbWutfp7wM1YAbALvW1HKl8h0+hkm7ayU2wvNt/oyMArB46archCXMjJPjKX00AJeEnISKe615kmP3gdYYn9gCwx1nxWgMgpkx5gUVAmVCxOfgIfADpwksx2DfxmAAAAABJRU5ErkJggg=="/> Logout
        </button>
      </nav>

      {/* Divider line */}
      <div className="divider"></div>

      <div className="about-us">
        <button className="sidebar-button">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAg5JREFUaEPtmA1OwzAMhbOTAScDTgacDPZQjSLLjp+djqzQSJMqNU3e5784u7SDj8vB9bcTYLUHTw/8Vw+8XMHxmx4rQgjCn1trr3tAzAI8ttbwe9hMiWcIw7AsLOLF8tMQMwBajBUOWuCnMWkKogrAiLes7H33dPXkeyUhKgAZ8SwExAMiPSoAOgywucQ9nhkrW3NKXsgCWBt7a7xtCe4lrDbEEoBRAqIiAUKGDhMNWAqjrAe01UbfRwDReyofsgDaapHbR8C7nAm3BIgERu9v4gG96ShutfV1viwB0HGrKwzeY6DXkWeZo729pApJjwOBmRFZH2tlw/l7/9JHg8OK6Yess6TcD1UBWE8wlsdaSwDE2tI2I6ykIfvYnvsGjemh0iAzHsjkgAXrfZ+C+G2AXjQ8gouQrlaYQ7cVWYC+TGIja/NeJIQgnCRnLKt7oUV5ggWAUKu2Z8NoJEq3KVg7alWoMuodXlnx/XwPJN2hRh5gKkcVxIKwjDX0wgjAEy9xLSVydJftS6wFaonL9FvDENr7HwTmqimQdJ/keWDX474zvbWuVTKj6+jPkh5A1ApX495rQXQo0bc1CyBzca+CRDc7K5lNYzMA1IGSJGESlbp/WwB0/CVF99PpEIn2sAAo8mjh4D0dItE+qwCgaxdD/UmAyGt39T7qhe5KrCXmBFjtotMDpwcmLXD4EPoC5hKTMRYz8GoAAAAASUVORK5CYII="/> About Us
        </button>
      </div>
    </aside>
  );
};



export default Sidebar;
