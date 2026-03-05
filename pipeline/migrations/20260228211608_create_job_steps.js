/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("job_steps");
  if (exists) return;

  await knex.schema.createTable("job_steps", (t) => {
    t.bigIncrements("id").primary();
    t.uuid("job_id").notNullable().index(); 
    t.text("step").notNullable();
    t.uuid("artifact_id").nullable();
    t.jsonb("meta").nullable();
    t.timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("job_steps", (t) => {
    t.index(["job_id", "step"], "job_steps_job_step_idx");
    t.index(["created_at"], "job_steps_created_at_idx");
  });

  await knex.schema.alterTable("job_steps", (t) => {
    t.foreign("artifact_id").references("artifacts.id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("job_steps");
};
