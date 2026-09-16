'use client';
import { motion } from 'framer-motion';
import SimulationForm from './SimulationForm';
import styles from './Hero.module.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.navSpacer} />

      <div className={`container ${styles.inner}`}>
        {/* LEFT */}
        <motion.div className={styles.left}
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}>

          <div className={styles.badge}>
            <span className={styles.dot} />
            Simulação 100% gratuita
          </div>

          <h1 className={styles.headline}>
            Seu benefício pode render{' '}
            <span className={styles.accent}>muito mais</span>{' '}
            do que você imagina.
          </h1>

          <p className={styles.sub}>
            Margem disponível, antecipação ou empréstimo pessoal —
            descubra em segundos o que você tem direito.
          </p>

          <ul className={styles.bullets}>
            {['Sem taxa antecipada', 'Sem compromisso', 'Processo 100% seguro'].map(b => (
              <li key={b}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#F26522" fillOpacity="0.15"/>
                  <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#F26522" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {b}
              </li>
            ))}
          </ul>

          <p className={styles.nudge}>Comece agora mesmo e descubra o que você tem direito.</p>
        </motion.div>

        {/* RIGHT: Form */}
        <motion.div className={styles.right}
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          id="simulacao">


          <SimulationForm />
        </motion.div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsInner}>
            {[
              { val: '100%', label: 'Gratuito para simular' },
              { val: 'R$0', label: 'Taxa antecipada' },
              { val: '+15k', label: 'Clientes atendidos' },
              { val: '4.9', label: 'Avaliação média' },
            ].map(s => (
              <div key={s.label} className={styles.stat}>
                <strong>{s.val}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
