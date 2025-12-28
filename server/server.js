import { createApp } from "./src/app.js";

const PORT = 3001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Ops Command Center API: http://localhost:${PORT}/api`);
});


