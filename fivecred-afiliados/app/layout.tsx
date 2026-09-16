import type { Metadata } from "next";
import content from "./content.json";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Programa de afiliados: conheça a parceria Fivecred",
  "description": "Conheça o programa de afiliados Fivecred. Entenda como participar, acompanhar indicações e quais são as regras da parceria.",
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
