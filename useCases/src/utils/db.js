import knex from "knex";
import config from "../../knexfile.js";
export const db = knex(config.development);

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

export async function updateArtifactData(id, data) {
  const count = await db("artifacts").where({ id }).update({ data });

  if (count === 0) throw new Error(`Artifact not found: ${id}`);
}
