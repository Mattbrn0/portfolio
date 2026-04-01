import http from "node:http";
import crypto from "node:crypto";
import { exec } from "node:child_process";
import { URL } from "node:url";
import fs from "node:fs";
import path from "node:path";

const {
  PORT = "3001",
  REPO_PATH = process.cwd(),
  DEPLOY_SCRIPT = "scripts/deploy-vps.sh",
  WEBHOOK_SECRET_FILE = ".webhook_secret",
  WEBHOOK_PATH = "/github-webhook",
} = process.env;

const secretPath = path.resolve(REPO_PATH, WEBHOOK_SECRET_FILE);
const deployScriptPath = path.resolve(REPO_PATH, DEPLOY_SCRIPT);

let secret = "";
try {
  secret = fs.readFileSync(secretPath, "utf8").trim();
} catch {
  console.error(`[webhook] Secret file introuvable: ${secretPath}`);
  process.exit(1);
}

if (!secret) {
  console.error("[webhook] WEBHOOK_SECRET vide (secret file vide).");
  process.exit(1);
}

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

let deploying = false;
let lastDeployAt = 0;

function deploy() {
  return new Promise((resolve, reject) => {
    if (deploying) {
      return resolve({ status: "skipped", reason: "deploy_already_running" });
    }

    // anti-spam simple : refuse si trop rapproché
    const now = Date.now();
    if (now - lastDeployAt < 10_000) {
      return resolve({ status: "skipped", reason: "cooldown" });
    }

    deploying = true;
    lastDeployAt = now;

    const cmd = `bash "${deployScriptPath}"`;
    console.log(`[webhook] Déploiement: ${cmd}`);

    exec(
      cmd,
      { cwd: REPO_PATH, env: process.env },
      (error, stdout, stderr) => {
        deploying = false;
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        if (error) return reject(error);
        return resolve({ status: "ok" });
      },
    );
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);

    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "method_not_allowed" }));
    }

    if (url.pathname !== WEBHOOK_PATH) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "not_found" }));
    }

    const signature256 = req.headers["x-hub-signature-256"];
    if (!signature256 || typeof signature256 !== "string") {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "missing_signature" }));
    }

    const event = req.headers["x-github-event"];
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    // Vérification HMAC SHA256
    const digest = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    const expected = `sha256=${digest}`;

    if (!timingSafeEqual(expected, signature256)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "invalid_signature" }));
    }

    let payload = null;
    try {
      payload = JSON.parse(rawBody.toString("utf8"));
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "invalid_json" }));
    }

    // Déploie seulement sur push main
    const isPush = event === "push";
    const ref = payload?.ref || "";
    const isMain = ref === "refs/heads/main";

    if (!isPush || !isMain) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "ignored", event, ref }));
    }

    await deploy();

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "deployed", event, ref }));
  } catch (err) {
    console.error("[webhook] error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "internal_error" }));
  }
});

server.listen(Number(PORT), "127.0.0.1", () => {
  console.log(`[webhook] Listening on 127.0.0.1:${PORT}${WEBHOOK_PATH}`);
});

