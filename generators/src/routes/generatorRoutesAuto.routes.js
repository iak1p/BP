import { Router } from "express";
import { PatternDTO } from "../utils/generator.base.js";
import {
  createFractal,
  getAvailableGenerators,
} from "../generators/FractalFactoryAutoDetect.js";
import { createArtifact } from "../utils/db.js";

const generatorRoutes = new Router();

const generate = async (req, res) => {
  const start = performance.now();
  const { type = null, params = {} } = req.body ?? {};
  const { depth = null, ...otherParams } = params;
  console.log(params);

  if (!type) {
    return res.status(400).json({
      error: "Missing required field: type",
    });
  }

  try {
    const availableGenerators = await getAvailableGenerators();
    const allowedTypes = availableGenerators.map((g) => g.id);

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid type. Allowed values are: ${allowedTypes.join(", ")}`,
      });
    }

    const pattern = new PatternDTO(type, otherParams);
    const fractal = await createFractal(type, otherParams);
    const geometry = await fractal.generate(pattern);

    const artifactId = await createArtifact(type, JSON.stringify(geometry));

    const duration = performance.now() - start;
    console.log(
      JSON.stringify({
        service: "generate",
        durationMs: duration,
        depth: req.body?.params.patterns[0]?.params?.depth ?? null,
      }),
    );

    return res.status(200).json({ artifactId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

generatorRoutes.get("/", async (req, res) => {
  try {
    const generators = await getAvailableGenerators();
    return res.status(200).json(generators);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

generatorRoutes.post("/generate", generate);

export default generatorRoutes;
