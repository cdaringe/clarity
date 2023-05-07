import type { Task, Tasks } from "https://deno.land/x/rad/src/mod.ts";

const format = "deno fmt";
const uiDev = `cd apps/ui && deno task dev`;

export const tasks: Tasks = {
  cache: "fd .ts -x deno cache {}",
  run: "deno run -A ./packages/adapt-deno/shell/bin.ts",
  ...{ format, f: format, fmt: format },
  ...{ uiDev, u: uiDev },
};
