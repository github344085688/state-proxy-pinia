import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import typescript2 from "rollup-plugin-typescript2";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    typescript2({
      check: false,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true, // 确保生成 .d.ts 文件
          declarationMap: false,
          outDir: "dist",
        },
        include: ["src/index.ts"],
        exclude: ["node_modules", "**/*.test.ts", "**/*.spec.ts"] // 排除测试文件
      }
    }),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      name: "StateProxyPinia",
      fileName: (format) => `juejin-state.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
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
