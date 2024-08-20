module.exports = {
  input: "./build/index.js",
  output: {
    path: "dist",
    filename: "bundle.js",
  },
  server: {
    port: 8081,
  },
}