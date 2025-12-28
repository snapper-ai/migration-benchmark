function readPort(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

const serverPort = readPort("PORT", 3001);
const clientPort = readPort("VITE_PORT", 5173);

console.log(`Backend API: http://localhost:${serverPort}`);
console.log(`Frontend Dev: http://localhost:${clientPort}`);


