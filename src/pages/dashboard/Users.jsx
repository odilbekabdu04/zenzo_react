import { useDashboard } from '../Dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faSearch,
  faPen,
  faBan,
  faTrash,
  faUserPlus,
  faCheckCircle,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';

export default function Users() {
  const {
    users,
    loading,
    search,
    setSearch,
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

  return (
    <div className="page-users">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div>
            <h1>Foydalanuvchilar</h1>
            <p>{users.length} ta foydalanuvchi</p>
          </div>
        </div>
        <button className="btn-add" onClick={openAdd}>
          <FontAwesomeIcon icon={faUserPlus} />
          Yangi qo'shish
        </button>
      </div>

      {/* Qidiruv */}
      <div className="page-search">
        <FontAwesomeIcon icon={faSearch} className="page-search-icon" />
        <input
          type="text"
          placeholder="Ism yoki email bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: 60 }}>ID</th>
                <th>Foydalanuvchi</th>
                <th>Email</th>
                <th>Username</th>
                <th style={{ width: 130 }}>Holat</th>
                <th style={{ width: 200 }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="table-loading">
                    <div className="table-spinner"></div>
                    <p>Yuklanmoqda...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty">
                    <FontAwesomeIcon icon={faSearch} />
                    <p>Foydalanuvchi topilmadi</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
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
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="user-email">{u.email || '—'}</span>
                    </td>
                    <td>
                      <span className="user-email">@{u.username || 'user'}</span>
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
    </div>
  );
}