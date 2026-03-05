import knex from "knex";
import config from "../../knexfile.js";
export const db = knex(config.development);
import { randomUUID } from "crypto";

export async function createArtifact(kind, data) {
  const id = randomUUID();
  await db("artifacts").insert({ id, kind, data });
  return id;
}