"use client"

import { Search, Handshake, Key, ArrowRight } from "lucide-react"

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Escolha uma carta",
    desc: "Selecionamos opções compatíveis com seu objetivo. Todas analisadas juridicamente antes de chegar até você.",
    tag: "Análise jurídica inclusa",
    color: "#E8590C", // orange-600
  },
  {
    num: "02",
    icon: Handshake,
    title: "Assuma com entrada",
    desc: "Você paga a entrada acordada (a partir de 30%) e assume a posição no consórcio de quem vendeu a carta.",
    tag: "Entrada a partir de 30%",
    color: "#FF7A30", // orange lighter
  },
  {
    num: "03",
    icon: Key,
    title: "Compre à vista",
    desc: "O crédito contemplado permite comprar como pagamento à vista — sem juros bancários, com desconto real.",
    tag: "Zero juros bancários",
    color: "#059669", // emerald-600
  },
]

export function HowItWorksSection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <section id="como-funciona" className="relative py-24 lg:py-32 overflow-hidden bg-white">

      {/* Diagonal stripe accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03] blur-3xl"
          style={{ background: "radial-gradient(circle, #E8590C, transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">

        <div className="grid lg:grid-cols-2 gap-12 items-end mb-16 lg:mb-20">
          <div>
            <span className="badge-orange mb-6 inline-flex">💡 Como funciona</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              3 passos para comprar
              <span className="text-gradient-orange block">sem juros.</span>
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="text-slate-600 text-lg leading-relaxed max-w-md lg:ml-auto">
              Muitas pessoas vendem a carta porque mudaram de plano.
              Você assume e usa o crédito para comprar à vista.
              <br /><br />
              <span className="text-orange-600 font-bold">Você não precisa entender de consórcio. Nós cuidamos disso.</span>
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-14 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent 5%, #fdba74 20%, #fdba74 80%, transparent 95%)" }} />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="relative group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg z-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 bg-white"
                      style={{ border: `2px solid ${step.color}`, color: step.color, fontFamily: "'Sora', sans-serif" }}>
                      {step.num}
                    </div>
                    <div className="h-px flex-1 lg:hidden bg-orange-200" />
                  </div>

                  {/* Content card */}
                  <div className="rounded-2xl p-6 lg:p-7 transition-all duration-300 bg-white border border-slate-200 shadow-sm group-hover:shadow-lg group-hover:border-orange-200 group-hover:-translate-y-1">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: `${step.color}10`, border: `1px solid ${step.color}20` }}>
                      <Icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{step.desc}</p>
                    <div className="inline-flex items-center gap-2 text-xs font-bold rounded-lg px-3 py-1.5"
                      style={{ background: `${step.color}10`, color: step.color, border: `1px solid ${step.color}20` }}>
                      ✓ {step.tag}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center mt-16">
          <button onClick={() => scrollTo("formulario")} className="btn-orange px-10 py-5 text-lg">
            Quero minha carta agora
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-slate-500 font-medium text-sm mt-4">+500 famílias já usaram a carta contemplada 🏡</p>
        </div>
      </div>
    </section>
  )
}
