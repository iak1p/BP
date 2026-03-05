/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("artifacts");
  if (exists) return;

  await knex.schema.createTable("artifacts", (t) => {
    t.uuid("id").primary();
    t.text("kind").notNullable();
    t.jsonb("data").notNullable();
    t.timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
  
  await knex.schema.alterTable("artifacts", (t) => {
    t.index(["kind"], "artifacts_kind_idx");
    t.index(["created_at"], "artifacts_created_at_idx");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("artifacts");
};
