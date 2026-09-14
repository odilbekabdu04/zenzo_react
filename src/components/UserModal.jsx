import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faTimes,
  faSave,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

export default function UserModal({ isOpen, onClose, onSave, user }) {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        fullname: user.fullname || '',
        email: user.email || '',
        password: '',
      });
    } else {
      setForm({
        fullname: '',
        email: '',
        password: '',
      });
    }
    setError('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validatsiya
    if (!form.fullname.trim()) {
      setError("To'liq ismni kiriting!");
      return;
    }
    if (!form.email.trim()) {
      setError("Emailni kiriting!");
      return;
    }
    if (!user && !form.password.trim()) {
      setError("Parolni kiriting!");
      return;
    }
    if (!user && form.password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
      // Modal yopiladi (onSave ichida)
    } catch (err) {
      const msg = err?.response?.data?.error
        || err?.response?.data?.email?.[0]
        || err?.response?.data?.password?.[0]
        || err?.response?.data?.fullname?.[0]
        || "Xatolik yuz berdi!";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3>
              {user ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}
            </h3>
            <p className="modal-subtitle">
              {user ? `ID: #${user.id}` : "Barcha maydonlarni to'ldiring"}
            </p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(255, 107, 107, 0.15)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: '#ff8787',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faUser} /> To'liq ism
            </label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Ism Familiya"
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faEnvelope} /> Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              autoComplete="off"
              required
            />
          </div>

          {!user && (
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faLock} /> Parol
              </label>
              <input
                type="text"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Kamida 6 ta belgi"
                minLength="6"
                autoComplete="off"
                required
              />
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={saving}
            >
              {saving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Saqlanmoqda...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} /> Saqlash
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}