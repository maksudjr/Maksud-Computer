import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Replicate from "replicate";
import axios from "axios";
import FormData from "form-data";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload size for base64 images
  app.use(express.json({ limit: '50mb' }));

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
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

      // Using nightmare-ai/real-esrgan which is reliable for upscaling and face enhancement
      const output = await replicate.run(
        "nightmare-ai/real-esrgan:42fed1c49742f5d1c23358760513d2aa2d294509d465b554bc2c238ce43432df",
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

      // Convert base64 to buffer
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');

      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_file', buffer, { filename: 'image.png' });

      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        },
        responseType: 'arraybuffer',
      });

      const resultBase64 = Buffer.from(response.data).toString('base64');
      const output = `data:image/png;base64,${resultBase64}`;

      console.log("remove.bg Background Removal complete");
      res.json({ output });
    } catch (error: any) {
      const errorData = error.response?.data;
      let errorMessage = "Failed to remove background";
      
      if (errorData) {
        try {
          const parsed = JSON.parse(errorData.toString());
          if (parsed.errors && parsed.errors.length > 0) {
            errorMessage = parsed.errors[0].title;
          }
        } catch (e) {
          console.error("Error parsing remove.bg error response:", e);
        }
      }
      
      console.error("Background removal error:", errorData?.toString() || error.message);
      res.status(500).json({ error: errorMessage });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
