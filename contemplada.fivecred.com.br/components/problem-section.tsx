"use client"

import { ArrowRight } from "lucide-react"

const numbers = [
  { value: "R$ 200k", label: "Valor do bem", desc: "O que você quer comprar" },
  { value: "R$ 380k", label: "Total no financiamento", desc: "Com juros bancários" },
  { value: "+ R$ 180k", label: "Você paga a mais", desc: "Por literalmente nada", highlight: true },
]

export function ProblemSection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <section id="problema" className="relative py-24 lg:py-32 overflow-hidden bg-slate-50">

      {/* Line grid texture */}
      <div className="absolute inset-0 line-grid opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">

        <div className="max-w-2xl mb-16">
          <span className="badge-orange mb-6 inline-flex">⚠ A matemática do financiamento</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-5 leading-tight">
            Você pesquisou financiamento e se{" "}
            <em className="not-italic text-gradient-orange">assustou?</em>
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Não é exagero. <strong className="text-slate-900">É matemática pura.</strong>
          </p>
        </div>

        {/* Numbers — VERTICAL STACKED with connecting line */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 mb-16 items-stretch lg:items-center max-w-4xl">
          {numbers.map((n, i) => (
            <div key={i} className="flex lg:flex-col items-center lg:items-start gap-4 flex-1">
              {/* Card */}
              <div className={`flex-1 lg:w-full rounded-2xl p-6 lg:p-8 transition-all duration-300 ${n.highlight ? "shadow-lg shadow-orange-500/10 -translate-y-1" : "shadow-sm"}`}
                style={n.highlight
                  ? { background: "#fff7ed", border: "1px solid rgba(232,89,12,0.3)" }
                  : { background: "#ffffff", border: "1px solid #e2e8f0" }
                }>
                <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${n.highlight ? "text-orange-600" : "text-slate-400"}`}>{n.label}</div>
                <div className={`text-3xl lg:text-4xl font-black leading-none mb-2 ${n.highlight ? "text-gradient-orange" : "text-slate-900"}`}
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  {n.value}
                </div>
                <div className={`text-sm ${n.highlight ? "text-orange-700/80" : "text-slate-500"}`}>{n.desc}</div>
              </div>

              {/* Connector arrow (between items) */}
              {i < numbers.length - 1 && (
                <div className="text-slate-300 text-2xl font-black flex-shrink-0 lg:hidden">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Callout block */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
          <div className="card-bordered bg-white">
            <p className="text-slate-700 text-base leading-relaxed">
              Mais de <strong className="text-orange-600">R$ 180.000 saindo do seu bolso</strong> sem comprar nada novo.
              Você literalmente paga dois bens para ter um.
            </p>
          </div>
          <div className="card-bordered bg-white" style={{ borderLeftColor: "#10b981" }}>
            <p className="text-slate-700 text-base leading-relaxed mb-4">
              Chama-se carta de crédito contemplada — você paga{" "}
              <strong className="text-emerald-600">zero juros ao banco</strong> e compra à vista.
            </p>
            <button onClick={() => scrollTo("como-funciona")}
              className="btn-orange text-sm px-5 py-3 inline-flex items-center gap-2">
              Ver como funciona <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
