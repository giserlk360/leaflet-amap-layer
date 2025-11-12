import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  input: "src/AmapLayer.js",
  output: [
    {
      file: "dist/leaflet-amap-layer.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/leaflet-amap-layer.esm.js",
      format: "es",
      sourcemap: true,
    },
    {
      file: "dist/leaflet-amap-layer.umd.js",
      format: "umd",
      name: "LeafletAmapLayer",
      sourcemap: true,
      globals: {
        "leaflet": "L",
        "@amap/amap-jsapi-loader": "AMapLoader"
      }
    },
  ],
  plugins: [nodeResolve(), commonjs(), terser()],
  external: ["leaflet", "@amap/amap-jsapi-loader"],
});
