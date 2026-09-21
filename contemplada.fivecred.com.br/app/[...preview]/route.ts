import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Local preview only. The generator supplies this absolute directory.
const PREVIEW_ROOT = "C:\\Users\\auror\\Downloads\\fivecred-sites\\reformulacoes";
const ROOT_DOCUMENTS = new Set([
  "index.html", "politica-de-privacidade.html", "termos-de-uso.html",
]);
const PREFIXES = new Set([
  "shared", "conteudos", "orientacao", "clt-fivecred", "fgts-fivecred",
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
