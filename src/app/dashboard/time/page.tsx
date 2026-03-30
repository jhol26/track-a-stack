"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
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
import { Plus, Trash2, Clock, Play, Square } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Pencil } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function TimeTrackingPage() {
  interface TimeLog {
    id: string;
    hustle_id: string;
    hours: number;
    date: string;
    notes: string | null;
    hustles?: { name: string };
  }
  interface Hustle {
    id: string;
    name: string;
  }
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<TimeLog | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [timerHustle, setTimerHustle] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [formData, setFormData] = useState({
    hustle_id: "",
    hours: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerStart) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - timerStart.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerStart]);

  async function fetchData() {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data: logsData } = await supabase
        .from("time_logs")
        .select("*, hustles(name)")
        .order("date", { ascending: false });

      const { data: hustlesData } = await supabase
        .from("hustles")
        .select("id, name");

      setTimeLogs(logsData || []);
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
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const data = {
        ...formData,
        hours: parseFloat(formData.hours),
      };

      if (editingLog) {
        const { error } = await supabase
          .from("time_logs")
          .update(data)
          .eq("id", editingLog.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("time_logs").insert([data]);

        if (error) throw error;
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving time log:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this time log?")) return;

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supabase.from("time_logs").delete().eq("id", id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error deleting time log:", error);
    }
  }

  function resetForm() {
    setEditingLog(null);
    setFormData({
      hustle_id: "",
      hours: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
  }

  function handleEdit(log: { id: string; hustle_id: string; hours: number; date: string; notes: string | null }) {
    setEditingLog(log);
    setFormData({
      hustle_id: log.hustle_id,
      hours: log.hours.toString(),
      date: log.date,
      notes: log.notes || "",
    });
    setIsDialogOpen(true);
  }

  function startTimer() {
    if (!timerHustle) return;
    setTimerStart(new Date());
    setTimerActive(true);
    setElapsedTime(0);
  }

  function stopTimer() {
    if (!timerActive || !timerStart) return;
    
    const hours = elapsedTime / 3600;
    setFormData({
      ...formData,
      hustle_id: timerHustle,
      hours: hours.toFixed(2),
      date: new Date().toISOString().split("T")[0],
    });
    
    setTimerActive(false);
    setTimerStart(null);
    setIsDialogOpen(true);
  }

  function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const totalHours = timeLogs.reduce((sum, log) => sum + log.hours, 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Time Tracking</h1>
        <p className="text-muted-foreground">Log hours and track efficiency</p>
      </div>

      {/* Timer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Quick Timer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={timerHustle} onValueChange={setTimerHustle}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select hustle" />
              </SelectTrigger>
              <SelectContent>
                {hustles.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-3xl font-mono font-bold">
              {formatTime(elapsedTime)}
            </div>

            {timerActive ? (
              <Button variant="destructive" onClick={stopTimer}>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button onClick={startTimer} disabled={!timerHustle}>
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Hours Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalHours.toFixed(1)} hours</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {timeLogs
                .filter((log) => {
                  const logDate = new Date(log.date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return logDate >= weekAgo;
                })
                .reduce((sum, log) => sum + log.hours, 0)
                .toFixed(1)}{" "}
              hours
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Manual Entry */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => resetForm()}>
            <Plus className="w-4 h-4 mr-2" />
            Manual Entry
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLog ? "Edit Time Log" : "Add Time Log"}
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
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                step="0.25"
                value={formData.hours}
                onChange={(e) =>
                  setFormData({ ...formData, hours: e.target.value })
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
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="What did you work on?"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingLog ? "Update" : "Add"} Log
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

      {/* Time Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {timeLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No time logs yet. Start the timer or add a manual entry.
            </p>
          ) : (
            <div className="space-y-2">
              {timeLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{log.hustles?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(log.date)}
                        {log.notes && ` • ${log.notes}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">{log.hours}h</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(log)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(log.id)}
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
