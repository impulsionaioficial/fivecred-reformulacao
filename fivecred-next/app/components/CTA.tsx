"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import styles from "./CTA.module.css";

function maskPhone(v: string) {
  return v.replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
}

export default function CTA() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1600);
  };

  return (
    <section className={styles.section} id="cadastro">
      <div className={styles.bg} />
      <div className={`container ${styles.inner}`}>
        <FadeIn>
          <div className={styles.label}>Seção 06</div>
          <h2 className={styles.heading}>
            Quero me tornar um<br />
            <span className={styles.accent}>afiliado Fivecred</span>
          </h2>
          <p className={styles.sub}>
            Cadastro grátis. Comece a indicar hoje mesmo.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className={styles.formCard}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label2}>Seu nome</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Como você prefere ser chamado"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label2}>WhatsApp</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={e => setPhone(maskPhone(e.target.value))}
                    maxLength={15}
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className={styles.submitBtn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? <span className={styles.loader} /> : "Começar agora →"}
                </motion.button>
                <p className={styles.note}>
                  Gratuito. Sem obrigação de meta. Ganhe no seu ritmo.
                </p>
              </form>
            ) : (
              <motion.div
                className={styles.success}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={styles.successIcon}>✓</div>
                <h3>Cadastro realizado!</h3>
                <p>Entraremos em contato pelo WhatsApp com seu link exclusivo de afiliado.</p>
              </motion.div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
