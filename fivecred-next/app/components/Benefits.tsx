"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./Benefits.module.css";

const BenefitIcons = {
  free: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  noExp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  digital: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
};

const ITEMS = [
  {
    iconKey: "free" as const,
    tag: "Zero investimento",
    title: "Cadastro gratuito,\nsem mensalidades",
    desc: "Você não paga nada para entrar no programa. Não há mensalidade, não há taxa de adesão. Só entrar e começar a indicar.",
  },
  {
    iconKey: "noExp" as const,
    tag: "Zero experiência",
    title: "Não precisa saber\nde finanças ou vendas",
    desc: "Nossa equipe cuida de tudo após a indicação. Você não precisa entender de crédito, não precisa convencer ninguém.",
  },
  {
    iconKey: "digital" as const,
    tag: "100% digital",
    title: "Trabalhe de qualquer\nlugar, no seu tempo",
    desc: "Tudo funciona pelo celular. Você compartilha o link quando e onde quiser — sem horário fixo, sem chefe, sem obrigação.",
  },
];

export default function Benefits() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className={styles.section} ref={ref}>
      {/* Orange banner like CGI reference */}
      <div className={styles.banner}>
        <div className={styles.bannerPattern} />
        <div className={`container ${styles.bannerInner}`}>
          <motion.div
            className={styles.bannerLabel}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Baixa barreira, alto potencial
          </motion.div>
          <motion.h2
            className={styles.bannerHeading}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Não precisa de experiência.<br />
            Não precisa de investimento.<br />
            <em>Só precisa começar.</em>
          </motion.h2>
          <motion.p
            className={styles.bannerSub}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            O programa de afiliados da Fivecred foi feito pra quem quer uma renda extra sem complicação.
            Você não precisa saber nada sobre crédito — nossa equipe cuida de tudo depois da indicação.
          </motion.p>
        </div>
      </div>

      {/* Cards */}
      <div className={`container ${styles.cards}`}>
        {ITEMS.map((item, i) => (
          <motion.div
            key={i}
            className={styles.card}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
          >
            <div className={styles.cardIcon}>{BenefitIcons[item.iconKey]}</div>
            <span className={styles.cardTag}>{item.tag}</span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
