import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { week: "Week 1", onTime: 85, delayed: 15, delivered: 950 },
  { week: "Week 2", onTime: 88, delayed: 12, delivered: 1200 },
  { week: "Week 3", onTime: 92, delayed: 8, delivered: 1100 },
  { week: "Week 4", onTime: 90, delayed: 10, delivered: 1050 },
]

export function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2.1 days</div>
            <p className="text-xs text-primary mt-1">↓ 0.3 days faster</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">88.9%</div>
            <p className="text-xs text-primary mt-1">↑ 1.2% increase</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4,300</div>
            <p className="text-xs text-green-400 mt-1">↑ 8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Weekly Delivery Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="onTime"
                stackId="1"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.6}
                name="On-Time Deliveries"
              />
              <Area
                type="monotone"
                dataKey="delayed"
                stackId="1"
                stroke="var(--color-destructive)"
                fill="var(--color-destructive)"
                fillOpacity={0.6}
                name="Delayed Deliveries"
              />
              <Area
                type="monotone"
                dataKey="delivered"
                stackId="2"
                stroke="var(--color-chart-2)"
                fill="var(--color-chart-2)"
                fillOpacity={0.6}
                name="Total Delivered"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
