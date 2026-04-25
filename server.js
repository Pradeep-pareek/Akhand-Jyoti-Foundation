import { createServer } from "http";
import next from "next";
const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Server running on http://localhost:${PORT}`);
  });
});