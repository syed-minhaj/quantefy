"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart"

export const description = "A bar chart with a label"



const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarLabel({chartData}:{chartData:{item:string , revenue:number}[]}) {
  return (
    <div className="w-full space-y-4 bg-bg2 p-4 rounded-r1 border border-input" >
        <p className="font-medium">Revenue by Item</p>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 40,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="item"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="revenue" fill="#1447e6" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-[#1447e6]"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
    </div>
  )
}
