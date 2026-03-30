import { sseSend } from "../utils/sse.js";

const SERVICES = {
  generator: process.env.GENERATOR_URL || "http://localhost:4002",
  usecases: process.env.USECASE_URL || "http://localhost:4003",
  render: process.env.RENDER_URL || "http://localhost:4004",
};

export async function runGenerateStep(context) {
  const response = await fetch(`${SERVICES.generator}/api/generator/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: context.type,
      params: context.params,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    sseSend({
      type: "error",
      step: `Generator service error: ${errorData.error}`,
      at: Date.now(),
    });
    throw new Error(`Generator service error: ${errorData.error}`);
  }

  const data = await response.json();
  context.artifactId = data.artifactId;
  return context;
}

export async function runUseCasesStep(context) {
  if (!context.usecases || context.usecases.length === 0) {
    return context;
  }

  const response = await fetch(`${SERVICES.usecases}/api/usecases/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      artifactId: context.artifactId,
      usecases: context.usecases,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    sseSend({
      type: "error",
      step: `UseCase service error: ${errorData.error}`,
      at: Date.now(),
    });
    throw new Error(`UseCases service error: ${errorData.error}`);
  }

  return context;
}

export async function runRenderStep(context) {
  const response = await fetch(`${SERVICES.render}/api/canvas/render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      artifactId: context.artifactId,
      canvasParams: context.canvasParams || {},
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    sseSend({
      type: "error",
      step: `Render service error: ${errorData.error}`,
      at: Date.now(),
    });
    throw new Error(`Render service error: ${errorData.error}`);
  }

  context.renderResponse = response;
  return context;
}
