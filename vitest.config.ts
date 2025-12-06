import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "browser",
          benchmark: { include: ["browser.bench.ts"] },
          browser: {
            enabled: true,
            provider: playwright(),
            // https://vitest.dev/config/browser/playwright
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: "node",
          benchmark: { include: ["node.bench.tsx"] },
          environment: "node",
        },
      },
    ],
  },
});
