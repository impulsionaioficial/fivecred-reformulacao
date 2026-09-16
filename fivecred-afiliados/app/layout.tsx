import type { Metadata } from "next";
import content from "./content.json";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Programa de afiliados: conheça a parceria Fivecred",
  "description": "Quer indicar pessoas à Fivecred? Conheça o programa de afiliados, consulte as regras de participação e converse com a equipe sobre a parceria.",
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
