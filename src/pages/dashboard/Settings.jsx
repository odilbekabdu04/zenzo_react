import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faUser,
  faBell,
  faLock,
  faPalette,
  faSave,
} from '@fortawesome/free-solid-svg-icons';

export default function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    alert('✅ Sozlamalar saqlandi!');
  };

  return (
    <div className="page-settings">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">
            <FontAwesomeIcon icon={faCog} />
          </div>
          <div>
            <h1>Sozlamalar</h1>
            <p>Tizim sozlamalari</p>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        {/* Profil */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FontAwesomeIcon icon={faUser} />
            <h3>Profil ma'lumotlari</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-field">
              <label>Username</label>
              <input type="text" value={user?.username || ''} readOnly />
            </div>
            <div className="settings-field">
              <label>Email</label>
              <input type="email" value={user?.email || ''} readOnly />
            </div>
            <div className="settings-field">
              <label>To'liq ism</label>
              <input type="text" value={user?.fullname || ''} readOnly />
            </div>
          </div>
        </div>

        {/* Bildirishnomalar */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FontAwesomeIcon icon={faBell} />
            <h3>Bildirishnomalar</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-toggle">
              <div>
                <b>Email bildirishnomalar</b>
                <p>Yangi buyurtmalar haqida xabar</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="settings-toggle">
              <div>
                <b>Dark mode</b>
                <p>Qorong'u rejim</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Xavfsizlik */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FontAwesomeIcon icon={faLock} />
            <h3>Xavfsizlik</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-field">
              <label>Joriy parol</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="settings-field">
              <label>Yangi parol</label>
              <input type="password" placeholder="••••••••" />
            </div>
          </div>
        </div>

        {/* Dizayn */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FontAwesomeIcon icon={faPalette} />
            <h3>Dizayn</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-field">
              <label>Til</label>
              <select>
                <option>O'zbekcha</option>
                <option>English</option>
                <option>Русский</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <button className="btn-save-settings" onClick={handleSave}>
        <FontAwesomeIcon icon={faSave} /> Saqlash
      </button>
    </div>
  );
}