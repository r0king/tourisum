import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Camera, Utensils, Calendar, Map } from "lucide-react";

export function DashBoardOverView(dashboardStats: { totalDistricts: number; totalDestinations: number; totalFoodSpots: number; totalEvents: number; pendingDestinations: number; pendingFoodSpots: number; pendingEvents: number; visitorData: { name: string; visitors: number }[] }): React.ReactNode {
    return <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Districts</CardTitle>
                    <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalDistricts}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
                    <Camera className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalDestinations}</div>
                    <p className="text-xs text-muted-foreground">
                        {dashboardStats.pendingDestinations} pending
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Food Spots</CardTitle>
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalFoodSpots}</div>
                    <p className="text-xs text-muted-foreground">
                        {dashboardStats.pendingFoodSpots} pending
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalEvents}</div>
                    <p className="text-xs text-muted-foreground">
                        {dashboardStats.pendingEvents} pending
                    </p>
                </CardContent>
            </Card>
        </div>

        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Event Analytics</CardTitle>
                <CardDescription>Monthly event trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer
                    config={{
                        events: {
                            label: "Events",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                    className="h-[300px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardStats.visitorData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false} />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="visitors" fill="var(--color-events)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    </>
}