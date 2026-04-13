const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  turbopack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
});