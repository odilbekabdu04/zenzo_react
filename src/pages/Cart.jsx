import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faTrash,
  faMinus,
  faPlus,
  faCartShopping,
  faTruckFast,
  faCreditCard,
  faCircleCheck,
  faArrowRight,
  faBox,
  faJar,
  faCookieBite,
  faSeedling,
  faLocationDot,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const formatPrice = (price) => {
    if (!price) return '0';
    return Number(price).toLocaleString('uz-UZ');
  };

  const getCategoryIcon = (kategoriya) => {
    switch (kategoriya) {
      case 'asal': return faJar;
      case 'meva': return faCookieBite;
      case 'yongoq': return faSeedling;
      default: return faBox;
    }
  };

  const deliveryFee = cartTotal > 0 ? 20000 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleOrder = () => {
    if (cart.length === 0) return;
    if (!address.trim() || !phone.trim()) {
      alert("Iltimos, manzil va telefon raqamni kiriting!");
      return;
    }
    setOrderPlaced(true);
    clearCart();
    setTimeout(() => {
      navigate('/market');
    }, 4000);
  };

  if (orderPlaced) {
    return (
      <div className="cart-success">
        <div className="success-icon">
          <FontAwesomeIcon icon={faCircleCheck} />
        </div>
        <h1>Buyurtmangiz qabul qilindi!</h1>
        <p>Tez orada operatorlarimiz siz bilan bog'lanadi</p>
        <div className="success-info">
          <div className="success-item">
            <FontAwesomeIcon icon={faTruckFast} />
            <span>2-3 kun ichida yetkazib beriladi</span>
          </div>
          <div className="success-item">
            <FontAwesomeIcon icon={faCreditCard} />
            <span>To'lov yetkazib berishda</span>
          </div>
          <div className="success-item">
            <FontAwesomeIcon icon={faPhone} />
            <span>Telefon: {phone}</span>
          </div>
        </div>
        <Link to="/market" className="btn-back-market">
          <FontAwesomeIcon icon={faArrowLeft} /> Marketga qaytish
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <header className="cart-header">
          <button className="back-btn" onClick={() => navigate('/market')}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Orqaga</span>
          </button>
          <h1>Savat</h1>
          <div style={{ width: 100 }}></div>
        </header>

        <div className="cart-empty">
          <FontAwesomeIcon icon={faCartShopping} className="empty-icon" />
          <h2>Savat bo'sh</h2>
          <p>Mahsulotlarni tanlab, savatga qo'shing</p>
          <Link to="/market" className="btn-go-market">
            <FontAwesomeIcon icon={faCartShopping} />
            Xarid qilishni boshlash
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
        <button className="back-btn" onClick={() => navigate('/market')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Orqaga</span>
        </button>
        <h1>Savat ({cart.length})</h1>
        <button className="clear-btn" onClick={clearCart}>
          <FontAwesomeIcon icon={faTrash} /> Tozalash
        </button>
      </header>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <Link to={`/product/${item.id}`} className="cart-item-image">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.nomi} />
                ) : (
                  <FontAwesomeIcon
                    icon={getCategoryIcon(item.kategoriya)}
                    style={{ fontSize: 40, opacity: 0.4 }}
                  />
                )}
              </Link>

              <div className="cart-item-info">
                <Link to={`/product/${item.id}`}>
                  <h3>{item.nomi}</h3>
                </Link>
                <div className="cart-item-category">
                  {item.kategoriya_nomi || item.kategoriya}
                </div>
                <div className="cart-item-price-unit">
                  {formatPrice(item.puli)} so'm / dona
                </div>
              </div>

              <div className="cart-item-controls">
                <div className="quantity-control-small">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, (item.quantity || 1) - 1)
                    }
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, (item.quantity || 1) + 1)
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className="cart-item-total">
                  {formatPrice(Number(item.puli) * (item.quantity || 1))}{' '}
                  <small>so'm</small>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Buyurtma xulosasi</h2>

          <div className="summary-row">
            <span>Mahsulotlar ({cart.length}):</span>
            <b>{formatPrice(cartTotal)} so'm</b>
          </div>

          <div className="summary-row">
            <span>
              <FontAwesomeIcon icon={faTruckFast} /> Yetkazib berish:
            </span>
            <b>{formatPrice(deliveryFee)} so'm</b>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Jami:</span>
            <b>{formatPrice(grandTotal)} so'm</b>
          </div>

          <div className="cart-form-group">
            <label>
              <FontAwesomeIcon icon={faLocationDot} /> Manzil
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Toshkent, Chilonzor..."
            />
          </div>

          <div className="cart-form-group">
            <label>
              <FontAwesomeIcon icon={faPhone} /> Telefon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
            />
          </div>

          <button className="btn-order" onClick={handleOrder}>
            <span className="btn-shine"></span>
            Buyurtma berish
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          <div className="payment-methods">
            <div className="payment-title">To'lov usullari:</div>
            <div className="payment-icons">
              <span>💳 Karta</span>
              <span>💰 Naqd</span>
              <span>📱 Click</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}