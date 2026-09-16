"use client"

import { useState, useEffect } from "react"
import { ArrowRight, CheckCircle2, Star, Car, Home, TrendingDown, ChevronDown } from "lucide-react"

export function HeroSection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", type: "" })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("https://hook.us1.make.celonis.com/0b1d6blfvvj1ay2qkf3yi62v7w7e04uk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "FiveCred Contemplada - Hero", timestamp: new Date().toISOString() }),
      })
    } catch {}
    const msg = `Olá! Tenho interesse em carta contemplada.\n\nNome: ${form.name}\nWhatsApp: ${form.phone}\nTipo de bem: ${form.type}`
    setLoading(false)
    setSubmitted(true)
    setTimeout(() => window.open(`https://wa.me/5511961614215?text=${encodeURIComponent(msg)}`, "_blank"), 1000)
  }

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <section
      id="topo"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white"
    >
      {/* Background accents */}
      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
      
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #E8590C, transparent 70%)", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF7A30, transparent 70%)", transform: "translate(-30%, 30%)" }} />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-28 pb-20">

        {/* ── CENTERED HERO COPY ── */}
        <div className={`text-center max-w-4xl mx-auto mb-14 ${mounted ? "animate-slide-up" : "opacity-0"}`}>

          {/* Badge row */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            <div className="badge-orange">
              <Star className="w-3.5 h-3.5 fill-current" />
              Análise jurídica inclusa
            </div>
            <div className="badge-light">
              ✓ Sem juros bancários
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
            Compre seu bem{" "}
            <span className="relative inline-block">
              <span className="text-gradient-orange">à vista</span>
              <span
                className="absolute -bottom-2 left-0 right-0 h-1.5 rounded-full"
                style={{ background: "linear-gradient(90deg, #E8590C, #FF7A30, transparent)" }}
              />
            </span>
            <br />
            <span className="text-slate-800">sem pagar juros ao banco.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
            Acesse cartas de crédito contempladas analisadas juridicamente pela FiveCred
            e tenha <strong className="text-orange-600 font-bold">poder de compra imediato</strong>.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {[
              { icon: TrendingDown, value: "0%", label: "Juros bancários", color: "#059669" }, // emerald-600
              { icon: Car, value: "30%", label: "Entrada mínima", color: "#E8590C" }, // orange
              { icon: Home, value: "À vista", label: "Poder de compra", color: "#2563eb" }, // blue-600
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="flex items-center gap-3 rounded-2xl px-5 py-3 bg-slate-50 border border-slate-200 shadow-sm">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.color}15` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: s.color }} />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-xl leading-none" style={{ color: s.color, fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
                    <div className="text-slate-500 text-[11px] font-semibold uppercase tracking-wide mt-0.5">{s.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── FORM ── */}
        <div
          id="formulario"
          className={`max-w-2xl mx-auto ${mounted ? "animate-scale-in" : "opacity-0"}`}
          style={{ animationDelay: "0.15s" }}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white border border-slate-200">

            {/* Top accent line */}
            <div className="h-1.5" style={{ background: "linear-gradient(90deg, #FF7A30, #E8590C)" }} />

            <div className="p-8 sm:p-10">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Enviado com sucesso!</h3>
                  <p className="text-slate-600">Abrindo WhatsApp para continuar...</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4 bg-orange-50 border border-orange-100 text-orange-600">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-slow inline-block" />
                      Consultor disponível agora
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Ver Cartas Disponíveis</h2>
                    <p className="text-slate-500 text-sm mt-1">Preencha e um especialista entra em contato hoje</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid sm:grid-cols-3 gap-4 mb-5">
                      <div>
                        <label htmlFor="h-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome</label>
                        <input id="h-name" type="text" placeholder="Seu nome" required
                          className="w-full h-12 px-4 rounded-xl text-slate-900 text-sm transition-all outline-none bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div>
                        <label htmlFor="h-phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WhatsApp</label>
                        <input id="h-phone" type="tel" placeholder="(11) 96161-4215" required
                          className="w-full h-12 px-4 rounded-xl text-slate-900 text-sm transition-all outline-none bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                          value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div>
                        <label htmlFor="h-type" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipo de bem</label>
                        <select id="h-type" required
                          className="w-full h-12 px-4 rounded-xl text-slate-900 text-sm transition-all outline-none appearance-none bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                          value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                          <option value="" disabled>Selecione</option>
                          <option value="Veículo">Veículo (R$60k–150k)</option>
                          <option value="Imóvel">Imóvel (R$200k–450k)</option>
                          <option value="Caminhão/Frota">Caminhão/Frota</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" disabled={loading}
                      className="btn-orange w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                      {loading ? (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando...</>
                      ) : (
                        <>Ver cartas disponíveis <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-6 mt-6">
                      {["CNPJ Verificado", "Análise Jurídica", "+500 Aprovados"].map((t, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {t}
                        </div>
                      ))}
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="text-center mt-14">
          <button onClick={() => scrollTo("problema")}
            className="flex flex-col items-center gap-2 mx-auto text-slate-400 hover:text-orange-500 transition-colors animate-bounce-subtle">
            <span className="text-xs uppercase tracking-widest font-semibold">Entenda como funciona</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
