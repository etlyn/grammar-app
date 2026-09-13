import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
const directory = await mkdtemp(path.join(tmpdir(), "grammacho-tests-"));
try {
  const compile = spawnSync(
    process.execPath,
    [
      "node_modules/typescript/bin/tsc",
      "src/utils/learningState.ts",
      "--module",
      "commonjs",
      "--target",
      "es2021",
      "--esModuleInterop",
      "--skipLibCheck",
      "--outDir",
      directory,
    ],
    { stdio: "inherit" },
  );
  if (compile.status !== 0) process.exitCode = compile.status ?? 1;
  else {
    const result = spawnSync(
      process.execPath,
      ["--test", "tests/content.test.mjs", "tests/learning.test.cjs"],
      {
        stdio: "inherit",
        env: { ...process.env, LEARNING_BUILD_DIR: directory },
      },
    );
    process.exitCode = result.status ?? 1;
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}
