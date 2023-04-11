import { log as logMod } from "./deps.ts";

await logMod.setup({
  handlers: {
    console: new logMod.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    clarity: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

export const log = logMod.getLogger("clarity");
