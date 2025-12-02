import { Router } from "express";
import CanvasRenderer from "./canvas.renderer.js";

const canvasRoutes = new Router();

const renderer = new CanvasRenderer({
  bgColor: "#000000",
  width: 800,
  height: 600,
});

async function render(req, res) {
  renderer.render(req.body.geometry);

  return res.status(200).json(req.body);
}

canvasRoutes.post("/render", render);

export default canvasRoutes;
