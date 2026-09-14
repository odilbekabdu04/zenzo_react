import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserModal from '../components/UserModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faBox,
  faShoppingBag,
  faDollarSign,
  faPlus,
  faPen,
  faBan,
  faTrash,
  faCheckCircle,
  faCircleXmark,
  faSearch,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import StatCard from '../components/StatCard';
import '../styles/dashboard.css';

// ============================================
// CONTEXT — Dashboard ma'lumotlari uchun
// ============================================
export const DashboardContext = createContext();
export const useDashboard = () => useContext(DashboardContext);

export default function Dashboard() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    sold_products: 0,
    total_revenue: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        API.get('/users/'),
        API.get('/stats/'),
      ]);
      const usersData = usersRes.data.results || usersRes.data;
      setUsers(Array.isArray(usersData) ? usersData : []);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Load error:', err);
      showToast("Ma'lumotlarni yuklashda xatolik!", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Boshlang'ich sahifa — /dashboard/overview
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      navigate('/dashboard/overview', { replace: true });
    }
  }, [location, navigate]);

  const handleDelete = async (id) => {
    const u = users.find((x) => x.id === id);
    if (u && currentUser && u.id === currentUser.id) {
      showToast("O'zingizni o'chira olmaysiz!", 'error');
      return;
    }
    if (!window.confirm(`"${u?.fullname || u?.username}" ni o'chirishni tasdiqlaysizmi?`))
      return;

    try {
      await API.delete(`/users/${id}/`);
      showToast("Foydalanuvchi o'chirildi", 'success');
      loadData();
    } catch (err) {
      showToast('Xatolik!', 'error');
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await API.post(`/users/${id}/block/`);
      showToast("Holat o'zgartirildi", 'success');
      loadData();
    } catch (err) {
      const data = err && err.response ? err.response.data : {};
      showToast(data.error || 'Xatolik!', 'error');
    }
  };

 const handleSave = async (form) => {
  try {
    if (editingUser) {
      // Tahrirlash
      await API.put(`/users/${editingUser.id}/`, form);
      showToast('Yangilandi!', 'success');
    } else {
      // Yangi qo'shish
      await API.post('/users/', form);
      showToast("Qo'shildi!", 'success');
    }
    
    // ✅ Modal yopish
    setModalOpen(false);
    setEditingUser(null);
    
    // ✅ Ro'yxatni yangilash
    loadData();
  } catch (err) {
    console.error('Save error:', err);
    
    // ✅ Xatoni ko'rsatish
    const errors = err?.response?.data;
    let msg = 'Xatolik!';
    if (errors) {
      if (typeof errors === 'string') {
        msg = errors;
      } else if (errors.error) {
        msg = errors.error;
      } else {
        const firstKey = Object.keys(errors)[0];
        const firstError = errors[firstKey];
        msg = Array.isArray(firstError) ? firstError[0] : firstError;
      }
    }
    
    // ✅ Xatoni qaytarish (modal ushlab qoladi)
    throw new Error(msg);
  }
};

  const openEdit = (u) => {
    setEditingUser(u);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  // Context value
  const contextValue = {
    users,
    stats,
    loading,
    search,
    setSearch,
    openEdit,
    openAdd,
    handleDelete,
    handleToggleBlock,
    loadData,
    showToast,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="dashboard-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="main-content">
          <Navbar
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            search={search}
            setSearch={setSearch}
          />

          <div className="content">
            <Outlet />
          </div>

          <Footer />
        </div>

        <UserModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSave}
          user={editingUser}
        />

        {toast && (
          <div className={`toast show ${toast.type}`}>
            <FontAwesomeIcon
              icon={toast.type === 'success' ? faCheckCircle : faCircleXmark}
            />
            {toast.msg}
          </div>
        )}
      </div>
    </DashboardContext.Provider>
  );
}

// ============================================
// OVERVIEW — Asosiy sahifa (Dashboard home)
// ============================================
Dashboard.Overview = function Overview() {
  const { user: currentUser } = useAuth();
  const {
    users,
    stats,
    loading,
    search,
    openEdit,
    openAdd,
    handleDelete,
    handleToggleBlock,
  } = useDashboard();

  const filteredUsers = users.filter((u) => {
    const name = (u.fullname || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const activeUsers = users.filter((u) => !u.is_blocked).length;

  return (
    <>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>
            Salom,{' '}
            <span>{currentUser?.fullname || currentUser?.username || 'Admin'}</span>! 👋
          </h1>
          <p>Bugun Zenzo Market'da nima yangilik bor?</p>
        </div>
        <div className="welcome-stats">
          <div className="welcome-stat">
            <b>{activeUsers}</b>
            <span>Faol foydalanuvchi</span>
          </div>
          <div className="welcome-stat-divider"></div>
          <div className="welcome-stat">
            <b>{stats.total_products}</b>
            <span>Mahsulot</span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <StatCard
          icon={faUsers}
          value={stats.total_users}
          label="Jami foydalanuvchilar"
          color="purple"
          trend="up"
          trendValue="12%"
        />
        <StatCard
          icon={faBox}
          value={stats.total_products}
          label="Jami mahsulotlar"
          color="green"
          trend="up"
          trendValue="8%"
        />
        <StatCard
          icon={faShoppingBag}
          value={stats.sold_products}
          label="Sotilgan mahsulotlar"
          color="orange"
          trend="up"
          trendValue="24%"
        />
        <StatCard
          icon={faDollarSign}
          value={Number(stats.total_revenue).toLocaleString()}
          label="Umumiy daromad (so'm)"
          color="red"
          trend="down"
          trendValue="3%"
        />
      </div>

      {/* TABLE */}
      <div className="table-container">
        <div className="table-header">
          <div className="table-header-left">
            <div className="table-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div>
              <h2>Foydalanuvchilar ro'yxati</h2>
              <p className="table-subtitle">{filteredUsers.length} ta foydalanuvchi</p>
            </div>
          </div>
          <button className="btn-add" onClick={openAdd}>
            <FontAwesomeIcon icon={faUserPlus} />
            Yangi qo'shish
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: 60 }}>ID</th>
                <th>Foydalanuvchi</th>
                <th>Email</th>
                <th style={{ width: 130 }}>Holat</th>
                <th style={{ width: 200 }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="table-loading">
                    <div className="table-spinner"></div>
                    <p>Yuklanmoqda...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-empty">
                    <FontAwesomeIcon icon={faSearch} />
                    <p>Foydalanuvchi topilmadi</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr key={u.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <td>
                      <span className="user-id">#{u.id}</span>
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">
                          {(u.fullname || u.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="user-cell-info">
                          <b>{u.fullname || u.username}</b>
                          <span>@{u.username || 'user'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="user-email">{u.email || '—'}</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          u.is_blocked ? 'blocked' : 'active'
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={u.is_blocked ? faCircleXmark : faCheckCircle}
                        />
                        {u.is_blocked ? 'Bloklangan' : 'Faol'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => openEdit(u)}
                          title="Tahrirlash"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          className="btn-action btn-block"
                          onClick={() => handleToggleBlock(u.id)}
                          title={u.is_blocked ? 'Blokdan chiqarish' : 'Bloklash'}
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(u.id)}
                          title="O'chirish"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};