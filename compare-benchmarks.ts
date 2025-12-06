import * as fs from "fs";
import * as path from "path";

interface BenchmarkResult {
  name: string;
  rank: number;
  hz: number;
  mean: number;
  min: number;
  max: number;
}

interface BenchmarkGroup {
  fullName: string;
  benchmarks: BenchmarkResult[];
}

interface BenchmarkFile {
  filepath: string;
  groups: BenchmarkGroup[];
}

interface BenchJson {
  files: BenchmarkFile[];
}

function formatHz(hz: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(hz);
}

function generateReport(data: BenchJson): string {
  const suites = new Map<string, BenchmarkResult[]>();

  for (const file of data.files) {
    const relativePath = path.basename(file.filepath);

    for (const group of file.groups) {
      const name = group.fullName.replace(relativePath, "");

      const suite = suites.get(name) ?? [];
      suites.set(name, [...suite, ...group.benchmarks]);
    }
  }

  let report = "";
  for (const [group, benchmarks] of suites.entries()) {
    const reportRows = benchmarks
      .sort((a, b) => b.hz - a.hz)
      .map((benchmark, i, arr) => {
        return {
          name: benchmark.name,
          ops: formatHz(benchmark.hz),
          average: benchmark.mean.toFixed(3),
          relative:
            i === 0
              ? "Fastest"
              : (arr[0]!.hz / benchmark.hz).toFixed(2) + "x slower",
        };
      });

    const columnLengths = reportRows.reduce(
      (acc, cur) => ({
        name: cur.name.length > acc.name ? cur.name.length : acc.name,
        ops: cur.ops.length > acc.ops ? cur.ops.length : acc.ops,
        average:
          cur.average.length > acc.average ? cur.average.length : acc.average,
        relative:
          cur.relative.length > acc.relative
            ? cur.relative.length
            : acc.relative,
      }),
      {
        name: "Name".length,
        ops: "Ops/sec".length,
        average: "Average (ms)".length,
        relative: "Relative".length,
      },
    );

    report += "\n" + group.trim() + "\n\n";
    report += `| ${"Name".padEnd(columnLengths.name, " ")} `;
    report += `| ${"Ops/sec".padEnd(columnLengths.ops, " ")} `;
    report += `| ${"Average (ms)".padEnd(columnLengths.average, " ")} `;
    report += `| ${"Relative".padEnd(columnLengths.relative, " ")} `;
    report += `|\n`;
    report += `|:${"----".padEnd(columnLengths.name, "-")}:`;
    report += `|:${"-------".padEnd(columnLengths.ops, "-")}:`;
    report += `|:${"------------".padEnd(columnLengths.average, "-")}:`;
    report += `|:${"--------".padEnd(columnLengths.relative, "-")}:`;
    report += `|\n`;
    reportRows.forEach((row) => {
      report += `| ${row.name.padEnd(columnLengths.name, " ")} `;
      report += `| ${row.ops.padEnd(columnLengths.ops, " ")} `;
      report += `| ${row.average.padEnd(columnLengths.average, " ")} `;
      report += `| ${row.relative.padEnd(columnLengths.relative, " ")} `;
      report += `|\n`;
    });
    report += "\n";
  }

  return report;
}

const jsonPath = "bench.json";
const jsonData: BenchJson = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
const report = generateReport(jsonData);
console.log(report);
