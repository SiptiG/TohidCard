import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/CardTransfer.module.css';

const Payment = () => {
  const [formData, setFormData] = useState({
    sourceCard: '',
    destinationCard: '1111111111111111', // Default value (card number made of '1')
    amount: '',
    description: '',
    cvv2: '',
    expiry: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [token, setToken] = useState(null); // Store token from API response

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // فقط بخش submit تغییر کرده است
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/cardtocard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        /* token را دریافت می‌کنیم و به صفحهٔ QR می‌رویم */
        navigate(`/myqrcode/${result.token}`);
      } else {
        setStatus('error');
        console.error(result);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'success' && token) {
      navigate('/MyQrCode', { state: { token } });
    } else if (status === 'success' && !token) {
      console.error('No token available for navigation');
      setStatus('error');
    }
  }, [status, token, navigate]);

  return (
    <div className={styles.paymentRoot}>
      <header className={styles.header}>
        <span className={styles.welcome}>خوش آمدید</span>
        <button className={styles.menuButton}>☰</button>
      </header>

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
        <h1>پرداخت کارت به کارت</h1>

        <form className={styles.paymentForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="sourceCard">کارت مبدا</label>
            <input
              type="text"
              id="sourceCard"
              value={formData.sourceCard}
              onChange={handleChange}
              placeholder="شماره کارت مبدا را وارد کنید"
              required
            />
          </div>

          {/* Hidden Destination Card Field */}
          <div className={styles.formGroup} style={{ display: 'none' }}>
            <label htmlFor="destinationCard">کارت مقصد</label>
            <input
              type="text"
              id="destinationCard"
              value={formData.destinationCard}
              onChange={handleChange}
              placeholder="شماره کارت مقصد را وارد کنید"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="amount">مبلغ (تومان)</label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="مبلغ را وارد کنید"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cvv2">CVV2</label>
            <input
              type="text"
              id="cvv2"
              value={formData.cvv2}
              onChange={handleChange}
              placeholder="CVV2 را وارد کنید"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="expiry">تاریخ انقضا کارت</label>
            <input
              type="text"
              id="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="مثلاً 01/06"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">توضیحات (اختیاری)</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="توضیحات را وارد کنید"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'در حال ارسال...' : 'پرداخت'}
          </button>

          {status === 'success' && (
            <p style={{ color: 'lime', marginTop: '12px' }}>
              ✅ پرداخت با موفقیت انجام شد.
            </p>
          )}
          {status === 'error' && (
            <p style={{ color: 'red', marginTop: '12px' }}>
              ❌ خطا در انجام پرداخت.
            </p>
          )}
        </form>
      </main>

      <nav className={styles.bottomNav}>
        <button className={styles.navBtn}>🏠</button>
        <button className={styles.navBtn}>💳</button>
        <button className={styles.navBtn}>⚙️</button>
      </nav>
    </div>
  );
};

export default Payment;
