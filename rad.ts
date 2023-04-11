import type { Task, Tasks } from "https://deno.land/x/rad/src/mod.ts";

const format = "deno fmt";

export const tasks: Tasks = {
  cache: "fd .ts -x deno cache {}",
  run: "deno run -A ./packages/adapt-deno/shell/bin.ts",
  ...{ format, f: format, fmt: format },
};
