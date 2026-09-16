"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./Testimonials.module.css";

export default function Scale() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className={styles.section} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          {/* Left: copy */}
          <div>
            <motion.div
              className={styles.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Escala e recorrência
            </motion.div>
            <motion.h2
              className={styles.heading}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Sua renda cresce com o seu volume.{" "}
              <span className={styles.accent}>Sem teto.</span>
            </motion.h2>
            <motion.p
              className={styles.body}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Cada nova indicação aprovada é mais uma comissão entrando. E como o produto tem demanda
              constante — crédito é algo que as pessoas sempre precisam — você pode construir uma fonte de
              renda estável ao longo do tempo.
            </motion.p>
            <motion.p
              className={styles.body}
              style={{ marginTop: "1rem" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Afiliados que se dedicam a compartilhar de forma consistente crescem mês a mês.{" "}
              <strong style={{ color: "#F26522" }}>Sem limite de ganho.</strong>
            </motion.p>
          </div>

          {/* Right: animated income progression */}
          <motion.div
            className={styles.chartWrap}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className={styles.chartLabel}>Renda estimada por mês</div>
            <div className={styles.chart}>
              {[
                { month: "Mês 1", pct: 20, val: "R$ 120" },
                { month: "Mês 2", pct: 35, val: "R$ 340" },
                { month: "Mês 3", pct: 52, val: "R$ 620" },
                { month: "Mês 4", pct: 68, val: "R$ 980" },
                { month: "Mês 5", pct: 82, val: "R$ 1.450" },
                { month: "Mês 6", pct: 100, val: "R$ 2.100+" },
              ].map((b, i) => (
                <div key={b.month} className={styles.bar}>
                  <div className={styles.barLabel}>{b.val}</div>
                  <motion.div
                    className={styles.barFill}
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${b.pct}%` } : { height: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                  />
                  <div className={styles.barMonth}>{b.month}</div>
                </div>
              ))}
            </div>
            <div className={styles.chartNote}>* Estimativa baseada em afiliados ativos. Resultados variam.</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
