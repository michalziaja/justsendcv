"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface CompanyPieChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

const COLORS = {
  'Pracuj.pl': '#00A86B',
  'NoFluffJobs': '#FF4081',
  'JustJoinIT': '#1E90FF',
  'LinkedIn': '#0077B5',
  'Indeed': '#2164F3',
  'RocketJobs': '#FF6B6B',
  'BulldogJob': '#FFB302',
  'theprotocol.it': '#6B46C1',
  'Solid.Jobs': '#34D399',
  'GoWork': '#FF9800'
};

const SITE_ICONS = {
  'Pracuj.pl': '/pracuj.png',
  'NoFluffJobs': '/nofluffjobs.png',
  'JustJoinIT': '/justjoin.png',
  'LinkedIn': '/linkedin.png',
  'Indeed': '/indeed.png',
  'RocketJobs': '/rocketjobs.png',
  'BulldogJob': '/bulldog.png',
  'theprotocol.it': '/protocol.png',
  'Solid.Jobs': '/solid.png',
  'GoWork': '/gowork.png'
};

export function CompanyPieChart({ data }: CompanyPieChartProps) {
  // Filtrujemy dane, zostawiając tylko zdefiniowane portale
  const filteredData = data.filter(item => COLORS[item.name as keyof typeof COLORS]);
  const total = filteredData.reduce((sum, item) => sum + item.value, 0);
  const sortedData = [...filteredData].sort((a, b) => b.value - a.value);

  return (
    <Card className="col-span-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.4 bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-900">Źródła ofert pracy</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={504}>
          <PieChart>
            <Pie
              data={sortedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={168}
              innerRadius={84}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${((value / total) * 100).toFixed(0)}%`}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} ofert (${((value / total) * 100).toFixed(1)}%)`,
                name
              ]}
              contentStyle={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={100}
              content={({ payload }) => (
                <div className="grid grid-cols-3 gap-3 mt-8">
                  {payload?.map((entry: any, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                      <Image
                        src={SITE_ICONS[entry.value as keyof typeof SITE_ICONS]}
                        alt={entry.value}
                        width={16}
                        height={16}
                        className="rounded-sm"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-600 font-medium">
                          {entry.value}
                        </span>
                        <span className="text-xs text-gray-400">
                          {sortedData[index].value} ofert
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 