import knex from "knex";
import config from "../../knexfile.js";
export const db = knex(config.development);

export async function saveStep(
  jobId,
  step,
  { artifactId = null, meta = null } = {},
) {
  await db("job_steps").insert({
    job_id: jobId,
    step,
    artifact_id: artifactId,
    meta,
  });
}

export async function getSteps(jobId) {
  return db("job_steps")
    .select("id", "job_id", "step", "artifact_id", "meta", "created_at")
    .where({ job_id: jobId })
    .orderBy("id", "asc");
}

export async function createArtifact(kind, data) {
  const id = randomUUID();
  await db("artifacts").insert({ id, kind, data });
  return id;
}

export async function getArtifact(id) {
  const row = await db("artifacts")
    .select("id", "kind", "data", "created_at")
    .where({ id })
    .first();

  if (!row) throw new Error(`Artifact not found: ${id}`);
  return row;
}

export async function getArtifactData(id) {
  const row = await db("artifacts").select("data").where({ id }).first();

  if (!row) throw new Error(`Artifact not found: ${id}`);
  return row.data;
}
