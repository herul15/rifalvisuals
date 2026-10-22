import { createServer } from "http";
import { parse } from "url";
import next from "next";

process.env.NODE_ENV = process.env.NODE_ENV || "production";
const dev = process.env.NODE_ENV === "development";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      if (parsedUrl.pathname === "/index.php" || parsedUrl.pathname === "/index.html") {
        parsedUrl.pathname = "/";
      }
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error handling request:", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Rifalvisuals Production Server running on port ${port}`);
  });
});
