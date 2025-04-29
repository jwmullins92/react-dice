// postcss.config.js
import url from "postcss-url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    url({
      url: "inline", // Inline fonts and assets as base64
      maxSize: Infinity, // Always inline
    }),
    tailwindcss,
    autoprefixer,
  ],
};
