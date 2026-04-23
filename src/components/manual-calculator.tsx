"use client";

import { useState, useMemo } from "react";
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

const STORAGE_KEY = "manual-calculator";
const MULTIPLIER_OPTIONS = ["1.125", "1.25", "1.5", "2", "3"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getStored<T>(field: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed[field] !== undefined) return parsed[field] as T;
    }
  } catch {}
  return fallback;
}

export function ManualCalculator() {
  const [startBalance, setStartBalance] = useState(() =>
    getStored("startBalance", "100"),
  );
  const [targetBalance, setTargetBalance] = useState(() =>
    getStored("targetBalance", "1000000"),
  );
  const [multiplier, setMultiplier] = useState(() =>
    getStored("multiplier", "1.25"),
  );

  function handleChange<T extends string>(
    setter: (v: T) => void,
    field: string,
  ) {
    return (value: T) => {
      setter(value);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : {};
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...parsed, [field]: value }),
        );
      } catch {}
    };
  }

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

  const start = parseFloat(startBalance);
  const target = parseFloat(targetBalance);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compound Calculator</CardTitle>
          <CardDescription>
            Set your starting balance, target, and multiplier.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                placeholder="100"
                value={startBalance}
                onChange={(e) =>
                  handleChange(setStartBalance, "startBalance")(e.target.value)
                }
                className="pl-8"
              />
            </div>
          </div>

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
                placeholder="1000000"
                value={targetBalance}
                onChange={(e) =>
                  handleChange(setTargetBalance, "targetBalance")(
                    e.target.value,
                  )
                }
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Multiplier</label>
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={ChartIncreaseIcon}
                strokeWidth={1.5}
                className="size-4 shrink-0 text-muted-foreground"
              />
              <Select
                value={multiplier}
                onValueChange={handleChange(setMultiplier, "multiplier")}
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

      {trades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trade Progression</CardTitle>
            <CardDescription>
              {trades.length} trade{trades.length !== 1 ? "s" : ""} to reach{" "}
              {formatCurrency(target)} from {formatCurrency(start)} at{" "}
              {multiplier}x
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
                    <TableCell className="pl-4 font-medium">{trade}</TableCell>
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

      {trades.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Enter a valid target balance greater than your starting balance.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
