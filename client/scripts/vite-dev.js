import { spawn } from "node:child_process";

function readPort(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

const port = readPort("VITE_PORT", 5173);

const child = spawn(
  process.execPath,
  ["./node_modules/vite/bin/vite.js", "--port", String(port), "--strictPort"],
  {
    stdio: "inherit",
    env: process.env,
  },
);

child.on("exit", (code) => process.exit(code ?? 1));


