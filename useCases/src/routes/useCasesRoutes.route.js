import { Router } from "express";
import { getArtifactData, updateArtifactData } from "../utils/db.js";
import {
  getAvailableUseCases,
  createUseCase,
} from "../useCases/registersAuto.js";

const useCasesRoutes = new Router();

const applyUseCasesToArtifact = async (req, res) => {
  const start = performance.now();
  const mem = process.memoryUsage();
  const { artifactId = null, usecases = [] } = req.body ?? {};

  if (!artifactId) {
    return res.status(400).json({
      error: "Missing required field: artifactId.",
    });
  }

  try {
    const artifact = await getArtifactData(artifactId);

    for (const useCaseDef of usecases) {
      try {
        const usecase = await createUseCase(useCaseDef);        
        usecase.apply(artifact);
      } catch (err) {
        throw err;
      }
    }

    await updateArtifactData(artifactId, artifact);

    const duration = performance.now() - start;
    console.log(
      JSON.stringify({
        service: "usecases_apply",
        durationMs: duration,
        depth: artifact.meta.options.patterns[0].params.depth ?? null,
        heapUsedMb: mem.heapUsed / 1024 / 1024,
        rssMb: mem.rss / 1024 / 1024,
      }),
    );
    return res.status(200).json({ artifactId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

useCasesRoutes.get("/", async (req, res) => {
  try {
    const availableUseCases = await getAvailableUseCases();
    return res.status(200).json(availableUseCases);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

useCasesRoutes.post("/apply", applyUseCasesToArtifact);
export default useCasesRoutes;
