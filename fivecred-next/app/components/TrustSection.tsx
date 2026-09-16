'use client';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useRef } from 'react';
import styles from './TrustSection.module.css';

const TESTIMONIALS = [
  { text: 'Fiquei com medo no começo, achei que era golpe. Mas me atenderam super bem, explicaram tudo e recebi o dinheiro em poucos dias.', name: 'Maria S.', age: '67 anos', role: 'Aposentada INSS' },
  { text: 'Precisava de dinheiro urgente e a Fivecred resolveu em menos de 48 horas. O processo todo foi pelo celular, sem sair de casa.', name: 'João R.', age: '58 anos', role: 'Pensionista INSS' },
  { text: 'Tinha saldo no FGTS parado sem usar. A equipe me explicou tudo direitinho e antecipei na hora. Recomendo demais.', name: 'Ana P.', age: '44 anos', role: 'Trabalhadora CLT' },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

export default function TrustSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section id="seguranca" className={styles.section} ref={ref}>
      {/* Parallax glow blob */}
      <motion.div className={styles.blob} style={{ y }} />

      <div className="container">
        <motion.div className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
          <p className={styles.eyebrow}>Segurança e Confiança</p>
          <h2 className={styles.title}>
            Segurança em cada etapa.<br />
            <span className={styles.accent}>Sem surpresas.</span>
          </h2>
          <p className={styles.sub}>
            Empresa registrada. Equipe real. Atendimento humanizado.
            Nenhuma taxa cobrada antes da liberação — transparência total do início ao fim.
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div className={styles.badges}
          variants={container} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-40px' }}>
          {[
            { icon: '🛡', label: 'Empresa Registrada', sub: 'CNPJ verificado e ativo' },
            { icon: '💳', label: 'Sem Taxa Antecipada', sub: 'Você não paga nada antes' },
            { icon: '👤', label: 'Atendimento Humano', sub: 'Time real, sem robôs' },
            { icon: '🔒', label: '100% Transparente', sub: 'Do início ao fim' },
          ].map((b) => (
            <motion.div key={b.label} className={styles.badge} variants={item}>
              <div className={styles.badgeIcon}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="11" fill="rgba(242,101,34,0.15)"/>
                  <path d="M7 11l3 3 5-6" stroke="#F26522" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <strong>{b.label}</strong>
                <span>{b.sub}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div id="depoimentos" className={styles.testimonials}>
          <motion.p className={styles.testiLabel}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            O que nossos clientes dizem
          </motion.p>
          <motion.div className={styles.testiGrid}
            variants={container} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: '-40px' }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} className={styles.card} variants={item}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#F26522">
                      <path d="M7 1l1.6 3.4 3.8.5-2.7 2.8.6 3.8L7 9.8l-3.3 1.7.6-3.8L1.6 4.9l3.8-.5L7 1z"/>
                    </svg>
                  ))}
                </div>
                <p>"{t.text}"</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>{t.name[0]}</div>
                  <div>
                    <strong>{t.name}, {t.age}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
