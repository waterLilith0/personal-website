import { defineConfig, loadEnv, type PluginOption } from "vite";
import pkg from "./package.json" with { type: "json" };
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import faroUploader from "@grafana/faro-rollup-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const uploadSourcemaps = !!env.FARO_API_KEY;
  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    build: { sourcemap: uploadSourcemaps ? "hidden" : false },
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      ...(uploadSourcemaps
        ? [
            // Its types come from rollup, which isn't installed, so they resolve to any.
            faroUploader({
              appName: "horizon-ui",
              endpoint: env.FARO_UPLOAD_ENDPOINT,
              appId: env.FARO_APP_ID,
              stackId: env.FARO_STACK_ID,
              apiKey: env.FARO_API_KEY,
              // .git isn't in the Docker build context, so CI passes the commit in.
              gitHash: env.FARO_GIT_HASH || undefined,
              gzipContents: true,
            }) as PluginOption,
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
  };
});
