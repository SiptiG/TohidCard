// Header.jsx
import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Menu from "../components/Menu";
import styles from "../style/Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((p) => !p);

  /* optional: allow ESC to close */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.menuButton} onClick={toggle}>
          <FiMenu />
        </div>
      </header>

      {/* Side‑drawer */}
      <Menu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
