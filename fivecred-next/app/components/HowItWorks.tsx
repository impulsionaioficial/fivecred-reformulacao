'use client';
import { motion, type Variants } from 'framer-motion';
import styles from './HowItWorks.module.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STEPS = [
  { n: '01', title: 'Simule agora, em 2 minutos', desc: 'Preencha seus dados básicos. Não consultamos o CPF, não enviamos spam. É gratuito e sem compromisso.' },
  { n: '02', title: 'Nossa equipe analisa seu perfil', desc: 'Especialistas identificam as melhores opções disponíveis para você — consignado, FGTS, energia ou pessoal.' },
  { n: '03', title: 'Assine digitalmente e receba', desc: 'Tudo pelo celular, sem sair de casa. O dinheiro cai diretamente na sua conta. Simples assim.' },
];

const stepVar: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: (i: number) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.6, delay: i * 0.18, ease: EASE }
  })
};

export default function HowItWorks() {
  return (
    <section id="como-funciona" className={styles.section}>
      <div className="container">
        <div className={styles.layout}>
          {/* Left: text */}
          <motion.div className={styles.left}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE }}>
            <p className={styles.eyebrow}>Como funciona</p>
            <h2 className={styles.title}>
              Três passos.<br />
              <span className={styles.accent}>Sem burocracia.</span>
            </h2>
            <p className={styles.sub}>
              Do preenchimento ao recebimento — tudo pensado para ser rápido, seguro e sem complicação.
            </p>
            <motion.button
              className={styles.btn}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(242,101,34,0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('simulacao')?.scrollIntoView({ behavior: 'smooth' })}>
              Quero simular agora →
            </motion.button>
          </motion.div>

          {/* Right: steps */}
          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <motion.div key={i} className={styles.step}
                custom={i} variants={stepVar} initial="hidden"
                whileInView="show" viewport={{ once: true, margin: '-40px' }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}>
                <div className={styles.stepLeft}>
                  <div className={styles.stepNum}>{s.n}</div>
                  {i < STEPS.length - 1 && <div className={styles.stepLine} />}
                </div>
                <div className={styles.stepBody}>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
