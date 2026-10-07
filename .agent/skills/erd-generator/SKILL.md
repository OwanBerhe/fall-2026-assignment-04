name: erd-generator
description: Designs Entity-Relationship Diagrams from a domain description. Use when asked to design an ERD, data model, or architecture diagram. Writes a Mermaid erDiagram to docs/architecture/schema.mmd, validates it and compiles it to docs/architecture/erd.svg with a local script, and fixes syntax errors.


# ERD Generator

## Workflow

1. Parse the domain requirements into entities, primary keys (PK), foreign keys (FK), and cardinalities.
2. Write the drafted Mermaid syntax directly to `docs/architecture/schema.mmd`.
3. Run the script from the project root (the script lives in this skill's `scripts/` folder):

node .agent/skills/erd-generator/scripts/render_erd.js docs/architecture/schema.mmd

4. Self-Correction Loop: if the script fails with `SYNTAX_ERROR`, parse the error trace, adjust the Mermaid syntax in `docs/architecture/schema.mmd`, and re-run. Retry up to 3 times.
5. Final output: present the raw Mermaid block to the user and reference the generated image asset path, `docs/architecture/erd.svg`.