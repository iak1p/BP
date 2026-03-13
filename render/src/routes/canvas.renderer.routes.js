import { Router } from "express";
import CanvasRenderer from "../utils/canvas.renderer.js";
import { getArtifactData } from "../utils/db.js";
// import CanvasRenderer from "./canvas.renderer.js";

const canvasRoutes = new Router();

async function render(req, res) {
  const { artifactId, canvasParams = {} } = req.body ?? {};

  if (!artifactId) {
    return res.status(400).json({
      error: "Missing required field: artifactId.",
    });
  }

  try {
    const geometry = await getArtifactData(artifactId);

    const renderer = new CanvasRenderer(canvasParams);
    const canvas = renderer.render(geometry);

    // return res.status(200).json(req.body);

    res.setHeader("Content-Type", "image/png");
    const stream = canvas.createPNGStream();
    stream.pipe(res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

canvasRoutes.post("/render", render);

export default canvasRoutes;
