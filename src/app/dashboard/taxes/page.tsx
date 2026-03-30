"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function TaxesPage() {
  const [loading, setLoading] = useState(true);
  const [taxData, setTaxData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    estimatedTax: 0,
    quarterlyPayments: [0, 0, 0, 0],
    deductibleExpenses: 0,
  });

  useEffect(() => {
    fetchTaxData();
  }, []);

  async function fetchTaxData() {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data: transactions } = await supabase
        .from("transactions")
        .select("type, amount, category");

      const totalIncome =
        transactions
          ?.filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0) || 0;

      const totalExpenses =
        transactions
          ?.filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0) || 0;

      const netProfit = totalIncome - totalExpenses;
      const estimatedTax = netProfit > 0 ? netProfit * 0.25 : 0;
      const quarterlyPayment = estimatedTax / 4;

      setTaxData({
        totalIncome,
        totalExpenses,
        netProfit,
        estimatedTax,
        quarterlyPayments: [quarterlyPayment, quarterlyPayment, quarterlyPayment, quarterlyPayment],
        deductibleExpenses: totalExpenses,
      });
    } catch (error) {
      console.error("Error fetching tax data:", error);
    } finally {
      setLoading(false);
    }
  }

  function exportTaxReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      ...taxData,
      quarterlyBreakdown: [
        { quarter: "Q1 (Jan-Mar)", amount: taxData.quarterlyPayments[0], dueDate: "April 15" },
        { quarter: "Q2 (Apr-Jun)", amount: taxData.quarterlyPayments[1], dueDate: "June 15" },
        { quarter: "Q3 (Jul-Sep)", amount: taxData.quarterlyPayments[2], dueDate: "September 15" },
        { quarter: "Q4 (Oct-Dec)", amount: taxData.quarterlyPayments[3], dueDate: "January 15" },
      ],
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vestro-tax-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tax Estimates</h1>
          <p className="text-muted-foreground">Quarterly estimated tax calculator</p>
        </div>
        <Button onClick={exportTaxReport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(taxData.totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deductible Expenses</CardTitle>
            <DollarSign className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(taxData.deductibleExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(taxData.netProfit)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Tax (25%)</CardTitle>
            <FileText className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(taxData.estimatedTax)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quarterly Payments */}
      <Card>
        <CardHeader>
          <CardTitle>2026 Quarterly Estimated Tax Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-1">Q1</p>
                <p className="text-xs text-muted-foreground mb-2">Jan - Mar</p>
                <p className="text-lg font-bold">{formatCurrency(taxData.quarterlyPayments[0])}</p>
                <p className="text-xs text-muted-foreground">Due: April 15</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-1">Q2</p>
                <p className="text-xs text-muted-foreground mb-2">Apr - Jun</p>
                <p className="text-lg font-bold">{formatCurrency(taxData.quarterlyPayments[1])}</p>
                <p className="text-xs text-muted-foreground">Due: June 15</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-1">Q3</p>
                <p className="text-xs text-muted-foreground mb-2">Jul - Sep</p>
                <p className="text-lg font-bold">{formatCurrency(taxData.quarterlyPayments[2])}</p>
                <p className="text-xs text-muted-foreground">Due: Sep 15</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-1">Q4</p>
                <p className="text-xs text-muted-foreground mb-2">Oct - Dec</p>
                <p className="text-lg font-bold">{formatCurrency(taxData.quarterlyPayments[3])}</p>
                <p className="text-xs text-muted-foreground">Due: Jan 15</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> This is an estimate based on 25% of your net profit. 
                Actual tax liability may vary based on your total income, deductions, and tax bracket. 
                Consult with a tax professional for accurate advice.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Deductible Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Common Deductible Business Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Software & subscriptions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Home office expenses
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Equipment & supplies
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Marketing & advertising
              </li>
            </ul>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Professional services
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Education & training
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Travel & mileage
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Insurance
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
