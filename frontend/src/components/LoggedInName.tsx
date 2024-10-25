import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function LoggedInName() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [userName, setUserName] = useState(""); // State for storing user name

  // Fetch user data when the component mounts
  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(`${user.firstName} ${user.lastName}`); // Set the user name
    }
  }, []);

  function doLogout(event: any): void {
    event.preventDefault();
    
    // Clear user data
    localStorage.removeItem("user_data"); // Adjust the key to what you're using

    // Redirect to login page
    navigate("/"); // Assuming this is the path to your login page
    
    alert("Logged out successfully");
  }

  return (
    <div id="loggedInDiv">
      <span id="userName">Logged In As {userName} </span> {/* Display dynamic user name */}
      <br />
      <button
        type="button"
        id="logoutButton"
        className="buttons"
        onClick={doLogout}
      >
        Log Out
      </button>
    </div>
  );
}

export default LoggedInName;
