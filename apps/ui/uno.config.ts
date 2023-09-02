// disabled: https://github.com/unocss/unocss/issues/2584
// uno.config.ts
import { defineConfig, presetUno } from "unocss";

const config = defineConfig({
  presets: [presetUno()],
}) as any;

export default config;
