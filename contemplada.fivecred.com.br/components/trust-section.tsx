"use client"

import { ShieldCheck, Building2, MapPin, FileCheck, UserCheck, BadgeCheck, Lock } from "lucide-react"

const badges = [
  { icon: Building2, title: "CNPJ Verificado", desc: "Empresa auditável e verificável" },
  { icon: FileCheck, title: "Contratos Auditados", desc: "Análise jurídica em toda oferta" },
  { icon: MapPin, title: "Sede em São Paulo", desc: "Av. Brigadeiro Faria Lima – SP" },
  { icon: UserCheck, title: "Consultor Real", desc: "Atendimento humano via WhatsApp" },
]

const howWeWork = [
  "Atendimento por consultor real (WhatsApp ou presencial)",
  "Apenas cartas analisadas e compatíveis com seu perfil",
  "Acompanhamento até a transferência do bem",
  "Auditoria jurídica antes de qualquer oferta",
]

export function TrustSection() {
  return (
    <section className="relative py-24 lg:py-28 overflow-hidden bg-slate-50">

      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">

        <div className="text-center mb-16">
          <span className="badge-orange mb-6 inline-flex">🔒 Empresa Verificável</span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 max-w-2xl mx-auto leading-tight">
            Você não está falando com
            <span className="text-gradient-orange block">um site anônimo.</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-lg mx-auto">
            A internet está cheia de golpes com a palavra "consórcio". A FiveCred é verificável.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {badges.map((b, i) => {
            const Icon = b.icon
            return (
              <div key={i} className="flex items-center gap-3 rounded-2xl px-5 py-4 bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-50 border border-orange-100">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-slate-900 font-black text-sm">{b.title}</div>
                  <div className="text-slate-500 text-xs">{b.desc}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl p-8 lg:p-10 bg-white border border-orange-200 shadow-lg shadow-orange-500/5 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-100 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/2" />

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-50 border border-orange-100">
                  <ShieldCheck className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <div className="text-slate-900 font-black text-lg">Como trabalhamos</div>
                  <div className="text-orange-600 text-sm font-semibold">Transparência em cada etapa</div>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Você pode verificar a empresa, falar com um consultor e entender todas as opções
                antes de tomar qualquer decisão.
              </p>
            </div>

            <ul className="space-y-3">
              {howWeWork.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <BadgeCheck className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {[
            { icon: Lock, label: "Ambiente 100% Seguro" },
            { icon: BadgeCheck, label: "LGPD Compliant" },
            { icon: ShieldCheck, label: "Criptografia SSL" },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                <Icon className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold uppercase tracking-widest">{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
