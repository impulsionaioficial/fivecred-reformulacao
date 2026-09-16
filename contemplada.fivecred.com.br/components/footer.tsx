"use client"

import { MapPin, MessageCircle, ArrowUpRight } from "lucide-react"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">

      <div className="h-0.5" style={{ background: "linear-gradient(90deg, transparent, #FF7A30 30%, #E8590C 70%, transparent)" }} />

      <div className="container mx-auto px-4 lg:px-8 py-14 lg:py-18">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white"
                style={{ background: "linear-gradient(135deg, #FF7A30, #E8590C)" }}>
                FC
              </div>
              <div>
                <div className="font-black text-xl text-slate-900 tracking-tight leading-none">FiveCred</div>
                <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-none mt-0.5">Contemplada</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              5 passos para o seu futuro! Especialistas em carta contemplada e soluções financeiras. Compre seu bem à vista sem pagar juros ao banco.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/_fivecred" target="_blank" rel="noopener noreferrer" aria-label="Instagram FiveCred"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:border-orange-300 bg-white border border-slate-200 shadow-sm">
                <InstagramIcon className="w-4 h-4 text-slate-400" />
              </a>
              <a href="https://wa.me/5511961614215" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp FiveCred"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:border-emerald-300 bg-white border border-slate-200 shadow-sm">
                <MessageCircle className="w-4 h-4 text-slate-400 hover:text-emerald-500" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-black text-xs uppercase tracking-widest mb-6 text-slate-400">Carta Contemplada</h3>
            <ul className="space-y-3">
              {[
                { label: "Como Funciona", href: "#como-funciona" },
                { label: "Cartas Disponíveis", href: "#cartas" },
                { label: "Solicitar Crédito", href: "#formulario" },
                { label: "Política de Privacidade", href: "#" },
                { label: "Termos de Uso", href: "#" },
              ].map((item, i) => (
                <li key={i}>
                  <a href={item.href}
                    className="text-slate-500 hover:text-orange-600 transition-colors text-sm font-medium flex items-center gap-1 group">
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-black text-xs uppercase tracking-widest mb-6 text-slate-400">Atendimento</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/5511961614215" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 group">
                  <MessageCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-700 group-hover:text-orange-600 transition-colors text-sm font-semibold">(11) 96161-4215</div>
                    <div className="text-slate-400 text-xs">WhatsApp · Seg-Sex 8h–18h</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://instagram.com/_fivecred" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 group">
                  <InstagramIcon className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-700 group-hover:text-orange-600 transition-colors text-sm font-semibold">@_fivecred</div>
                    <div className="text-slate-400 text-xs">Instagram</div>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-700 text-sm font-semibold">Av. Brigadeiro Faria Lima</div>
                  <div className="text-slate-400 text-xs">São Paulo – SP</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-200">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} FiveCred. Todos os direitos reservados.
          </p>
          <p className="text-slate-400 text-xs text-center sm:text-right">
            Consórcio sujeito à análise. Condições variam conforme disponibilidade de cartas.
          </p>
        </div>
      </div>
    </footer>
  )
}
