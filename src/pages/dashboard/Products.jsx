import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faPlus,
  faPen,
  faTrash,
  faSearch,
  faJar,
  faCookieBite,
  faSeedling,
  faStar,
  faCircleCheck,
  faCircleXmark,
  faTimes,
  faSave,
  faSpinner,
  faImage,
  faTag,
  faCreditCard,
  faTruckFast,
  faUser,
  faLocationDot,
  faPercent,
  faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Rasm uchun alohida state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    nomi: '',
    puli: '',
    eski_narx: '',
    yulduzi: '5.0',
    korishi: '',
    kategoriya: 'asal',
    oyiga: '',
    qancha: '12',
    yetkazish_kun: '2',
    fermer_ismi: '',
    fermer_manzil: '',
    faol: true,
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/rest/');
      const data = res.data.results || res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Load error:', err);
      showToast("Yuklashda xatolik!", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Modal ochish — YANGI
  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      nomi: '',
      puli: '',
      eski_narx: '',
      yulduzi: '5.0',
      korishi: '',
      kategoriya: 'asal',
      oyiga: '',
      qancha: '12',
      yetkazish_kun: '2',
      fermer_ismi: '',
      fermer_manzil: '',
      faol: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  // Modal ochish — TAHRIRLASH
  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      nomi: product.nomi || '',
      puli: product.puli || '',
      eski_narx: product.eski_narx || '',
      yulduzi: product.yulduzi || '5.0',
      korishi: product.korishi || '',
      kategoriya: product.kategoriya || 'asal',
      oyiga: product.oyiga || '',
      qancha: product.qancha || '12',
      yetkazish_kun: product.yetkazish_kun || '2',
      fermer_ismi: product.fermer_ismi || '',
      fermer_manzil: product.fermer_manzil || '',
      faol: product.faol !== false,
    });
    setImageFile(null);
    setImagePreview(product.image_url || null);
    setModalOpen(true);
  };

  // Rasm tanlash
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Saqlash
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // FormData (rasm uchun)
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        let value = form[key];
        // 'faol' boolean
        if (key === 'faol') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, value);
        }
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingProduct) {
        // Update — PATCH (qismiy yangilash)
        await API.patch(`/rest/${editingProduct.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast("Mahsulot yangilandi!", 'success');
      } else {
        // Create
        await API.post('/rest/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast("Mahsulot qo'shildi!", 'success');
      }

      setModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error('Save error:', err);
      const errors = err.response?.data;
      let msg = 'Xatolik yuz berdi!';
      if (errors) {
        if (typeof errors === 'string') {
          msg = errors;
        } else {
          const firstKey = Object.keys(errors)[0];
          const firstError = errors[firstKey];
          msg = Array.isArray(firstError) ? firstError[0] : firstError;
        }
      }
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    if (!window.confirm(`"${p.nomi}" ni o'chirishni tasdiqlaysizmi?`)) return;

    setDeleting(id);

    try {
      await API.delete(`/rest/${id}/`);
      showToast(`"${p.nomi}" o'chirildi`, 'success');
      setProducts((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      showToast("O'chirishda xatolik!", 'error');
    } finally {
      setDeleting(null);
    }
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

  const formatPrice = (price) => {
    if (!price) return '0';
    return Number(price).toLocaleString('uz-UZ');
  };

  const filteredProducts = products.filter((p) =>
    (p.nomi || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-products">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon green">
            <FontAwesomeIcon icon={faBox} />
          </div>
          <div>
            <h1>Mahsulotlar</h1>
            <p>{products.length} ta mahsulot</p>
          </div>
        </div>
        <button className="btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} />
          Yangi qo'shish
        </button>
      </div>

      {/* Qidiruv */}
      <div className="page-search">
        <FontAwesomeIcon icon={faSearch} className="page-search-icon" />
        <input
          type="text"
          placeholder="Mahsulot nomi bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Mahsulotlar */}
      {loading ? (
        <div className="table-loading">
          <div className="table-spinner"></div>
          <p>Yuklanmoqda...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="table-empty">
          <FontAwesomeIcon icon={faBox} />
          <p>Mahsulot topilmadi</p>
        </div>
      ) : (
        <div className="products-admin-grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="product-admin-card">
              <div className="product-admin-image">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.nomi} />
                ) : (
                  <FontAwesomeIcon
                    icon={getCategoryIcon(p.kategoriya)}
                    style={{ fontSize: 60, opacity: 0.3 }}
                  />
                )}
                <span className="product-admin-id">#{p.id}</span>

                {!p.faol && (
                  <span className="product-admin-inactive">Nofaol</span>
                )}
              </div>

              <div className="product-admin-body">
                <div className="product-admin-cat">
                  <FontAwesomeIcon icon={getCategoryIcon(p.kategoriya)} />
                  {p.kategoriya_nomi || p.kategoriya}
                </div>

                <h3>{p.nomi}</h3>

                <div className="product-admin-rating">
                  <FontAwesomeIcon icon={faStar} />
                  <span>{p.yulduzi}</span>
                </div>

                <div className="product-admin-price">
                  {formatPrice(p.puli)} so'm
                </div>

                {p.eski_narx && (
                  <div className="product-admin-old-price">
                    {formatPrice(p.eski_narx)} so'm
                  </div>
                )}

                <div className="product-admin-actions">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => openEditModal(p)}
                    title="Tahrirlash"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    title="O'chirish"
                  >
                    {deleting === p.id ? (
                      <div className="btn-spinner-small"></div>
                    ) : (
                      <FontAwesomeIcon icon={faTrash} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* MODAL — Yangi/Tahrirlash */}
      {/* ═══════════════════════════════════════ */}
      {modalOpen && (
        <div
          className="modal-overlay active"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="modal modal-large">
            <div className="modal-header">
              <div>
                <h3>
                  {editingProduct
                    ? 'Mahsulotni tahrirlash'
                    : "Yangi mahsulot qo'shish"}
                </h3>
                <p className="modal-subtitle">
                  {editingProduct
                    ? `ID: #${editingProduct.id}`
                    : 'Barcha maydonlarni to\'ldiring'}
                </p>
              </div>
              <button
                className="modal-close"
                onClick={() => setModalOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              {/* ═══ RASM ═══ */}
              <div className="form-section">
                <div className="form-section-title">
                  <FontAwesomeIcon icon={faImage} />
                  Rasm
                </div>

                <div className="image-upload-wrapper">
                  <div className="image-preview">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" />
                    ) : (
                      <div className="image-empty">
                        <FontAwesomeIcon icon={faImage} />
                        <p>Rasm yuklanmagan</p>
                      </div>
                    )}
                  </div>

                  <label className="image-upload-btn">
                    <FontAwesomeIcon icon={faImage} />
                    {imagePreview ? 'Rasmni almashtirish' : 'Rasm tanlash'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* ═══ ASOSIY MA'LUMOTLAR ═══ */}
              <div className="form-section">
                <div className="form-section-title">
                  <FontAwesomeIcon icon={faBox} />
                  Asosiy ma'lumotlar
                </div>

                <div className="form-group">
                  <label>Nomi *</label>
                  <input
                    type="text"
                    value={form.nomi}
                    onChange={(e) =>
                      setForm({ ...form, nomi: e.target.value })
                    }
                    placeholder="Masalan: Tog' asali (1 kg)"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Kategoriya *</label>
                  <select
                    value={form.kategoriya}
                    onChange={(e) =>
                      setForm({ ...form, kategoriya: e.target.value })
                    }
                    required
                  >
                    <option value="asal">🍯 Mahalliy asal</option>
                    <option value="meva">🍇 Quritilgan meva</option>
                    <option value="yongoq">🥜 Yong'oq</option>
                    <option value="boshqa">🛒 Boshqa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Korishi (tavsif)</label>
                  <textarea
                    value={form.korishi}
                    onChange={(e) =>
                      setForm({ ...form, korishi: e.target.value })
                    }
                    placeholder="Qisqa tavsif..."
                    rows="3"
                  ></textarea>
                </div>
              </div>

              {/* ═══ NARX ═══ */}
              <div className="form-section">
                <div className="form-section-title">
                  <FontAwesomeIcon icon={faTag} />
                  Narx
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Puli (so'm) *</label>
                    <input
                      type="text"
                      value={form.puli}
                      onChange={(e) =>
                        setForm({ ...form, puli: e.target.value })
                      }
                      placeholder="180000"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faPercent} /> Eski narx
                    </label>
                    <input
                      type="text"
                      value={form.eski_narx}
                      onChange={(e) =>
                        setForm({ ...form, eski_narx: e.target.value })
                      }
                      placeholder="250000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Yulduzi (reyting) *</label>
                  <input
                    type="text"
                    value={form.yulduzi}
                    onChange={(e) =>
                      setForm({ ...form, yulduzi: e.target.value })
                    }
                    placeholder="4.9"
                    required
                  />
                </div>
              </div>

              {/* ═══ BO'LIB TO'LASH ═══ */}
              <div className="form-section">
                <div className="form-section-title">
                  <FontAwesomeIcon icon={faCreditCard} />
                  Bo'lib to'lash
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Oyiga (so'm)</label>
                    <input
                      type="text"
                      value={form.oyiga}
                      onChange={(e) =>
                        setForm({ ...form, oyiga: e.target.value })
                      }
                      placeholder="15000"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faCalendarDays} /> Necha oy
                    </label>
                    <input
                      type="text"
                      value={form.qancha}
                      onChange={(e) =>
                        setForm({ ...form, qancha: e.target.value })
                      }
                      placeholder="12"
                    />
                  </div>
                </div>
              </div>

              {/* ═══ YETKAZIB BERISH ═══ */}
              <div className="form-section">
                <div className="form-section-title">
                  <FontAwesomeIcon icon={faTruckFast} />
                  Yetkazib berish
                </div>

                <div className="form-group">
                  <label>Necha kunda yetkaziladi</label>
                  <input
                    type="text"
                    value={form.yetkazish_kun}
                    onChange={(e) =>
                      setForm({ ...form, yetkazish_kun: e.target.value })
                    }
                    placeholder="2"
                  />
                </div>
              </div>

              {/* ═══ FERMER ═══ */}
              <div className="form-section">
                <div className="form-section-title">
                  <FontAwesomeIcon icon={faUser} />
                  Fermer ma'lumotlari
                </div>

                <div className="form-group">
                  <label>Fermer ismi</label>
                  <input
                    type="text"
                    value={form.fermer_ismi}
                    onChange={(e) =>
                      setForm({ ...form, fermer_ismi: e.target.value })
                    }
                    placeholder="olim aka"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faLocationDot} /> Fermer manzili
                  </label>
                  <input
                    type="text"
                    value={form.fermer_manzil}
                    onChange={(e) =>
                      setForm({ ...form, fermer_manzil: e.target.value })
                    }
                    placeholder="Chotqol, Toshkent viloyati"
                  />
                </div>
              </div>

              {/* ═══ HOLAT ═══ */}
              <div className="form-section">
                <div className="form-section-title">
                  <FontAwesomeIcon icon={faCircleCheck} />
                  Holat
                </div>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={form.faol}
                    onChange={(e) =>
                      setForm({ ...form, faol: e.target.checked })
                    }
                  />
                  <span className="checkbox-label">
                    <b>Faol mahsulot</b>
                    <p>Marketda ko'rinadi</p>
                  </span>
                </label>
              </div>

              {/* ═══ TUGMALAR ═══ */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setModalOpen(false)}
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
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast show ${toast.type}`}>
          <FontAwesomeIcon
            icon={toast.type === 'success' ? faCircleCheck : faCircleXmark}
          />
          {toast.msg}
        </div>
      )}
    </div>
  );
}