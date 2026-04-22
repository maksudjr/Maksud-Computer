import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Replicate from "replicate";
import axios from "axios";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Increase payload size for base64 images
// IMPORTANT: Vercel has a 4.5MB limit for serverless functions.
// If images are larger than this, Vercel will return a 413 error.
app.use(express.json({ limit: '10mb' }));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL
  });
});

// API Route for AI Enhancement
app.post("/api/enhance", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(500).json({ error: "REPLICATE_API_TOKEN is not configured" });
    }

    console.log("Starting Replicate AI Enhancement...");

    const output = await replicate.run(
      "nightmare-ai/real-esrgan",
      {
        input: {
          image: image,
          upscale: 2,
          face_enhance: true,
        }
      }
    );

    console.log("Replicate AI Enhancement complete");
    res.json({ output });
  } catch (error: any) {
    console.error("Enhancement error:", error);
    res.status(500).json({ error: error.message || "Failed to enhance image" });
  }
});

// API Route for Background Removal (remove.bg)
app.post("/api/remove-bg", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!process.env.REMOVE_BG_API_KEY) {
      return res.status(500).json({ error: "REMOVE_BG_API_KEY is not configured" });
    }

    console.log("Starting remove.bg Background Removal...");

    // Extract base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', 
      {
        image_file_b64: base64Data,
        size: 'auto',
      },
      {
        headers: {
          'X-Api-Key': process.env.REMOVE_BG_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer'
      }
    );

    const buffer = Buffer.from(response.data);
    const resultBase64 = buffer.toString('base64');
    const output = `data:image/png;base64,${resultBase64}`;

    console.log("remove.bg Background Removal complete");
    res.json({ output });
  } catch (error: any) {
    console.error("Background removal error:", error.response?.data?.toString() || error.message);
    
    let errorMessage = "Failed to remove background";
    if (error.response?.data) {
      try {
        const errorData = JSON.parse(error.response.data.toString());
        if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].title;
        }
      } catch (e) {
        // Not JSON
      }
    }

    res.status(error.response?.status || 500).json({ error: errorMessage });
  }
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    // Only serve static files if NOT on Vercel (Vercel handles this via vercel.json)
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not in a serverless environment (like Vercel)
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});

export default app;
