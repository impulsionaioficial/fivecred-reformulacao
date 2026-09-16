"use client";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div>
          <Image src="/logo-white.svg" alt="FiveCred" width={130} height={36} />
          <p className={styles.tagline}>Programa de Afiliados Fivecred</p>
        </div>
        <div className={styles.links}>
          <a href="#">Política de Privacidade</a>
          <a href="#">Termos de Uso</a>
          <a href="#">Contato</a>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.legal}>
          &copy; {new Date().getFullYear()} Fivecred. Todos os direitos reservados. Plataforma de correspondência
          bancária. Nunca cobramos taxas antecipadas. Crédito sujeito a aprovação.
        </p>
        <div className={styles.trust}>
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Dados protegidos
          </span>
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            SSL 256-bit
          </span>
        </div>
      </div>
    </footer>
  );
}
