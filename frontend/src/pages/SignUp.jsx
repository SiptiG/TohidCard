import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../style/SignUp.module.css";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "", email: "", number: "", password: "",
  });
  const [error, setError] = useState("");
  const [busy,  setBusy ] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const { username, email, number, password } = formData;
    if (!username || !email || !number || !password)
      return setError("تمام فیلدها الزامی‌ست.");

    try {
      setBusy(true);
      const res = await fetch(`${API}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",        //  ← cookie!
      });
      const data = await res.json();
      if (res.ok) {
        alert("ثبت‌نام موفق بود!");
        navigate("/login");
      } else setError(data.error ?? "خطایی رخ داد.");
    } catch { setError("خطا در اتصال به سرور."); }
    finally { setBusy(false); }
  };

  return (
    <div className={styles.signupRoot}>
      <div className={styles["animated-bg"]}>{[...Array(8)].map((_,i)=><span key={i}/>)}</div>

      <form className={styles.card} onSubmit={handleSubmit}>
        <h2>به <span>کیف&nbsp;هوشمند</span> خوش آمدید</h2>
        {error && <p className={styles.error}>{error}</p>}

        <input name="username" placeholder="نام کاربری" onChange={handleChange} value={formData.username}/>
        <input type="email" name="email" placeholder="ایمیل" onChange={handleChange} value={formData.email}/>
        <input name="number" placeholder="شماره تلفن" onChange={handleChange} value={formData.number}/>
        <input type="password" name="password" placeholder="رمز عبور" onChange={handleChange} value={formData.password}/>

        <button disabled={busy}>{busy ? <span className={styles.loader}/> : "ایجاد حساب"}</button>
        <p className={styles.alt}>قبلاً ثبت‌نام کرده‌اید؟ <Link to="/login">وارد شوید</Link></p>
      </form>
    </div>
  );
}
