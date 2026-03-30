"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ProjectionsPage() {
  const [currentMonthly, setCurrentMonthly] = useState("");
  const [additionalHours, setAdditionalHours] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [projections, setProjections] = useState<{
    monthly: number;
    annual: number;
    increase: number;
  } | null>(null);

  function calculateProjections() {
    const current = parseFloat(currentMonthly) || 0;
    const hours = parseFloat(additionalHours) || 0;
    const rate = parseFloat(hourlyRate) || 0;

    const additionalIncome = hours * rate * 4; // 4 weeks per month
    const newMonthly = current + additionalIncome;
    const annual = newMonthly * 12;

    setProjections({
      monthly: newMonthly,
      annual,
      increase: additionalIncome,
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">What-If Projections</h1>
        <p className="text-muted-foreground">
          See how working more hours could increase your income
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Income Projection Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentMonthly">Current Monthly Income</Label>
              <Input
                id="currentMonthly"
                type="number"
                value={currentMonthly}
                onChange={(e) => setCurrentMonthly(e.target.value)}
                placeholder="2500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalHours">
                Additional Hours Per Week
              </Label>
              <Input
                id="additionalHours"
                type="number"
                value={additionalHours}
                onChange={(e) => setAdditionalHours(e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Your Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="50"
              />
            </div>

            <Button className="w-full" onClick={calculateProjections}>
              Calculate Projection
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {projections && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Your Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  Additional Monthly Income
                </p>
                <p className="text-3xl font-bold text-green-600">
                  +{formatCurrency(projections.increase)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  New Monthly Income
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(projections.monthly)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Projected Annual Income
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(projections.annual)}
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  That&apos;s{" "}
                  <span className="font-bold text-primary">
                    {formatCurrency(projections.annual / 52)}
                  </span>{" "}
                  per week or{" "}
                  <span className="font-bold text-primary">
                    {formatCurrency(projections.annual / 365)}
                  </span>{" "}
                  per day
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Goal Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Common Income Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <GoalScenario
              title="Replace Average Salary"
              target={5000}
              description="$60k/year - median US salary"
            />
            <GoalScenario
              title="Financial Independence"
              target={10000}
              description="$120k/year - comfortable living"
            />
            <GoalScenario
              title="High Earner"
              target={20000}
              description="$240k/year - top 10%"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GoalScenario({
  title,
  target,
  description,
}: {
  title: string;
  target: number;
  description: string;
}) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-2xl font-bold text-primary mb-2">
        {formatCurrency(target)}
      </p>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="text-sm mt-3">
        Requires{" "}
        <span className="font-medium">
          {Math.ceil((target * 12) / 50 / 40)}
        </span>{" "}
        hours/week at $50/hr
      </p>
    </div>
  );
}
