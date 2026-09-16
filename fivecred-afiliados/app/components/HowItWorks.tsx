"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    num: "01",
    title: "Você recebe seu link exclusivo",
    desc: "Após o cadastro, você ganha um link personalizado da Fivecred. Compartilhe com quem você conhece — no WhatsApp, Instagram, grupos ou onde quiser.",
  },
  {
    num: "02",
    title: "Seu indicado faz a simulação",
    desc: "A pessoa clica no seu link, faz a simulação de crédito e preenche os dados. Nossa equipe cuida de todo o processo — atendimento, análise e aprovação.",
  },
  {
    num: "03",
    title: "Operação aprovada → comissão automática",
    desc: "Cada operação aprovada gera uma comissão creditada automaticamente na sua conta. Sem precisar cobrar, sem intermediário.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={styles.section} id="como-funciona" ref={ref}>
      <div className={`container ${styles.inner}`}>

        <motion.div
          className={styles.label}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Como funciona o modelo de ganho
        </motion.div>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Funciona assim: quanto mais você indica,{" "}
          <span className={styles.accent}>mais você ganha.</span>
        </motion.h2>

        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              className={styles.step}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
            >
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insight box */}
        <motion.div
          className={styles.insight}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <div className={styles.insightIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <strong>Insight sobre comissão</strong>
            <p>
              A comissão pode parecer pequena por indicação. Mas a real oportunidade está no volume.
              Um afiliado ativo que indica consistentemente pode gerar uma renda recorrente relevante —
              sem horário fixo, sem chefe e sem investimento inicial. É uma das formas mais simples de
              monetizar sua audiência ou rede de contatos.
            </p>
          </div>
        </motion.div>

        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <a href="#cadastro" className={styles.ctaBtn}>
            Fazer meu cadastro grátis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
