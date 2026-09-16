import type { Metadata } from "next";
import content from "./content.json";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Fivecred | Encontre opções de crédito para seu momento",
  "description": "Preencha seus dados, conte seu perfil e informe o crédito que procura. A Fivecred orienta você sobre as possibilidades e as condições da análise.",
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
