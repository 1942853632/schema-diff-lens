# Schema Diff Lens

Schema Diff Lens is a local-only Chrome side-panel extension for reviewing JSON schema compatibility before an API version ships.

## What it demonstrates

- Recursive schema comparison with deterministic breaking-change rules
- Explainable findings: rule ID, JSON path, severity and remediation context
- A testable TypeScript core separated from the browser adapter
- Markdown export for pull requests and release checklists
- No API keys, network requests or uploaded schemas

## Interview-ready engineering story

The project separates a pure recursive compatibility analyzer from the Chrome adapter. Every finding has a stable rule ID, JSON path and severity, making the result reproducible in a release review instead of hiding the decision behind an opaque score.

The MVP detects removed properties, newly required fields, narrowed enums, type changes, deprecations and additive properties. It returns a compatibility verdict and score that can be reproduced in CI later.

## Run

```bash
pnpm install
pnpm test -- --run
pnpm lint
pnpm build
```

Load `dist/` in `chrome://extensions` with Developer mode enabled.

The repository also includes `SchemaDiffLens-v0.1.0.zip` as a ready-to-load package.
