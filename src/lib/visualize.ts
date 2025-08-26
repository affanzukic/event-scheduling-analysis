import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const width = 1200 as const;
const height = 700 as const;
const charter = new ChartJSNodeCanvas({ width, height, backgroundColour: "white" });

export const renderBar = async (labels: string[], data: number[]) => {
  return charter.renderToBuffer({
    type: "bar",
    data: { labels, datasets: [{ label: "Count", data }] },
    options: { plugins: { legend: { display: false } } }
  });
}

export const renderLine = async (labels: string[], data: number[]) => {
  return charter.renderToBuffer({
    type: "line",
    data: { labels, datasets: [{ label: "Score", data }] },
    options: { plugins: { legend: { display: false } } }
  });
}
