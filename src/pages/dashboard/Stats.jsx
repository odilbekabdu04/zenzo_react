import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faBox,
  faShoppingBag,
  faDollarSign,
  faArrowUp,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/stats/');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="table-loading">
        <div className="table-spinner"></div>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  const cards = [
    {
      icon: faUsers,
      label: 'Foydalanuvchilar',
      value: stats?.total_users || 0,
      color: 'purple',
      trend: '+12%',
      up: true,
    },
    {
      icon: faBox,
      label: 'Mahsulotlar',
      value: stats?.total_products || 0,
      color: 'green',
      trend: '+8%',
      up: true,
    },
    {
      icon: faShoppingBag,
      label: 'Sotilgan',
      value: stats?.sold_products || 0,
      color: 'orange',
      trend: '+24%',
      up: true,
    },
    {
      icon: faDollarSign,
      label: 'Daromad',
      value: Number(stats?.total_revenue || 0).toLocaleString() + " so'm",
      color: 'red',
      trend: '-3%',
      up: false,
    },
  ];

  return (
    <div className="page-stats">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div>
            <h1>Statistika</h1>
            <p>Umumiy ko'rsatkichlar</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((c, i) => (
          <div key={i} className={`stat-card stat-card-${c.color}`}>
            <div className="stat-header">
              <div className={`stat-icon stat-icon-${c.color}`}>
                <FontAwesomeIcon icon={c.icon} />
              </div>
              <span className={`stat-trend ${c.up ? 'up' : 'down'}`}>
                <FontAwesomeIcon icon={c.up ? faArrowUp : faArrowDown} />
                {c.trend}
              </span>
            </div>
            <div className="stat-body">
              <h3>{c.value}</h3>
              <p>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-chart-placeholder">
        <FontAwesomeIcon icon={faChartLine} style={{ fontSize: 60, color: '#cbd5e1' }} />
        <h3>Grafik tez orada</h3>
        <p>Sotuv va foydalanuvchilar dinamikasi</p>
      </div>
    </div>
  );
}