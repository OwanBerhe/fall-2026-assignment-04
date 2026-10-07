name: kysely-migration-generator
description: Translates a Mermaid ERD from docs/architecture/ into a type-safe Kysely database migration in src/db/migrations/. Use when asked to generate a migration or database schema from an ERD or Mermaid file.


# Kysely Migration Generator

Use `src/db/migrations/001_initial_schema.ts` as the reference for migration structure.

# Translation rules

- Entities to tables: map Mermaid entities to snake_case table names (e.g. `USERS` becomes `users`).
- Keys and columns: convert PK attributes to auto-generating IDs (use `serial`, matching `001_initial_schema.ts`) and FK attributes to `.references()` with `.onDelete('cascade')`. Map Mermaid attribute types to matching Postgres column types.
- Cardinalities:
  - `||--o{` (one-to-many): FK on the "many" table.
  - `||--o|` (one-to-one): FK on the child table with a unique constraint.

# Output

- Write the TypeScript migration to `src/db/migrations/<timestamp>_<migration_name>.ts`.
- Export both `up(db: Kysely<any>)` and `down(db: Kysely<any>)`.
- `down` must drop tables in reverse dependency order.