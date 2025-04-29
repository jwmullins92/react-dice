import path from "path";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import url from "@rollup/plugin-url";
import dts from "rollup-plugin-dts";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/bundle.js",
      format: "esm",
      sourcemap: true,
    },
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
      url({
        include: ["**/*.woff", "**/*.woff2"],
        limit: Infinity,
        emitFiles: false,
        sourceDir: path.join(__dirname, "src"),
      }),
      postcss({
        minimize: true,
        inject: true,
      }),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "esm",
    },
    plugins: [dts()],
    external: [/\.css$/, /\.woff$/, /\.woff2$/],
  },
];
