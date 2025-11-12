"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart"
import { Button } from "@/app/components/ui/button"

interface RevenueData {
  date: string
  revenue: number
}

interface RevenueChartProps {
  data: RevenueData[]
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function formatDateLabel(dateString: string): string {
  const date = new Date(dateString)
  const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase()
  const year = date.getFullYear().toString().slice(-2)
  return `${month}'${year}`
}

function aggregateByYear(data: RevenueData[]) {
  const yearlyData: { [key: string]: number } = {}

  data.forEach((item) => {
    const year = new Date(item.date).getFullYear().toString()
    yearlyData[year] = (yearlyData[year] || 0) + item.revenue
  })

  return Object.entries(yearlyData).map(([year, revenue]) => ({
    date: year,
    revenue,
  }))
}

function aggregateByMonth(data: RevenueData[]) {
  const monthlyData: { [key: string]: number } = {}

  data.forEach((item) => {
    const month = new Date(item.date).toLocaleString("en-US", { month: "short" }).toLowerCase()
    monthlyData[month] = (monthlyData[month] || 0) + item.revenue
  })

  return Object.entries(monthlyData).map(([month, revenue]) => ({
    date: month,
    revenue,
  }))
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [viewMode, setViewMode] = useState<"month" | "year">("month")

  const displayData =
    viewMode === "year"
      ? aggregateByYear(data)
      : aggregateByMonth(data)

  return (
    <div className="w-full space-y-4 bg-bg2 p-4 rounded-r1 border border-input" >
        <div className="flex flex-row items-center ">
            <p className="font-medium">Revenue</p>
            <div className="flex flex-row ml-auto gap-2">
                <Button variant={viewMode === "month" ? "default" : "outline"} size="sm" onClick={() => setViewMode("month")}>
                By Month
                </Button>
                <Button variant={viewMode === "year" ? "default" : "outline"} size="sm" onClick={() => setViewMode("year")}>
                By Year
                </Button>
            </div>
        </div>

      <ChartContainer config={chartConfig} className="w-full h-fit">
        <AreaChart
          accessibilityLayer
          data={displayData}
          margin={{
            top: 20,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="#1447e6" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1447e6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1447e6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="revenue"
            type="natural"
            fill="#1447e6"
            fillOpacity={0.4}
            stroke="#1447e6"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
