// adapters/express/vite.config.ts
import { nodeServerAdapter } from "file:///D:/Ramy%20folders/Projects/vin-decoder/node_modules/@builder.io/qwik-city/lib/adapters/node-server/vite/index.mjs";
import { extendConfig } from "file:///D:/Ramy%20folders/Projects/vin-decoder/node_modules/@builder.io/qwik-city/lib/vite/index.mjs";

// vite.config.ts
import { defineConfig } from "file:///D:/Ramy%20folders/Projects/vin-decoder/node_modules/vite/dist/node/index.js";
import { qwikVite } from "file:///D:/Ramy%20folders/Projects/vin-decoder/node_modules/@builder.io/qwik/dist/optimizer.mjs";
import { qwikCity } from "file:///D:/Ramy%20folders/Projects/vin-decoder/node_modules/@builder.io/qwik-city/lib/vite/index.mjs";
import tsconfigPaths from "file:///D:/Ramy%20folders/Projects/vin-decoder/node_modules/vite-tsconfig-paths/dist/index.mjs";

// package.json
var package_default = {
  name: "my-qwik-empty-starter",
  description: "Blank project with routing included",
  engines: {
    node: "^18.17.0 || ^20.3.0 || >=21.0.0"
  },
  "engines-annotation": "Mostly required by sharp which needs a Node-API v9 compatible runtime",
  private: true,
  type: "module",
  scripts: {
    build: "qwik build",
    "build.client": "vite build",
    "build.preview": "vite build --ssr src/entry.preview.tsx",
    "build.server": "vite build -c adapters/express/vite.config.ts",
    "build.types": "tsc --incremental --noEmit",
    deploy: `echo 'Run "npm run qwik add" to install a server adapter'`,
    dev: "vite --mode ssr",
    "dev.debug": "node --inspect-brk ./node_modules/vite/bin/vite.js --mode ssr --force",
    fmt: "prettier --write .",
    "fmt.check": "prettier --check .",
    lint: 'eslint "src/**/*.ts*"',
    preview: "qwik build preview && vite preview --open",
    serve: "node server/entry.express",
    start: "vite --open --mode ssr",
    qwik: "qwik"
  },
  devDependencies: {
    "@builder.io/qwik": "^1.12.1",
    "@builder.io/qwik-city": "^1.12.1",
    "@types/compression": "^1.7.2",
    "@types/crypto-js": "^4.2.2",
    "@types/eslint": "8.56.10",
    "@types/express": "^4.17.19",
    "@types/lodash": "^4.17.16",
    "@types/node": "20.14.11",
    "@types/selenium-webdriver": "^4.1.28",
    "@typescript-eslint/eslint-plugin": "7.16.1",
    "@typescript-eslint/parser": "7.16.1",
    compression: "^1.7.4",
    dotenv: "^16.3.2",
    eslint: "8.57.0",
    "eslint-plugin-qwik": "^1.12.1",
    prettier: "3.3.3",
    typescript: "5.4.5",
    undici: "*",
    vite: "5.3.5",
    "vite-tsconfig-paths": "^4.2.1"
  },
  dependencies: {
    "@tailwindcss/vite": "^4.0.12",
    axios: "^1.8.2",
    cheerio: "^1.0.0",
    "crypto-js": "^4.2.0",
    express: "4.20.0",
    lodash: "^4.17.21",
    "selenium-webdriver": "^4.31.0",
    sequelize: "^6.37.6",
    serpapi: "^2.1.0",
    tailwindcss: "^4.0.12",
    tedious: "^18.6.1",
    vindec: "^2.8.0"
  }
};

// vite.config.ts
import tailwindcss from "file:///D:/Ramy%20folders/Projects/vin-decoder/node_modules/@tailwindcss/vite/dist/index.mjs";
var { dependencies = {}, devDependencies = {} } = package_default;
errorOnDuplicatesPkgDeps(devDependencies, dependencies);
var vite_config_default = defineConfig(({ command, mode }) => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), tailwindcss()],
    // This tells Vite which dependencies to pre-build in dev mode.
    optimizeDeps: {
      // Put problematic deps that break bundling here, mostly those with binaries.
      // For example ['better-sqlite3'] if you use that in server functions.
      exclude: []
    },
    /**
     * This is an advanced setting. It improves the bundling of your server code. To use it, make sure you understand when your consumed packages are dependencies or dev dependencies. (otherwise things will break in production)
     */
    // ssr:
    //   command === "build" && mode === "production"
    //     ? {
    //         // All dev dependencies should be bundled in the server build
    //         noExternal: Object.keys(devDependencies),
    //         // Anything marked as a dependency will not be bundled
    //         // These should only be production binary deps (including deps of deps), CLI deps, and their module graph
    //         // If a dep-of-dep needs to be external, add it here
    //         // For example, if something uses `bcrypt` but you don't have it as a dep, you can write
    //         // external: [...Object.keys(dependencies), 'bcrypt']
    //         external: Object.keys(dependencies),
    //       }
    //     : undefined,
    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0"
      }
    },
    preview: {
      headers: {
        // Do cache the server response in preview (non-adapter production build)
        "Cache-Control": "public, max-age=600"
      }
    }
  };
});
function errorOnDuplicatesPkgDeps(devDependencies2, dependencies2) {
  let msg = "";
  const duplicateDeps = Object.keys(devDependencies2).filter(
    (dep) => dependencies2[dep]
  );
  const qwikPkg = Object.keys(dependencies2).filter(
    (value) => /qwik/i.test(value)
  );
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;
  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }
  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}

// adapters/express/vite.config.ts
var vite_config_default2 = extendConfig(vite_config_default, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.express.tsx", "@qwik-city-plan"]
      }
    },
    plugins: [nodeServerAdapter({ name: "express" })]
  };
});
export {
  vite_config_default2 as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYWRhcHRlcnMvZXhwcmVzcy92aXRlLmNvbmZpZy50cyIsICJ2aXRlLmNvbmZpZy50cyIsICJwYWNrYWdlLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxSYW15IGZvbGRlcnNcXFxcUHJvamVjdHNcXFxcdmluLWRlY29kZXJcXFxcYWRhcHRlcnNcXFxcZXhwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUmFteSBmb2xkZXJzXFxcXFByb2plY3RzXFxcXHZpbi1kZWNvZGVyXFxcXGFkYXB0ZXJzXFxcXGV4cHJlc3NcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1JhbXklMjBmb2xkZXJzL1Byb2plY3RzL3Zpbi1kZWNvZGVyL2FkYXB0ZXJzL2V4cHJlc3Mvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBub2RlU2VydmVyQWRhcHRlciB9IGZyb20gXCJAYnVpbGRlci5pby9xd2lrLWNpdHkvYWRhcHRlcnMvbm9kZS1zZXJ2ZXIvdml0ZVwiO1xuaW1wb3J0IHsgZXh0ZW5kQ29uZmlnIH0gZnJvbSBcIkBidWlsZGVyLmlvL3F3aWstY2l0eS92aXRlXCI7XG5pbXBvcnQgYmFzZUNvbmZpZyBmcm9tIFwiLi4vLi4vdml0ZS5jb25maWdcIjtcblxuZXhwb3J0IGRlZmF1bHQgZXh0ZW5kQ29uZmlnKGJhc2VDb25maWcsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBidWlsZDoge1xuICAgICAgc3NyOiB0cnVlLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBpbnB1dDogW1wic3JjL2VudHJ5LmV4cHJlc3MudHN4XCIsIFwiQHF3aWstY2l0eS1wbGFuXCJdLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtub2RlU2VydmVyQWRhcHRlcih7IG5hbWU6IFwiZXhwcmVzc1wiIH0pXSxcbiAgfTtcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxSYW15IGZvbGRlcnNcXFxcUHJvamVjdHNcXFxcdmluLWRlY29kZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFJhbXkgZm9sZGVyc1xcXFxQcm9qZWN0c1xcXFx2aW4tZGVjb2RlclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovUmFteSUyMGZvbGRlcnMvUHJvamVjdHMvdmluLWRlY29kZXIvdml0ZS5jb25maWcudHNcIjsvKipcbiAqIFRoaXMgaXMgdGhlIGJhc2UgY29uZmlnIGZvciB2aXRlLlxuICogV2hlbiBidWlsZGluZywgdGhlIGFkYXB0ZXIgY29uZmlnIGlzIHVzZWQgd2hpY2ggbG9hZHMgdGhpcyBmaWxlIGFuZCBleHRlbmRzIGl0LlxuICovXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgVXNlckNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyBxd2lrVml0ZSB9IGZyb20gXCJAYnVpbGRlci5pby9xd2lrL29wdGltaXplclwiO1xuaW1wb3J0IHsgcXdpa0NpdHkgfSBmcm9tIFwiQGJ1aWxkZXIuaW8vcXdpay1jaXR5L3ZpdGVcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5pbXBvcnQgcGtnIGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiO1xuXG50eXBlIFBrZ0RlcCA9IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG5jb25zdCB7IGRlcGVuZGVuY2llcyA9IHt9LCBkZXZEZXBlbmRlbmNpZXMgPSB7fSB9ID0gcGtnIGFzIGFueSBhcyB7XG4gIGRlcGVuZGVuY2llczogUGtnRGVwO1xuICBkZXZEZXBlbmRlbmNpZXM6IFBrZ0RlcDtcbiAgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbn07XG5lcnJvck9uRHVwbGljYXRlc1BrZ0RlcHMoZGV2RGVwZW5kZW5jaWVzLCBkZXBlbmRlbmNpZXMpO1xuXG4vKipcbiAqIE5vdGUgdGhhdCBWaXRlIG5vcm1hbGx5IHN0YXJ0cyBmcm9tIGBpbmRleC5odG1sYCBidXQgdGhlIHF3aWtDaXR5IHBsdWdpbiBtYWtlcyBzdGFydCBhdCBgc3JjL2VudHJ5LnNzci50c3hgIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pOiBVc2VyQ29uZmlnID0+IHtcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbcXdpa0NpdHkoKSwgcXdpa1ZpdGUoKSwgdHNjb25maWdQYXRocygpLCB0YWlsd2luZGNzcygpXSxcbiAgICAvLyBUaGlzIHRlbGxzIFZpdGUgd2hpY2ggZGVwZW5kZW5jaWVzIHRvIHByZS1idWlsZCBpbiBkZXYgbW9kZS5cbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIC8vIFB1dCBwcm9ibGVtYXRpYyBkZXBzIHRoYXQgYnJlYWsgYnVuZGxpbmcgaGVyZSwgbW9zdGx5IHRob3NlIHdpdGggYmluYXJpZXMuXG4gICAgICAvLyBGb3IgZXhhbXBsZSBbJ2JldHRlci1zcWxpdGUzJ10gaWYgeW91IHVzZSB0aGF0IGluIHNlcnZlciBmdW5jdGlvbnMuXG4gICAgICBleGNsdWRlOiBbXSxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBhbiBhZHZhbmNlZCBzZXR0aW5nLiBJdCBpbXByb3ZlcyB0aGUgYnVuZGxpbmcgb2YgeW91ciBzZXJ2ZXIgY29kZS4gVG8gdXNlIGl0LCBtYWtlIHN1cmUgeW91IHVuZGVyc3RhbmQgd2hlbiB5b3VyIGNvbnN1bWVkIHBhY2thZ2VzIGFyZSBkZXBlbmRlbmNpZXMgb3IgZGV2IGRlcGVuZGVuY2llcy4gKG90aGVyd2lzZSB0aGluZ3Mgd2lsbCBicmVhayBpbiBwcm9kdWN0aW9uKVxuICAgICAqL1xuICAgIC8vIHNzcjpcbiAgICAvLyAgIGNvbW1hbmQgPT09IFwiYnVpbGRcIiAmJiBtb2RlID09PSBcInByb2R1Y3Rpb25cIlxuICAgIC8vICAgICA/IHtcbiAgICAvLyAgICAgICAgIC8vIEFsbCBkZXYgZGVwZW5kZW5jaWVzIHNob3VsZCBiZSBidW5kbGVkIGluIHRoZSBzZXJ2ZXIgYnVpbGRcbiAgICAvLyAgICAgICAgIG5vRXh0ZXJuYWw6IE9iamVjdC5rZXlzKGRldkRlcGVuZGVuY2llcyksXG4gICAgLy8gICAgICAgICAvLyBBbnl0aGluZyBtYXJrZWQgYXMgYSBkZXBlbmRlbmN5IHdpbGwgbm90IGJlIGJ1bmRsZWRcbiAgICAvLyAgICAgICAgIC8vIFRoZXNlIHNob3VsZCBvbmx5IGJlIHByb2R1Y3Rpb24gYmluYXJ5IGRlcHMgKGluY2x1ZGluZyBkZXBzIG9mIGRlcHMpLCBDTEkgZGVwcywgYW5kIHRoZWlyIG1vZHVsZSBncmFwaFxuICAgIC8vICAgICAgICAgLy8gSWYgYSBkZXAtb2YtZGVwIG5lZWRzIHRvIGJlIGV4dGVybmFsLCBhZGQgaXQgaGVyZVxuICAgIC8vICAgICAgICAgLy8gRm9yIGV4YW1wbGUsIGlmIHNvbWV0aGluZyB1c2VzIGBiY3J5cHRgIGJ1dCB5b3UgZG9uJ3QgaGF2ZSBpdCBhcyBhIGRlcCwgeW91IGNhbiB3cml0ZVxuICAgIC8vICAgICAgICAgLy8gZXh0ZXJuYWw6IFsuLi5PYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpLCAnYmNyeXB0J11cbiAgICAvLyAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpLFxuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgOiB1bmRlZmluZWQsXG5cbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgLy8gRG9uJ3QgY2FjaGUgdGhlIHNlcnZlciByZXNwb25zZSBpbiBkZXYgbW9kZVxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJwdWJsaWMsIG1heC1hZ2U9MFwiLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHByZXZpZXc6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgLy8gRG8gY2FjaGUgdGhlIHNlcnZlciByZXNwb25zZSBpbiBwcmV2aWV3IChub24tYWRhcHRlciBwcm9kdWN0aW9uIGJ1aWxkKVxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJwdWJsaWMsIG1heC1hZ2U9NjAwXCIsXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59KTtcblxuLy8gKioqIHV0aWxzICoqKlxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGlkZW50aWZ5IGR1cGxpY2F0ZSBkZXBlbmRlbmNpZXMgYW5kIHRocm93IGFuIGVycm9yXG4gKiBAcGFyYW0ge09iamVjdH0gZGV2RGVwZW5kZW5jaWVzIC0gTGlzdCBvZiBkZXZlbG9wbWVudCBkZXBlbmRlbmNpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXBlbmRlbmNpZXMgLSBMaXN0IG9mIHByb2R1Y3Rpb24gZGVwZW5kZW5jaWVzXG4gKi9cbmZ1bmN0aW9uIGVycm9yT25EdXBsaWNhdGVzUGtnRGVwcyhcbiAgZGV2RGVwZW5kZW5jaWVzOiBQa2dEZXAsXG4gIGRlcGVuZGVuY2llczogUGtnRGVwLFxuKSB7XG4gIGxldCBtc2cgPSBcIlwiO1xuICAvLyBDcmVhdGUgYW4gYXJyYXkgJ2R1cGxpY2F0ZURlcHMnIGJ5IGZpbHRlcmluZyBkZXZEZXBlbmRlbmNpZXMuXG4gIC8vIElmIGEgZGVwZW5kZW5jeSBhbHNvIGV4aXN0cyBpbiBkZXBlbmRlbmNpZXMsIGl0IGlzIGNvbnNpZGVyZWQgYSBkdXBsaWNhdGUuXG4gIGNvbnN0IGR1cGxpY2F0ZURlcHMgPSBPYmplY3Qua2V5cyhkZXZEZXBlbmRlbmNpZXMpLmZpbHRlcihcbiAgICAoZGVwKSA9PiBkZXBlbmRlbmNpZXNbZGVwXSxcbiAgKTtcblxuICAvLyBpbmNsdWRlIGFueSBrbm93biBxd2lrIHBhY2thZ2VzXG4gIGNvbnN0IHF3aWtQa2cgPSBPYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpLmZpbHRlcigodmFsdWUpID0+XG4gICAgL3F3aWsvaS50ZXN0KHZhbHVlKSxcbiAgKTtcblxuICAvLyBhbnkgZXJyb3JzIGZvciBtaXNzaW5nIFwicXdpay1jaXR5LXBsYW5cIlxuICAvLyBbUExVR0lOX0VSUk9SXTogSW52YWxpZCBtb2R1bGUgXCJAcXdpay1jaXR5LXBsYW5cIiBpcyBub3QgYSB2YWxpZCBwYWNrYWdlXG4gIG1zZyA9IGBNb3ZlIHF3aWsgcGFja2FnZXMgJHtxd2lrUGtnLmpvaW4oXCIsIFwiKX0gdG8gZGV2RGVwZW5kZW5jaWVzYDtcblxuICBpZiAocXdpa1BrZy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cblxuICAvLyBGb3JtYXQgdGhlIGVycm9yIG1lc3NhZ2Ugd2l0aCB0aGUgZHVwbGljYXRlcyBsaXN0LlxuICAvLyBUaGUgYGpvaW5gIGZ1bmN0aW9uIGlzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBlbGVtZW50cyBvZiB0aGUgJ2R1cGxpY2F0ZURlcHMnIGFycmF5IGFzIGEgY29tbWEtc2VwYXJhdGVkIHN0cmluZy5cbiAgbXNnID0gYFxuICAgIFdhcm5pbmc6IFRoZSBkZXBlbmRlbmN5IFwiJHtkdXBsaWNhdGVEZXBzLmpvaW4oXCIsIFwiKX1cIiBpcyBsaXN0ZWQgaW4gYm90aCBcImRldkRlcGVuZGVuY2llc1wiIGFuZCBcImRlcGVuZGVuY2llc1wiLlxuICAgIFBsZWFzZSBtb3ZlIHRoZSBkdXBsaWNhdGVkIGRlcGVuZGVuY2llcyB0byBcImRldkRlcGVuZGVuY2llc1wiIG9ubHkgYW5kIHJlbW92ZSBpdCBmcm9tIFwiZGVwZW5kZW5jaWVzXCJcbiAgYDtcblxuICAvLyBUaHJvdyBhbiBlcnJvciB3aXRoIHRoZSBjb25zdHJ1Y3RlZCBtZXNzYWdlLlxuICBpZiAoZHVwbGljYXRlRGVwcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cbn1cbiIsICJ7XG4gIFwibmFtZVwiOiBcIm15LXF3aWstZW1wdHktc3RhcnRlclwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQmxhbmsgcHJvamVjdCB3aXRoIHJvdXRpbmcgaW5jbHVkZWRcIixcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcIm5vZGVcIjogXCJeMTguMTcuMCB8fCBeMjAuMy4wIHx8ID49MjEuMC4wXCJcbiAgfSxcbiAgXCJlbmdpbmVzLWFubm90YXRpb25cIjogXCJNb3N0bHkgcmVxdWlyZWQgYnkgc2hhcnAgd2hpY2ggbmVlZHMgYSBOb2RlLUFQSSB2OSBjb21wYXRpYmxlIHJ1bnRpbWVcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJxd2lrIGJ1aWxkXCIsXG4gICAgXCJidWlsZC5jbGllbnRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJidWlsZC5wcmV2aWV3XCI6IFwidml0ZSBidWlsZCAtLXNzciBzcmMvZW50cnkucHJldmlldy50c3hcIixcbiAgICBcImJ1aWxkLnNlcnZlclwiOiBcInZpdGUgYnVpbGQgLWMgYWRhcHRlcnMvZXhwcmVzcy92aXRlLmNvbmZpZy50c1wiLFxuICAgIFwiYnVpbGQudHlwZXNcIjogXCJ0c2MgLS1pbmNyZW1lbnRhbCAtLW5vRW1pdFwiLFxuICAgIFwiZGVwbG95XCI6IFwiZWNobyAnUnVuIFxcXCJucG0gcnVuIHF3aWsgYWRkXFxcIiB0byBpbnN0YWxsIGEgc2VydmVyIGFkYXB0ZXInXCIsXG4gICAgXCJkZXZcIjogXCJ2aXRlIC0tbW9kZSBzc3JcIixcbiAgICBcImRldi5kZWJ1Z1wiOiBcIm5vZGUgLS1pbnNwZWN0LWJyayAuL25vZGVfbW9kdWxlcy92aXRlL2Jpbi92aXRlLmpzIC0tbW9kZSBzc3IgLS1mb3JjZVwiLFxuICAgIFwiZm10XCI6IFwicHJldHRpZXIgLS13cml0ZSAuXCIsXG4gICAgXCJmbXQuY2hlY2tcIjogXCJwcmV0dGllciAtLWNoZWNrIC5cIixcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgXFxcInNyYy8qKi8qLnRzKlxcXCJcIixcbiAgICBcInByZXZpZXdcIjogXCJxd2lrIGJ1aWxkIHByZXZpZXcgJiYgdml0ZSBwcmV2aWV3IC0tb3BlblwiLFxuICAgIFwic2VydmVcIjogXCJub2RlIHNlcnZlci9lbnRyeS5leHByZXNzXCIsXG4gICAgXCJzdGFydFwiOiBcInZpdGUgLS1vcGVuIC0tbW9kZSBzc3JcIixcbiAgICBcInF3aWtcIjogXCJxd2lrXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGJ1aWxkZXIuaW8vcXdpa1wiOiBcIl4xLjEyLjFcIixcbiAgICBcIkBidWlsZGVyLmlvL3F3aWstY2l0eVwiOiBcIl4xLjEyLjFcIixcbiAgICBcIkB0eXBlcy9jb21wcmVzc2lvblwiOiBcIl4xLjcuMlwiLFxuICAgIFwiQHR5cGVzL2NyeXB0by1qc1wiOiBcIl40LjIuMlwiLFxuICAgIFwiQHR5cGVzL2VzbGludFwiOiBcIjguNTYuMTBcIixcbiAgICBcIkB0eXBlcy9leHByZXNzXCI6IFwiXjQuMTcuMTlcIixcbiAgICBcIkB0eXBlcy9sb2Rhc2hcIjogXCJeNC4xNy4xNlwiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCIyMC4xNC4xMVwiLFxuICAgIFwiQHR5cGVzL3NlbGVuaXVtLXdlYmRyaXZlclwiOiBcIl40LjEuMjhcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiNy4xNi4xXCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiNy4xNi4xXCIsXG4gICAgXCJjb21wcmVzc2lvblwiOiBcIl4xLjcuNFwiLFxuICAgIFwiZG90ZW52XCI6IFwiXjE2LjMuMlwiLFxuICAgIFwiZXNsaW50XCI6IFwiOC41Ny4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXF3aWtcIjogXCJeMS4xMi4xXCIsXG4gICAgXCJwcmV0dGllclwiOiBcIjMuMy4zXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiNS40LjVcIixcbiAgICBcInVuZGljaVwiOiBcIipcIixcbiAgICBcInZpdGVcIjogXCI1LjMuNVwiLFxuICAgIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiOiBcIl40LjIuMVwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB0YWlsd2luZGNzcy92aXRlXCI6IFwiXjQuMC4xMlwiLFxuICAgIFwiYXhpb3NcIjogXCJeMS44LjJcIixcbiAgICBcImNoZWVyaW9cIjogXCJeMS4wLjBcIixcbiAgICBcImNyeXB0by1qc1wiOiBcIl40LjIuMFwiLFxuICAgIFwiZXhwcmVzc1wiOiBcIjQuMjAuMFwiLFxuICAgIFwibG9kYXNoXCI6IFwiXjQuMTcuMjFcIixcbiAgICBcInNlbGVuaXVtLXdlYmRyaXZlclwiOiBcIl40LjMxLjBcIixcbiAgICBcInNlcXVlbGl6ZVwiOiBcIl42LjM3LjZcIixcbiAgICBcInNlcnBhcGlcIjogXCJeMi4xLjBcIixcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiXjQuMC4xMlwiLFxuICAgIFwidGVkaW91c1wiOiBcIl4xOC42LjFcIixcbiAgICBcInZpbmRlY1wiOiBcIl4yLjguMFwiXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1YsU0FBUyx5QkFBeUI7QUFDalksU0FBUyxvQkFBb0I7OztBQ0c3QixTQUFTLG9CQUFxQztBQUM5QyxTQUFTLGdCQUFnQjtBQUN6QixTQUFTLGdCQUFnQjtBQUN6QixPQUFPLG1CQUFtQjs7O0FDUDFCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixTQUFXO0FBQUEsSUFDVCxNQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0Esc0JBQXNCO0FBQUEsRUFDdEIsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsZ0JBQWdCO0FBQUEsSUFDaEIsaUJBQWlCO0FBQUEsSUFDakIsZ0JBQWdCO0FBQUEsSUFDaEIsZUFBZTtBQUFBLElBQ2YsUUFBVTtBQUFBLElBQ1YsS0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLElBQ2IsS0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLElBQ2IsTUFBUTtBQUFBLElBQ1IsU0FBVztBQUFBLElBQ1gsT0FBUztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsTUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCLG9CQUFvQjtBQUFBLElBQ3BCLHlCQUF5QjtBQUFBLElBQ3pCLHNCQUFzQjtBQUFBLElBQ3RCLG9CQUFvQjtBQUFBLElBQ3BCLGlCQUFpQjtBQUFBLElBQ2pCLGtCQUFrQjtBQUFBLElBQ2xCLGlCQUFpQjtBQUFBLElBQ2pCLGVBQWU7QUFBQSxJQUNmLDZCQUE2QjtBQUFBLElBQzdCLG9DQUFvQztBQUFBLElBQ3BDLDZCQUE2QjtBQUFBLElBQzdCLGFBQWU7QUFBQSxJQUNmLFFBQVU7QUFBQSxJQUNWLFFBQVU7QUFBQSxJQUNWLHNCQUFzQjtBQUFBLElBQ3RCLFVBQVk7QUFBQSxJQUNaLFlBQWM7QUFBQSxJQUNkLFFBQVU7QUFBQSxJQUNWLE1BQVE7QUFBQSxJQUNSLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxjQUFnQjtBQUFBLElBQ2QscUJBQXFCO0FBQUEsSUFDckIsT0FBUztBQUFBLElBQ1QsU0FBVztBQUFBLElBQ1gsYUFBYTtBQUFBLElBQ2IsU0FBVztBQUFBLElBQ1gsUUFBVTtBQUFBLElBQ1Ysc0JBQXNCO0FBQUEsSUFDdEIsV0FBYTtBQUFBLElBQ2IsU0FBVztBQUFBLElBQ1gsYUFBZTtBQUFBLElBQ2YsU0FBVztBQUFBLElBQ1gsUUFBVTtBQUFBLEVBQ1o7QUFDRjs7O0FEckRBLE9BQU8saUJBQWlCO0FBR3hCLElBQU0sRUFBRSxlQUFlLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLElBQUk7QUFLcEQseUJBQXlCLGlCQUFpQixZQUFZO0FBS3RELElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQWtCO0FBQzdELFNBQU87QUFBQSxJQUNMLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLGNBQWMsR0FBRyxZQUFZLENBQUM7QUFBQTtBQUFBLElBRWhFLGNBQWM7QUFBQTtBQUFBO0FBQUEsTUFHWixTQUFTLENBQUM7QUFBQSxJQUNaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQW1CQSxRQUFRO0FBQUEsTUFDTixTQUFTO0FBQUE7QUFBQSxRQUVQLGlCQUFpQjtBQUFBLE1BQ25CO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsU0FBUztBQUFBO0FBQUEsUUFFUCxpQkFBaUI7QUFBQSxNQUNuQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQztBQVNELFNBQVMseUJBQ1BBLGtCQUNBQyxlQUNBO0FBQ0EsTUFBSSxNQUFNO0FBR1YsUUFBTSxnQkFBZ0IsT0FBTyxLQUFLRCxnQkFBZSxFQUFFO0FBQUEsSUFDakQsQ0FBQyxRQUFRQyxjQUFhLEdBQUc7QUFBQSxFQUMzQjtBQUdBLFFBQU0sVUFBVSxPQUFPLEtBQUtBLGFBQVksRUFBRTtBQUFBLElBQU8sQ0FBQyxVQUNoRCxRQUFRLEtBQUssS0FBSztBQUFBLEVBQ3BCO0FBSUEsUUFBTSxzQkFBc0IsUUFBUSxLQUFLLElBQUksQ0FBQztBQUU5QyxNQUFJLFFBQVEsU0FBUyxHQUFHO0FBQ3RCLFVBQU0sSUFBSSxNQUFNLEdBQUc7QUFBQSxFQUNyQjtBQUlBLFFBQU07QUFBQSwrQkFDdUIsY0FBYyxLQUFLLElBQUksQ0FBQztBQUFBO0FBQUE7QUFLckQsTUFBSSxjQUFjLFNBQVMsR0FBRztBQUM1QixVQUFNLElBQUksTUFBTSxHQUFHO0FBQUEsRUFDckI7QUFDRjs7O0FEdEdBLElBQU9DLHVCQUFRLGFBQWEscUJBQVksTUFBTTtBQUM1QyxTQUFPO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixPQUFPLENBQUMseUJBQXlCLGlCQUFpQjtBQUFBLE1BQ3BEO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sVUFBVSxDQUFDLENBQUM7QUFBQSxFQUNsRDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbImRldkRlcGVuZGVuY2llcyIsICJkZXBlbmRlbmNpZXMiLCAidml0ZV9jb25maWdfZGVmYXVsdCJdCn0K
