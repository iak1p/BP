import knex from "knex";
import config from "../../knexfile.js";
export const db = knex(config.development);

export async function getArtifactData(id) {
  const row = await db("artifacts").select("data").where({ id }).first();

  if (!row) throw new Error(`Artifact not found: ${id}`);
  return row.data;
}