import { describe, bench } from "vitest";
import html2pdf from "html2pdf.js";
import { image } from "./image.js";

describe("creating an empty pdf", () => {
  bench(
    "html2pdf",
    async () => {
      await html2pdf().from(document.body).outputPdf("arraybuffer");
    },
    { throws: true },
  );
});

describe('rendering "Hello, world!"', () => {
  bench(
    "html2pdf",
    async () => {
      document.body.innerHTML = "Hello, world!";
      await html2pdf().from(document.body).outputPdf("arraybuffer");
    },
    { throws: true },
  );
});

describe("rendering an image", () => {
  bench(
    "html2pdf",
    async () => {
      document.body.innerHTML = `<img src="${image}" width="50" height="60">`;
      await html2pdf().from(document.body).outputPdf("arraybuffer");
    },
    { throws: true },
  );
});
