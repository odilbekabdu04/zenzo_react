import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
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
      const data = await login(email, password);

      // ✅ Rolga qarab yo'naltirish
      if (data.role === 'admin') {
        navigate('/dashboard');   // Admin panel
      } else {
        navigate('/market');       // Onlayn do'kon
      }
    } catch (err) {
      const data = err && err.response ? err.response.data : {};
      const msg = data.error || data.detail || "Email yoki parol noto'g'ri!";
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
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
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
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Kirish...' : 'Kirish'}
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