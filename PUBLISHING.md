# Publishing to npm

This project publishes to npm from a developer machine, not from GitHub
Actions. `.github/workflows/test.yml` only runs tests/lint on push and PR —
it does not publish.

## Prerequisites

- Logged in to npm with publish rights to `@h4shed/skill-underworld-writer`
  (`npm login`).
- On `main`, working tree clean, local `main` in sync with `origin/main`.
- Version in `package.json` bumped (see `npm run version:sync`).

## Publish

```bash
npm run publish:npm            # validates, builds, tests, then publishes
npm run publish:npm -- --dry-run   # everything except the actual publish
npm run publish:npm -- --otp=123456
```

`scripts/publish-npm.mjs` runs, in order:

1. Git safety checks (clean tree, on `main`, in sync with `origin/main`).
2. npm auth check (`npm whoami`).
3. Refuses if the current version is already published.
4. `npm run release:evidence` — version/workspace validation, changelog
   evidence via the pinned local `@h4shed/rock-hardened` devDependency
   (no `npx --yes` auto-install of unpinned code), and release artwork.
5. `npm publish --access public`.
6. Tags the release (`vX.Y.Z`) and pushes the tag.

## Notes

- `@h4shed/rock-hardened` is pinned to an exact version as a devDependency
  and invoked via its local bin (`hardened-changelogger`), not fetched at
  publish time with `npx --yes`. Bump it deliberately when a new version is
  vetted.
