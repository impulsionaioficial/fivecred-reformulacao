import type { Metadata } from "next";
import content from "./content.json";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Comprar carta contemplada para imóvel ou veículo | Fivecred",
  "description": "Quer comprar uma carta de consórcio contemplada? Entenda entrada, saldo a pagar e transferência antes de consultar opções com a Fivecred.",
  "referrer": "no-referrer",
  "robots": {
    "index": false,
    "follow": false,
    "nocache": true,
    "googleBot": {
      "index": false,
      "follow": false,
      "noimageindex": true
    }
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {content.styles.map(href => <link key={href} rel="stylesheet" href={href} />)}
      </head>
      <body>{children}</body>
    </html>
  );
}
