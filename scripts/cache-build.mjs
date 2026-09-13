import { readFile, writeFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const files = (await readdir("dist", { recursive: true })).filter(
  (file) =>
    !file.endsWith(".map") &&
    /\.(html|js|css|png|ico|svg)$/.test(file) &&
    file !== "sw.js",
);
const assets = ["/", ...files.map((f) => "/" + f)];
const hash = createHash("sha256");
for (const file of files.sort()) hash.update(await readFile("dist/" + file));
const name = "grammacho-web-" + hash.digest("hex").slice(0, 16);
await writeFile(
  "dist/sw.js",
  `const CACHE=${JSON.stringify(name)};const ASSETS=${JSON.stringify(assets)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('grammacho-web-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.open(CACHE).then(cache=>cache.match('/index.html'))));return;}if(ASSETS.includes(url.pathname))event.respondWith(caches.open(CACHE).then(cache=>cache.match(url.pathname)).then(cached=>cached||fetch(event.request)));});
`,
);
console.log(
  "Offline shell cached at build: " + assets.length + " assets, " + name,
);
