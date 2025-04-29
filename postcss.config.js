import url from "postcss-url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    url({
      url: "inline",
      maxSize: Infinity,
    }),
    tailwindcss,
    autoprefixer,
  ],
};
