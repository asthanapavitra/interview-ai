import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../style/navbar.scss'
import { useAuth } from "../../auth/hooks/useAuth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // NEW
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const goTo = (path) => {
    navigate(path);
    setMobileNavOpen(false); // NEW — closes mobile menu on navigation
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => goTo("/")}>
        <span className="brand-mark">I</span>
        <span className="brand-name">
          Interview<span className="accent">ly</span>
        </span>
      </div>

      {/* Desktop links */}
      <div className="navbar-links">
        <button className="nav-link" onClick={() => goTo("/dashboard")}>
          Dashboard
        </button>
        <button className="nav-link" onClick={() => goTo("/")}>
          New Interview
        </button>
      </div>

      <div className="navbar-right">
        {/* NEW — hamburger, mobile only */}
        <button
          className={`hamburger-btn ${mobileNavOpen ? "open" : ""}`}
          onClick={() => setMobileNavOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="navbar-profile" ref={menuRef}>
          <button
            className="avatar-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Profile" className="avatar-img" />
            ) : (
              <span className="avatar-initials">{initials}</span>
            )}
          </button>

          {menuOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-name">{user?.name || "Guest"}</span>
                <span className="dropdown-email">{user?.email}</span>
              </div>

              <button
                className="dropdown-item"
                onClick={() => {
                  goTo("/my-profile");
                  setMenuOpen(false);
                }}
              >
                View Profile
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  goTo("/dashboard");
                  setMenuOpen(false);
                }}
              >
                My Reports
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item logout"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* NEW — Mobile slide-down nav */}
      {mobileNavOpen && (
        <div className="mobile-nav">
          <button className="nav-link" onClick={() => goTo("/dashboard")}>
            Dashboard
          </button>
          <button className="nav-link" onClick={() => goTo("/")}>
            New Interview
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;