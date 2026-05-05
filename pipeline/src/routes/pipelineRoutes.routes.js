import { Router } from "express";
import { randomUUID } from "crypto";
import { getArtifactData, getSteps, saveStep } from "../utils/db.js";
import { sseConnect, sseSend } from "../utils/sse.js";
import { Readable } from "stream";
import executePipeline from "../pipeline/pipeline.executor.js";

const pipelineRoutes = new Router();

async function processPipeline(req, res) {
  const start = performance.now();
  const mem = process.memoryUsage();
  const {
    type,
    params = {},
    usecases = [],
    canvasParams = {},
  } = req.body ?? {};

  if (!type) {
    return res.status(400).json({
      error: "Missing required field: type",
    });
  }

  const jobId = randomUUID();

  await saveStep(jobId, "started", {});
  sseSend({ type: "step", step: `started (${jobId})`, at: Date.now() });

  try {
    const context = {
      type,
      params,
      usecases,
      canvasParams,
      artifactId: null,
      renderResponse: null,
    };

    const result = await executePipeline(context, jobId);

    res.setHeader("Content-Type", "image/png");

    Readable.fromWeb(result.renderResponse.body).pipe(res);
    const duration = performance.now() - start;
    console.log(
      JSON.stringify({
        service: "pipeline_total",
        durationMs: duration,
        depth: req.body?.params.patterns[0]?.params?.depth ?? null,
        heapUsedMb: mem.heapUsed / 1024 / 1024,
        rssMb: mem.rss / 1024 / 1024,
      }),
    );
  } catch (err) {
    sseSend({
      type: "error",
      step: err.message,
      at: Date.now(),
    });

    return res.status(500).json({ error: err.message });
  }
}

pipelineRoutes.post("/run", processPipeline);
pipelineRoutes.get("/jobs/:jobId", async (req, res) => {
  const jobId = req.params.jobId;
  const steps = await getSteps(jobId);
  res.json({ jobId: jobId, steps });
});
pipelineRoutes.get("/logs/stream", (req, res) => {
  sseConnect(req, res);
});
pipelineRoutes.get("/artifact/:artifactId", async (req, res) => {
  const artifactId = req.params.artifactId;
  try {
    const artifact = await getArtifactData(artifactId);
    res.json({ artifact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default pipelineRoutes;
