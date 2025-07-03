import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <nav className="footer-links">
          <Link to="/" className="footer-link">
            Home
          </Link>
          <span className="footer-sep">|</span>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
          <span className="footer-sep">|</span>
          <Link to="/about" className="footer-link">
            About
          </Link>
        </nav>
        <div className="mt-2">© 2025 Codemy</div>
      </div>
    </footer>
  );
}

export default Footer;
