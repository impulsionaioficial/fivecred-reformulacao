"use strict";

const fs = require("node:fs");
const path = require("node:path");

const NEXT_PROJECTS = new Set([
  "fivecred-next",
  "fivecred-afiliados",
  "contemplada.fivecred.com.br",
]);

const ROUTE_TEMPLATE = String.raw`import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Local preview only. The generator supplies this absolute directory.
const PREVIEW_ROOT = __PREVIEW_ROOT__;
const ROOT_DOCUMENTS = new Set([
  "index.html", "politica-de-privacidade.html", "termos-de-uso.html",
]);
const PREFIXES = new Set([
  "shared", "conteudos", "clt-fivecred", "fgts-fivecred",
  "bolsa-fivecred", "consignado-fivecred", "contemplada.fivecred.com.br",
  "fivecred-afiliados", "fivecred-landing-page",
  "fivecred-next", "imovel-fivecred",
  "luz-fivecred", "veiculo-fivecred", "lp-venda-carta-contemplada",
]);
const PRIVATE_PARTS = new Set([
  "app", "src", "source", "pages", "components", "lib", "hooks", "utils",
  "scripts", "work", "docs", "tests", "test", "e2e", "node_modules", "coverage",
  "server", "api", "config", "env", "secrets", "types",
]);
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
};
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://hook.us1.make.celonis.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'",
].join("; ");
const COMMON_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store",
  "Content-Security-Policy": CSP,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "index, follow",
  "Referrer-Policy": "no-referrer",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
};

type PreviewContext = { params: Promise<{ preview: string[] }> };

function allowedSegments(parts: unknown): parts is string[] {
  if (!Array.isArray(parts) || parts.length === 0) return false;
  const rootDocument = parts.length === 1 && ROOT_DOCUMENTS.has(parts[0]);
  if (!rootDocument && (parts.length < 2 || !PREFIXES.has(parts[0]))) {
    return false;
  }
  for (const part of parts) {
    if (
      typeof part !== "string" ||
      !part ||
      part.startsWith(".") ||
      part.endsWith(".") ||
      part.trim() !== part ||
      /[\\\/:%\u0000-\u001f\u007f<>|?*"]/.test(part) ||
      /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part) ||
      PRIVATE_PARTS.has(part.toLowerCase())
    ) {
      return false;
    }
  }
  const name = parts[parts.length - 1];
  if (
    /(?:^|[.-])(?:config|test|spec)\.js$/i.test(name) ||
    /^(?:middleware|proxy|instrumentation|server|env|environment|credentials|secrets)\.js$/i.test(name)
  ) {
    return false;
  }
  return Object.hasOwn(MIME, path.extname(name).toLowerCase());
}

function notFound(head: boolean): Response {
  return new Response(head ? null : "Arquivo não encontrado.", {
    status: 404,
    headers: { ...COMMON_HEADERS, "Content-Type": "text/plain; charset=utf-8" },
  });
}

async function respond(context: PreviewContext, head: boolean): Promise<Response> {
  const { preview } = await context.params;
  if (!allowedSegments(preview)) return notFound(head);
  try {
    const root = await realpath(PREVIEW_ROOT);
    const candidate = path.resolve(root, ...preview);
    const relative = path.relative(root, candidate);
    if (
      !relative ||
      relative === ".." ||
      relative.startsWith(".." + path.sep) ||
      path.isAbsolute(relative)
    ) {
      return notFound(head);
    }

    // Check the resolved destination too: a symlink must not expose private
    // files or leave the local preview directory.
    const resolved = await realpath(candidate);
    const resolvedRelative = path.relative(root, resolved);
    if (
      !resolvedRelative ||
      resolvedRelative === ".." ||
      resolvedRelative.startsWith(".." + path.sep) ||
      path.isAbsolute(resolvedRelative) ||
      !allowedSegments(resolvedRelative.split(path.sep))
    ) {
      return notFound(head);
    }
    const info = await stat(resolved);
    if (!info.isFile()) return notFound(head);

    const headers = {
      ...COMMON_HEADERS,
      "Content-Type": MIME[path.extname(resolved).toLowerCase()],
      "Content-Length": String(info.size),
    };
    if (head) return new Response(null, { status: 200, headers });
    const bytes = await readFile(resolved);
    return new Response(new Uint8Array(bytes), { status: 200, headers });
  } catch {
    // Do not reveal filesystem paths or distinguish private and missing files.
    return notFound(head);
  }
}

export async function GET(_request: Request, context: PreviewContext) {
  return respond(context, false);
}

export async function HEAD(_request: Request, context: PreviewContext) {
  return respond(context, true);
}
`;

const PAGE_TEMPLATE = String.raw`import Script from "next/script";
import content from "./content.json";

export default function Page() {
  return (
    <>
      {/* Trusted static HTML from the local generator; never accept user HTML here. */}
      <div id="fivecred-preview" dangerouslySetInnerHTML={{ __html: content.body }} />
      {content.scripts.map(src => <Script key={src} src={src} strategy="afterInteractive" />)}
    </>
  );
}
`;

const LAYOUT_TEMPLATE = String.raw`import type { Metadata } from "next";
import content from "./content.json";
import type { ReactNode } from "react";

export const metadata: Metadata = __METADATA__;

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
`;

function renderPreviewRoute(root) {
  return ROUTE_TEMPLATE.replace("__PREVIEW_ROOT__", () => JSON.stringify(root));
}

function ensureDirectory(parent, name) {
  const target = path.join(parent, name);
  const info = fs.lstatSync(target, { throwIfNoEntry: false });
  if (info) {
    if (info.isSymbolicLink() || !info.isDirectory()) {
      throw new Error("O diretório de saída deve ser uma pasta local comum: " + target);
    }
  } else {
    fs.mkdirSync(target);
  }
  return target;
}

function writeEntry(directory, filename, content) {
  const target = path.join(directory, filename);
  const info = fs.lstatSync(target, { throwIfNoEntry: false });
  if (info) {
    if (info.isSymbolicLink() || !info.isFile()) {
      throw new Error("A entrada não pode substituir um link ou diretório: " + target);
    }
  }
  fs.writeFileSync(target, content, "utf8");
  return target;
}

/**
 * Generate Next App Router entry points for one approved local project.
 * This function is deliberately never invoked when the module is required.
 * @param {string} root Absolute path to reformulacoes, the parent of work.
 * @param {{slug:string,title:string,description:string,body:string}} page
 * @returns {string[]} Absolute paths of the four written entry points.
 */
function adaptNext(root, page) {
  if (typeof root !== "string" || !path.isAbsolute(root)) {
    throw new TypeError("root deve ser o caminho absoluto da pasta reformulacoes.");
  }
  if (!page || !NEXT_PROJECTS.has(page.slug)) {
    throw new TypeError("O adaptador aceita somente os três projetos Next previstos.");
  }
  for (const field of ["title", "description", "body"]) {
    if (typeof page[field] !== "string" || !page[field].trim()) {
      throw new TypeError("Campo de página obrigatório: " + field);
    }
  }

  const resolvedRoot = fs.realpathSync(root);
  const moduleRoot = fs.realpathSync(path.resolve(__dirname, ".."));
  if (resolvedRoot !== moduleRoot) {
    throw new Error("A saída deve permanecer na pasta reformulacoes deste módulo.");
  }
  const project = path.join(resolvedRoot, page.slug);
  const projectInfo = fs.lstatSync(project);
  if (projectInfo.isSymbolicLink() || !projectInfo.isDirectory()) {
    throw new Error("O projeto Next deve ser uma pasta local comum.");
  }
  const app = ensureDirectory(project, "app");
  const preview = ensureDirectory(app, "[...preview]");
  const metadata = {
    title: page.title,
    description: page.description,
    referrer: "no-referrer",
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: { index: true, follow: true, noimageindex: false },
    },
  };

  // Replace only the explicit entry points. Existing components, assets,
  // stylesheets, configuration, dependencies and source files remain intact.
  return [
    writeEntry(app, "content.json", JSON.stringify({ body: page.body, ...require("./form-assets.cjs").assetsFor(page,"/") }, null, 2) + "\n"),
    writeEntry(app, "page.tsx", PAGE_TEMPLATE),
    writeEntry(app, "layout.tsx", LAYOUT_TEMPLATE.replace("__METADATA__", () => JSON.stringify(metadata, null, 2))),
    writeEntry(preview, "route.ts", renderPreviewRoute(resolvedRoot)),
  ];
}

module.exports = { adaptNext };
