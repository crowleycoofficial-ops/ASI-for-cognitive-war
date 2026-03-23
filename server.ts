import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes for real-world telemetry
  app.get("/api/telemetry/gdelt", async (req, res) => {
    try {
      // Fetching latest global news related to AI and Geopolitics as per PDF focus
      const query = "ai OR artificial intelligence OR cognitive warfare";
      const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=10&format=json`;
      
      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      console.error("GDELT Fetch Error:", error);
      res.status(500).json({ error: "Failed to fetch ecosystem data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ASI Operational Server running on http://localhost:${PORT}`);
  });
}

startServer();
