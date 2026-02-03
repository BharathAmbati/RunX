import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ActivityView from "./ActivityView";

type RunRow = {
    id: string;
    name: string | null;
    start_date: string;
    distance_m: number;
    moving_time_s: number;
    calories: number | null;
};

function safeNumber(value: unknown) {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function startOfWeekLocal(now = new Date()) {
    const d = new Date(now);
    const day = d.getDay(); // 0=Sun
    const diff = (day + 6) % 7; // Mon=0
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function startOfMonthLocal(now = new Date()) {
    const d = new Date(now);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
}

export default async function ActivityPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    const { data: runs, error: runsError } = await supabase
        .from("runs")
        .select("id,name,start_date,distance_m,moving_time_s,calories")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false })
        .range(0, 1999);

    const rows: RunRow[] =
        runsError || !Array.isArray(runs)
            ? []
            : runs
                  .map((row): RunRow | null => {
                      if (!row || typeof row !== "object") return null;
                      const r = row as Record<string, unknown>;

                      const start_date = typeof r.start_date === "string" ? r.start_date : null;
                      if (!start_date) return null;

                      const idRaw = r.id;
                      const id =
                          typeof idRaw === "string"
                              ? idRaw
                              : typeof idRaw === "number"
                                ? String(idRaw)
                                : String(idRaw ?? "");

                      return {
                          id,
                          name: typeof r.name === "string" ? r.name : null,
                          start_date,
                          distance_m: safeNumber(r.distance_m),
                          moving_time_s: safeNumber(r.moving_time_s),
                          calories: typeof r.calories === "number" && Number.isFinite(r.calories) ? r.calories : null,
                      };
                  })
                  .filter((r): r is RunRow => Boolean(r));

    const totals = rows.reduce(
        (acc, r) => {
            acc.distance_m += safeNumber(r.distance_m);
            acc.moving_time_s += safeNumber(r.moving_time_s);
            acc.calories += safeNumber(r.calories);
            acc.count += 1;
            return acc;
        },
        { distance_m: 0, moving_time_s: 0, calories: 0, count: 0 }
    );

    const now = new Date();
    const weekStart = startOfWeekLocal(now);
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const monthStart = startOfMonthLocal(now);

    const week = { distance_m: 0, count: 0 };
    const lastWeek = { distance_m: 0, count: 0 };
    const month = { distance_m: 0, count: 0 };

    for (const r of rows) {
        const d = new Date(r.start_date);
        if (Number.isNaN(d.getTime())) continue;

        if (d >= weekStart) {
            week.distance_m += safeNumber(r.distance_m);
            week.count += 1;
        } else if (d >= lastWeekStart && d < weekStart) {
            lastWeek.distance_m += safeNumber(r.distance_m);
            lastWeek.count += 1;
        }

        if (d >= monthStart) {
            month.distance_m += safeNumber(r.distance_m);
            month.count += 1;
        }
    }

    const avgPaceSecPerKm =
        totals.distance_m > 0 ? (totals.moving_time_s * 1000) / totals.distance_m : 0;

    return (
        <ActivityView
            activities={rows.slice(0, 50)}
            summary={{
                totalDistanceKm: totals.distance_m / 1000,
                totalCalories: totals.calories,
                avgPaceSecPerKm,
                weekly: {
                    thisWeek: { distanceKm: week.distance_m / 1000, runs: week.count },
                    lastWeek: { distanceKm: lastWeek.distance_m / 1000, runs: lastWeek.count },
                    thisMonth: { distanceKm: month.distance_m / 1000, runs: month.count },
                },
            }}
        />
    );
}
