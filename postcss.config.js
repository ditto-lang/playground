import mixins from "postcss-mixins";
import autoprefixer from "postcss-mixins";
import cssnano from "cssnano";

export default {
  plugins: [
    mixins,
    autoprefixer,
    cssnano({
      preset: "default",
    }),
  ],
};
