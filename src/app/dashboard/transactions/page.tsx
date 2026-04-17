"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Upload, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Pencil } from "lucide-react";

function getSupabase() {
  return createBrowserClient();
}

const transactionCategories = [
  "sales",
  "services",
  "commissions",
  "software",
  "equipment",
  "advertising",
  "subscriptions",
  "other",
];

export default function TransactionsPage() {
  interface Transaction {
    id: string;
    hustle_id: string;
    type: 'income' | 'expense';
    amount: number;
    date: string;
    category: string;
    description: string | null;
    receipt_url: string | null;
    hustles?: { name: string };
  }
  interface Hustle {
    id: string;
    name: string;
  }
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [formData, setFormData] = useState({
    hustle_id: "",
    type: "income" as "income" | "expense",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "sales",
    description: "",
    receipt_url: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const supabase = getSupabase();
      
      const { data: transactionsData, error: transError } = await supabase
        .from("transactions")
        .select("*, hustles(name)")
        .order("date", { ascending: false });

      const { data: hustlesData, error: hustlesError } = await supabase
        .from("hustles")
        .select("id, name");

      if (transError) console.error("Error fetching transactions:", transError);
      if (hustlesError) console.error("Error fetching hustles:", hustlesError);

      setTransactions(transactionsData || []);
      setHustles(hustlesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const supabase = getSupabase();
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      let error;
      if (editingTransaction) {
        const result = await supabase
          .from("transactions")
          .update(data)
          .eq("id", editingTransaction.id);
        error = result.error;
      } else {
        const result = await supabase.from("transactions").insert([data]);
        error = result.error;
      }

      if (error) {
        console.error("Save error details:", error);
        alert(`Failed to save transaction: ${error.message}`);
        throw error;
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("transactions").delete().eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        alert(`Failed to delete: ${error.message}`);
        throw error;
      }
      fetchData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }

  function resetForm() {
    setEditingTransaction(null);
    setFormData({
      hustle_id: "",
      type: "income",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "sales",
      description: "",
      receipt_url: "",
    });
  }

  function handleEdit(transaction: { id: string; hustle_id: string; type: 'income' | 'expense'; amount: number; date: string; category: string; description: string | null; receipt_url: string | null }) {
    setEditingTransaction(transaction);
    setFormData({
      hustle_id: transaction.hustle_id,
      type: transaction.type,
      amount: transaction.amount.toString(),
      date: transaction.date,
      category: transaction.category,
      description: transaction.description || "",
      receipt_url: transaction.receipt_url || "",
    });
    setIsDialogOpen(true);
  }

  const filteredTransactions = transactions.filter((t) =>
    filter === "all" ? true : t.type === filter
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Track income and expenses</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? "Edit Transaction" : "Add Transaction"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hustle_id">Hustle</Label>
                <Select
                  value={formData.hustle_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, hustle_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hustle" />
                  </SelectTrigger>
                  <SelectContent>
                    {hustles.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "income" | "expense") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Income
                      </div>
                    </SelectItem>
                    <SelectItem value="expense">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        Expense
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt_url">Receipt URL (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="receipt_url"
                    value={formData.receipt_url}
                    onChange={(e) =>
                      setFormData({ ...formData, receipt_url: e.target.value })
                    }
                    placeholder="Paste image URL or upload"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingTransaction ? "Update" : "Add"} Transaction
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
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
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "income" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("income")}
        >
          Income
        </Button>
        <Button
          variant={filter === "expense" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("expense")}
        >
          Expenses
        </Button>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No transactions found
            </p>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description || transaction.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.hustles?.name} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-bold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(transaction)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
