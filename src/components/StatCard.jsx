import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function StatCard({
  icon,
  value,
  label,
  color = 'purple',
  trend,
  trendValue,
}) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-glow"></div>

      <div className="stat-header">
        <div className={`stat-icon stat-icon-${color}`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        {trend && (
          <span className={`stat-trend ${trend === 'up' ? 'up' : 'down'}`}>
            {trend === 'up' ? '▲' : '▼'} {trendValue}
          </span>
        )}
      </div>

      <div className="stat-body">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>

      <div className="stat-footer-bar"></div>
    </div>
  );
}