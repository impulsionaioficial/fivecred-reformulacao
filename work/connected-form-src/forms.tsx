import React, { useEffect, useRef, useState } from 'react';

export const ENDPOINTS = {
  home: 'https://hook.us1.make.celonis.com/a1niutnubcy8miisowdia8geyha1187u',
  affiliate: 'https://hook.us1.make.celonis.com/m4ln9sg12wotrfm5nejxgtge8qfpg2kd',
  buyer: 'https://hook.us1.make.celonis.com/0b1d6blfvvj1ay2qkf3yi62v7w7e04uk',
};
export const SLUGS: Record<string, string> = {
  'fivecred-next': 'home', 'fivecred-afiliados': 'affiliate',
  'contemplada.fivecred.com.br': 'buyer', home: 'home', affiliate: 'affiliate', buyer: 'buyer',
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
  .replace(/^(\d{2})(\d{2})(\d{1,4})$/,'$1/$2/$3')
  .replace(/^(\d{2})(\d{1,2})$/,'$1/$2');
function maskAffiliatePhone(v: string) {
  return v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');
}

function useSubmission(endpoint: string) {
  const busy = useRef(false);
  const [loading,setLoading] = useState(false);
  const [done,setDone] = useState(false);
  const [error,setError] = useState('');
  async function send(payload: unknown, afterSuccess?: () => void) {
    if (busy.current) return;
    busy.current = true; setLoading(true); setError('');
    try {
      const response = await fetch(endpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if (!response.ok) {
        setError('Não foi possível enviar seus dados. Tente novamente.');
        busy.current = false; return;
      }
      setDone(true);
      afterSuccess?.();
    } catch {
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
      busy.current = false;
    } finally { setLoading(false); }
  }
  return {loading,done,error,setError,send};
}
function ReadyFields({children,loading}: {children:React.ReactNode,loading:boolean}) {
  const ref = useRef<HTMLFieldSetElement>(null);
  const [ready,setReady] = useState(false);
  useEffect(()=>{setReady(true);const mount=ref.current?.closest<HTMLElement>('[data-connected-form]');if(mount)mount.dataset.formReady='true';},[]);
  // Keep server-rendered inputs disabled until React attaches submit handlers.
  return <fieldset ref={ref} className="cf-fields-root" disabled={!ready || loading}>{children}</fieldset>;
}
function TextField({prefix,name,label,value,onChange,type='text',placeholder='',required=true,maxLength,inputMode,autoComplete}:any) {
  const id=`${prefix}-${name}`;
  return <div className="cf-field"><label htmlFor={id}>{label}</label><input id={id} name={name} type={type} value={value} placeholder={placeholder} required={required} maxLength={maxLength} inputMode={inputMode} autoComplete={autoComplete} onChange={e=>onChange(e.target.value)}/></div>;
}
function RadioField({name,label,options,value,onChange,columns=false}:any) {
  return <fieldset className="cf-field"><legend>{label}</legend><div className={`cf-choices${columns?' cf-choices-row':''}`}>{options.map((option:string)=><label key={option} className={`cf-choice${value===option?' cf-choice-selected':''}`}><input type="radio" name={name} value={option} checked={value===option} onChange={()=>onChange(option)} required/><span>{option}</span></label>)}</div></fieldset>;
}
function Feedback({error}: {error:string}) {return error?<p className="cf-error" role="alert">{error}</p>:null;}
function Success({title,children}: {title:string,children:React.ReactNode}) {
  const ref=useRef<HTMLDivElement>(null);useEffect(()=>{ref.current?.focus();},[]);
  return <div className="cf-success" ref={ref} tabIndex={-1} role="status"><span className="cf-success-check" aria-hidden="true">✓</span><h3>{title}</h3>{children}</div>;
}
function FormHeader({title,description}: {title:string,description:string}) {return <div className="cf-header"><p className="cf-eyebrow">Fivecred</p><h2>{title}</h2><p>{description}</p></div>;}

// Field names, choices, masks and payload follow fivecred-next/app/components/SimulationForm.tsx.
function HomeForm({placement}: {placement:string}) {
  const prefix=`cf-home-${placement}`;
  const [d,setD] = useState({name:'',whatsapp:'',cpf:'',birthdate:'',profile:'',hasLoan:'',bank:'',amount:'',contactTime:'',term1:false,term2:false});
  const [step,setStep]=useState(1);
  const submission=useSubmission(ENDPOINTS.home);
  const set=(key:string,value:string|boolean)=>setD(p=>({...p,[key]:value}));
  const ok1=d.name.trim().length>2 && d.whatsapp.length>=14 && d.cpf.length>=14 && d.birthdate.length===10;
  const ok2=!!d.profile && d.hasLoan!=='';
  const ok3=!!d.bank && !!d.amount && !!d.contactTime && d.term1 && d.term2;
  const stepHeading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(step>1)stepHeading.current?.focus();},[step]);
  async function submit(e:React.FormEvent){e.preventDefault();if(step!==3 || !ok1 || !ok2 || !ok3)return;await submission.send({nome:d.name,whatsapp:d.whatsapp,cpf:d.cpf,nascimento:d.birthdate,perfil:d.profile,emprestimo_ativo:d.hasLoan,banco:d.bank,valor_desejado:d.amount,horario_contato:d.contactTime,origem:'consignado-fivecred',data:new Date().toISOString()});}
  if(submission.done)return <div className="cf-card"><Success title="Solicitação enviada!"><p>Nossa equipe entrará em contato no melhor horário para você.</p></Success></div>;
  return <div className="cf-card"><FormHeader title="Simulação 100% Gratuita" description="Sem consulta ao CPF · Sem compromisso"/>
    <ol className="cf-progress" aria-label="Etapas da simulação">{['Seus dados','Seu perfil','Sua simulação'].map((label,i)=><li key={label} className={step>=i+1?'cf-progress-active':''} aria-current={step===i+1?'step':undefined}><span aria-hidden="true">{step>i+1?'✓':i+1}</span><span>{label}</span></li>)}</ol>
    <form onSubmit={submit} aria-label="Simulação gratuita" aria-busy={submission.loading}><ReadyFields loading={submission.loading}>
      <h3 className="cf-step-title" ref={stepHeading} tabIndex={-1}>Etapa {step} de 3 — {['Seus dados','Seu perfil','Sua simulação'][step-1]}</h3>
      {step===1&&<div className="cf-stack">
        <TextField prefix={prefix} name="name" label="Nome completo" placeholder="Ex: João da Silva" autoComplete="name" value={d.name} onChange={(v:string)=>set('name',v)}/>
        <TextField prefix={prefix} name="whatsapp" label="WhatsApp (com DDD)" type="tel" placeholder="(11) 99999-9999" autoComplete="tel-national" value={d.whatsapp} onChange={(v:string)=>set('whatsapp',maskPhone(v))}/>
        <div className="cf-row"><TextField prefix={prefix} name="cpf" label="CPF" inputMode="numeric" placeholder="000.000.000-00" value={d.cpf} onChange={(v:string)=>set('cpf',maskCPF(v))}/><TextField prefix={prefix} name="birthdate" label="Data de nascimento" inputMode="numeric" autoComplete="bday" placeholder="DD/MM/AAAA" value={d.birthdate} onChange={(v:string)=>set('birthdate',maskDate(v))}/></div>
        <button className="cf-submit" type="button" disabled={!ok1} onClick={()=>setStep(2)}>Continuar →</button>
      </div>}
      {step===2&&<div className="cf-stack">
        <RadioField name="profile" label="Você se enquadra em qual opção?" options={['Aposentado INSS','Pensionista INSS','Trabalhador CLT','Possuo saldo FGTS','Conta de luz no meu nome','Busco empréstimo pessoal']} value={d.profile} onChange={(v:string)=>set('profile',v)}/>
        <RadioField name="hasLoan" label="Possui empréstimo ativo?" options={['Sim','Não']} value={d.hasLoan} onChange={(v:string)=>set('hasLoan',v)} columns/>
        <div className="cf-actions"><button type="button" className="cf-back" onClick={()=>setStep(1)}>← Voltar</button><button type="button" className="cf-submit" disabled={!ok2} onClick={()=>setStep(3)}>Continuar →</button></div>
      </div>}
      {step===3&&<div className="cf-stack">
        <TextField prefix={prefix} name="bank" label="Recebe benefício/salário em qual banco?" placeholder="Nome do banco" value={d.bank} onChange={(v:string)=>set('bank',v)}/>
        <RadioField name="amount" label="Valor aproximado que deseja" options={['Até R$ 1.000','R$ 1.000 a R$ 5.000','R$ 5.000 a R$ 10.000','Acima de R$ 10.000']} value={d.amount} onChange={(v:string)=>set('amount',v)}/>
        <RadioField name="ct" label="Melhor horário para contato" options={['Manhã','Tarde','Noite']} value={d.contactTime} onChange={(v:string)=>set('contactTime',v)} columns/>
        <div className="cf-terms"><label className="cf-check"><input type="checkbox" name="term1" checked={d.term1} onChange={e=>set('term1',e.target.checked)} required/><span>Autorizo o contato da equipe <strong>Fivecred</strong> para análise de crédito e envio de proposta.</span></label><label className="cf-check"><input type="checkbox" name="term2" checked={d.term2} onChange={e=>set('term2',e.target.checked)} required/><span>Estou ciente de que a simulação é gratuita e sem compromisso, sem taxa antecipada.</span></label></div>
        <Feedback error={submission.error}/>
        <div className="cf-actions"><button type="button" className="cf-back" onClick={()=>setStep(2)}>← Voltar</button><button type="submit" className="cf-submit" disabled={!ok3 || submission.loading}>{submission.loading?'Enviando...':'Quero minha simulação grátis →'}</button></div>
      </div>}
    </ReadyFields></form>
  </div>;
}

// All ten original affiliate fields, choices and comma-joined channel payload are preserved.
function AffiliateForm({placement}: {placement:string}) {
  const prefix=`cf-affiliate-${placement}`;
  const [form,setForm]=useState({nome:'',whatsapp:'',email:'',cidade:'',trabalhaVendas:'',canais:[] as string[],cnpj:'',volume:'',comoConheceu:'',aceite:false});
  const submission=useSubmission(ENDPOINTS.affiliate);
  const set=(key:string,value:string|boolean)=>setForm(p=>({...p,[key]:value}));
  const toggle=(canal:string)=>setForm(p=>({...p,canais:p.canais.includes(canal)?p.canais.filter(c=>c!==canal):[...p.canais,canal]}));
  async function submit(e:React.FormEvent){e.preventDefault();if(!form.aceite){submission.setError('Você precisa aceitar os termos para continuar.');return;}await submission.send({...form,canais:form.canais.join(', '),origem:'landing-afiliados',data:new Date().toISOString(),pagina:window.location.href});}
  if(submission.done)return <div className="cf-card"><Success title="Cadastro realizado!"><p>Entraremos em contato pelo WhatsApp com seu link exclusivo de afiliado.</p></Success></div>;
  return <div className="cf-card cf-affiliate"><FormHeader title="Programa de Afiliados Fivecred" description="Preencha seus dados e comece a ganhar indicando"/>
    <form onSubmit={submit} aria-label="Cadastro no Programa de Afiliados Fivecred" aria-busy={submission.loading}><ReadyFields loading={submission.loading}><div className="cf-stack">
      <TextField prefix={prefix} name="nome" label="Nome completo" placeholder="Seu nome completo" autoComplete="name" value={form.nome} onChange={(v:string)=>set('nome',v)}/>
      <TextField prefix={prefix} name="whatsapp" label="WhatsApp (com DDD)" type="tel" placeholder="(00) 00000-0000" maxLength={15} autoComplete="tel-national" value={form.whatsapp} onChange={(v:string)=>set('whatsapp',maskAffiliatePhone(v))}/>
      <TextField prefix={prefix} name="email" label="E-mail" type="email" placeholder="seu@email.com" autoComplete="email" value={form.email} onChange={(v:string)=>set('email',v)}/>
      <TextField prefix={prefix} name="cidade" label="Cidade / Estado" placeholder="Ex: Belo Horizonte / MG" value={form.cidade} onChange={(v:string)=>set('cidade',v)}/>
      <RadioField name="trabalhaVendas" label="Você já trabalha com indicações ou vendas?" options={['Sim','Não']} value={form.trabalhaVendas} onChange={(v:string)=>set('trabalhaVendas',v)} columns/>
      <fieldset className="cf-field"><legend>Onde pretende divulgar suas indicações?</legend><div className="cf-choices cf-choices-row">{['WhatsApp','Instagram','Facebook','TikTok','YouTube','Rede de contatos pessoais','Outros'].map(canal=><label key={canal} className={`cf-choice${form.canais.includes(canal)?' cf-choice-selected':''}`}><input type="checkbox" name="canais" value={canal} checked={form.canais.includes(canal)} onChange={()=>toggle(canal)}/><span>{canal}</span></label>)}</div></fieldset>
      <RadioField name="cnpj" label="Você possui CNPJ?" options={['Sim','Não']} value={form.cnpj} onChange={(v:string)=>set('cnpj',v)} columns/>
      <RadioField name="volume" label="Quantas pessoas você acredita que consegue indicar por mês?" options={['1 a 5','5 a 10','10 a 20','Mais de 20']} value={form.volume} onChange={(v:string)=>set('volume',v)} columns/>
      <TextField prefix={prefix} name="comoConheceu" label="Como conheceu o Programa de Afiliados Fivecred?" placeholder="Ex: indicação de amigo, redes sociais..." value={form.comoConheceu} onChange={(v:string)=>set('comoConheceu',v)}/>
      <div className="cf-terms"><h3>Termo de aceite</h3><label className="cf-check"><input type="checkbox" name="aceite" checked={form.aceite} onChange={e=>set('aceite',e.target.checked)}/><span>Declaro que li e concordo com as regras do Programa de Afiliados <strong>Fivecred</strong> e autorizo o contato da equipe para ativação do meu cadastro.</span></label></div>
      <Feedback error={submission.error}/><button type="submit" className="cf-submit" disabled={submission.loading}>{submission.loading?'Enviando...':'Enviar cadastro →'}</button><p className="cf-note">Gratuito. Sem obrigação de meta. Ganhe no seu ritmo.</p>
    </div></ReadyFields></form>
  </div>;
}

// Hero/CTA keep their own source labels, original field values and WhatsApp destination.
function BuyerForm({placement}: {placement:string}) {
  const isCta=placement==='cta';const prefix=`cf-buyer-${placement}`;
  const [form,setForm]=useState({name:'',phone:'',type:''});
  const submission=useSubmission(ENDPOINTS.buyer);
  const msg=`Olá! Tenho interesse em carta contemplada.\n\nNome: ${form.name}\nWhatsApp: ${form.phone}\nTipo de bem: ${form.type}`;
  const whatsapp=`https://wa.me/5511961614215?text=${encodeURIComponent(msg)}`;
  async function submit(e:React.FormEvent){e.preventDefault();const scope=e.currentTarget.closest('[data-connected-form]');const trigger=e.currentTarget.querySelector('button[type=submit]');await submission.send({...form,source:isCta?'FiveCred Contemplada - CTA':'FiveCred Contemplada - Hero',timestamp:new Date().toISOString()},()=>{window.dispatchEvent(new CustomEvent('fivecred:whatsapp',{detail:{url:whatsapp,name:form.name,scope,trigger}}));});}
  if(submission.done)return <div className="cf-card"><Success title={isCta?'Solicitação enviada!':'Enviado com sucesso!'}><p>Para conversar no WhatsApp, confirme seu nome e e-mail no próximo passo.</p><a className="cf-submit" data-contact-name={form.name} href={whatsapp} target="_blank" rel="noopener noreferrer">Continuar no WhatsApp</a></Success></div>;
  return <div className="cf-card cf-buyer"><FormHeader title={isCta?'Falar com um Consultor de Crédito':'Ver Cartas Disponíveis'} description={isCta?'Seg a Sex, 8h às 18h · Barra Funda, São Paulo – SP':'Preencha e um especialista entra em contato hoje'}/>
    <form onSubmit={submit} aria-label={isCta?'Contato sobre carta contemplada':'Consulta de cartas contempladas'} aria-busy={submission.loading}><ReadyFields loading={submission.loading}><div className="cf-stack">
      <TextField prefix={prefix} name="name" label="Nome" placeholder="Seu nome" autoComplete="name" value={form.name} onChange={(v:string)=>setForm(p=>({...p,name:v}))}/>
      <TextField prefix={prefix} name="phone" label="WhatsApp" type="tel" placeholder="(11) 96161-4215" autoComplete="tel-national" value={form.phone} onChange={(v:string)=>setForm(p=>({...p,phone:v}))}/>
      <div className="cf-field"><label htmlFor={`${prefix}-type`}>{isCta?'Bem':'Tipo de bem'}</label><select id={`${prefix}-type`} name="type" required value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}><option value="" disabled>Selecione</option><option value="Veículo">{isCta?'Veículo':'Veículo (R$60k–150k)'}</option><option value="Imóvel">{isCta?'Imóvel':'Imóvel (R$200k–450k)'}</option><option value="Caminhão/Frota">Caminhão/Frota</option></select></div>
      <Feedback error={submission.error}/><button type="submit" className="cf-submit" disabled={submission.loading}>{submission.loading?'Enviando...':isCta?'Falar com um Consultor de Crédito →':'Ver cartas disponíveis →'}</button>
    </div></ReadyFields></form>
  </div>;
}
export function ConnectedForm({kind,placement='hero'}: {kind:string,placement?:string}) {
  if(kind==='home')return <HomeForm placement={placement}/>;
  if(kind==='affiliate')return <AffiliateForm placement={placement}/>;
  if(kind==='buyer')return <BuyerForm placement={placement}/>;
  throw new Error(`Unsupported connected form: ${kind}`);
}

