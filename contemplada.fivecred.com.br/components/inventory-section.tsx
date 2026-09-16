"use client"

import { Car, Home, Truck, ArrowRight, Zap } from "lucide-react"

const cards = [
  {
    icon: Car,
    category: "Veículos",
    range: "R$ 60k – R$ 150k",
    tags: ["Carros", "SUVs", "Seminovos"],
    color: "#2563eb", // blue-600
    bg: "#f0f9ff", // sky-50
    border: "#bae6fd", // sky-200
  },
  {
    icon: Home,
    category: "Imóveis",
    range: "R$ 200k – R$ 450k",
    tags: ["Apartamentos", "Casas", "Terrenos"],
    color: "#E8590C", // orange-600
    bg: "#fff7ed", // orange-50
    border: "#fed7aa", // orange-200
    featured: true,
  },
  {
    icon: Truck,
    category: "Caminhões / Frotas",
    range: "R$ 150k – R$ 500k",
    tags: ["Caminhões", "Frotas", "Empresas"],
    color: "#059669", // emerald-600
    bg: "#ecfdf5", // emerald-50
    border: "#a7f3d0", // emerald-200
  },
]

export function InventorySection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <section id="cartas" className="relative py-24 lg:py-32 overflow-hidden bg-white">

      <div className="absolute inset-0 line-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600">
            <Zap className="w-3.5 h-3.5" />
            Disponibilidade em Tempo Real
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            Cartas Disponíveis <span className="text-gradient-orange">Agora</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            As cartas dependem de disponibilidade real nos grupos de consórcio.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {cards.map((c, i) => {
            const Icon = c.icon
            return (
              <div key={i}
                className={`group relative rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${c.featured ? "shadow-md shadow-orange-500/10" : "shadow-sm"}`}
                style={{ background: "#ffffff", border: `2px solid ${c.border}` }}
                onClick={() => scrollTo("formulario")}>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  <Icon className="w-7 h-7" style={{ color: c.color }} />
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-1">{c.category}</h3>

                {/* Range as the hero number */}
                <div className="text-3xl font-black mb-5 leading-tight"
                  style={{ color: c.color, fontFamily: "'Sora', sans-serif" }}>
                  {c.range}
                </div>

                {/* Tags as pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {c.tags.map((t, j) => (
                    <span key={j} className="text-[11px] font-bold px-2.5 py-1 rounded-md"
                      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={e => { e.stopPropagation(); scrollTo("formulario") }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition-all group-hover:opacity-80"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
                  Quero essa carta
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>

        <p className="text-center text-slate-500 text-sm font-medium">
          🔄 Disponibilidade varia conforme os grupos de consórcio — consulte nosso especialista
        </p>
      </div>
    </section>
  )
}
