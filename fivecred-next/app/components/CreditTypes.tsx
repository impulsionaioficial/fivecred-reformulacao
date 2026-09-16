'use client';
import { motion } from 'framer-motion';
import styles from './CreditTypes.module.css';

const CREDITS = [
  { tag: 'INSS', title: 'Consignado INSS', desc: 'Para aposentados e pensionistas. Parcelas descontadas diretamente do benefício, com as menores taxas do mercado.', highlight: 'Juros mais baixos do mercado' },
  { tag: 'CLT', title: 'Consignado CLT', desc: 'Para trabalhadores com carteira assinada. Desconto automático em folha, sem preocupação com parcelas em atraso.', highlight: 'Desconto automático em folha' },
  { tag: 'FGTS', title: 'Antecipação FGTS', desc: 'Use o saldo que já é seu. Receba agora e pague com o que o governo libera todo ano. Sem comprometer a renda mensal.', highlight: 'Sem impacto na renda mensal' },
  { tag: 'Energia', title: 'Crédito na Conta de Luz', desc: 'Sem cartão, sem conta bancária necessária. As parcelas são inclusas na fatura de energia.', highlight: 'Sem conta bancária' },
  { tag: 'Pessoal', title: 'Empréstimo Pessoal', desc: 'Para quem precisa de crédito rápido e flexível, com análise simplificada e resposta ágil.', highlight: 'Aprovação simplificada' },
];

export default function CreditTypes() {
  return (
    <section id="credito" className={styles.section}>
      <div className="container">
        <motion.div className={styles.header}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}>
          <p className={styles.eyebrow}>Tipos de crédito disponível</p>
          <h2 className={styles.title}>
            Uma solução para{' '}
            <span className={styles.accent}>cada perfil.</span>
          </h2>
          <p className={styles.sub}>
            Você pode ter crédito disponível e ainda não saber. A Fivecred verifica tudo, sem custo e sem burocracia.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {CREDITS.map((c, i) => (
            <motion.article key={c.title} className={styles.card}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}>
              <span className={styles.tag}>{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className={styles.chip}>
                <span className={styles.chipDot} />
                {c.highlight}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Insight callout like afiliado */}
        <motion.div className={styles.insight}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="9" fill="rgba(242,101,34,0.2)"/>
            <path d="M9 5v4l2.5 2" stroke="#F26522" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div>
            <strong>Sem compromisso para simular</strong>
            <p>A simulação é gratuita e não consulta o CPF. Descubra agora quanto você pode liberar — as condições de hoje podem mudar amanhã.</p>
          </div>
        </motion.div>

        <motion.div className={styles.cta}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}>
          <button onClick={() => document.getElementById('simulacao')?.scrollIntoView({ behavior: 'smooth' })}>
            Simular gratuitamente →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
