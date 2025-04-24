import path from "path";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { fileURLToPath } from "node:url";
import dts from "rollup-plugin-dts";

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
      resolve(),
      commonjs(),
      typescript({
        tsconfig: path.resolve(__dirname, "tsconfig.json"), // Use the existing tsconfig
        noEmit: false, // Allow emitting files
        declaration: true, // Generate types
        declarationDir: "dist/types", // Generate types in dist folder
      }),
    ],
    external: ["react", "react-dom"], // Mark react and react-dom as external
  },
  {
    input: "dist/types/index.d.ts", // Your generated d.ts entry file
    output: {
      file: "dist/index.d.ts", // Your final combined d.ts file
      format: "esm",
    },
    plugins: [dts()],
  },
];
