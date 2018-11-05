// rollup.config.js
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import filesize from "rollup-plugin-filesize";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";

const pkg = require("./package.json");
const env = process.env.NODE_ENV;

const external = [];

export default args => {
  var cf = [
    {
      input: "./main.js",
      output: {
        file: {
          cjs: pkg.main,
          es: pkg.module
          //   umd: "dist/umd/bundle.js"
        }[env],
        format: [env]
      },
      external,
      plugins: [
        json(),
        resolve(),
        commonjs(),
        babel({
          // only transpile our source code
          exclude: "node_modules/**",
          // loading plugin here is better than in babelrc
          plugins: [
            "@babel/external-helpers",
            "@babel/plugin-proposal-object-rest-spread"
          ],
          // if external helpers true then use global babel object
          externalHelpers: true
        }),
        filesize()
      ]
    }
  ];

  return cf;
};
