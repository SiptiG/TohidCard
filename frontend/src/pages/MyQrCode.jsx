import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../style/MyQrCode.module.css";

export default function MyQrCode() {
  const { token } = useParams(); // dynamic param
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Placeholder for setting QR code (no fetching)
  const handleSetQr = () => {
    setQr("path_to_sample_qr_image.png");  // sample image for testing
    setLoading(false);
  };

  /* ---- UI ---- */
  return (
    <div className={styles.myQrCodeRoot}>
      <main className={styles.myQrCodeContainer}>
        <h1>کد QR شما</h1>
        {loading && <p>در حال بارگذاری...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {qr && <img src={qr} alt="QR Code" className={styles.qrCodeImage} />}
        <button onClick={handleSetQr}>Set QR</button> {/* button to simulate setting the QR */}
      </main>
    </div>
  );
}
