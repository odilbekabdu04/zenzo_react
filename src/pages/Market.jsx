// ═══════════════════════════════════════════════════════════════
// ZENZO MARKET — To'liq yangilangan versiya
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import logo from '../assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
    faCartShopping,
    faLeaf,
    faCircleCheck,
    faTruckFast,
    faCreditCard,
    faHandHoldingHeart,
    faStar,
    faFire,
    faWandMagicSparkles,
    faStore,
    faJar,
    faCookieBite,
    faSeedling,
    faBox,
    faArrowRight,
    faArrowLeft,
    faHeart,
    faSort,
    faBolt,
    faShield,
    faPercent,
    faAward,
    faHeadset,
    faRotateLeft,
    faChevronRight,
    faPaperPlane,
    faCamera,
    faPlay,
    faThumbsUp,
    faPhone,
    faEnvelope,
    faLocationDot,
    faUser,
    faClock,
    faCheckCircle,
    faGift,
    faMedal,
    faUsers,
    faTag,
    faHandshake,
    faGlobe,
    faChartLine,
    faBell,
    faSun,
    faMoon,
    faPlus,
    faMinus,
    faEye,
    faFilter,
    faThLarge,
    faList,
    faCrown,

    faSeedling as faSeedling2,
} from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/market.css';

export default function Market() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { cart, cartCount, addToCart: addToCartContext } = useCart();

    // ═══════════ STATE ═══════════
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('default');
    const [filterDiscount, setFilterDiscount] = useState(false);
    const [filterTop, setFilterTop] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [notifications, setNotifications] = useState(3);

    // ═══════════ EFFECTS ═══════════
    useEffect(() => {
        loadProducts();
        loadCategories();
        loadWishlist();
        loadRecentlyViewed();
    }, []);

    // Banner rotatsiyasi
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // ═══════════ LOAD FUNCTIONS ═══════════
    const loadProducts = async () => {
        try {
            const res = await API.get('/rest/');
            const data = res.data.results || res.data;
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Products load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        setCategories([
            { id: 'asal', nomi: 'Mahalliy asal', icon: faJar, count: 0 },
            { id: 'meva', nomi: 'Quritilgan meva', icon: faCookieBite, count: 0 },
            { id: 'yongoq', nomi: "Yong'oq", icon: faSeedling, count: 0 },
            { id: 'boshqa', nomi: 'Boshqa', icon: faBox, count: 0 },
        ]);
    };

    const loadWishlist = () => {
        const saved = localStorage.getItem('zenzo_wishlist');
        if (saved) {
            try {
                setWishlist(JSON.parse(saved));
            } catch (e) {
                setWishlist([]);
            }
        }
    };

    const loadRecentlyViewed = () => {
        const saved = localStorage.getItem('zenzo_recently_viewed');
        if (saved) {
            try {
                setRecentlyViewed(JSON.parse(saved));
            } catch (e) {
                setRecentlyViewed([]);
            }
        }
    };

    // ═══════════ HANDLERS ═══════════
    const toggleWishlist = (product) => {
        setWishlist((prev) => {
            const exists = prev.find((p) => p.id === product.id);
            let newList;
            if (exists) {
                newList = prev.filter((p) => p.id !== product.id);
            } else {
                newList = [...prev, product];
            }
            localStorage.setItem('zenzo_wishlist', JSON.stringify(newList));
            return newList;
        });
    };

    const isInWishlist = (id) => wishlist.some((p) => p.id === id);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAddToCart = (product) => {
        addToCartContext(product);
        showToast(`"${product.nomi}" savatga qo'shildi!`);
    };

    const showToast = (msg, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2500);
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setSearch('');
        setFilterDiscount(false);
        setFilterTop(false);
        setSortBy('default');
        setPriceRange({ min: '', max: '' });
    };

    // ═══════════ HELPERS ═══════════
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

    // ═══════════ FILTERED PRODUCTS ═══════════
    const filteredProducts = products
        .filter((p) => {
            const matchCategory =
                selectedCategory === 'all' || p.kategoriya === selectedCategory;
            const matchSearch = (p.nomi || '')
                .toLowerCase()
                .includes(search.toLowerCase());
            const matchDiscount = !filterDiscount || p.eski_narx;
            const matchTop = !filterTop || parseFloat(p.yulduzi) >= 4.8;
            const matchMinPrice =
                !priceRange.min || Number(p.puli) >= Number(priceRange.min);
            const matchMaxPrice =
                !priceRange.max || Number(p.puli) <= Number(priceRange.max);
            return (
                matchCategory &&
                matchSearch &&
                matchDiscount &&
                matchTop &&
                matchMinPrice &&
                matchMaxPrice
            );
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return Number(a.puli) - Number(b.puli);
            if (sortBy === 'price-desc') return Number(b.puli) - Number(a.puli);
            if (sortBy === 'rating')
                return parseFloat(b.yulduzi) - parseFloat(a.yulduzi);
            if (sortBy === 'name') return (a.nomi || '').localeCompare(b.nomi || '');
            return 0;
        });

    const topProducts = products
        .filter((p) => parseFloat(p.yulduzi) >= 4.5)
        .slice(0, 8);

    const discountedProducts = products
        .filter((p) => p.chegirma_foiz > 0)
        .slice(0, 6);

    const newProducts = products.slice(0, 6);

    const cartTotal = (cart || []).reduce(
        (sum, item) => sum + Number(item.puli || 0) * (item.quantity || 1),
        0
    );

    // ═══════════ BANNERS ═══════════
    const banners = [
        {
            title: 'Tabiiy mahsulotlar',
            subtitle: 'Fermerlardan to\'g\'ridan-to\'g\'ri',
            icon: faJar,
            gradient: 'linear-gradient(135deg, #4a9aae, #5ac5d4)',
        },
        {
            title: '30% chegirma',
            subtitle: 'Birinchi xaridingizga',
            icon: faGift,
            gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        },
        {
            title: 'Bo\'lib to\'lash',
            subtitle: '0% ustama bilan',
            icon: faCreditCard,
            gradient: 'linear-gradient(135deg, #10b981, #059669)',
        },
    ];

    return (
        <div className="market-page">
            {/* ═══════════════════════════════════════════════════════ */}
            {/* TOP BAR */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="market-topbar">
                <div className="topbar-left">
                    <FontAwesomeIcon icon={faGlobe} />
                    <span>O'zbekiston</span>
                    <span className="topbar-divider">•</span>
                    <span>Bepul yetkazish 500 000 so'mdan</span>
                </div>
                <div className="topbar-right">
                    <a href="#" className="topbar-link">
                        <FontAwesomeIcon icon={faPhone} /> +998 90 123 45 67
                    </a>
                    <span className="topbar-divider">|</span>
                    <a href="#" className="topbar-link">
                        <FontAwesomeIcon icon={faHeadset} /> Yordam
                    </a>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* HEADER */}
            {/* ═══════════════════════════════════════════════════════ */}
            <header className="market-header">
                <div className="market-logo">
                    <img src={logo} alt="Zenzo Market" className="logo-img" />
                    <div className="logo-text">
                        <h2>
                            Zenzo<span>Market</span>
                        </h2>
                        <p>
                            <FontAwesomeIcon icon={faLeaf} /> Fermerlardan to'g'ridan-to'g'ri
                        </p>
                    </div>
                </div>

                <div className="market-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Mahsulot, kategoriya yoki fermer qidirish..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            className="search-clear"
                            onClick={() => setSearch('')}
                            type="button"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="market-actions">
                    <button className="header-icon-btn" title="Bildirishnomalar">
                        <FontAwesomeIcon icon={faBell} />
                        {notifications > 0 && (
                            <span className="notif-badge">{notifications}</span>
                        )}
                    </button>

                    <Link to="/cart" className="cart-badge">
                        <FontAwesomeIcon icon={faCartShopping} />
                        <span className="cart-text">Savat</span>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>

                    <div className="user-menu">
                        <div className="user-avatar">
                            {(user?.fullname || user?.username || 'U')
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                        <div className="user-info">
                            <b>{user?.fullname || user?.username}</b>
                            <button onClick={handleLogout}>
                                Chiqish <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* NAVIGATION MENU */}
            {/* ═══════════════════════════════════════════════════════ */}
            <nav className="market-nav">
                <ul>
                    <li>
                        <Link to="/market" className="active">
                            <FontAwesomeIcon icon={faStore} /> Bosh sahifa
                        </Link>
                    </li>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon icon={faTag} /> Aksiyalar
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon icon={faFire} /> TOP mahsulotlar
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon icon={faGift} /> Sovg'alar
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon icon={faMedal} /> Yangi
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon icon={faHandshake} /> Fermerlar
                        </a>
                    </li>
                </ul>
            </nav>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* HERO */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="market-hero">
                <div className="hero-bg-shapes">
                    <div className="hero-shape shape-1"></div>
                    <div className="hero-shape shape-2"></div>
                    <div className="hero-shape shape-3"></div>
                </div>

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        Yangi hosil keldi
                    </div>

                    <h1>
                        <span className="hero-icon-wrap">
                            <FontAwesomeIcon icon={faJar} className="hero-icon" />
                        </span>
                        Tabiiy mahsulotlar
                        <br />
                        <span className="hero-highlight">fermerlardan</span>
                    </h1>

                    <p className="hero-subtitle">
                        O'zbekistonning eng yaxshi fermerlaridan to'g'ridan-to'g'ri — asal,
                        quritilgan meva, yong'oq va boshqa tabiiy mahsulotlar
                    </p>

                    <div className="hero-features">
                        <div className="hero-feature">
                            <FontAwesomeIcon icon={faCircleCheck} className="feature-icon" />
                            <span>100% tabiiy</span>
                        </div>
                        <div className="hero-feature">
                            <FontAwesomeIcon icon={faTruckFast} className="feature-icon" />
                            <span>Tez yetkazish</span>
                        </div>
                        <div className="hero-feature">
                            <FontAwesomeIcon icon={faCreditCard} className="feature-icon" />
                            <span>Bo'lib to'lash</span>
                        </div>
                        <div className="hero-feature">
                            <FontAwesomeIcon
                                icon={faHandHoldingHeart}
                                className="feature-icon"
                            />
                            <span>Fermerlarni qo'llash</span>
                        </div>
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-value">500+</div>
                            <div className="hero-stat-label">Fermer</div>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">10K+</div>
                            <div className="hero-stat-label">Mijoz</div>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">
                                4.9 <FontAwesomeIcon icon={faStar} style={{ fontSize: 16 }} />
                            </div>
                            <div className="hero-stat-label">Reyting</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* PROMO BANNER */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="promo-banner">
                <div
                    className="promo-banner-inner"
                    style={{ background: banners[currentBanner].gradient }}
                >
                    <div className="promo-banner-icon">
                        <FontAwesomeIcon icon={banners[currentBanner].icon} />
                    </div>
                    <div className="promo-banner-content">
                        <h2>{banners[currentBanner].title}</h2>
                        <p>{banners[currentBanner].subtitle}</p>
                    </div>
                    <Link to="/market" className="promo-banner-btn">
                        Batafsil <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>

                <div className="promo-dots">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            className={`promo-dot ${currentBanner === i ? 'active' : ''}`}
                            onClick={() => setCurrentBanner(i)}
                            type="button"
                        />
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SERVICES */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="services-section">
                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">
                            <FontAwesomeIcon icon={faTruckFast} />
                        </div>
                        <div className="service-info">
                            <h4>Tez yetkazish</h4>
                            <p>2-3 kun ichida</p>
                        </div>
                    </div>
                    <div className="service-card">
                        <div className="service-icon green">
                            <FontAwesomeIcon icon={faShield} />
                        </div>
                        <div className="service-info">
                            <h4>Xavfsiz to'lov</h4>
                            <p>100% himoyalangan</p>
                        </div>
                    </div>
                    <div className="service-card">
                        <div className="service-icon orange">
                            <FontAwesomeIcon icon={faRotateLeft} />
                        </div>
                        <div className="service-info">
                            <h4>14 kun qaytarish</h4>
                            <p>Qulay va oson</p>
                        </div>
                    </div>
                    <div className="service-card">
                        <div className="service-icon pink">
                            <FontAwesomeIcon icon={faHeadset} />
                        </div>
                        <div className="service-info">
                            <h4>24/7 Yordam</h4>
                            <p>Doim aloqadamiz</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* CHEGIRMALAR */}
            {/* ═══════════════════════════════════════════════════════ */}
            {discountedProducts.length > 0 && (
                <section className="discount-section">
                    <div className="section-header">
                        <div>
                            <div className="section-badge orange">
                                <FontAwesomeIcon icon={faPercent} /> Chegirmalar
                            </div>
                            <h2>Chegirmadagi mahsulotlar</h2>
                            <p className="section-subtitle">Eng yaxshi narxlar</p>
                        </div>
                    </div>

                    <div className="discount-grid">
                        {discountedProducts.map((p) => (
                            <Link
                                key={p.id}
                                to={`/product/${p.id}`}
                                className="discount-card"
                            >
                                <div className="discount-card-image">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.nomi} />
                                    ) : (
                                        <FontAwesomeIcon icon={getCategoryIcon(p.kategoriya)} />
                                    )}
                                    <span className="discount-card-badge">
                                        -{p.chegirma_foiz}%
                                    </span>
                                </div>
                                <div className="discount-card-body">
                                    <h4>{p.nomi}</h4>
                                    <div className="discount-card-price">
                                        <span className="price-new">
                                            {formatPrice(p.puli)} so'm
                                        </span>
                                        {p.eski_narx && (
                                            <span className="price-old">
                                                {formatPrice(p.eski_narx)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TOP MAHSULOTLAR — 1 TALIK SWIPER */}
            {/* ═══════════════════════════════════════════════════════ */}
            {topProducts.length > 0 && (
                <section className="top-products-section">
                    <div className="section-header">
                        <div>
                            <div className="section-badge">
                                <FontAwesomeIcon icon={faAward} /> Eng yaxshilar
                            </div>
                            <h2>TOP mahsulotlar</h2>
                            <p className="section-subtitle">
                                Eng yuqori reytingga ega mahsulotlar
                            </p>
                        </div>
                        <div className="section-nav">
                            <button className="nav-btn top-prev" type="button">
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <button className="nav-btn top-next" type="button">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    </div>

                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        slidesPerGroup={1}
                        loop={false}
                        navigation={{
                            prevEl: '.top-prev',
                            nextEl: '.top-next',
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        speed={800}
                        grabCursor={true}
                        className="top-swiper-single"
                    >
                        {topProducts.map((p) => (
                            <SwiperSlide key={p.id}>
                                <Link to={`/product/${p.id}`} className="top-single-card">
                                    <div className="top-single-image">
                                        {p.image_url ? (
                                            <img src={p.image_url} alt={p.nomi} />
                                        ) : (
                                            <div className="top-single-placeholder">
                                                <FontAwesomeIcon
                                                    icon={getCategoryIcon(p.kategoriya)}
                                                />
                                            </div>
                                        )}

                                        <div className="top-single-overlay"></div>

                                        <div className="top-single-badge">
                                            <FontAwesomeIcon icon={faFire} /> TOP
                                        </div>

                                        <button
                                            className={`top-single-wishlist ${isInWishlist(p.id) ? 'active' : ''
                                                }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleWishlist(p);
                                            }}
                                            type="button"
                                        >
                                            <FontAwesomeIcon icon={faHeart} />
                                        </button>

                                        <div className="top-single-content">
                                            <h3>{p.nomi}</h3>
                                            <div className="top-single-price">
                                                {formatPrice(p.puli)} so'm
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* YANGI MAHSULOTLAR */}
            {/* ═══════════════════════════════════════════════════════ */}
            {newProducts.length > 0 && (
                <section className="new-products-section">
                    <div className="section-header">
                        <div>
                            <div className="section-badge green">
                                <FontAwesomeIcon icon={faWandMagicSparkles} /> Yangi    {/* ✅ */}
                            </div>
                            <h2>Yangi mahsulotlar</h2>
                            <p className="section-subtitle">Eng so'nggi qo'shilganlar</p>
                        </div>
                    </div>

                    <div className="new-products-grid">
                        {newProducts.map((p) => (
                            <Link
                                key={p.id}
                                to={`/product/${p.id}`}
                                className="new-product-card"
                            >
                                <div className="new-product-image">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.nomi} />
                                    ) : (
                                        <FontAwesomeIcon icon={getCategoryIcon(p.kategoriya)} />
                                    )}
                                    <span className="new-badge">YANGI</span>
                                </div>
                                <div className="new-product-body">
                                    <h4>{p.nomi}</h4>
                                    <div className="new-product-price">
                                        {formatPrice(p.puli)} so'm
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* KATEGORIYALAR */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="market-categories">
                <div className="categories-header">
                    <h3>Kategoriyalar</h3>
                    <span className="categories-line"></span>
                </div>

                <div className="categories-list">
                    <button
                        className={`category-btn ${selectedCategory === 'all' ? 'active' : ''
                            }`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        <FontAwesomeIcon icon={faStore} className="category-icon" />
                        <span className="category-text">Hammasi</span>
                        <span className="category-count">{products.length}</span>
                    </button>

                    {categories.map((c) => {
                        const count = products.filter(
                            (p) => p.kategoriya === c.id
                        ).length;
                        return (
                            <button
                                key={c.id}
                                className={`category-btn ${selectedCategory === c.id ? 'active' : ''
                                    }`}
                                onClick={() => setSelectedCategory(c.id)}
                            >
                                <FontAwesomeIcon icon={c.icon} className="category-icon" />
                                <span className="category-text">{c.nomi}</span>
                                <span className="category-count">{count}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* FILTER VA SORT */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="filter-section">
                <div className="filter-row">
                    <div className="filter-chips">
                        <button
                            className={`chip ${!filterDiscount && !filterTop ? 'active' : ''
                                }`}
                            onClick={() => {
                                setFilterDiscount(false);
                                setFilterTop(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faThLarge} /> Hammasi
                        </button>
                        <button
                            className={`chip ${filterDiscount ? 'active' : ''}`}
                            onClick={() => setFilterDiscount(!filterDiscount)}
                        >
                            <FontAwesomeIcon icon={faPercent} /> Chegirmalar
                        </button>
                        <button
                            className={`chip ${filterTop ? 'active' : ''}`}
                            onClick={() => setFilterTop(!filterTop)}
                        >
                            <FontAwesomeIcon icon={faFire} /> TOP
                        </button>
                        <button
                            className="chip"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FontAwesomeIcon icon={faFilter} /> Filtr
                        </button>
                    </div>

                    <div className="filter-right">
                        <div className="sort-box">
                            <FontAwesomeIcon icon={faSort} className="sort-icon" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="default">Standart</option>
                                <option value="price-asc">Arzon → Qimmat</option>
                                <option value="price-desc">Qimmat → Arzon</option>
                                <option value="rating">Reyting bo'yicha</option>
                                <option value="name">Nomi bo'yicha</option>
                            </select>
                        </div>

                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                title="Grid"
                                type="button"
                            >
                                <FontAwesomeIcon icon={faThLarge} />
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                                title="List"
                                type="button"
                            >
                                <FontAwesomeIcon icon={faList} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="advanced-filters">
                        <div className="filter-group">
                            <label>Min narx</label>
                            <input
                                type="number"
                                value={priceRange.min}
                                onChange={(e) =>
                                    setPriceRange({ ...priceRange, min: e.target.value })
                                }
                                placeholder="0"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Max narx</label>
                            <input
                                type="number"
                                value={priceRange.max}
                                onChange={(e) =>
                                    setPriceRange({ ...priceRange, max: e.target.value })
                                }
                                placeholder="10000000"
                            />
                        </div>
                        <button
                            className="clear-filters-btn"
                            onClick={clearFilters}
                            type="button"
                        >
                            <FontAwesomeIcon icon={faRotateLeft} /> Tozalash
                        </button>
                    </div>
                )}
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* MAHSULOTLAR */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="market-products">
                <div className="products-header">
                    <h2>
                        {selectedCategory === 'all'
                            ? 'Barcha mahsulotlar'
                            : 'Tanlangan kategoriya'}{' '}
                        <span className="products-count">({filteredProducts.length})</span>
                    </h2>
                    {cartCount > 0 && (
                        <div className="cart-total">
                            <FontAwesomeIcon icon={faCartShopping} /> Savat:{' '}
                            <b>{formatPrice(cartTotal)} so'm</b>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Yuklanmoqda...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <FontAwesomeIcon icon={faBox} className="empty-icon" />
                        <p>Mahsulot topilmadi</p>
                        <button
                            className="reset-btn"
                            onClick={clearFilters}
                            type="button"
                        >
                            <FontAwesomeIcon icon={faRotateLeft} /> Filtrni tozalash
                        </button>
                    </div>
                ) : (
                    <div
                        className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}
                    >
                        {filteredProducts.map((p) => (
                            <div key={p.id} className="product-card">
                                <div className="card-aurora"></div>

                                {/* Badge */}
                                <div className="card-badge">
                                    {parseFloat(p.yulduzi) >= 4.8 ? (
                                        <span className="badge-top">
                                            <FontAwesomeIcon icon={faFire} /> TOP
                                        </span>
                                    ) : (
                                        <span className="badge-new">
                                            <FontAwesomeIcon icon={faWandMagicSparkles} /> YANGI
                                        </span>
                                    )}
                                </div>

                                {/* Chegirma badge */}
                                {p.chegirma_foiz > 0 && (
                                    <div className="discount-badge">
                                        <FontAwesomeIcon icon={faPercent} /> -{p.chegirma_foiz}%
                                    </div>
                                )}

                                {/* Wishlist */}
                                <button
                                    className={`wishlist-btn ${isInWishlist(p.id) ? 'active' : ''
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist(p);
                                    }}
                                    type="button"
                                    title="Sevimlilarga"
                                >
                                    <FontAwesomeIcon icon={faHeart} />
                                </button>

                                {/* Quick view */}
                                <button
                                    className="quick-view-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/product/${p.id}`);
                                    }}
                                    type="button"
                                    title="Tez ko'rish"
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                </button>

                                {/* Rasm */}
                                <Link
                                    to={`/product/${p.id}`}
                                    className="product-image-link"
                                >
                                    <div className="product-image">
                                        {p.image_url ? (
                                            <img src={p.image_url} alt={p.nomi} />
                                        ) : (
                                            <div className="image-placeholder">
                                                <FontAwesomeIcon
                                                    icon={getCategoryIcon(p.kategoriya)}
                                                    style={{
                                                        fontSize: 80,
                                                        color: '#5ac5d4',
                                                        opacity: 0.4,
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="image-overlay">
                                            <span className="glass-badge">
                                                <FontAwesomeIcon
                                                    icon={getCategoryIcon(p.kategoriya)}
                                                />
                                                <span>
                                                    {p.kategoriya_nomi || p.kategoriya}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Ma'lumot */}
                                <div className="card-body">
                                    <Link
                                        to={`/product/${p.id}`}
                                        className="card-title-link"
                                    >
                                        <h3>{p.nomi}</h3>
                                    </Link>

                                    {p.korishi && (
                                        <p className="product-desc">{p.korishi}</p>
                                    )}

                                    {/* Fermer */}
                                    {p.fermer_ismi && (
                                        <div className="product-farmer">
                                            <FontAwesomeIcon icon={faUser} />
                                            <span>{p.fermer_ismi}</span>
                                            {p.fermer_manzil && (
                                                <span className="farmer-location">
                                                    <FontAwesomeIcon icon={faLocationDot} />
                                                    {p.fermer_manzil}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Reyting */}
                                    <div className="product-rating">
                                        {renderStars(p.yulduzi)}
                                        <span className="rating-text">
                                            {p.yulduzi || '5.0'}
                                        </span>
                                    </div>

                                    {/* Mini stats */}
                                    <div className="mini-stats">
                                        <div className="mini-stat">
                                            <FontAwesomeIcon icon={faTruckFast} />
                                            <span>{p.yetkazish_kun || '2'} kun</span>
                                        </div>
                                        {p.oyiga && (
                                            <div className="mini-stat">
                                                <FontAwesomeIcon icon={faCreditCard} />
                                                <span>Bo'lib to'lash</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Narx */}
                                    <div className="product-prices">
                                        <span className="price-current">
                                            {formatPrice(p.puli)} <small>so'm</small>
                                        </span>
                                        {p.eski_narx && (
                                            <span className="price-old">
                                                {formatPrice(p.eski_narx)} so'm
                                            </span>
                                        )}
                                    </div>

                                    {/* Oyiga to'lash */}
                                    {p.oyiga && p.qancha && (
                                        <div className="product-installment">
                                            <FontAwesomeIcon icon={faCreditCard} />
                                            <span>
                                                <b>{formatPrice(p.oyiga)} so'm/oy</b> × {p.qancha}{' '}
                                                oy
                                            </span>
                                        </div>
                                    )}

                                    {/* Tugmalar */}
                                    <div className="card-actions">
                                        <button
                                            className="product-btn"
                                            onClick={() => handleAddToCart(p)}
                                            type="button"
                                        >
                                            <span className="btn-shine"></span>
                                            <span className="btn-text">
                                                <FontAwesomeIcon icon={faCartShopping} />
                                                Savatga
                                            </span>
                                        </button>

                                        <Link
                                            to={`/product/${p.id}`}
                                            className="product-btn-detail"
                                        >
                                            Batafsil
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* STATISTIKA */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div className="stat-info">
                            <h3>10,000+</h3>
                            <p>Faol mijozlar</p>
                        </div>
                    </div>
                    <div className="stat-card green">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faHandshake} />
                        </div>
                        <div className="stat-info">
                            <h3>500+</h3>
                            <p>Fermerlar</p>
                        </div>
                    </div>
                    <div className="stat-card orange">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faBox} />
                        </div>
                        <div className="stat-info">
                            <h3>5,000+</h3>
                            <p>Mahsulotlar</p>
                        </div>
                    </div>
                    <div className="stat-card pink">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faChartLine} />
                        </div>
                        <div className="stat-info">
                            <h3>98%</h3>
                            <p>Mamnun mijozlar</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* NEGA BIZNI TANLASH */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="why-us-section">
                <div className="why-us-header">
                    <div className="section-badge">
                        <FontAwesomeIcon icon={faCrown} /> Nega bizni tanlash
                    </div>
                    <h2>Bizning afzalliklar</h2>
                </div>

                <div className="why-us-grid">
                    <div className="why-us-card">
                        <div className="why-us-icon">
                            <FontAwesomeIcon icon={faLeaf} />
                        </div>
                        <h3>100% Tabiiy</h3>
                        <p>Faqat tabiiy va sifatli mahsulotlar</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon green">
                            <FontAwesomeIcon icon={faHandshake} />
                        </div>
                        <h3>Fermerlardan</h3>
                        <p>To'g'ridan-to'g'ri mahalliy fermerlardan</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon orange">
                            <FontAwesomeIcon icon={faTruckFast} />
                        </div>
                        <h3>Tez yetkazish</h3>
                        <p>2-3 kun ichida uyingizda</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon pink">
                            <FontAwesomeIcon icon={faShield} />
                        </div>
                        <h3>Xavfsiz to'lov</h3>
                        <p>100% himoyalangan to'lov</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon purple">
                            <FontAwesomeIcon icon={faCreditCard} />
                        </div>
                        <h3>Bo'lib to'lash</h3>
                        <p>0% ustama bilan 12 oygacha</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon">
                            <FontAwesomeIcon icon={faHeadset} />
                        </div>
                        <h3>24/7 Yordam</h3>
                        <p>Doim siz uchun aloqadamiz</p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TESTIMONIALS */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="testimonials-section">
                <div className="testimonials-header">
                    <div className="section-badge purple">
                        <FontAwesomeIcon icon={faStar} /> Mijozlar fikri
                    </div>
                    <h2>Mijozlarimiz nima deydi</h2>
                </div>

                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-stars">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon key={i} icon={faStar} />
                            ))}
                        </div>
                        <p className="testimonial-text">
                            "Juda sifatli asal! Butun oilamizga yoqdi. Tez yetkazib
                            berishdi."
                        </p>
                        <div className="testimonial-author">
                            <div className="author-avatar">A</div>
                            <div>
                                <b>Aziza M.</b>
                                <p>Toshkent</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-stars">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon key={i} icon={faStar} />
                            ))}
                        </div>
                        <p className="testimonial-text">
                            "Quritilgan mevalar juda mazali. Bolalarim juda yaxshi
                            ko'rishadi."
                        </p>
                        <div className="testimonial-author">
                            <div className="author-avatar">S</div>
                            <div>
                                <b>Sardor K.</b>
                                <p>Samarqand</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-stars">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon key={i} icon={faStar} />
                            ))}
                        </div>
                        <p className="testimonial-text">
                            "Bo'lib to'lash juda qulay. Endi doimiy mijozman."
                        </p>
                        <div className="testimonial-author">
                            <div className="author-avatar">D</div>
                            <div>
                                <b>Dilnoza R.</b>
                                <p>Buxoro</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* YAQINDA KO'RILGAN */}
            {/* ═══════════════════════════════════════════════════════ */}
            {recentlyViewed.length > 0 && (
                <section className="recently-viewed-section">
                    <div className="section-header">
                        <div>
                            <div className="section-badge purple">
                                <FontAwesomeIcon icon={faClock} /> Tarix
                            </div>
                            <h2>Yaqinda ko'rilgan</h2>
                        </div>
                    </div>

                    <div className="recently-grid">
                        {recentlyViewed.map((p) => (
                            <Link
                                key={p.id}
                                to={`/product/${p.id}`}
                                className="recently-card"
                            >
                                <div className="recently-image">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.nomi} />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={getCategoryIcon(p.kategoriya)}
                                        />
                                    )}
                                </div>
                                <h4>{p.nomi}</h4>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* NEWSLETTER */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="newsletter-section">
                <div className="newsletter-content">
                    <div className="newsletter-icon">
                        <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <h2>Yangiliklardan xabardor bo'ling</h2>
                    <p>
                        Yangi mahsulotlar va chegirmalar haqida birinchi bo'lib
                        biling
                    </p>
                    <div className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Email manzilingizni kiriting"
                        />
                        <button type="button">
                            Obuna bo'lish <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* CTA */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="cta-section">
                <div className="cta-content">
                    <div className="cta-icon">
                        <FontAwesomeIcon icon={faBolt} />
                    </div>
                    <h2>Birinchi xaridingizga 10% chegirma!</h2>
                    <p>Ro'yxatdan o'ting va chegirmadan foydalaning</p>
                    <Link to="/cart" className="cta-btn">
                        <FontAwesomeIcon icon={faCartShopping} /> Xarid qilishni
                        boshlash
                    </Link>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* FOOTER */}
            {/* ═══════════════════════════════════════════════════════ */}
            <footer className="market-footer-premium">
                <div className="footer-top">
                    <div className="footer-cols">
                        <div className="footer-col footer-col-brand">
                            <div className="footer-brand-logo">
                                <div className="footer-logo-icon">Z</div>
                                <div>
                                    <h3>
                                        Zenzo<span>Market</span>
                                    </h3>
                                    <p>Fermerlardan to'g'ridan-to'g'ri</p>
                                </div>
                            </div>
                            <p className="footer-brand-desc">
                                O'zbekistonning eng yaxshi fermerlaridan tabiiy
                                mahsulotlar — asal, quritilgan meva, yong'oq.
                            </p>
                            <div className="footer-socials">
                                <a href="#" className="footer-social" title="Telegram">
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </a>
                                <a href="#" className="footer-social" title="Instagram">
                                    <FontAwesomeIcon icon={faCamera} />
                                </a>
                                <a href="#" className="footer-social" title="YouTube">
                                    <FontAwesomeIcon icon={faPlay} />
                                </a>
                                <a href="#" className="footer-social" title="Facebook">
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                </a>
                            </div>
                        </div>

                        <div className="footer-col">
                            <h4>Kategoriyalar</h4>
                            <ul>
                                <li>
                                    <Link to="/market">
                                        <FontAwesomeIcon icon={faChevronRight} /> Mahalliy
                                        asal
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/market">
                                        <FontAwesomeIcon icon={faChevronRight} /> Quritilgan
                                        meva
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/market">
                                        <FontAwesomeIcon icon={faChevronRight} /> Yong'oq
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/market">
                                        <FontAwesomeIcon icon={faChevronRight} /> Boshqa
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4>Xizmatlar</h4>
                            <ul>
                                <li>
                                    <Link to="/cart">
                                        <FontAwesomeIcon icon={faChevronRight} /> Savat
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/market">
                                        <FontAwesomeIcon icon={faChevronRight} />{' '}
                                        Buyurtmalar
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/market">
                                        <FontAwesomeIcon icon={faChevronRight} />{' '}
                                        Yetkazish
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/market">
                                        <FontAwesomeIcon icon={faChevronRight} /> Bo'lib
                                        to'lash
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4>Aloqa</h4>
                            <ul className="footer-contacts">
                                <li>
                                    <span className="footer-contact-icon">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </span>
                                    <div>
                                        <b>+998 90 123 45 67</b>
                                        <p>24/7 qo'llab-quvvatlash</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="footer-contact-icon">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                    <div>
                                        <b>info@zenzo.uz</b>
                                        <p>Email manzil</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="footer-contact-icon">
                                        <FontAwesomeIcon icon={faLocationDot} />
                                    </span>
                                    <div>
                                        <b>Toshkent, O'zbekiston</b>
                                        <p>Bosh ofis</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-middle">
                    <div className="footer-features">
                        <div className="footer-feature">
                            <div className="footer-feature-icon">
                                <FontAwesomeIcon icon={faTruckFast} />
                            </div>
                            <div>
                                <b>Tez yetkazish</b>
                                <p>2-3 kun ichida</p>
                            </div>
                        </div>
                        <div className="footer-feature">
                            <div className="footer-feature-icon green">
                                <FontAwesomeIcon icon={faShield} />
                            </div>
                            <div>
                                <b>Xavfsiz to'lov</b>
                                <p>100% himoya</p>
                            </div>
                        </div>
                        <div className="footer-feature">
                            <div className="footer-feature-icon orange">
                                <FontAwesomeIcon icon={faRotateLeft} />
                            </div>
                            <div>
                                <b>Qaytarish</b>
                                <p>14 kun muddat</p>
                            </div>
                        </div>
                        <div className="footer-feature">
                            <div className="footer-feature-icon pink">
                                <FontAwesomeIcon icon={faHeadset} />
                            </div>
                            <div>
                                <b>Yordam</b>
                                <p>24/7 aloqada</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copy">
                        &copy; {new Date().getFullYear()} <b>Zenzo Market</b>.
                        Barcha huquqlar himoyalangan.
                    </p>
                    <div className="footer-bottom-links">
                        <a href="#">Maxfiylik siyosati</a>
                        <span>•</span>
                        <a href="#">Foydalanish shartlari</a>
                        <span>•</span>
                        <a href="#">Yordam</a>
                    </div>
                    <p className="footer-made">
                        <FontAwesomeIcon icon={faHeart} style={{ color: '#ef4444' }} />{' '}
                        O'zbekistonda
                    </p>
                </div>
            </footer>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SCROLL TOP BUTTON */}
            {/* ═══════════════════════════════════════════════════════ */}
            <button
                className="scroll-top-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                type="button"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
        </div>
    );
}