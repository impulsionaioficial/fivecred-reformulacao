'use client';
import { motion } from 'framer-motion';
import styles from './FinalCTA.module.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function FinalCTA() {
  return (
    <section className={styles.section}>
      {/* Animated background */}
      <div className={styles.bg} />
      <motion.div className={styles.glow1}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className={styles.glow2}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />

      <div className="container">
        <motion.div className={styles.inner}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}>

          <p className={styles.eyebrow}>Simulação gratuita · Sem compromisso</p>

          <h2 className={styles.title}>
            Descubra agora o crédito{' '}
            <br className={styles.br} />
            que é seu <span className={styles.accent}>por direito.</span>
          </h2>

          <p className={styles.sub}>
            As condições de hoje podem não estar disponíveis amanhã.
            Simule em menos de 2 minutos — é grátis e sem consulta ao CPF.
          </p>

          <motion.button
            className={styles.btn}
            onClick={() => document.getElementById('simulacao')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.04, boxShadow: '0 12px 48px rgba(0,0,0,0.4)' }}
            whileTap={{ scale: 0.97 }}>
            Consultar meu crédito grátis →
          </motion.button>

          <div className={styles.trust}>
            {['Sem taxa antecipada', 'Sem consulta ao CPF', '100% seguro'].map((t, i) => (
              <span key={t} className={styles.trustItem}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="6" fill="rgba(255,255,255,0.15)"/>
                  <path d="M3.5 6l2 2 3-3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
