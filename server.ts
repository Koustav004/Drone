import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("detections.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS detections (
    id TEXT PRIMARY KEY,
    image_name TEXT,
    status BOOLEAN,
    type TEXT,
    conf_a REAL,
    conf_b REAL,
    conf_c REAL,
    timestamp TEXT,
    lat REAL,
    lng REAL
  )
`);

// Seed data if empty
const count = db.prepare("SELECT count(*) as count FROM detections").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO detections (id, image_name, status, type, conf_a, conf_b, conf_c, timestamp, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const mockData = [
    ['DATA1', "Screenshot 2026-02-17 070839.png", 1, "C", 0.0002, 0.0089, 0.9908, "2026-02-17 07:08:39", 22.620917, 88.427489],
    ['DATA2', "Screenshot 2026-02-17 071215.png", 1, "B", 0.0122, 0.8589, 0.1288, "2026-02-17 07:12:15", 22.630922, 88.427100],
    ['DATA3', "Screenshot 2026-02-17 071542.png", 0, "A", 0.9502, 0.0389, 0.0108, "2026-02-17 07:15:42", 22.641022, 88.426794],
    ['DATA4', "Screenshot 2026-02-17 072011.png", 1, "C", 0.0005, 0.0120, 0.9875, "2026-02-17 07:20:11", 22.620717, 88.426264],
    ['DATA5', "Screenshot 2026-02-17 072533.png", 1, "B", 0.0500, 0.7500, 0.2000, "2026-02-17 07:25:33", 22.620667, 88.425797],
    ['DATA6', "Screenshot 2026-02-17 073000.png", 0, "A", 0.9800, 0.0100, 0.0100, "2026-02-17 07:30:00", 22.620319, 88.425283],
    ['DATA7', "Screenshot 2026-02-17 070839.png", 1, "C", 0.0002, 0.0089, 0.9908, "2026-02-17 07:08:39", 22.619903, 88.424697],
    ['DATA8', "Screenshot 2026-02-17 071215.png", 1, "B", 0.0122, 0.8589, 0.1288, "2026-02-17 07:12:15", 22.620917, 88.427489],
    ['DATA9', "Screenshot 2026-02-17 071542.png", 0, "A", 0.9502, 0.0389, 0.0108, "2026-02-17 07:15:42", 22.620922, 88.427100],
    ['DATA10', "Screenshot 2026-02-17 072011.png", 1, "C", 0.0005, 0.0120, 0.9875, "2026-02-17 07:20:11", 22.621022, 88.426794],
    ['DATA11', "Screenshot 2026-02-17 072533.png", 1, "B", 0.0500, 0.7500, 0.2000, "2026-02-17 07:25:33", 22.620717, 88.426264],
    ['DATA12', "Screenshot 2026-02-17 073000.png", 0, "A", 0.9800, 0.0100, 0.0100, "2026-02-17 07:30:00", 22.620667, 88.425797],
    ['DATA13', "Screenshot 2026-02-17 073512.png", 1, "C", 0.0001, 0.0050, 0.9949, "2026-02-17 07:35:12", 22.620319, 88.425283],
    ['DATA14', "Screenshot 2026-02-17 074025.png", 1, "B", 0.0200, 0.8800, 0.1000, "2026-02-17 07:40:25", 22.619903, 88.424697],
    ['DATA15', "Screenshot 2026-02-17 074538.png", 0, "A", 0.9700, 0.0200, 0.0100, "2026-02-17 07:45:38", 22.620917, 88.427489],
    ['DATA16', "Screenshot 2026-02-17 075051.png", 1, "C", 0.0003, 0.0100, 0.9897, "2026-02-17 07:50:51", 22.620922, 88.427100],
    ['DATA17', "Screenshot 2026-02-17 075504.png", 1, "B", 0.0300, 0.8200, 0.1500, "2026-02-17 07:55:04", 22.621022, 88.426794],
    ['DATA18', "Screenshot 2026-02-17 080017.png", 0, "A", 0.9900, 0.0050, 0.0050, "2026-02-17 08:00:17", 22.620717, 88.426264],
    ['DATA19', "Screenshot 2026-02-17 080530.png", 1, "C", 0.0001, 0.0020, 0.9979, "2026-02-17 08:05:30", 22.620667, 88.425797],
    ['DATA20', "Screenshot 2026-02-17 081043.png", 1, "B", 0.0100, 0.9500, 0.0400, "2026-02-17 08:10:43", 22.620319, 88.425283],
    ['DATA21', "Screenshot 2026-02-17 081556.png", 0, "A", 0.9600, 0.0300, 0.0100, "2026-02-17 08:15:56", 22.619903, 88.424697],
    ['DATA22', "Screenshot 2026-02-17 082009.png", 1, "C", 0.0002, 0.0040, 0.9958, "2026-02-17 08:20:09", 22.620917, 88.427489],
    ['DATA23', "Screenshot 2026-02-17 082522.png", 1, "B", 0.0400, 0.8600, 0.1000, "2026-02-17 08:25:22", 22.620922, 88.427100],
    ['DATA24', "Screenshot 2026-02-17 083035.png", 0, "A", 0.9850, 0.0100, 0.0050, "2026-02-17 08:30:35", 22.621022, 88.426794],
    ['DATA25', "Screenshot 2026-02-17 083548.png", 1, "C", 0.0001, 0.0030, 0.9969, "2026-02-17 08:35:48", 22.620717, 88.426264],
    ['DATA26', "Screenshot 2026-02-17 084001.png", 1, "B", 0.0150, 0.9200, 0.0650, "2026-02-17 08:40:01", 22.620667, 88.425797],
    ['DATA27', "Screenshot 2026-02-17 084514.png", 0, "A", 0.9950, 0.0030, 0.0020, "2026-02-17 08:45:14", 22.620319, 88.425283],
    ['DATA28', "Screenshot 2026-02-17 085027.png", 1, "C", 0.0004, 0.0080, 0.9916, "2026-02-17 08:50:27", 22.619903, 88.424697],
    ['DATA29', "Screenshot 2026-02-17 085540.png", 1, "B", 0.0250, 0.7800, 0.1950, "2026-02-17 08:55:40", 22.620917, 88.427489],
    ['DATA30', "Screenshot 2026-02-17 090053.png", 0, "A", 0.9800, 0.0150, 0.0050, "2026-02-17 09:00:53", 22.620922, 88.427100],
  ];

  for (const row of mockData) {
    insert.run(...row);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/detections", (req, res) => {
    const rows = db.prepare("SELECT * FROM detections ORDER BY timestamp DESC").all();
    const detections = rows.map((row: any) => ({
      id: row.id,
      image_name: row.image_name,
      status: !!row.status,
      type: row.type,
      confidence: {
        A: row.conf_a,
        B: row.conf_b,
        C: row.conf_c
      },
      timestamp: row.timestamp,
      lat: row.lat,
      lng: row.lng,
      coordinates: `${Math.abs(row.lat).toFixed(4)}° ${row.lat >= 0 ? 'N' : 'S'}, ${Math.abs(row.lng).toFixed(4)}° ${row.lng >= 0 ? 'E' : 'W'}`
    }));
    res.json(detections);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
