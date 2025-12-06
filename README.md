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
| jsPDF     | 8,306.77 | 0.120        | Fastest         |
| pdf-lib   | 4,740.41 | 0.211        | 1.75x slower    |
| pdfme     | 3,521.49 | 0.284        | 2.36x slower    |
| react-pdf | 2,495.44 | 0.401        | 3.33x slower    |
| html2pdf  | 11.46    | 87.280       | 725.02x slower  |
| puppeteer | 1.84     | 543.700      | 4516.39x slower |


> rendering "Hello, world!"

| Name      | Ops/sec  | Average (ms) | Relative        |
|:---------:|:--------:|:------------:|:---------------:|
| jsPDF     | 8,477.42 | 0.118        | Fastest         |
| pdf-lib   | 3,344.45 | 0.299        | 2.53x slower    |
| react-pdf | 759.59   | 1.317        | 11.16x slower   |
| pdfme     | 196.99   | 5.076        | 43.03x slower   |
| html2pdf  | 11.18    | 89.440       | 758.22x slower  |
| puppeteer | 1.38     | 724.282      | 6140.05x slower |


> rendering an image

| Name      | Ops/sec | Average (ms) | Relative      |
|:---------:|:-------:|:------------:|:-------------:|
| react-pdf | 14.86   | 67.275       | Fastest       |
| html2pdf  | 11.02   | 90.780       | 1.35x slower  |
| pdf-lib   | 10.11   | 98.905       | 1.47x slower  |
| pdfme     | 9.92    | 100.802      | 1.50x slower  |
| jsPDF     | 7.69    | 130.065      | 1.93x slower  |
| puppeteer | 1.2     | 830.018      | 12.34x slower |
```
