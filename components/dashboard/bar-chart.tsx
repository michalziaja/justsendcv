"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeeklyBarChartProps {
  data: Array<{
    name: string
    zapisane: number
    wyslane: number
  }>
}

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  // Znajdujemy maksymalną wartość dla obu typów danych
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.zapisane, item.wyslane))
  );

  return (
    <Card className="col-span-4 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.4 bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-900">Aktywność w ostatnich 14 dniach</CardTitle>
      </CardHeader>
      <CardContent className="pl-1">
        <ResponsiveContainer width="100%" height={504}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis
              dataKey="name"
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
              tickCount={Math.min(maxValue + 1, 10)}
              domain={[0, Math.ceil(maxValue)]}
              allowDecimals={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number, name: string) => {
                const label = name === 'zapisane' ? 'Zapisane oferty' : 'Wysłane aplikacje';
                return [`${value} ofert`, label];
              }}
              labelFormatter={(label) => `${label}`}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (value === 'zapisane' ? 'Zapisane oferty' : 'Wysłane aplikacje')}
            />
            <Bar
              name="zapisane"
              dataKey="zapisane"
              radius={[4, 4, 0, 0]}
              className="fill-[#1995ce] hover:fill-[#20b5fa] transition-colors"
              barSize={20}
            />
            <Bar
              name="wyslane"
              dataKey="wyslane"
              radius={[4, 4, 0, 0]}
              className="fill-[#00A86B] hover:fill-[#00C07B] transition-colors"
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 