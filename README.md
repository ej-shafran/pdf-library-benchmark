# JavaScript PDF Library Benchmark

This is a project I created when researching different approaches to saving PDFs from JavaScript, which uses Vitest's benchmark mode to compare different approaches to each other.

## Running

Run `pnpm install` to install the dependencies.

Use `pnpm bench` to run the benchmarks. One of the approaches being compared is using `puppeteer` to run a headless browser and downloading a webpage as a PDF, which is really slow, so by default the benchmarks for it aren't run. Use `PUPPETEER=true pnpm bench` to include those benchmarks.

Since some approaches run on the browser, there are two benchmark files with different Vitest projects, which aren't automatically compared to one another. To compare between browser and NodeJS approaches, use `pnpm compare` (after running `pnpm bench`) to run a custom script that prints out a comparison.

## Results

These are the results of running `PUPPETEER=true pnpm bench --no-watch && pnpm compare` on my local machine:

```
> creating an empty pdf

| Name      | Ops/sec  | Average (ms) | Relative        |
|:---------:|:--------:|:------------:|:---------------:|
| jsPDF     | 8,351.12 | 0.120        | Fastest         |
| pdf-lib   | 4,645.35 | 0.215        | 1.80x slower    |
| pdfme     | 3,468.89 | 0.288        | 2.41x slower    |
| react-pdf | 3,019.35 | 0.331        | 2.77x slower    |
| pdfkit    | 667.52   | 1.498        | 12.51x slower   |
| html2pdf  | 11.25    | 88.900       | 742.41x slower  |
| puppeteer | 1.3      | 767.848      | 6412.39x slower |


> rendering "Hello, world!"

| Name      | Ops/sec  | Average (ms) | Relative        |
|:---------:|:--------:|:------------:|:---------------:|
| jsPDF     | 8,202.55 | 0.122        | Fastest         |
| pdf-lib   | 3,069.08 | 0.326        | 2.67x slower    |
| react-pdf | 1,141.53 | 0.876        | 7.19x slower    |
| pdfkit    | 701.95   | 1.425        | 11.69x slower   |
| pdfme     | 226.51   | 4.415        | 36.21x slower   |
| html2pdf  | 11.34    | 88.170       | 723.22x slower  |
| puppeteer | 1.45     | 689.963      | 5659.46x slower |


> rendering an image

| Name      | Ops/sec | Average (ms) | Relative       |
|:---------:|:-------:|:------------:|:--------------:|
| pdfkit    | 591.64  | 1.690        | Fastest        |
| react-pdf | 16.37   | 61.098       | 36.15x slower  |
| html2pdf  | 10.92   | 91.610       | 54.20x slower  |
| pdfme     | 9.79    | 102.184      | 60.46x slower  |
| pdf-lib   | 9.6     | 104.211      | 61.66x slower  |
| jsPDF     | 7.16    | 139.712      | 82.66x slower  |
| puppeteer | 1.44    | 692.733      | 409.85x slower |
```
