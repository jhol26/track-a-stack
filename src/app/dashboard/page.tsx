"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, TrendingDown, Clock, Briefcase } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalHours: 0,
    hustleCount: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Fetch transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("type, amount") as { data: { type: string; amount: number }[] | null };

      // Fetch time logs
      const { data: timeLogs } = await supabase
        .from("time_logs")
        .select("hours") as { data: { hours: number }[] | null };

      // Fetch hustles
      const { data: hustles } = await supabase
        .from("hustles")
        .select("id") as { data: { id: string }[] | null };

      const totalIncome = transactions
        ?.filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      const totalExpenses = transactions
        ?.filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      const totalHours = timeLogs?.reduce((sum, t) => sum + t.hours, 0) || 0;

      setStats({
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        totalHours,
        hustleCount: hustles?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your side hustle performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome)}
          icon={DollarSign}
          trend="positive"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          icon={TrendingDown}
          trend="negative"
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(stats.netProfit)}
          icon={TrendingUp}
          trend={stats.netProfit >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Hours Tracked"
          value={stats.totalHours.toFixed(1)}
          icon={Clock}
        />
        <StatCard
          title="Active Hustles"
          value={stats.hustleCount.toString()}
          icon={Briefcase}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit Margin</span>
                <span className="font-medium">
                  {stats.totalIncome > 0
                    ? ((stats.netProfit / stats.totalIncome) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg $/Hour</span>
                <span className="font-medium">
                  {stats.totalHours > 0
                    ? formatCurrency(stats.totalIncome / stats.totalHours)
                    : "$0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Add your first hustle to get started tracking your income and expenses.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "positive" | "negative";
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            {trend === "positive" ? "+2.5%" : "-1.2%"} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
