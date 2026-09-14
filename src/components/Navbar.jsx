import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faBell,
  faBars,
  faEnvelope,
  faCircleDot,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ onMenuClick, search, setSearch }) {
  const { user } = useAuth();
  const initial = (user?.fullname || user?.username || 'A')
    .charAt(0)
    .toUpperCase();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div>
          <h1>Admin Dashboard</h1>
          <p className="navbar-subtitle">Zenzo Market boshqaruv paneli</p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon-fa" />
          <input
            type="text"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="navbar-icon-btn" title="Xabarlar">
          <FontAwesomeIcon icon={faEnvelope} />
          <span className="navbar-dot"></span>
        </button>

        <button className="navbar-icon-btn" title="Bildirishnomalar">
          <FontAwesomeIcon icon={faBell} />
          <span className="navbar-dot"></span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            {initial}
            <span className="avatar-status">
              <FontAwesomeIcon icon={faCircleDot} />
            </span>
          </div>
          <div className="user-info">
            <h4>{user?.fullname || user?.username}</h4>
            <p>Super Admin</p>
          </div>
        </div>
      </div>
    </nav>
  );
}