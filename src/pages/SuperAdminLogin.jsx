import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
  faShield,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/super-admin.css';

export default function SuperAdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // AuthContext orqali login
      await adminLogin(username, password);

      // ✅ MUVAFFAQIYAT: /dashboard ga o'tish
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const data = err && err.response ? err.response.data : {};
      const msg =
        data.error ||
        data.detail ||
        data.non_field_errors?.[0] ||
        'Xatolik yuz berdi!';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="super-admin-page">
      <div className="super-admin-container">
        <div className="super-admin-header">
          <div className="shield-icon">
            <FontAwesomeIcon icon={faShield} />
          </div>
          <h2>Super Admin</h2>
          <p>Maxfiy kirish</p>
        </div>

        <div className="super-admin-body">
          {error && (
            <div className="super-error">
              <FontAwesomeIcon icon={faShield} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="super-form-group">
              <label>
                <FontAwesomeIcon icon={faUser} /> Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="off"
                required
              />
            </div>

            <div className="super-form-group">
              <label>
                <FontAwesomeIcon icon={faLock} /> Parol
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol"
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="super-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Kirish...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faShield} /> Kirish
                </>
              )}
            </button>
          </form>

          <div className="super-footer">
            <p>⚠️ Faqat adminlar uchun</p>
          </div>
        </div>
      </div>
    </div>
  );
}