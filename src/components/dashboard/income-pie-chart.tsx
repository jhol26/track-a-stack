"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/supabase-auth-provider";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface HustleIncome {
  hustle_name: string;
  total_income: number;
}

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

const COLORS = [
  "#059669", // emerald-600
  "#d97706", // amber-600
  "#2563eb", // blue-600
  "#dc2626", // red-600
  "#7c3aed", // violet-600
  "#0891b2", // cyan-600
  "#db2777", // pink-600
  "#65a30d", // lime-600
  "#ea580c", // orange-600
  "#4f46e5", // indigo-600
];

export function IncomePieChart() {
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (!authLoading) {
      fetchIncomeData();
    }
  }, [authLoading]);

  async function fetchIncomeData() {
    try {
      const { data: incomeData, error } = await supabase
        .from("transactions")
        .select(`
          amount,
          hustles:name
        `)
        .eq("type", "income")
        .returns<{ amount: number; hustles: { name: string } }[]>();

      if (error) {
        console.error("Error fetching income data:", error);
        setLoading(false);
        return;
      }

      // Aggregate income by hustle name
      const incomeByHustle = new Map<string, number>();
      let total = 0;

      incomeData?.forEach((row) => {
        const hustleName = row.hustles?.name || "Unknown";
        incomeByHustle.set(hustleName, (incomeByHustle.get(hustleName) || 0) + row.amount);
        total += row.amount;
      });

      // Convert to chart data format with percentages
      const data: ChartData[] = Array.from(incomeByHustle.entries())
        .map(([name, value]) => ({
          name,
          value,
          percentage: total > 0 ? (value / total) * 100 : 0,
        }))
        .sort((a, b) => b.value - a.value);

      setChartData(data);
      setTotalIncome(total);
    } catch (error) {
      console.error("Error fetching income data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income by Hustle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income by Hustle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground text-sm">
              No income data yet. Add transactions to see your revenue breakdown.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income by Hustle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${((value as number) / totalIncome * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Income"]}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Total Income: <span className="font-medium text-foreground">${totalIncome.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
