import React, { useState, useEffect } from 'react';
import styles from '../style/UserData.module.css';

const UserData = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/users', {
          method: 'GET',
          credentials: 'include', // Sends the authentication cookie
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.user) {
          throw new Error('No user data found in response');
        }
        setUser(data.user);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className={styles.error}>خطا: {error}</div>;
  }

  if (!user) {
    return <div className={styles.noData}>داده‌ای یافت نشد</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>داده‌های کاربر</h1>
      <div className={styles.profileCard}>
        <div className={styles.field}>
          <span className={styles.label}>شناسه کاربر:</span>
          <span>{user.UserID}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>نام کاربری:</span>
          <span>{user.Username}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>نام:</span>
          <span>{user.FirstName}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>نام خانوادگی:</span>
          <span>{user.LastName}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>شماره موبایل:</span>
          <span>{user.MobileNumber}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>کد ملی:</span>
          <span>{user.NationalID}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>تاریخ ایجاد:</span>
          <span>{new Date(user.CreatedAt).toLocaleString('fa-IR')}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>فعال:</span>
          <span>{user.IsEnable ? 'بله' : 'خیر'}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>نقش:</span>
          <span>{user.RoleID}</span>
        </div>
      </div>
    </div>
  );
};

export default UserData;