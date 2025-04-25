import path from "path";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { fileURLToPath } from "node:url";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss"; // Import the postcss plugin

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/bundle.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
        exportConditions: ["react"],
      }),
      commonjs(),
      typescript({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
        noEmit: true,
      }),
      postcss({
        input: "./dist/index.css",
        output: "bundle.css",
        inject: true,
        minimize: true,
      }),
    ],
    external: ["react", "react-dom"], // Mark react and react-dom as external
  },
  {
    input: "src/index.ts", // Your generated d.ts entry file
    output: {
      file: "dist/index.d.ts", // Your final combined d.ts file
      format: "esm",
    },
    plugins: [dts()],
    external: [/\.css$/],
  },
];
