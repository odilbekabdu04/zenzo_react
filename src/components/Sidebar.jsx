import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faBox,
  faShoppingBag,
  faChartBar,
  faCog,
  faSignOutAlt,
  faLeaf,
} from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard/overview', icon: faChartLine, label: 'Dashboard' },
    { path: '/dashboard/users', icon: faUsers, label: 'Foydalanuvchilar' },
    { path: '/dashboard/products', icon: faBox, label: 'Mahsulotlar' },
    { path: '/dashboard/orders', icon: faShoppingBag, label: 'Buyurtmalar' },
    { path: '/dashboard/stats', icon: faChartBar, label: 'Statistika' },
    { path: '/dashboard/settings', icon: faCog, label: 'Sozlamalar' },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">Z</div>
          <div className="logo-text">
            <h2>Zenzo</h2>
            <span>Market Admin</span>
          </div>
        </div>

        <div className="sidebar-section-title">Asosiy</div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={() => isOpen && onClose()}
              >
                <span className="sidebar-icon">
                  <FontAwesomeIcon icon={item.icon} />
                </span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="sidebar-promo">
            <div className="promo-icon">
              <FontAwesomeIcon icon={faLeaf} />
            </div>
            <h4>Fermerlarni qo'llash</h4>
            <p>Har bir xarid fermerga yordam</p>
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
    </>
  );
}