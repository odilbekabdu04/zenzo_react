import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Register() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirm_password) {
      setError('Parollar mos kelmadi!');
      return;
    }

    if (form.password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!');
      return;
    }

    setLoading(true);

    try {
      await register(form);
      setSuccess('Muvaffaqiyatli! Login sahifasiga o\'tilmoqda...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const firstKey = Object.keys(errors)[0];
        const firstError = errors[firstKey];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Xatolik yuz berdi!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo-circle">Z</div>
          <h2>Ro'yxatdan o'tish</h2>
          <p>Zenzo Market'ga xush kelibsiz</p>     
        </div>

        <div className="auth-body">
          {error && <div className="error-msg show">{error}</div>}
          {success && <div className="success-msg show">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>To'liq ism</label>
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="Ismingizni kiriting"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Parol</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Kamida 6 ta belgi"
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Parolni tasdiqlash</label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Parolni qayta kiriting"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Yuborilmoqda...' : 'Ro\'yxatdan o\'tish'}
            </button>
          </form>

          <div className="auth-footer">
            Akkauntingiz bormi? <Link to="/login">Kirish</Link>
          </div>
        </div>
      </div>
    </div>
  );
}