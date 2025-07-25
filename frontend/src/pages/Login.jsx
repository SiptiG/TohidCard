import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../style/Login.module.css";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const clearCookies = async () => {
    try {
      await fetch(`${API}/api/auth/clear-cookies`, {
        method: "POST",
        credentials: "include", // Ensure cookies are sent and cleared
      });
      console.log("Previous cookies cleared successfully");
    } catch (err) {
      console.error("Error clearing cookies:", err);
      // Non-critical error; proceed with login attempt
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    if (!formData.username || !formData.password) {
      setError("نام کاربری و رمز عبور الزامی هستند.");
      setBusy(false);
      return;
    }

    // Clear existing cookies before login
    await clearCookies();

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/dashboard"); // Redirect to dashboard after successful login
      } else {
        // Show detailed error if available
        let errorMsg = data?.message ?? "خطایی رخ داد.";
        if (data?.error) {
          errorMsg += ": " + data.error;
        }
        setError(errorMsg);
      }
    } catch (err) {
      setError("خطا در اتصال به سرور: " + err.message);
      console.error("Login error:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.loginRoot}>
      <div className={styles["animated-bg"]}>
        {[...Array(6)].map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        <h2>
          ورود به <span>کیف هوشمند</span>
        </h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="نام کاربری"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="رمز عبور"
          value={formData.password}
          onChange={handleChange}
        />
        <button disabled={busy}>
          {busy ? <span className={styles.loader} /> : "ورود"}
        </button>
        <p className={styles.alt}>
          حساب ندارید؟ <Link to="/signup">ثبت‌نام</Link>
        </p>
      </form>
    </div>
  );
}