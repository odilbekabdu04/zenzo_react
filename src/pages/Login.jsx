import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard/overview');
    } catch (err) {
      const data = err && err.response ? err.response.data : {};
      const msg = data.error || data.detail || "Username yoki parol noto'g'ri!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo-circle">Z</div>
          <h2>Tizimga kirish</h2>
          <p>Zenzo Market'ga kirish</p>
        </div>

        <div className="auth-body">
          {error && <div className="error-msg show">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username kiriting"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label>Parol</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolingizni kiriting"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Kirish...' : 'KIRISH'}
            </button>
          </form>

          <div className="auth-footer">
            Akkauntingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
          </div>
        </div>
      </div>
    </div>
  );
}