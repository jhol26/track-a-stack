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
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Database } from "@/types/database";

function getSupabase() {
  return createBrowserClient();
}

type HustleInsert = Database["public"]["Tables"]["hustles"]["Insert"];
type HustleUpdate = Database["public"]["Tables"]["hustles"]["Update"];

const categories = [
  "freelance",
  "affiliate",
  "content",
  "e-commerce",
  "consulting",
  "coaching",
  "digital-products",
  "other",
];

export default function HustlesPage() {
  interface Hustle {
    id: string;
    name: string;
    category: string;
    is_passive: boolean;
    start_date: string;
    notes: string | null;
  }
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHustle, setEditingHustle] = useState<Hustle | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "freelance",
    is_passive: false,
    start_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    fetchHustles();
  }, []);

  async function fetchHustles() {
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from("hustles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHustles(data || []);
    } catch (error) {
      console.error("Error fetching hustles:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const client = getSupabase();
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (editingHustle) {
        const updateData: HustleUpdate = {
          name: formData.name,
          category: formData.category,
          is_passive: formData.is_passive,
          start_date: formData.start_date,
          notes: formData.notes || null,
        };
        const { error } = await client
          .from("hustles")
          .update(updateData)
          .eq("id", editingHustle.id);

        if (error) throw error;
      } else {
        const insertData: HustleInsert = {
          user_id: user.id,
          name: formData.name,
          category: formData.category,
          is_passive: formData.is_passive,
          start_date: formData.start_date,
          notes: formData.notes || null,
        };
        const { error } = await client.from("hustles").insert([insertData]);

        if (error) throw error;
      }

      setIsDialogOpen(false);
      resetForm();
      fetchHustles();
    } catch (error) {
      console.error("Error saving hustle:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this hustle?")) return;

    try {
      const client = getSupabase();
      const { error } = await client.from("hustles").delete().eq("id", id);

      if (error) throw error;
      fetchHustles();
    } catch (error) {
      console.error("Error deleting hustle:", error);
    }
  }

  function resetForm() {
    setEditingHustle(null);
    setFormData({
      name: "",
      category: "freelance",
      is_passive: false,
      start_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
  }

  function handleEdit(hustle: { id: string; name: string; category: string; is_passive: boolean; start_date: string; notes: string | null }) {
    setEditingHustle(hustle);
    setFormData({
      name: hustle.name,
      category: hustle.category,
      is_passive: hustle.is_passive,
      start_date: hustle.start_date,
      notes: hustle.notes || "",
    });
    setIsDialogOpen(true);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hustles</h1>
          <p className="text-muted-foreground">Manage your side hustles</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hustle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingHustle ? "Edit Hustle" : "Create New Hustle"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hustle Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Freelance Writing"
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
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_passive"
                  checked={formData.is_passive}
                  onChange={(e) =>
                    setFormData({ ...formData, is_passive: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="is_passive">Passive Income</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Optional notes about this hustle"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingHustle ? "Update" : "Create"} Hustle
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

      {hustles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hustles yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first side hustle to start tracking income and expenses
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Hustle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hustles.map((hustle) => (
            <Card key={hustle.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{hustle.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {hustle.category.replace("-", " ")}
                    </p>
                  </div>
                  {hustle.is_passive && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Passive
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started:</span>
                    <span>{formatDate(hustle.start_date)}</span>
                  </div>
                  {hustle.notes && (
                    <p className="text-muted-foreground">{hustle.notes}</p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(hustle)}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(hustle.id)}
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
