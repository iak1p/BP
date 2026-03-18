import { Router } from "express";
import { randomUUID } from "crypto";
import { getArtifactData, getSteps, saveStep } from "../utils/db.js";
import { sseConnect, sseSend } from "../utils/sse.js";
import { Readable } from "stream";

const pipelineRoutes = new Router();

const run = async (req, res) => {
  const {
    type = null,
    params = null,
    canvasParams = {},
    usecases = [],
  } = req.body;
  const jobId = randomUUID();
  console.log(req.body);

  if (!type || !params.depth) {
    return res.status(400).json({
      error: "Missing required fields: type and params.depth.",
    });
  }

  try {
    // Save initial step to DB and notify clients
    await saveStep(jobId, "started", {});
    sseSend({ type: "step", step: `Started jobId: ${jobId}`, at: Date.now() });

    // 1. Call generator service
    const artifactId = await fetch(
      "http://localhost:4002/api/generator/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, params }),
      },
    )
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();

          sseSend({
            type: "error",
            step: `Generator service error: ${errorData.error}`,
            at: Date.now(),
          });
          throw new Error(`Generator service error: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => data.artifactId)
      .catch((err) => {
        throw err;
      });

    // 2. Save generated artifact step to DB and notify clients
    await saveStep(jobId, "generated", { artifactId });
    sseSend({ type: "step", step: "Generated", at: Date.now() });

    // 3. Call use case service
    await fetch("http://localhost:4003/api/usecases/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artifactId, usecases }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();

          sseSend({
            type: "error",
            step: `UseCase service error: ${errorData.error}`,
            at: Date.now(),
          });
          throw new Error(`UseCase service error: ${res.status}`);
        }

        return res.json();
      })
      .catch((err) => {
        throw err;
      });

    // 4. Save use cases applied step to DB and notify clients
    await saveStep(jobId, "usecases_applied", { artifactId });
    sseSend({ type: "step", step: "Use cases applied", at: Date.now() });

    // 5. Call render service
    const renderResponse = await fetch(
      "http://localhost:4004/api/canvas/render",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ artifactId, canvasParams }),
      },
    );

    if (!renderResponse.ok) {
      throw new Error(`Render service error: ${renderResponse.status}`);
    }

    // 6. Save rendered step to DB and notify clients
    await saveStep(jobId, "rendered", { artifactId });
    sseSend({ type: "step", step: "Rendered", at: Date.now() });

    res.setHeader("Content-Type", "image/png");

    if (!renderResponse.body) {
      throw new Error("Render response body is empty");
    }

    Readable.fromWeb(renderResponse.body).pipe(res);

    // return res.status(200).json({ jobId, artifactId });
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
