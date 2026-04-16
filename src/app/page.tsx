"use client";

import { useState, useEffect, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DollarCircleIcon,
  TargetDollarIcon,
  ChartIncreaseIcon,
} from "@hugeicons/core-free-icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STORAGE_KEY = "compound-calculator";
const MULTIPLIER_OPTIONS = ["1.125", "1.25", "1.5", "2", "3"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Home() {
  const [startBalance, setStartBalance] = useState("1000");
  const [targetBalance, setTargetBalance] = useState("10000");
  const [multiplier, setMultiplier] = useState("2");
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.startBalance) setStartBalance(parsed.startBalance);
        if (parsed.targetBalance) setTargetBalance(parsed.targetBalance);
        if (parsed.multiplier) setMultiplier(parsed.multiplier);
      } catch {
        // ignore parse errors
      }
    }
    setHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ startBalance, targetBalance, multiplier }),
    );
  }, [startBalance, targetBalance, multiplier, hydrated]);

  const trades = useMemo(() => {
    const start = parseFloat(startBalance);
    const target = parseFloat(targetBalance);
    const mult = parseFloat(multiplier);

    if (
      isNaN(start) ||
      isNaN(target) ||
      isNaN(mult) ||
      start <= 0 ||
      target <= start ||
      mult <= 1
    ) {
      return [];
    }

    const rows: { trade: number; balance: number }[] = [];
    let balance = start;
    let trade = 0;

    while (balance < target && trade < 1000) {
      trade++;
      balance = balance * mult;
      rows.push({ trade, balance });
    }

    return rows;
  }, [startBalance, targetBalance, multiplier]);

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Inputs Card */}
        <Card>
          <CardHeader>
            <CardTitle>Compound Calculator</CardTitle>
            <CardDescription>
              Enter your starting balance, target, and trade multiplier.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Starting Balance */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Starting Balance
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={DollarCircleIcon}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="1000"
                  value={startBalance}
                  onChange={(e) => setStartBalance(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Target Balance */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Target Balance
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={TargetDollarIcon}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="10000"
                  value={targetBalance}
                  onChange={(e) => setTargetBalance(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Multiplier */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Multiplier
              </label>
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={ChartIncreaseIcon}
                  strokeWidth={1.5}
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <Select
                  value={multiplier}
                  onValueChange={(v) => v !== null && setMultiplier(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select multiplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {MULTIPLIER_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table Card */}
        {trades.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Trade Progression</CardTitle>
              <CardDescription>
                {trades.length} trade{trades.length !== 1 ? "s" : ""} to reach{" "}
                {formatCurrency(parseFloat(targetBalance))} from{" "}
                {formatCurrency(parseFloat(startBalance))} at {multiplier}x
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24 pl-4">Trade #</TableHead>
                    <TableHead className="pr-4 text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map(({ trade, balance }) => (
                    <TableRow key={trade}>
                      <TableCell className="pl-4 font-medium">
                        {trade}
                      </TableCell>
                      <TableCell className="pr-4 text-right tabular-nums">
                        {formatCurrency(balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {trades.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Enter a valid starting balance less than the target balance.
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
