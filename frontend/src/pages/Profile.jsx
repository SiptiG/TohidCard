import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiKey, FiLogOut } from "react-icons/fi";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import styles from "../style/Profile.module.css";

/* util: mask “1234567812345678” → “1234 •••• •••• 5678” */
const maskPan = (num) =>
  !num
    ? "---- ---- ---- ----"
    : String(num)
        .replace(/\D/g, "")
        .replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, "$1 •••• •••• $4");

export default function Profile() {
  const [user, setUser] = useState({
    username: "John Doe",
    number: "+123456789",
    id: "12345",
    email: "johndoe@example.com",
    role: "Admin",
    card_number: "1234567812345678",
    balance: "1000000",
    card_cvv2: "123",
    card_expiry: "12/23",
    card_added_at: "2021-12-01",
    markets: ["Market1", "Market2"],
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  /* ---- derived display values ---- */
  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("fa-IR")
    : "—";

  const initials = user?.username
    ? user.username.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "؟";

  /* ---- handlers ---- */
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className={styles.root}>
      <Background />

      <div className={styles.container}>
        <ProfileCard
          initials={initials}
          username={user?.username}
          number={user?.number}
          id={user?.id}
          email={user?.email}
          role={user?.role}
          joined={joined}
          onLogout={handleLogout}
        />

        {user && (
          <BankCard
            pan={maskPan(user.card_number)}
            balance={Number(user.balance ?? 0).toLocaleString("fa-IR")}
            cvv={user.card_cvv2 ?? "000"}
            expiry={user.card_expiry ?? "00/00"}
            added={user.card_added_at
              ? new Date(user.card_added_at).toLocaleDateString("fa-IR")
              : "—"}
            markets={Array.isArray(user.markets)
              ? user.markets.join("، ") || "—"
              : (user.markets ?? "—")}
          />
        )}

        {err && <p className={styles.error}>{err}</p>}
        {!user && !err && <p className={styles.loading}>در حال بارگیری…</p>}
      </div>
    </div>
  );
}

/* ------------ sub‑components ------------ */

const Background = memo(() => (
  <div className={styles.bg}>
    {Array.from({ length: 8 }).map((_, i) => <span key={i} />)}
  </div>
));

const ProfileCard = memo(
  ({ initials, username, number, id, email, role, joined, onLogout }) => (
    <section className={styles.profileCard}>
      <div className={styles.avatarRing}>
        <div className={styles.avatar}>{initials}</div>
      </div>

      <h2 className={styles.name}>{username ?? "—"}</h2>
      <p className={styles.phone}>{number ?? "—"}</p>

      <ul className={styles.infoList}>
        <li><span>شناسه</span><span>{id ?? "—"}</span></li>
        <li><span>ایمیل</span><span>{email ?? "—"}</span></li>
        <li><span>نقش</span><span>{role ?? "—"}</span></li>
        <li><span>عضو از</span><span>{joined}</span></li>
      </ul>

      <div className={styles.buttons}>
        <button><FiEdit2 />ویرایش پروفایل</button>
        <button><FiKey />تغییر رمز</button>
        {/* new logout button */}
        <button className={styles.logoutBtn} onClick={onLogout}>
          <FiLogOut />خروج
        </button>
      </div>
    </section>
  )
);

const BankCard = memo(
  ({ pan, balance, cvv, expiry, added, markets }) => (
    <section className={styles.bankCard}>
      <div className={styles.cardHeader}>
        <BsFillCreditCard2FrontFill className={styles.cardIcon} />
        <span className={styles.bankName}>Tohid Card</span>
      </div>

      <p className={styles.pan}>{pan}</p>

      <div className={styles.detailRow}>
        <div><small>انقضا</small><span>{expiry}</span></div>
        <div><small>CVV2</small><span>{cvv}</span></div>
      </div>

      <div className={styles.balanceBadge}>
        {balance} <small>ریال</small>
      </div>

      <div className={styles.cardFooter}>
        <span>افزوده {added}</span> · <span>مارکت‌ها: {markets}</span>
      </div>
    </section>
  )
);
