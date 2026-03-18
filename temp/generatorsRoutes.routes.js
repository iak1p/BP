import { Router } from "express";
import { PatternDTO } from "../generators/src/utils/generator.base.js";
import { createFractal } from "../gen/FractalFactory.js";
import { createArtifact } from "../generators/src/utils/db.js";

const genaratorRoutes = new Router();
const allowedTypes = ["koch", "sierpinsky", "anklet"];

const generate = async (req, res) => {
  const { type = null, params = {} } = req.body ?? {};
  const { depth = null, ...otherParams } = params;

  if (!type || !depth) {
    return res.status(400).json({
      error: "Missing required fields: type and depth.",
    });
  }

  if (!allowedTypes.includes(type)) {
    return res.status(400).json({
      error:
        "Invalid type. Allowed values are 'koch', 'sierpinsky' or 'anklet'.",
    });
  }

  try {
    const patern = new PatternDTO(type, depth);
    const fractal = createFractal(type, otherParams);
    const geometry = await fractal.generate(patern);
    const artifactId = await createArtifact(type, JSON.stringify(geometry));

    return res.status(200).json({ artifactId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

genaratorRoutes.post("/generate", generate);

export default genaratorRoutes;
