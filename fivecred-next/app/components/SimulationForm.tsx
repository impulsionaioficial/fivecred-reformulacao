'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './SimulationForm.module.css';

type D = {
  name: string; whatsapp: string; cpf: string; birthdate: string;
  profile: string; hasLoan: string; bank: string; amount: string;
  contactTime: string; term1: boolean; term2: boolean;
};

const INIT: D = {
  name:'', whatsapp:'', cpf:'', birthdate:'',
  profile:'', hasLoan:'', bank:'', amount:'',
  contactTime:'', term1:false, term2:false,
};

const maskPhone = (v: string) => v.replace(/\D/g,'').slice(0,11)
  .replace(/^(\d{2})(\d{5})(\d{4})$/,'($1) $2-$3')
  .replace(/^(\d{2})(\d{4,5})(\d{0,4})$/,'($1) $2-$3')
  .replace(/^(\d{2})(\d{0,5})$/,'($1) $2');

const maskCPF = (v: string) => v.replace(/\D/g,'').slice(0,11)
  .replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})$/,'$1.$2.$3-$4')
  .replace(/(\d{3})(\d{3})(\d{1,3})$/,'$1.$2.$3')
  .replace(/(\d{3})(\d{1,3})$/,'$1.$2');

const maskDate = (v: string) => v.replace(/\D/g,'').slice(0,8)
  .replace(/(\d{2})(\d{2})(\d{1,4})$/,'$1/$2/$3')
  .replace(/(\d{2})(\d{1,2})$/,'$1/$2');

export default function SimulationForm() {
  const [d, setD] = useState<D>(INIT);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof D, v: string | boolean) => setD(p => ({ ...p, [k]: v }));

  const ok1 = d.name.trim().length > 2 && d.whatsapp.length >= 14 && d.cpf.length >= 14 && d.birthdate.length === 10;
  const ok2 = !!d.profile && d.hasLoan !== '';
  const ok3 = !!d.bank && !!d.amount && !!d.contactTime && d.term1 && d.term2;

  const WEBHOOK = 'https://hook.us1.make.celonis.com/a1niutnubcy8miisowdia8geyha1187u';

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ok3) return;
    setLoading(true);

    // Payload enviado ao webhook Make.com
    const payload = {
      nome:          d.name,
      whatsapp:      d.whatsapp,
      cpf:           d.cpf,
      nascimento:    d.birthdate,
      perfil:        d.profile,
      emprestimo_ativo: d.hasLoan,
      banco:         d.bank,
      valor_desejado: d.amount,
      horario_contato: d.contactTime,
      origem:        'consignado-fivecred',
      data:          new Date().toISOString(),
    };

    try {
      await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Segue mesmo se webhook falhar
    }

    setLoading(false);
    setDone(true);

    const msg = encodeURIComponent(
      `Olá! Me chamo ${d.name}.\n\nWhatsApp: ${d.whatsapp}\nCPF: ${d.cpf}\nNascimento: ${d.birthdate}\nPerfil: ${d.profile}\nEmpréstimo ativo: ${d.hasLoan}\nBanco: ${d.bank}\nValor: ${d.amount}\nHorário: ${d.contactTime}`
    );
    window.open(`https://wa.me/5500000000000?text=${msg}`, '_blank');
  };

  if (done) return (
    <div className={styles.card}>
      <div className={styles.success}>
        <div className={styles.successCheck}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 16l6 6 10-12" stroke="#F26522" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Solicitação enviada!</h3>
        <p>Nossa equipe entrará em contato no melhor horário para você.</p>
        <div className={styles.successNote}>Sem taxa · Sem compromisso · 100% seguro</div>
      </div>
    </div>
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <div className={styles.dot} />
        <div>
          <h2 className={styles.cardTitle}>Simulação 100% Gratuita</h2>
          <p className={styles.cardSub}>Sem consulta ao CPF · Sem compromisso</p>
        </div>
      </div>

      {/* Step dots */}
      <div className={styles.steps}>
        {[1,2,3].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s < 3 ? 1 : 'none' }}>
            <div className={`${styles.stepDot} ${step === s ? styles.stepActive : ''} ${step > s ? styles.stepDone : ''}`}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && <div className={`${styles.stepLine} ${step > s ? styles.stepLineDone : ''}`} />}
          </div>
        ))}
      </div>

      <form className={styles.form} onSubmit={send}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" className={styles.fields}
              initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}}
              transition={{duration:0.22}}>
              <div className={styles.field}>
                <label>Nome completo</label>
                <input type="text" placeholder="Ex: João da Silva" value={d.name}
                  onChange={e => set('name', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>WhatsApp (com DDD)</label>
                <input type="tel" placeholder="(11) 99999-9999" value={d.whatsapp}
                  onChange={e => set('whatsapp', maskPhone(e.target.value))} />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>CPF</label>
                  <input type="text" placeholder="000.000.000-00" value={d.cpf}
                    onChange={e => set('cpf', maskCPF(e.target.value))} />
                </div>
                <div className={styles.field}>
                  <label>Data de nascimento</label>
                  <input type="text" placeholder="DD/MM/AAAA" value={d.birthdate}
                    onChange={e => set('birthdate', maskDate(e.target.value))} />
                </div>
              </div>
              <button type="button" className={styles.btn} onClick={() => setStep(2)} disabled={!ok1}>
                Continuar →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" className={styles.fields}
              initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}}
              transition={{duration:0.22}}>
              <div className={styles.field}>
                <label>Você se enquadra em qual opção?</label>
                <div className={styles.radioCol}>
                  {['Aposentado INSS','Pensionista INSS','Trabalhador CLT','Possuo saldo FGTS','Conta de luz no meu nome','Busco empréstimo pessoal'].map(o => (
                    <label key={o} className={`${styles.radio} ${d.profile===o?styles.radioOn:''}`}>
                      <input type="radio" name="profile" value={o} checked={d.profile===o} onChange={() => set('profile',o)} />
                      <span className={styles.radioCircle} />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <label>Possui empréstimo ativo?</label>
                <div className={styles.radioRow}>
                  {['Sim','Não'].map(o => (
                    <label key={o} className={`${styles.radio} ${d.hasLoan===o?styles.radioOn:''}`}>
                      <input type="radio" name="hasLoan" value={o} checked={d.hasLoan===o} onChange={() => set('hasLoan',o)} />
                      <span className={styles.radioCircle} />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.navRow}>
                <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>← Voltar</button>
                <button type="button" className={styles.btn} onClick={() => setStep(3)} disabled={!ok2}>Continuar →</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" className={styles.fields}
              initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}}
              transition={{duration:0.22}}>
              <div className={styles.field}>
                <label>Recebe benefício/salário em qual banco?</label>
                <input type="text" placeholder="Nome do banco" value={d.bank}
                  onChange={e => set('bank', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Valor aproximado que deseja</label>
                <div className={styles.radioCol}>
                  {['Até R$ 1.000','R$ 1.000 a R$ 5.000','R$ 5.000 a R$ 10.000','Acima de R$ 10.000'].map(o => (
                    <label key={o} className={`${styles.radio} ${d.amount===o?styles.radioOn:''}`}>
                      <input type="radio" name="amount" value={o} checked={d.amount===o} onChange={() => set('amount',o)} />
                      <span className={styles.radioCircle} />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <label>Melhor horário para contato</label>
                <div className={styles.radioRow}>
                  {['Manhã','Tarde','Noite'].map(o => (
                    <label key={o} className={`${styles.radio} ${d.contactTime===o?styles.radioOn:''}`}>
                      <input type="radio" name="ct" value={o} checked={d.contactTime===o} onChange={() => set('contactTime',o)} />
                      <span className={styles.radioCircle} />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.terms}>
                <label className={styles.check}>
                  <input type="checkbox" checked={d.term1} onChange={e => set('term1', e.target.checked)} />
                  <span className={styles.checkBox} />
                  <span>Autorizo o contato da equipe <strong>Fivecred</strong> para análise de crédito e envio de proposta.</span>
                </label>
                <label className={styles.check}>
                  <input type="checkbox" checked={d.term2} onChange={e => set('term2', e.target.checked)} />
                  <span className={styles.checkBox} />
                  <span>Estou ciente de que a simulação é gratuita e sem compromisso, sem taxa antecipada.</span>
                </label>
              </div>
              <div className={styles.navRow}>
                <button type="button" className={styles.backBtn} onClick={() => setStep(2)}>← Voltar</button>
                <button type="submit" className={styles.btn} disabled={!ok3 || loading}>
                  {loading ? <span className={styles.spinner}/> : 'Quero minha simulação grátis →'}
                </button>
              </div>
              <p className={styles.secure}>Seus dados estão 100% seguros. Sem spam.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Trust bar */}
      <div className={styles.trustBar}>
        <span>CNPJ Verificado</span>
        <span className={styles.bar}>|</span>
        <span>Sede Física</span>
        <span className={styles.bar}>|</span>
        <span>+15k Aprovados</span>
      </div>
    </div>
  );
}
