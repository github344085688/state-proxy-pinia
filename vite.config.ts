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
        "include": ["src/index.ts"], // 只包含你的入口文件
        "exclude": ["node_modules","src/**/*", "**/*.test.ts", "**/*.spec.ts"] // 排除所有文件，除了 src/index.ts
      }
    }),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      name: "StateProxyPinia",
      fileName: (format) => `state-proxy-pinia.${format}.js`,
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
