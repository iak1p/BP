import { Router } from "express";
import { getArtifact, getArtifactData, updateArtifactData } from "../utils/db.js";
import createUseCase from "../utils/registers.js";

const useCasesRoutes = new Router();

const apply = async (req, res) => {
  const { artifactId = null, usecases = [] } = req.body ?? {};

  if (!artifactId) {
    return res.status(400).json({
      error: "Missing required field: artifactId.",
    });
  }

  try {
    const artifact = await getArtifactData(artifactId);

    usecases.forEach((usecase) => {
      usecase = createUseCase(usecase);
      usecase.apply(artifact);
    });

    await updateArtifactData(artifactId, artifact);
    return res.status(200).json({ artifact });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

useCasesRoutes.post("/apply", apply);
export default useCasesRoutes;
