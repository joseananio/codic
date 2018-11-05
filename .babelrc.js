const presets = ["@babel/env"];
const plugins = [];

var rollup_envs = ["cjs", "es", "umd"];
var env = process.env["NODE_ENV"];
if (rollup_envs.includes(env)) {
  plugins.push("@babel/external-helpers");
}

module.exports = { presets, plugins };
