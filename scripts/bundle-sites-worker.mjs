import { build } from "esbuild";
import { rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serverRoot = path.join(projectRoot, "dist", "server");
const assetsRoot = path.join(projectRoot, "dist", "assets");

// Sites receives the generated Worker as an already-built module. Bundling here
// is important because OpenNext's handler still contains CommonJS wrappers that
// a raw Cloudflare module cannot execute (`require` is not a Worker global).
const nodeBuiltins = [
  "assert",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "diagnostics_channel",
  "dns",
  "dns/promises",
  "domain",
  "events",
  "fs",
  "http",
  "http2",
  "https",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "sys",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "wasi",
  "worker_threads",
  "zlib",
];

const requireShim = `
import * as __siteAsyncHooks from "node:async_hooks";
import * as __siteBuffer from "node:buffer";
import * as __siteCrypto from "node:crypto";
import * as __siteDns from "node:dns";
import * as __siteDnsPromises from "node:dns/promises";
import * as __siteEvents from "node:events";
import * as __siteFs from "node:fs";
import * as __siteHttp from "node:http";
import * as __siteHttps from "node:https";
import * as __siteNet from "node:net";
import * as __siteOs from "node:os";
import * as __sitePath from "node:path";
import * as __siteProcess from "node:process";
import * as __siteStream from "node:stream";
import * as __siteTimers from "node:timers";
import * as __siteTty from "node:tty";
import * as __siteUrl from "node:url";
import * as __siteUtil from "node:util";
import * as __siteVm from "node:vm";
import * as __siteZlib from "node:zlib";
const require = (specifier) => {
  const modules = {
    "assert": undefined,
    "async_hooks": __siteAsyncHooks,
    "node:async_hooks": __siteAsyncHooks,
    "buffer": __siteBuffer,
    "node:buffer": __siteBuffer,
    "crypto": __siteCrypto,
    "node:crypto": __siteCrypto,
    "dns": __siteDns,
    "node:dns": __siteDns,
    "dns/promises": __siteDnsPromises,
    "node:dns/promises": __siteDnsPromises,
    "events": __siteEvents,
    "node:events": __siteEvents,
    "fs": __siteFs,
    "node:fs": __siteFs,
    "http": __siteHttp,
    "node:http": __siteHttp,
    "https": __siteHttps,
    "node:https": __siteHttps,
    "net": __siteNet,
    "node:net": __siteNet,
    "os": __siteOs,
    "node:os": __siteOs,
    "path": __sitePath,
    "node:path": __sitePath,
    "process": __siteProcess,
    "node:process": __siteProcess,
    "stream": __siteStream,
    "node:stream": __siteStream,
    "timers": __siteTimers,
    "node:timers": __siteTimers,
    "tty": __siteTty,
    "node:tty": __siteTty,
    "url": __siteUrl,
    "node:url": __siteUrl,
    "util": __siteUtil,
    "node:util": __siteUtil,
    "vm": __siteVm,
    "node:vm": __siteVm,
    "zlib": __siteZlib,
    "node:zlib": __siteZlib,
  };
  const module = modules[specifier];
  if (module) return module;
  throw new Error("Unsupported Worker require: " + specifier);
};
`;

await build({
  entryPoints: [path.join(serverRoot, "worker.js")],
  outfile: path.join(serverRoot, "index.js"),
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  conditions: ["workerd", "worker", "browser", "import", "default"],
  mainFields: ["browser", "module", "main"],
  external: ["cloudflare:workers", "node:*", ...nodeBuiltins],
  banner: { js: requireShim },
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "none",
  sourcemap: false,
});

// The bundled entrypoint contains the server handler and no longer needs the
// unbundled copy. Removing it keeps the published Worker below Sites' limit.
await rm(path.join(serverRoot, "server-functions"), { recursive: true, force: true });
await rm(path.join(serverRoot, "middleware"), { recursive: true, force: true });
await rm(assetsRoot, { recursive: true, force: true });
await rename(path.join(serverRoot, "assets"), assetsRoot);
