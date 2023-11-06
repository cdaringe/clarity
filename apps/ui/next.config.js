/** @type {import('next').NextConfig} */
// https://github.com/unocss/unocss/issues/2584
// const UnoCSS = require("unocss/webpack").default;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    // https://github.com/unocss/unocss/issues/2584
    // config.cache = false; // https://github.com/unocss/unocss/pull/1198/files
    // config.plugins.push(UnoCSS());
    return config;
  },
};

module.exports = nextConfig;
