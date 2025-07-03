import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();
  return (
    <nav className="navbar orange-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo orange-logo">
          Codemy
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          {!user && (
            <Link to="/courses" className="navbar-link">
              Courses
            </Link>
          )}
          {!user && (
            <Link to="/contact" className="navbar-link">
              Contact
            </Link>
          )}
          <Link to="/login" className="navbar-link">
            Login
          </Link>
          <Link to="/register" className="navbar-link">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
