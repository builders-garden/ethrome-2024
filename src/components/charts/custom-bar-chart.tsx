"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", workout: 12 },
  { month: "February", workout: 23 },
  { month: "March", workout: 14 },
  { month: "April", workout: 8 },
  { month: "May", workout: 16 },
  { month: "June", workout: 19 },
];

const chartConfig = {
  workout: {
    label: "Workout",
    color: "#FCA5A5",
  },
} satisfies ChartConfig;

function CustomBarChart() {
  return (
    <div className="flex flex-col items-start px-4 gap-4">
      <h1 className="text-xl font-medium">Year Recap</h1>
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] w-full max-w-md"
      >
        <BarChart accessibilityLayer data={chartData}>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="workout" fill="var(--color-workout)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default CustomBarChart;
