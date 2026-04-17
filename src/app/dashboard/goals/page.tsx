"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target, Trophy, CheckCircle, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/components/supabase-auth-provider";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const presetGoals = [
  { name: "Replace 9-5 Income", target: 5000 },
  { name: "$500/month Side Income", target: 500 },
  { name: "$10k Total Earned", target: 10000 },
  { name: "First $1k Month", target: 1000 },
  { name: "$100k Annual Run Rate", target: 8333 },
];

export default function GoalsPage() {
  interface Goal {
    id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    achieved: boolean;
    created_at: string;
    updated_at: string;
  }
  const { user, loading: authLoading } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [customTarget, setCustomTarget] = useState("");
  const [customName, setCustomName] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  async function fetchData() {
    try {
      const { data: goalsData } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: transactions } = await supabase
        .from("transactions")
        .select("type, amount");

      const income = transactions
        ?.filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      setGoals(goalsData || []);
      setTotalIncome(income);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createGoal(name: string, target: number) {
    setCreating(true);
    setError("");
    try {
      if (!user) {
        setError("Not authenticated. Please sign in again.");
        setCreating(false);
        return;
      }

      const { error } = await supabase.from("goals").insert([
        {
          user_id: user.id,
          name,
          target_amount: target,
          current_amount: totalIncome,
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
        return;
      }
      fetchData();
    } catch (err) {
      const error = err as { message?: string };
      console.error("Error creating goal:", error);
      setError(error.message || "Failed to create goal");
    } finally {
      setCreating(false);
    }
  }

  async function updateGoalAmount(id: string, amount: number) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supabase
        .from("goals")
        .update({ current_amount: amount })
        .eq("id", id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  }

  async function toggleAchieved(id: string, achieved: boolean) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supabase
        .from("goals")
        .update({ achieved })
        .eq("id", id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  }

  async function deleteGoal(id: string) {
    if (!confirm("Delete this goal?")) return;

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supabase.from("goals").delete().eq("id", id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center h-64">Please sign in to view goals</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Goals</h1>
        <p className="text-muted-foreground">Track your financial milestones</p>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Total Income Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{formatCurrency(totalIncome)}</div>
          <p className="text-muted-foreground mt-2">
            This amount automatically counts toward your goals
          </p>
        </CardContent>
      </Card>

      {/* Preset Goals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Add Goals</h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {presetGoals.map((preset) => (
            <Card key={preset.name}>
              <CardContent className="pt-6">
                <p className="text-sm font-medium mb-2">{preset.name}</p>
                <p className="text-2xl font-bold mb-4">
                  {formatCurrency(preset.target)}
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => createGoal(preset.name, preset.target)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Goal */}
      <Card>
        <CardHeader>
          <CardTitle>Create Custom Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., Buy New Laptop"
              />
            </div>
            <div className="w-40 space-y-2">
              <Label htmlFor="goalAmount">Target Amount</Label>
              <Input
                id="goalAmount"
                type="number"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                placeholder="1000"
              />
            </div>
            <Button
              onClick={() => {
                if (customName && customTarget) {
                  createGoal(customName, parseFloat(customTarget));
                  setCustomName("");
                  setCustomTarget("");
                }
              }}
            >
              Create Goal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Goals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Goals</h2>
        {goals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground">
                Add a preset goal above or create a custom one
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => {
              const progress = Math.min(
                (goal.current_amount / goal.target_amount) * 100,
                100
              );
              const remaining = goal.target_amount - goal.current_amount;

              return (
                <Card key={goal.id} className={goal.achieved ? "border-green-500 bg-green-50" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {goal.achieved && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {goal.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Target: {formatCurrency(goal.target_amount)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-full bg-muted rounded-full h-4">
                        <div
                          className="bg-primary h-4 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>{formatCurrency(goal.current_amount)}</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>

                      {!goal.achieved && (
                        <p className="text-sm text-muted-foreground">
                          {remaining > 0
                            ? `${formatCurrency(remaining)} to go`
                            : "Goal achieved!"}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateGoalAmount(goal.id, totalIncome)
                          }
                        >
                          Sync to Income
                        </Button>
                        <Button
                          variant={goal.achieved ? "outline" : "default"}
                          size="sm"
                          onClick={() =>
                            toggleAchieved(goal.id, !goal.achieved)
                          }
                        >
                          {goal.achieved ? "Mark Incomplete" : "Mark Complete"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
