import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faLeaf,
  faCode,
  faCircleCheck,
  faShield,
  faBolt,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-content">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">Z</div>
          <div>
            <h4>Zenzo Market</h4>
            <p>
              <FontAwesomeIcon icon={faLeaf} /> Fermerlardan to'g'ridan-to'g'ri
            </p>
          </div>
        </div>

        {/* Center - badges */}
        <div className="footer-badges">
          <span className="footer-badge">
            <FontAwesomeIcon icon={faCircleCheck} /> Ishlab turibdi
          </span>
          <span className="footer-badge">
            <FontAwesomeIcon icon={faShield} /> Xavfsiz
          </span>
          <span className="footer-badge">
            <FontAwesomeIcon icon={faBolt} /> Tez
          </span>
        </div>

        {/* Right - copyright + scroll top */}
        <div className="footer-right">
          <div className="footer-copyright">
            <p>
              &copy; {new Date().getFullYear()} <b>Zenzo Market</b>
            </p>
            <p>
              <FontAwesomeIcon icon={faCode} /> Bilan qurilgan{' '}
              <FontAwesomeIcon icon={faHeart} style={{ color: '#ef4444' }} />
            </p>
          </div>
          <button
            className="footer-scroll-top"
            onClick={scrollToTop}
            title="Yuqoriga"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
    </footer>
  );
}