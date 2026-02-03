import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OverviewView from "./OverviewView";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const safeNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : 0);

    const startOfWeekLocal = () => {
        const d = new Date();
        const day = d.getDay(); // 0=Sun
        const diff = (day + 6) % 7; // Mon=0
        d.setDate(d.getDate() - diff);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const { data: runs, error: runsError } = await supabase
        .from("runs")
        .select("id,name,start_date,distance_m,moving_time_s,calories,sport_type")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false })
        .range(0, 1999);

    const runRows =
        runsError || !Array.isArray(runs)
            ? []
            : runs
                  .map((row) => {
                      if (!row || typeof row !== "object") return null;
                      const r = row as Record<string, unknown>;

                      const idRaw = r.id;
                      const id =
                          typeof idRaw === "string"
                              ? idRaw
                              : typeof idRaw === "number"
                                ? String(idRaw)
                                : String(idRaw ?? "");

                      const start_date = typeof r.start_date === "string" ? r.start_date : null;

                      return {
                          id,
                          name: typeof r.name === "string" ? r.name : null,
                          start_date,
                          distance_m: safeNumber(r.distance_m),
                          moving_time_s: safeNumber(r.moving_time_s),
                          calories: safeNumber(r.calories),
                          sport_type: typeof r.sport_type === "string" ? r.sport_type : null,
                      };
                  })
                  .filter((r): r is NonNullable<typeof r> => Boolean(r));

    const totals = runRows.reduce(
        (acc, r) => {
            acc.distance_m += safeNumber(r.distance_m);
            acc.moving_time_s += safeNumber(r.moving_time_s);
            acc.calories += safeNumber(r.calories);
            acc.count += 1;
            return acc;
        },
        { distance_m: 0, moving_time_s: 0, calories: 0, count: 0 }
    );

    const weekStart = startOfWeekLocal();
    const weekDistanceM = runRows.reduce((acc: number, r) => {
        const start = r.start_date ? new Date(r.start_date) : null;
        if (!start || Number.isNaN(start.getTime())) return acc;
        if (start >= weekStart) return acc + safeNumber(r.distance_m);
        return acc;
    }, 0);

    const profileRecord =
        profile && typeof profile === "object" ? (profile as Record<string, unknown>) : null;
    const weeklyTargetKmRaw =
        profileRecord && typeof profileRecord.weekly_goal_km === "number"
            ? profileRecord.weekly_goal_km
            : undefined;
    const weeklyTargetKm = weeklyTargetKmRaw && weeklyTargetKmRaw > 0 ? weeklyTargetKmRaw : 40;

    const overview = {
        totals: {
            distanceKm: totals.distance_m / 1000,
            timeHours: totals.moving_time_s / 3600,
            runsCount: totals.count,
            calories: totals.calories,
        },
        weekly: {
            currentKm: weekDistanceM / 1000,
            targetKm: weeklyTargetKm,
        },
        recentRuns: runRows.slice(0, 10).map((r) => ({
            id: r.id,
            name: r.name ?? null,
            start_date: r.start_date,
            distance_m: safeNumber(r.distance_m),
            moving_time_s: safeNumber(r.moving_time_s),
            calories: safeNumber(r.calories),
            sport_type: r.sport_type ?? null,
        })),
    };

    return <OverviewView user={user} profile={profile} overview={overview} />;
}
