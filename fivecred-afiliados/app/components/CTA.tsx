"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import styles from "./CTA.module.css";

function maskPhone(v: string) {
  return v.replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
}

const WEBHOOK = "https://hook.us1.make.celonis.com/m4ln9sg12wotrfm5nejxgtge8qfpg2kd";

const CANAIS = ["WhatsApp", "Instagram", "Facebook", "TikTok", "YouTube", "Rede de contatos pessoais", "Outros"];
const VOLUME = ["1 a 5", "5 a 10", "10 a 20", "Mais de 20"];

export default function CTA() {
  const [form, setForm] = useState({
    nome: "",
    whatsapp: "",
    email: "",
    cidade: "",
    trabalhaVendas: "",
    canais: [] as string[],
    cnpj: "",
    volume: "",
    comoConheceu: "",
    aceite: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string | boolean | string[]) =>
    setForm(f => ({ ...f, [field]: value }));

  const toggleCanal = (canal: string) =>
    setForm(f => ({
      ...f,
      canais: f.canais.includes(canal)
        ? f.canais.filter(c => c !== canal)
        : [...f.canais, canal],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.aceite) { setError("Você precisa aceitar os termos para continuar."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          canais: form.canais.join(", "),
          origem: "landing-afiliados",
          data: new Date().toISOString(),
          pagina: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      if (res.ok) { setSubmitted(true); }
      else { setError("Algo deu errado. Tente novamente."); }
    } catch {
      setError("Erro de conexão. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section} id="cadastro">
      <div className={styles.bg} />
      <div className={`container ${styles.inner}`}>
        <FadeIn>
          <div className={styles.label}>Seção 06</div>
          <h2 className={styles.heading}>
            Quero me tornar um<br />
            <span className={styles.accent}>afiliado Fivecred</span>
          </h2>
          <p className={styles.sub}>Cadastro grátis. Comece a indicar hoje mesmo.</p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className={styles.formCard}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formHeader}>
                  <h3>Formulário de Cadastro — Programa de Afiliados Fivecred</h3>
                  <p>Preencha seus dados e comece a ganhar indicando</p>
                </div>

                {/* Nome */}
                <div className={styles.field}>
                  <label className={styles.label2}>Nome completo</label>
                  <input className={styles.input} type="text" placeholder="Seu nome completo"
                    value={form.nome} onChange={e => set("nome", e.target.value)} required />
                </div>

                {/* WhatsApp */}
                <div className={styles.field}>
                  <label className={styles.label2}>WhatsApp (com DDD)</label>
                  <input className={styles.input} type="text" placeholder="(00) 00000-0000"
                    value={form.whatsapp}
                    onChange={e => set("whatsapp", maskPhone(e.target.value))}
                    maxLength={15} required />
                </div>

                {/* E-mail */}
                <div className={styles.field}>
                  <label className={styles.label2}>E-mail</label>
                  <input className={styles.input} type="email" placeholder="seu@email.com"
                    value={form.email} onChange={e => set("email", e.target.value)} required />
                </div>

                {/* Cidade/Estado */}
                <div className={styles.field}>
                  <label className={styles.label2}>Cidade / Estado</label>
                  <input className={styles.input} type="text" placeholder="Ex: Belo Horizonte / MG"
                    value={form.cidade} onChange={e => set("cidade", e.target.value)} required />
                </div>

                {/* Trabalha com indicações */}
                <div className={styles.field}>
                  <label className={styles.label2}>Você já trabalha com indicações ou vendas?</label>
                  <div className={styles.radioGroup}>
                    {["Sim", "Não"].map(opt => (
                      <label key={opt} className={styles.radioLabel}>
                        <input type="radio" name="trabalhaVendas" value={opt}
                          checked={form.trabalhaVendas === opt}
                          onChange={() => set("trabalhaVendas", opt)} required />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Canais */}
                <div className={styles.field}>
                  <label className={styles.label2}>Onde pretende divulgar suas indicações?</label>
                  <div className={styles.checkGroup}>
                    {CANAIS.map(canal => (
                      <label key={canal} className={styles.checkLabel}>
                        <input type="checkbox" checked={form.canais.includes(canal)}
                          onChange={() => toggleCanal(canal)} />
                        {canal}
                      </label>
                    ))}
                  </div>
                </div>

                {/* CNPJ */}
                <div className={styles.field}>
                  <label className={styles.label2}>Você possui CNPJ?</label>
                  <div className={styles.radioGroup}>
                    {["Sim", "Não"].map(opt => (
                      <label key={opt} className={styles.radioLabel}>
                        <input type="radio" name="cnpj" value={opt}
                          checked={form.cnpj === opt}
                          onChange={() => set("cnpj", opt)} required />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Volume */}
                <div className={styles.field}>
                  <label className={styles.label2}>Quantas pessoas você acredita que consegue indicar por mês?</label>
                  <div className={styles.radioGroup}>
                    {VOLUME.map(opt => (
                      <label key={opt} className={styles.radioLabel}>
                        <input type="radio" name="volume" value={opt}
                          checked={form.volume === opt}
                          onChange={() => set("volume", opt)} required />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Como conheceu */}
                <div className={styles.field}>
                  <label className={styles.label2}>Como conheceu o Programa de Afiliados Fivecred?</label>
                  <input className={styles.input} type="text" placeholder="Ex: indicação de amigo, redes sociais..."
                    value={form.comoConheceu} onChange={e => set("comoConheceu", e.target.value)} required />
                </div>

                {/* Termo de aceite */}
                <div className={styles.termoBox}>
                  <h4 className={styles.termoTitle}>Termo de aceite</h4>
                  <label className={styles.termoLabel}>
                    <input type="checkbox" checked={form.aceite}
                      onChange={e => set("aceite", e.target.checked)} />
                    <span>
                      Declaro que li e concordo com as regras do Programa de Afiliados{" "}
                      <strong>Fivecred</strong> e autorizo o contato da equipe para ativação do meu cadastro.
                    </span>
                  </label>
                </div>

                {error && <p className={styles.errorMsg}>{error}</p>}

                <motion.button type="submit" className={styles.submitBtn}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
                  {loading ? <span className={styles.loader} /> : "Enviar cadastro →"}
                </motion.button>

                <p className={styles.note}>Gratuito. Sem obrigação de meta. Ganhe no seu ritmo.</p>
              </form>
            ) : (
              <motion.div className={styles.success}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className={styles.successIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3>Cadastro realizado!</h3>
                <p>Entraremos em contato pelo WhatsApp com seu link exclusivo de afiliado.</p>
              </motion.div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
