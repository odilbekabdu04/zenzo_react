import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faHourglassHalf,
  faTruckFast,
  faCircleCheck,
  faBoxOpen,
} from '@fortawesome/free-solid-svg-icons';

export default function Orders() {
  const stats = [
    { icon: faHourglassHalf, label: 'Kutilmoqda', value: 0, color: 'orange' },
    { icon: faTruckFast, label: 'Yetkazilmoqda', value: 0, color: 'purple' },
    { icon: faCircleCheck, label: 'Yetkazildi', value: 0, color: 'green' },
    { icon: faBoxOpen, label: 'Bekor qilindi', value: 0, color: 'red' },
  ];

  return (
    <div className="page-orders">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon orange">
            <FontAwesomeIcon icon={faShoppingBag} />
          </div>
          <div>
            <h1>Buyurtmalar</h1>
            <p>Barcha buyurtmalar ro'yxati</p>
          </div>
        </div>
      </div>

      <div className="orders-stats">
        {stats.map((s, i) => (
          <div key={i} className={`order-stat-card order-stat-${s.color}`}>
            <FontAwesomeIcon icon={s.icon} />
            <div>
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-empty" style={{ padding: '80px 20px' }}>
        <FontAwesomeIcon
          icon={faShoppingBag}
          style={{ fontSize: 60, color: '#cbd5e1' }}
        />
        <p style={{ marginTop: 15, fontSize: 16, fontWeight: 700 }}>
          Hozircha buyurtmalar yo'q
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 5 }}>
          Buyurtmalar shu yerda paydo bo'ladi
        </p>
      </div>
    </div>
  );
}