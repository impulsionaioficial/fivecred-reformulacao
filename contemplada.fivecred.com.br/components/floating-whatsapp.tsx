"use client"

import { X } from "lucide-react"
import { useState } from "react"

export function FloatingWhatsApp() {
  const [dismissed, setDismissed] = useState(false)

  const WAIcon = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )

  if (dismissed) {
    return (
      <a href="https://wa.me/5511961614215" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
        style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", boxShadow: "0 8px 30px rgba(37,211,102,0.4)" }}
        aria-label="Falar no WhatsApp">
        <WAIcon />
      </a>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat bubble — light style */}
      <div className="relative rounded-2xl p-4 max-w-xs shadow-2xl bg-white border border-slate-200"
        style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
          aria-label="Fechar">
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xs text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #FF7A30, #E8590C)" }}>
            FC
          </div>
          <div>
            <div className="font-black text-slate-900 text-sm">FiveCred Contemplada</div>
            <div className="text-emerald-600 text-xs mb-2 font-medium">Especialista Online ✓</div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Posso te ajudar a encontrar uma carta contemplada para comprar seu bem à vista? 💬
            </p>
          </div>
        </div>
        {/* Triangle */}
        <div className="absolute -bottom-2 right-8"
          style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid #ffffff", filter: "drop-shadow(0 2px 1px rgba(0,0,0,0.05))" }} />
      </div>

      <a href="https://wa.me/5511961614215" target="_blank" rel="noopener noreferrer"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
        style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", boxShadow: "0 8px 30px rgba(37,211,102,0.4)" }}
        aria-label="Falar no WhatsApp">
        <WAIcon />
      </a>
    </div>
  )
}
