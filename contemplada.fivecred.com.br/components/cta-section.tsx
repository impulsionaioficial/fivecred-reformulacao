"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, Shield, ChevronDown } from "lucide-react"

export function CtaSection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", type: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("https://hook.us1.make.celonis.com/0b1d6blfvvj1ay2qkf3yi62v7w7e04uk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "FiveCred Contemplada - CTA", timestamp: new Date().toISOString() }),
      })
    } catch {}
    const msg = `Olá! Tenho interesse em carta contemplada.\n\nNome: ${form.name}\nWhatsApp: ${form.phone}\nTipo de bem: ${form.type}`
    setLoading(false)
    setSubmitted(true)
    setTimeout(() => window.open(`https://wa.me/5511961614215?text=${encodeURIComponent(msg)}`, "_blank"), 1000)
  }

  return (
    <section className="relative py-24 lg:py-28 overflow-hidden bg-white">

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: "radial-gradient(ellipse, #E8590C, transparent 65%)" }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">

        <div className="flex items-center gap-4 rounded-2xl p-5 mb-12 bg-orange-50 border border-orange-100"
          style={{ borderLeft: "4px solid #E8590C" }}>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse-slow flex-shrink-0" />
          <p className="text-orange-700 text-sm font-semibold">
            As melhores cartas são assumidas por quem age primeiro — disponibilidade limitada
          </p>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-5 leading-tight">
            Enquanto você pensa,
            <span className="text-gradient-orange block">milhares pagam juros.</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
            Simule agora. É gratuito. Sem compromisso. Um consultor real responde pelo WhatsApp.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="h-1.5" style={{ background: "linear-gradient(90deg, #FF7A30, #E8590C)" }} />

          <div className="p-8 sm:p-10">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Solicitação enviada!</h3>
                <p className="text-slate-600 text-sm">Abrindo WhatsApp para finalizar sua análise...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-3 bg-orange-50 border border-orange-100 text-orange-600">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-slow inline-block" />
                    Consultor disponível agora
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Falar com um Consultor de Crédito</h3>
                  <p className="text-slate-500 text-sm mt-1">Seg a Sex, 8h às 18h · Barra Funda, São Paulo – SP</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="cta-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome</label>
                      <input id="cta-name" type="text" placeholder="Seu nome" required
                        className="w-full h-12 px-4 rounded-xl text-slate-900 text-sm outline-none transition-all bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="cta-phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WhatsApp</label>
                      <input id="cta-phone" type="tel" placeholder="(11) 96161-4215" required
                        className="w-full h-12 px-4 rounded-xl text-slate-900 text-sm outline-none transition-all bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="cta-type" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bem</label>
                      <select id="cta-type" required
                        className="w-full h-12 px-4 rounded-xl text-slate-900 text-sm outline-none appearance-none bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                        value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="" disabled>Selecione</option>
                        <option value="Veículo">Veículo</option>
                        <option value="Imóvel">Imóvel</option>
                        <option value="Caminhão/Frota">Caminhão/Frota</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-orange w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                    {loading ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando...</>
                    ) : (
                      <>Falar com um Consultor de Crédito <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-5 text-slate-400 text-xs">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="font-semibold uppercase tracking-wide">Ambiente 100% seguro · Sem spam</span>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="https://wa.me/5511961614215"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500 transition-colors text-sm font-semibold">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Prefere chamar direto no WhatsApp? (11) 96161-4215
          </a>
        </div>
      </div>
    </section>
  )
}
