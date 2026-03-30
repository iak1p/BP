import { saveStep } from "../utils/db.js";
import { sseSend } from "../utils/sse.js";
import {
  runGenerateStep,
  runRenderStep,
  runUseCasesStep,
} from "./pipeline.steps.js";

const PIPELINE_STEPS = [
  {
    name: "generated",
    run: runGenerateStep,
  },
  {
    name: "usecases_applied",
    run: runUseCasesStep,
    shouldRun: (context) =>
      Array.isArray(context.usecases) && context.usecases.length > 0,
  },
  {
    name: "rendered",
    run: runRenderStep,
  },
];

export default async function executePipeline(context, jobId) {
  for (const step of PIPELINE_STEPS) {
    if (step.shouldRun && !step.shouldRun(context)) {
      continue;
    }

    context = await step.run(context);

    await saveStep(jobId, step.name, {
      artifactId: context.artifactId || null,
    });

    sseSend({ type: "step", step: step.name, at: Date.now() });
  }

  return context;
}
