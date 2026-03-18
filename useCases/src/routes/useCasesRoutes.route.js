import { Router } from "express";
import { getArtifactData, updateArtifactData } from "../utils/db.js";
import {
  getAvailableUseCases,
  createUseCase,
} from "../useCases/registersAuto.js";

const useCasesRoutes = new Router();

/**
 * Applies use cases to an existing artifact.
 *
 * Request body:
 * {
 *   artifactId: string,
 *   usecases: [
 *     {
 *       name: string,
 *       otherParams: any
 *     },
 *   ]
 * }
 *
 * Response:
 * {
 *   artifact: Object
 * }
 */
const applyUseCasesToArtifact = async (req, res) => {
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
