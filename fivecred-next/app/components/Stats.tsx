"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./Stats.module.css";

const SupportIcons = {
  creative: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  support: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  training: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
};

const SUPPORT_ITEMS = [
  {
    iconKey: "creative" as const,
    title: "Criativos prontos",
    desc: "Artes, textos e links personalizados para compartilhar nas redes sociais ou no WhatsApp. Você só copia e cola.",
  },
  {
    iconKey: "dashboard" as const,
    title: "Dashboard de acompanhamento",
    desc: "Veja em tempo real suas indicações, conversões e comissões acumuladas. Transparência total.",
  },
  {
    iconKey: "support" as const,
    title: "Suporte dedicado",
    desc: "Time disponível para tirar dúvidas e te ajudar a melhorar seus resultados. Não começa do zero.",
  },
  {
    iconKey: "training" as const,
    title: "Treinamento de boas-vindas",
    desc: "Material prático pra você entender o produto e saber como apresentar para as pessoas certas.",
  },
];

export default function Support() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className={styles.section} ref={ref}>
      <div className="container">
        <motion.div
          className={styles.label}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Suporte e estrutura
        </motion.div>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Você não começa do zero.{" "}
          <span className={styles.accent}>A gente te dá tudo que precisa.</span>
        </motion.h2>

        <div className={styles.grid}>
          {SUPPORT_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -6, borderColor: "rgba(242,101,34,0.4)" }}
            >
              <div className={styles.cardIcon}>{SupportIcons[item.iconKey]}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.ctaRow}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <a href="#cadastro" className={styles.ctaBtn}>
            Entrar para o programa
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
