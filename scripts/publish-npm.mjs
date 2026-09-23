#!/usr/bin/env node
// Local npm publish flow. Replaces any GitHub Actions publish workflow —
// this project publishes from a developer machine, not CI.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const DRY_RUN = process.argv.includes("--dry-run");
const OTP = (process.argv.find((a) => a.startsWith("--otp=")) ?? "").split("=")[1];

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { stdio: "pipe", encoding: "utf8", ...opts }).trim();
}

function runInherit(cmd, args) {
  execFileSync(cmd, args, { stdio: "inherit" });
}

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

console.log("== Underworld Writer npm publish ==\n");

// 1. Working tree must be clean.
const status = run("git", ["status", "--porcelain"]);
if (status) fail("Working tree is not clean. Commit or stash changes before publishing.");

// 2. Must be on main with no unpushed commits.
const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== "main") {
  fail(`Refusing to publish from branch "${branch}". Switch to "main" first.`);
}
try {
  run("git", ["fetch", "origin", "main"]);
} catch {
  fail("Could not fetch origin/main to verify branch is up to date.");
}
const ahead = run("git", ["rev-list", "--left-right", "--count", "origin/main...HEAD"]);
const [behind, aheadCount] = ahead.split(/\s+/).map(Number);
if (behind > 0) fail("Local main is behind origin/main. Pull first.");
if (aheadCount > 0) fail("Local main has unpushed commits. Push first.");

// 3. Must be authenticated to npm.
let whoami;
try {
  whoami = run("npm", ["whoami"]);
} catch {
  fail('Not logged in to npm. Run "npm login" first.');
}
console.log(`Publishing as npm user: ${whoami}`);

// 4. Version must not already be published.
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
try {
  const published = run("npm", ["view", `${pkg.name}@${pkg.version}`, "version"]);
  if (published === pkg.version) {
    fail(`${pkg.name}@${pkg.version} is already published. Bump the version first.`);
  }
} catch {
  // npm view exits non-zero when the version doesn't exist yet — expected.
}

// 5. Run the full local validation/evidence pipeline (build, tests, lint,
// release contract, changelog evidence, release art) before publishing.
console.log("\nRunning release validation (npm run release:evidence)...");
runInherit("npm", ["run", "release:evidence"]);

// 6. Publish.
const publishArgs = ["publish", "--access", "public"];
if (DRY_RUN) publishArgs.push("--dry-run");
if (OTP) publishArgs.push("--otp", OTP);

console.log(`\nRunning: npm ${publishArgs.join(" ")}`);
runInherit("npm", publishArgs);

if (DRY_RUN) {
  console.log("\nDry run complete. No package was published.");
  process.exit(0);
}

// 7. Tag the release in git and push the tag.
const tag = `v${pkg.version}`;
try {
  run("git", ["rev-parse", tag]);
  console.log(`\nGit tag ${tag} already exists, skipping tag/push.`);
} catch {
  runInherit("git", ["tag", "-a", tag, "-m", `Release ${tag}`]);
  runInherit("git", ["push", "origin", tag]);
  console.log(`\nTagged and pushed ${tag}.`);
}

console.log(`\n✔ Published ${pkg.name}@${pkg.version}`);
