import { describe, bench } from "vitest";
import ReactPDF, { Document, Page, Text, Image } from "@react-pdf/renderer";
import { BLANK_A4_PDF, type Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import puppeteer from "puppeteer";
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import { image as ImagePlugin } from "@pdfme/schemas";
import PDFKitDocument from "pdfkit";

import { image } from "./image.js";

const benchPuppeteer = bench.runIf(process.env.PUPPETEER === "true");

describe("creating an empty pdf", () => {
  bench(
    "react-pdf",
    async () => {
      const doc = (
        <Document>
          <Page />
        </Document>
      );

      await Array.fromAsync(await ReactPDF.renderToStream(doc));
    },
    { throws: true },
  );

  bench(
    "pdfme",
    async () => {
      const template: Template = { basePdf: BLANK_A4_PDF, schemas: [] };

      await generate({ template, inputs: [{}] });
    },
    { throws: true },
  );

  bench(
    "jsPDF",
    () => {
      new jsPDF().output("arraybuffer");
    },
    { throws: true },
  );

  bench(
    "pdf-lib",
    async () => {
      const doc = await PDFDocument.create();
      await doc.save();
    },
    { throws: true },
  );

  bench(
    "pdfkit",
    () => {
      const doc = new PDFKitDocument();
      doc.end();
    },
    { throws: true },
  );

  benchPuppeteer(
    "puppeteer",
    async () => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.pdf();
    },
    { throws: true },
  );
});

describe('rendering "Hello, world!"', () => {
  bench(
    "react-pdf",
    async () => {
      const doc = (
        <Document>
          <Page>
            <Text>Hello, world!</Text>
          </Page>
        </Document>
      );

      await Array.fromAsync(await ReactPDF.renderToStream(doc));
    },
    { throws: true },
  );

  bench(
    "pdfme",
    async () => {
      const template: Template = {
        basePdf: BLANK_A4_PDF,
        schemas: [
          [
            {
              name: "helloWorld",
              type: "text",
              position: { x: 0, y: 0 },
              width: 100,
              height: 10,
            },
          ],
        ],
      };

      await generate({
        template,
        inputs: [{ helloWorld: "Hello, world!" }],
      });
    },
    { throws: true },
  );

  bench(
    "jsPDF",
    () => {
      new jsPDF().text("Hello, world!", 0, 5).output("arraybuffer");
    },
    { throws: true },
  );

  bench(
    "pdf-lib",
    async () => {
      const doc = await PDFDocument.create();
      const page = doc.addPage();
      const { height } = page.getSize();
      page.moveTo(0, height - 18);
      page.drawText("Hello, world!");
      await doc.save();
    },
    { throws: true },
  );

  bench(
    "pdfkit",
    () => {
      const doc = new PDFKitDocument();
      doc.text("Hello, world!");
      doc.end();
    },
    { throws: true },
  );

  benchPuppeteer(
    "puppeteer",
    async () => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent("Hello, world!");
      await page.pdf();
    },
    { throws: true },
  );
});

describe("rendering an image", () => {
  bench(
    "react-pdf",
    async () => {
      const doc = (
        <Document>
          <Page>
            <Image style={{ width: 50 }} src={image} />
          </Page>
        </Document>
      );

      await Array.fromAsync(await ReactPDF.renderToStream(doc));
    },
    { throws: true },
  );

  bench(
    "pdfme",
    async () => {
      const template: Template = {
        basePdf: BLANK_A4_PDF,
        schemas: [
          [
            {
              name: "image",
              type: "image",
              position: { x: 0, y: 0 },
              width: 50,
              height: 60,
            },
          ],
        ],
      };

      await generate({
        template,
        inputs: [{ image }],
        plugins: { Image: ImagePlugin },
      });
    },
    { throws: true },
  );

  bench(
    "jsPDF",
    () => {
      new jsPDF().addImage(image, "png", 0, 0, 50, 60).output("arraybuffer");
    },
    { throws: true },
  );

  bench(
    "pdf-lib",
    async () => {
      const doc = await PDFDocument.create();
      const page = doc.addPage();
      const { height } = page.getSize();
      const png = await doc.embedPng(image);
      page.drawImage(png, { y: height - 60, width: 50, height: 60 });
      await doc.save();
    },
    { throws: true },
  );

  bench(
    "pdfkit",
    () => {
      const doc = new PDFKitDocument();
      doc.image("image.jpg", { width: 100, height: 50 });
      doc.end();
    },
    { throws: true },
  );

  benchPuppeteer(
    "puppeteer",
    async () => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(`<img src="${image}" width="50" height="60">`);
      await page.pdf();
    },
    { throws: true },
  );
});
