import { useEffect, useState } from "react";
import { FiX, FiCreditCard } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "../style/Menu.module.css";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5173"; // Update the default URL to the correct one

export default function Menu({ open, onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  /* ---------- fetch logged-in user ---------- */
  useEffect(() => {
    fetch(`${API}/api/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        setUser(data.user ?? data); // Assuming data has a user object or fallback to entire data if not
      })
      .catch(() => setError("خطا در دریافت اطلاعات"));
  }, []);

  /* ---------- lock page scroll while drawer is open ---------- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  /* graceful fallbacks */
  const username = user?.username ?? "کاربر مهمان";
  const number = user?.number ?? "—";

  const handleCardTransfer = () => {
    navigate("/cardtransfer");
    onClose();
  };

  return (
    <>
      {/* Blur-tinted overlay */}
      <div
        className={`${styles["nav-overlay"]} ${open ? styles.show : ""}`}
        onClick={onClose}
      />

      {/* Side drawer */}
      <aside className={`${styles["nav-panel"]} ${open ? styles.open : ""}`}>
        <button
          aria-label="بستن منو"
          className={styles["nav-close"]}
          onClick={onClose}
        >
          <FiX />
        </button>

        {/* User strip at the top */}
        <div className={styles["nav-user"]}>
          <div className={styles["nav-user-avatar"]}>
            <span>{username[0]?.toUpperCase() || "U"}</span>
          </div>
          <span className={styles["nav-user-name"]}>{username}</span>
          <span className={styles["nav-user-number"]}>{number}</span>
        </div>

        {/* Card transfer button */}
        <button
          className={styles["card-transfer"]}
          onClick={handleCardTransfer}
        >
          <FiCreditCard />
          <span>کارت به کارت</span>
        </button>

        <ul className={styles["nav-list"]}>
          {["داشبورد", "تراکنش‌ها", "تنظیمات", "خروج"].map((t, i) => (
            <li
              key={t}
              className={styles["nav-item"]}
              style={{ animationDelay: `${240 + i * 80}ms` }}
            >
              {t}
            </li>
          ))}
        </ul>

        {error && <p className={styles["nav-error"]}>{error}</p>}
      </aside>
    </>
  );
}
