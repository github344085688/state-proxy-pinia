import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import typescript2 from "rollup-plugin-typescript2";
import { resolve } from "path";
export default defineConfig({
  plugins: [
    vue(),
    typescript2({
      check: false,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true, // 确保生成 .d.ts 文件
          declarationMap: false,
          outDir: "dist",
        },
        include: ["/src/index.ts"],
        exclude: ["node_modules", "**/*.test.ts", "**/*.spec.ts"] // 排除测试文件
      }
    }),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      name: "juejin-state",
      fileName: (format) => `juejin-state.${format}.js`,
    },
    rollupOptions: {
      external: ["vue","uni"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          uni: "uni"
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
