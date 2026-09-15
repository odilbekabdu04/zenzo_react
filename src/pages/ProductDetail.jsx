import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCartShopping,
  faStar,
  faTruckFast,
  faCreditCard,
  faCircleCheck,
  faShield,
  faRotateLeft,
  faMinus,
  faPlus,
  faFire,
  faWandMagicSparkles,
  faJar,
  faCookieBite,
  faSeedling,
  faBox,
  faCheck,
  faUser,
  faLocationDot,
  faPercent,
  faHeart,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/product-detail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToCart, cartCount, cart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  // Sahifa almashganda tepaga scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/rest/${id}/`);
      setProduct(res.data);

      // O'xshash mahsulotlar
      try {
        const allRes = await API.get('/rest/');
        const data = allRes.data.results || allRes.data;
        const filtered = (Array.isArray(data) ? data : [])
          .filter(
            (p) =>
              p.id !== parseInt(id) &&
              p.kategoriya === res.data.kategoriya
          )
          .slice(0, 4);
        setRelated(filtered);
      } catch (e) {
        console.error('Related load error:', e);
        setRelated([]);
      }
    } catch (err) {
      console.error('Product load error:', err);
      setError('Mahsulot topilmadi');
      setTimeout(() => navigate('/market'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/cart'), 500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleWishlist = () => {
    setWishlist(!wishlist);
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    const num = Number(price);
    if (isNaN(num)) return '0';
    return num.toLocaleString('uz-UZ');
  };

  const getCategoryIcon = (kategoriya) => {
    switch (kategoriya) {
      case 'asal':
        return faJar;
      case 'meva':
        return faCookieBite;
      case 'yongoq':
        return faSeedling;
      default:
        return faBox;
    }
  };

  const getCategoryName = (kategoriya) => {
    switch (kategoriya) {
      case 'asal':
        return 'Mahalliy asal';
      case 'meva':
        return 'Quritilgan meva';
      case 'yongoq':
        return "Yong'oq";
      default:
        return 'Boshqa';
    }
  };

  const renderStars = (rating) => {
    const r = parseFloat(rating) || 0;
    const full = Math.floor(r);
    const half = r - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <span className="stars-wrapper">
        {[...Array(full)].map((_, i) => (
          <FontAwesomeIcon key={`f-${i}`} icon={faStar} className="star-full" />
        ))}
        {half && <FontAwesomeIcon icon={faStar} className="star-half" />}
        {[...Array(empty)].map((_, i) => (
          <FontAwesomeIcon key={`e-${i}`} icon={faStar} className="star-empty" />
        ))}
      </span>
    );
  };

  // ═══ YUKLANMOQDA ═══
  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  // ═══ XATO ═══
  if (error || !product) {
    return (
      <div className="detail-loading">
        <FontAwesomeIcon
          icon={faBox}
          style={{ fontSize: 80, color: '#5ac5d4', opacity: 0.3 }}
        />
        <p>{error || 'Mahsulot topilmadi'}</p>
        <Link
          to="/market"
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #4a9aae, #5ac5d4)',
            color: '#0a1418',
            borderRadius: 12,
            fontWeight: 800,
            textDecoration: 'none',
            marginTop: 20,
          }}
        >
          Marketga qaytish
        </Link>
      </div>
    );
  }

  // ═══ ASOSIY SAHIFA ═══
  return (
    <div className="detail-page">
      {/* ═══ HEADER ═══ */}
      <header className="market-header">
        <button className="back-btn" onClick={() => navigate('/market')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Orqaga</span>
        </button>

        <Link to="/market" className="detail-logo">
          <div className="logo-mini">Z</div>
          <h2>Zenzo Market</h2>
        </Link>

        <div className="detail-actions">
          <Link to="/cart" className="cart-badge">
            <FontAwesomeIcon icon={faCartShopping} />
            <span className="cart-text">Savat</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <div className="user-avatar-mini" onClick={handleLogout}>
            {(user?.username || 'U').charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* ═══ CONTENT ═══ */}
      <div className="detail-container">
        {/* ═══ CHAP — RASM ═══ */}
        <div className="detail-image-section">
          <div className="detail-image-main">
            {product.image_url ? (
              <img src={product.image_url} alt={product.nomi} />
            ) : (
              <div className="detail-placeholder">
                <FontAwesomeIcon icon={getCategoryIcon(product.kategoriya)} />
              </div>
            )}

            {/* Badge */}
            <div className="detail-badge">
              {parseFloat(product.yulduzi) >= 4.8 ? (
                <span className="badge-top">
                  <FontAwesomeIcon icon={faFire} /> TOP
                </span>
              ) : (
                <span className="badge-new">
                  <FontAwesomeIcon icon={faWandMagicSparkles} /> YANGI
                </span>
              )}
            </div>

            {/* Wishlist tugmasi */}
            <button
              className={`detail-wishlist-btn ${wishlist ? 'active' : ''}`}
              onClick={handleWishlist}
              title="Sevimlilarga qo'shish"
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>

            {/* Share tugmasi */}
            <button className="detail-share-btn" title="Ulashish">
              <FontAwesomeIcon icon={faShare} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <FontAwesomeIcon icon={faCircleCheck} />
              <span>Sertifikatlangan</span>
            </div>
            <div className="trust-badge">
              <FontAwesomeIcon icon={faShield} />
              <span>Xavfsiz to'lov</span>
            </div>
            <div className="trust-badge">
              <FontAwesomeIcon icon={faRotateLeft} />
              <span>14 kun qaytarish</span>
            </div>
          </div>
        </div>

        {/* ═══ O'NG — MA'LUMOT ═══ */}
        <div className="detail-info-section">
          <div className="detail-category">
            <FontAwesomeIcon icon={getCategoryIcon(product.kategoriya)} />
            <span>{product.kategoriya_nomi || getCategoryName(product.kategoriya)}</span>
          </div>

          <h1 className="detail-title">{product.nomi}</h1>

          {/* Reyting */}
          <div className="detail-rating">
            {renderStars(product.yulduzi)}
            <span className="rating-value">{product.yulduzi || '5.0'}</span>
            <span className="rating-reviews">(127 sharh)</span>
          </div>

          {/* Tavsif */}
          {product.korishi && (
            <p className="detail-description">{product.korishi}</p>
          )}

          {/* Fermer ma'lumotlari */}
          {product.fermer_ismi && (
            <div className="detail-farmer">
              <div className="farmer-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div>
                <b>{product.fermer_ismi}</b>
                {product.fermer_manzil && (
                  <p>
                    <FontAwesomeIcon icon={faLocationDot} />{' '}
                    {product.fermer_manzil}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Narx */}
          <div className="detail-price-box">
            <div className="detail-price">
              <span className="price-value">
                {formatPrice(product.puli)} <small>so'm</small>
              </span>

              {/* Chegirma */}
              {product.eski_narx && (
                <div className="detail-old-price">
                  <span className="old-price-value">
                    {formatPrice(product.eski_narx)} so'm
                  </span>
                  {product.chegirma_foiz > 0 && (
                    <span className="discount-badge">
                      <FontAwesomeIcon icon={faPercent} /> -{product.chegirma_foiz}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bo'lib to'lash */}
            {product.oyiga && product.qancha && (
              <div className="installment-block">
                <FontAwesomeIcon icon={faCreditCard} />
                <span>
                  <b>{formatPrice(product.oyiga)} so'm/oy</b> × {product.qancha} oy
                  — bo'lib to'lash
                </span>
              </div>
            )}
          </div>

          {/* Xususiyatlar */}
          <div className="detail-features">
            <div className="detail-feature">
              <FontAwesomeIcon icon={faTruckFast} />
              <div>
                <b>Tez yetkazish</b>
                <p>{product.yetkazish_kun || '2'} kun ichida</p>
              </div>
            </div>
            <div className="detail-feature">
              <FontAwesomeIcon icon={faCircleCheck} />
              <div>
                <b>100% tabiiy</b>
                <p>Fermerlardan</p>
              </div>
            </div>
          </div>

          {/* Miqdor */}
          <div className="quantity-section">
            <label>Miqdor:</label>
            <div className="quantity-control">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                type="button"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                type="button"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>

          {/* Tugmalar */}
          <div className="detail-buttons">
            <button
              className={`btn-add-cart ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              type="button"
            >
              {added ? (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  Qo'shildi!
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCartShopping} />
                  Savatga qo'shish
                </>
              )}
            </button>

            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              type="button"
            >
              Hozir sotib olish
            </button>
          </div>
        </div>
      </div>

      {/* ═══ O'XSHASH MAHSULOTLAR ═══ */}
      {related.length > 0 && (
        <section className="related-section">
          <h2>O'xshash mahsulotlar</h2>
          <div className="related-grid">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="related-card"
              >
                <div className="related-image">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.nomi} />
                  ) : (
                    <FontAwesomeIcon
                      icon={getCategoryIcon(p.kategoriya)}
                      style={{ fontSize: 60, opacity: 0.3 }}
                    />
                  )}
                </div>
                <h4>{p.nomi}</h4>
                <div className="related-price">
                  {formatPrice(p.puli)} so'm
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer className="market-footer">
        <p>&copy; {new Date().getFullYear()} Zenzo Market. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}