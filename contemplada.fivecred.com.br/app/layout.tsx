import type { Metadata } from "next";
import content from "./content.json";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Comprar carta contemplada para imóvel ou veículo | Fivecred",
  "description": "Imóvel ou veículo: conte o que deseja comprar e consulte as possibilidades com a Fivecred. Entenda entrada, saldo e transferência antes de negociar.",
  "referrer": "no-referrer",
  "robots": {
    "index": true,
    "follow": true,
    "nocache": false,
    "googleBot": {
      "index": true,
      "follow": true,
      "noimageindex": false
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
