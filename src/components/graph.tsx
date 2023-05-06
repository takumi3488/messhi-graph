"use client";

import { DailyData } from "@/app/page";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Graph({
  dailyValues,
}: {
  dailyValues: DailyData[];
}): JSX.Element {
  const dailyWeights = dailyValues
    .map(
      (dailyValue) =>
        [dailyValue.date, +dailyValue.weight.slice(0, -2)] as [string, number]
    )
    .filter((dailyWeight) => dailyWeight[1] > 0);
  const labelCount = 5;
  const diff = Math.floor(dailyWeights.length / (labelCount - 1));
  const start = dailyWeights.length - diff * (labelCount - 1);
  const labels = dailyWeights.map((dailyWeight, i) => {
    if (i === 0 || (i + start - 1) % diff === 0)
      return dailyWeight[0].split("/").slice(1, 3).join("/");
    return "";
  });
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "体重",
            data: dailyWeights.map((dailyWeight) => dailyWeight[1]),
            backgroundColor: "rgb(53, 162, 235)",
            borderColor: "rgb(53, 162, 235, 0.5)",
          },
        ],
      }}
      options={{ responsive: true }}
    />
  );
}
