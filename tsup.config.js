import { defineConfig } from "tsup";

// https://modyqyw.top/blogs/2022/12/why-tsup.html
export default defineConfig({
  entry: ["./src/index.ts"],
  dts: true,
  splitting: false,
  shims: true,
  outDir: "dist",
  format: ["cjs", "esm"],
  banner: ({ format }) => {
    if (format === "esm") {
      return {
        js: `import {createRequire as __createRequire} from 'module';var require=__createRequire(import.meta.url);`,
      };
    }
  },
  sourcemap: process.env.NODE_ENV === "development",
  // extra watch
  // watch: process.env.NODE_ENV === "development" && [
  //   "./node",
  //   "./client",
  //   "../shared/dist",
  //   "../plugin-docit/dist",
  //   "../theme-default/dist",
  // ],
});
