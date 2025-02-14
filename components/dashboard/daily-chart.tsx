"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DailyChartProps {
  data: Array<{
    date: string
    total: number
  }>
}

export function DailyChart({ data }: DailyChartProps) {
  return (
    <Card className="col-span-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.4 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Zapisane oferty dziennie</CardTitle>
      </CardHeader>
      <CardContent className="pl-5">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => [`${value} ofert`, 'Liczba ofert']}
              labelFormatter={(label) => `${label}`}
            />
            <Bar
              dataKey="total"
              radius={[4, 4, 0, 0]}
              className="fill-purple-600 hover:fill-purple-700 transition-colors"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 