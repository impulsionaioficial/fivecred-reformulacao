"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./Hero.module.css";

// SVG icon library — no emojis, all clean vector
const Icons = {
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  bell: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  share: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  dollar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  creditCard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  zap: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  barChart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  trendingUp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  star: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

type IconKey = keyof typeof Icons;

const SLOT_A: { icon: IconKey; title: string; sub: string; green?: boolean }[] = [
  { icon: "link",  title: "Seu link exclusivo",     sub: "fivecred.com.br/?ref=você" },
  { icon: "bell",  title: "Nova indicação",          sub: "Carlos M. acabou de simular" },
  { icon: "user",  title: "Cadastro recebido",       sub: "Fernanda R. entrou pelo seu link" },
  { icon: "share", title: "Compartilhe onde quiser", sub: "WhatsApp · Instagram · Grupos" },
  { icon: "bell",  title: "Nova indicação",          sub: "Roberta L. fez a simulação" },
  { icon: "user",  title: "Cadastro recebido",       sub: "Marcelo T. se inscreveu agora" },
  { icon: "bell",  title: "Nova indicação",          sub: "Patrícia N. clicou no seu link" },
];
const SLOT_B: { icon: IconKey; title: string; sub: string; green?: boolean }[] = [
  { icon: "dollar",     title: "Comissão creditada", sub: "+ R$ 280,00 aprovado",       green: true },
  { icon: "check",      title: "Operação aprovada",  sub: "André S. — + R$ 450,00",     green: true },
  { icon: "creditCard", title: "Saque disponível",   sub: "R$ 1.340,00 na sua conta",   green: true },
  { icon: "zap",        title: "Meta atingida",      sub: "+ R$ 620,00 liberado",        green: true },
  { icon: "dollar",     title: "Comissão creditada", sub: "Juliana P. — + R$ 310,00",   green: true },
  { icon: "check",      title: "Operação aprovada",  sub: "Lucas F. — + R$ 390,00",     green: true },
  { icon: "creditCard", title: "Novo pagamento",     sub: "R$ 870,00 na sua conta",     green: true },
];
const SLOT_C: { icon: IconKey; title: string; sub: string; green?: boolean }[] = [
  { icon: "barChart",   title: "18 indicações",    sub: "este mês" },
  { icon: "trendingUp", title: "Crescimento 41%",  sub: "vs. mês anterior" },
  { icon: "clock",      title: "Taxa aprovação",   sub: "96% das indicações" },
  { icon: "star",       title: "Afiliado ativo",   sub: "Top 10% da plataforma" },
  { icon: "barChart",   title: "24 indicações",    sub: "melhor semana do mês" },
  { icon: "trendingUp", title: "R$ 2.180 este mês", sub: "renda acumulada" },
  { icon: "star",       title: "Destaque da semana", sub: "parabéns pelo resultado" },
];

function CardIcon({ name }: { name: IconKey }) {
  return <span className={styles.cardIcon}>{Icons[name]}</span>;
}

function CyclingCard({ items, delay, className }: { items: typeof SLOT_A; delay: number; className?: string }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const id = setInterval(() => setIdx(i => (i + 1) % items.length), 7000);
      return () => clearInterval(id);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [items.length, delay]);

  const item = items[idx];
  return (
    <div className={`${styles.floatCard} ${className || ""}`}>
      <CardIcon name={item.icon} />
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.4 }}
        >
          <strong>{item.title}</strong>
          <p className={item.green ? styles.greenText : ""}>{item.sub}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const ORBIT_CARDS = [
  { items: SLOT_A, initDeg: -30, delay: 0   },
  { items: SLOT_B, initDeg: 100, delay: 1.5 },
  { items: SLOT_C, initDeg: 225, delay: 3   },
];

/** Desktop: orbit illustration */
function DesktopIllustration() {
  return (
    <div className={styles.illustration}>
      {/* Central node */}
      <div className={styles.centralNode}>
        <motion.div className={styles.nodeRing1}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div className={styles.nodeRing2}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.05, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
        />
        <div className={styles.nodeCenter}>
          <svg viewBox="0 0 72 68" width="28" height="28" fill="none">
            <path fill="white" d="M6 0 L72 0 L60 18 L6 18 Q0 18 0 12 L0 6 Q0 0 6 0 Z"/>
            <path fill="white" d="M6 24 L62 24 L50 42 L6 42 Q0 42 0 36 L0 30 Q0 24 6 24 Z"/>
            <path fill="white" d="M6 48 L36 48 L24 66 L6 66 Q0 66 0 60 L0 54 Q0 48 6 48 Z"/>
          </svg>
        </div>

        <motion.div className={styles.linesWrapper}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <motion.div key={deg} className={styles.nodeLine}
              style={{ transform: `rotate(${deg}deg)` }}
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </motion.div>

        <motion.div className={styles.orbitRing}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <motion.div key={`dot-${deg}`} className={styles.orbitDot}
              style={{ transform: `rotate(${deg}deg) translateX(92px)` }}
              animate={{ scale: [0.9, 1.2, 0.9] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.28 }}
            >
              <div className={styles.orbitDotInner}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Orbiting card arms */}
      {ORBIT_CARDS.map(({ items, initDeg, delay }, i) => (
        <div key={i} className={styles.cardOrbitArm}
          style={{ transform: `rotate(${initDeg}deg)` }}>
          <div className={styles.cardOrbitSpinner}>
            <div className={styles.cardOnRadius}>
              <div className={styles.cardCounterRotate}>
                <div style={{ transform: `rotate(${-initDeg}deg)` }}>
                  <CyclingCard items={items} delay={delay} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Mobile: simplified static cards stacked */
function MobileCards() {
  return (
    <div className={styles.mobileCards}>
      <CyclingCard items={SLOT_A} delay={0} />
      <CyclingCard items={SLOT_B} delay={1.5} />
    </div>
  );
}

const bullets = ["Sem mensalidade", "Sem meta obrigatória", "Sem investimento inicial"];

export default function Hero() {
  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.meshBg} />

      <div className={`container ${styles.inner}`}>
        {/* Left: copy */}
        <div className={styles.content}>
          <motion.div className={styles.tag}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <span className={styles.tagDot} />
            Cadastro 100% gratuito
          </motion.div>

          <motion.h1 className={styles.headline}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            Transforme sua rede{" "}
            <span className={styles.accent}>em renda.</span>
          </motion.h1>

          <motion.div className={styles.bullets}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            {bullets.map((b) => (
              <div key={b} className={styles.bullet}>
                <span className={styles.bulletIcon}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {b}
              </div>
            ))}
          </motion.div>

          <motion.p className={styles.sub}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}>
            Comece hoje mesmo a transformar sua rede em renda.
          </motion.p>

          <motion.div className={styles.actions}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}>
            <motion.a href="#cadastro" className={styles.ctaBtn}
              whileHover={{ scale: 1.04, boxShadow: "0 16px 32px -6px rgba(242,101,34,0.5)" }}
              whileTap={{ scale: 0.97 }}>
              Quero ser um Afiliado Fivecred
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </motion.a>
          </motion.div>

          {/* Mobile cards shown inline below CTA */}
          <motion.div className={styles.mobileOnly}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}>
            <MobileCards />
          </motion.div>
        </div>

        {/* Right: desktop orbit illustration */}
        <motion.div className={styles.desktopOnly}
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}>
          <DesktopIllustration />
        </motion.div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {[
          { v: "100%", l: "Gratuito para entrar" },
          { v: "R$0",  l: "Investimento inicial" },
          { v: "Auto", l: "Comissão automática" },
          { v: "∞",    l: "Sem teto de ganho" },
        ].map((s, i) => (
          <motion.div key={s.l} className={styles.stat}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}>
            <strong>{s.v}</strong>
            <span>{s.l}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
