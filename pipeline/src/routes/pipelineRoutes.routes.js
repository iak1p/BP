import { Router } from "express";
import { randomUUID } from "crypto";
import { getSteps, saveStep } from "../utils/db.js";
import { sseConnect, sseSend } from "../utils/sse.js";

const pipelineRoutes = new Router();

const run = async (req, res) => {
  const { type = null, params = null } = req.body;
  const jobId = randomUUID();
  console.log(params);

  try {
    await saveStep(jobId, "started", {});
    sseSend({ type: "step", step: `Started jobId: ${jobId}`, at: Date.now() });

    const artifactId = await fetch(
      "http://localhost:4002/api/generator/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, params }),
      },
    )
      .then((res) => res.json())
      .then((data) => data.artifactId);

    await saveStep(jobId, "generated", { artifactId });
    sseSend({ type: "step", step: "Generated", at: Date.now() });

    return res.status(200).json({ jobId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getJobSteps = async (req, res) => {
  const jobId = req.params.jobId;
  const steps = await getSteps(jobId);
  res.json({ jobId: jobId, steps });
};

pipelineRoutes.post("/run", run);
pipelineRoutes.get("/jobs/:jobId", getJobSteps);
pipelineRoutes.get("/logs/stream", (req, res) => {
  sseConnect(req, res);
});

export default pipelineRoutes;
