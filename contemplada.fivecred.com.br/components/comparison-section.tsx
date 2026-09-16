"use client"

import { CheckCircle2, XCircle } from "lucide-react"

const rows = [
  { criterio: "Juros pagos", banco: "12% a 18% ao ano", contemplada: "Zero — compra à vista" },
  { criterio: "Total pago (R$ 200k)", banco: "Até R$ 380.000", contemplada: "~R$ 200k + entrada" },
  { criterio: "Poder de compra", banco: "Parcelado com juros", contemplada: "À vista com desconto real" },
  { criterio: "Aprovação", banco: "Burocrática e demorada", contemplada: "Consultiva e ágil" },
  { criterio: "Análise jurídica", banco: "Não incluída", contemplada: "Inclusa em todas as cartas" },
]

export function ComparisonSection() {
  return (
    <section className="relative py-24 lg:py-28 overflow-hidden bg-slate-50">

      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center max-w-5xl mx-auto">

          {/* Left: headline + description */}
          <div>
            <span className="badge-orange mb-6 inline-flex">📊 Compare e decida</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 leading-tight">
              A matemática
              <span className="text-gradient-orange block">não mente.</span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Financiamento bancário vs. Carta Contemplada no mesmo bem, no mesmo valor.
            </p>

            {/* Big saving callout */}
            <div className="rounded-2xl p-6 bg-orange-50 border border-orange-200 shadow-sm">
              <div className="text-orange-600 text-sm font-bold uppercase tracking-wider mb-2">Economia potencial</div>
              <div className="text-5xl font-black text-gradient-orange" style={{ fontFamily: "'Sora', sans-serif" }}>
                R$ 165k
              </div>
              <div className="text-slate-600 font-medium text-sm mt-2">no mesmo bem avaliado em R$ 200.000</div>
            </div>
          </div>

          {/* Right: table */}
          <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg">

            {/* Table header */}
            <div className="grid grid-cols-[1fr_1fr_1fr]">
              <div className="p-4 pl-5 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">Critério</div>
              <div className="p-4 border-b border-l border-slate-100 text-center bg-slate-50">
                <div className="text-red-500 text-xs font-black uppercase tracking-wide">Banco</div>
              </div>
              <div className="p-4 border-b border-l border-orange-200 relative text-center bg-orange-50/50">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-400" />
                <div className="text-orange-600 text-xs font-black uppercase tracking-wide">Contemplada</div>
              </div>
            </div>

            {rows.map((row, i) => (
              <div key={i} className={`grid grid-cols-[1fr_1fr_1fr] border-t border-slate-100 ${i % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                <div className="p-3.5 pl-5 text-xs font-bold text-slate-600">{row.criterio}</div>
                <div className="p-3.5 border-l border-slate-100 flex items-center justify-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span className="text-slate-500 text-[11px] font-semibold text-center leading-tight">{row.banco}</span>
                </div>
                <div className="p-3.5 border-l border-orange-100 bg-orange-50/30 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  <span className="text-orange-700 text-[11px] font-bold text-center leading-tight">{row.contemplada}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
