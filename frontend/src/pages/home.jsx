import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Correct import
import styles from "../style/home.module.css";
import {
  FiShoppingCart,
  FiPlusCircle,
  FiWifi,
  FiRefreshCw,
  FiShare2,
  FiSend,
  FiDownload,
  FiChevronLeft,
  FiList,
  FiTrendingUp,
  FiShoppingBag,
  FiGrid,
  FiCreditCard,
  FiCpu,
} from "react-icons/fi";

/* ---------- mock data ---------- */
const cards = [
  {
    banner: "",
    balance: "۰ ریال",
    balanceLabel: "موجودی",
    expiry: "۱۴۰۵/۱۲/۲۹",
    expiryLabel: "تاریخ انقضا",
    footer: "کیف پول (تا ۱۰٪ برگشت نقدی)",
    cardNumber: "1234567812341234",
  },
  {
    banner: "",
    balance: "۲٬۵۰۰٬۰۰۰ ریال",
    balanceLabel: "در دسترس",
    expiry: "۱۴۰۴/۰۹/۱۰",
    expiryLabel: "انقضا",
    footer: "کیف هدیه دوستان",
    cardNumber: "5678123456781234",
  },
  {
    banner: "",
    balance: "۷۵۰٬۰۰۰ ریال",
    balanceLabel: "اعتبار باقی‌مانده",
    expiry: "۱۴۰۶/۰۳/۰۱",
    expiryLabel: "پایان اعتبار",
    footer: "کیف باشگاه مشتریان",
    cardNumber: "9012345690123456",
  },
];

const actionSets = [
  [
    { label: "خرید", subtitle: "بارکد پرداخت حضوری", icon: <FiShoppingCart /> },
    {
      label: "شارژ کیف پول",
      subtitle: "افزایش موجودی کیف پول",
      icon: <FiPlusCircle />,
    },
    {
      label: "شارژ و اینترنت",
      subtitle: "خرید شارژ و بسته اینترنت",
      icon: <FiWifi />,
    },
    {
      label: "گردش کیف",
      subtitle: "مشاهده گردش مالی کیف",
      icon: <FiRefreshCw />,
    },
    {
      label: "اشتراک کیف",
      subtitle: "اشتراک کیف با دیگران",
      icon: <FiShare2 />,
    },
    {
      label: "کیف به کیف",
      subtitle: "انتقال وجه از شما به کیف دیگران",
      icon: <FiSend />,
    },
    {
      label: "برداشت از کیف پول",
      subtitle: "انتقال وجه به حساب بانکی",
      icon: <FiDownload />,
    },
  ],
  [
    {
      label: "بلیط سفر",
      subtitle: "اتوبوس، قطار، هواپیما",
      icon: <FiShoppingBag />,
    },
    {
      label: "قبض خدماتی",
      subtitle: "آب، برق، گاز، تلفن",
      icon: <FiTrendingUp />,
    },
    {
      label: "اینترنت ثابت",
      subtitle: "ارتقای سرویس خانگی",
      icon: <FiWifi />,
    },
    { label: "تبرع", subtitle: "پرداخت خیریه و نذری", icon: <FiShare2 /> },
  ],
  [
    {
      label: "سرمایه‌گذاری",
      subtitle: "صندوق درآمد ثابت",
      icon: <FiTrendingUp />,
    },
    { label: "رمز ارز", subtitle: "خرید و فروش آسان", icon: <FiCpu /> },
    { label: "بیمه", subtitle: "بدنه، مسئولیت، درمان", icon: <FiGrid /> },
  ],
];

/* ---------- components ---------- */
const WalletCard = ({ data, animateKey }) => {
  const formatCardNumber = (number) => {
    if (!number) return "•••• •••• •••• ••••";
    return number.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
  };

  const formatExpiryDate = (date) => {
    if (!date) return "••/••";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "••/••";
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      return `${month}/${year}`;
    } catch {
      return "••/••";
    }
  };

  return (
    <div
      key={animateKey}
      className={`${styles["wallet-card"]} ${styles["swing-in"]}`}
    >
      <div
        className={styles["wallet-card__banner"]}
        style={data.banner ? { backgroundImage: `url(${data.banner})` } : {}}
      />
      <div className={styles["wallet-card__body"]}>
        <div className={styles["wallet-card__chip"]}>
          <FiCpu />
        </div>

        <div
          className={`${styles["wallet-card__row"]} ${styles["wallet-card__number"]}`}
          style={{ direction: "ltr" }}
        >
          {formatCardNumber(data.cardNumber)}
        </div>

        <div className={styles["wallet-card__row"]}>
          <span>{data.balance}</span>
          <span>{data.balanceLabel}</span>
        </div>
        <div className={styles["wallet-card__row"]}>
          <span>{formatExpiryDate(data.expiry)}</span>
          <span>{data.expiryLabel}</span>
        </div>
        <div className={styles["wallet-card__row"]}>
          <span>{"•••"}</span>
          <span>CVV2</span>
        </div>
      </div>
      <div className={styles["wallet-card__footer"]}>{data.footer}</div>
    </div>
  );
};

const ActionItem = ({ icon, label, subtitle }) => (
  <div className={styles["action-item"]}>
    <div className={styles["action-icon"]}>{icon}</div>
    <div className={styles["action-text"]}>
      <span className={styles["action-label"]}>{label}</span>
      <span className={styles["action-subtitle"]}>{subtitle}</span>
    </div>
    <FiChevronLeft className={styles["action-chevron"]} />
  </div>
);

const BottomNav = ({ navigate }) => {
  const navItems = [
    { id: 1, label: "تراکنش‌ها", icon: <FiList />, path: "/transactions" },
    { id: 2, label: "اقساط", icon: <FiTrendingUp />, path: "/installments" },
    { id: 3, label: "فروشگاه‌ها", icon: <FiShoppingBag />, path: "/stores" },
    { id: 4, label: "خدمات", icon: <FiGrid />, path: "/services" },
    { id: 5, label: "کیف‌ها", icon: <FiCreditCard />, path: "/wallets" },
  ];

  return (
    <nav className={styles["bottom-nav"]}>
      {navItems.map(({ id, label, icon, path }) => (
        <button
          key={id}
          className={styles["nav-btn"]}
          onClick={() => navigate(path)}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
};

/* ---------- main page component ---------- */
const Home = () => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);

  const [idx, setIdx] = useState(0);
  const cooldown = useRef(false);
  const navigate = useNavigate(); // This should now work with correct import

  useEffect(() => {
    const step = (dir) => setIdx((i) => (i + dir + cards.length) % cards.length);

    const onWheel = (e) => {
      e.preventDefault();
      if (cooldown.current) return;
      cooldown.current = true;
      setTimeout(() => (cooldown.current = false), 500);
      step(e.deltaY > 0 ? 1 : -1);
    };

    const onTouch = (() => {
      let startY = 0;
      return (e) => {
        if (e.type === "touchstart") startY = e.touches[0].clientY;
        if (e.type === "touchend") {
          const delta = startY - e.changedTouches[0].clientY;
          if (Math.abs(delta) < 30) return;
          if (!cooldown.current) {
            cooldown.current = true;
            setTimeout(() => (cooldown.current = false), 500);
            step(delta > 0 ? 1 : -1);
          }
        }
      };
    })();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouch, { passive: false });
    window.addEventListener("touchend", onTouch, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchend", onTouch);
    };
  }, []);

  const [showRules, setShowRules] = useState(false);

  return (
    <div className={styles.homeRoot}>
      <div className={styles["animated-bg"]}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className={styles["home-container"]}>
        <div className={styles.slider}>
          <WalletCard data={cards[idx]} animateKey={idx} />
        </div>

        <div className={styles["chip-row"]}>
          <button
            className={styles.chip}
            onClick={() => setShowRules((s) => !s)}
          >
            قوانین کیف
          </button>
          {showRules && (
            <div className={styles["rules-box"]}>
              <p>در اینجا می‌توانید متن کامل قوانین کیف پول را قرار دهید.</p>
            </div>
          )}
        </div>

        <div key={idx} className={styles["action-list"]}>
          {actionSets[idx].map(({ label, subtitle, icon }) => (
            <ActionItem key={label} label={label} subtitle={subtitle} icon={icon} />
          ))}
        </div>

        <BottomNav navigate={navigate} />
      </div>
    </div>
  );
};

export default Home;