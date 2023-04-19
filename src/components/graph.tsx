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
  return (
    <Line
      data={{
        labels: dailyWeights.map((dailyWeight) => dailyWeight[0]),
        datasets: [
          {
            label: "体重",
            data: dailyWeights.map((dailyWeight) => dailyWeight[1]),
          },
        ],
      }}
      options={{ responsive: true }}
    />
  );
}
