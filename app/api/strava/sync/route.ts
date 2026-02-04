import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StravaAccountRow = {
    user_id: string;
    athlete_id: number;
    access_token: string;
    refresh_token: string;
    expires_at: number;
};

type StravaTokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    token_type?: string;
    scope?: string;
    athlete?: { id: number };
};

type StravaActivity = {
    id: number;
    name?: string;
    sport_type?: string;
    type?: string;
    start_date: string;
    start_date_local?: string;
    timezone?: string;
    distance?: number;
    moving_time?: number;
    elapsed_time?: number;
    total_elevation_gain?: number;
    average_speed?: number;
    max_speed?: number;
    calories?: number;
    average_heartrate?: number;
    max_heartrate?: number;
    map?: { summary_polyline?: string };
};

function nowEpochSeconds() {
    return Math.floor(Date.now() / 1000);
}

function clampInt(value: number, { min, max }: { min: number; max: number }) {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, Math.trunc(value)));
}

async function refreshStravaToken(args: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}): Promise<StravaTokenResponse> {
    const body = new URLSearchParams({
        client_id: args.clientId,
        client_secret: args.clientSecret,
        grant_type: "refresh_token",
        refresh_token: args.refreshToken,
    });

    const res = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Strava token refresh failed (${res.status})${text ? `: ${text}` : ""}`);
    }

    return (await res.json()) as StravaTokenResponse;
}

async function fetchStravaActivities(args: {
    accessToken: string;
    perPage: number;
    page: number;
    after?: number;
}): Promise<StravaActivity[]> {
    const url = new URL("https://www.strava.com/api/v3/athlete/activities");
    url.searchParams.set("per_page", String(args.perPage));
    url.searchParams.set("page", String(args.page));
    if (args.after) url.searchParams.set("after", String(args.after));

    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${args.accessToken}` },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Strava activities fetch failed (${res.status})${text ? `: ${text}` : ""}`);
    }

    return (await res.json()) as StravaActivity[];
}

export async function GET() {
    return NextResponse.json({
        ok: true,
        runtime: "nodejs",
        env: {
            hasClientId: Boolean(process.env.STRAVA_CLIENT_ID),
            hasClientSecret: Boolean(process.env.STRAVA_CLIENT_SECRET),
            hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
            hasSupabaseAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
        },
    });
}

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);

        const full =
            url.searchParams.get("full") === "1" || url.searchParams.get("full") === "true";

        const perPage = clampInt(Number(url.searchParams.get("per_page") ?? "50"), { min: 1, max: 50 });
        const maxPages = clampInt(Number(url.searchParams.get("pages") ?? (full ? "10" : "3")), {
            min: 1,
            max: 30,
        });
        const clientId = process.env.STRAVA_CLIENT_ID;
        const clientSecret = process.env.STRAVA_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            return NextResponse.json(
                { ok: false, error: "Missing STRAVA_CLIENT_ID/STRAVA_CLIENT_SECRET" },
                { status: 500 }
            );
        }

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const { data: account, error: accountError } = await supabase
            .from("strava_accounts")
            .select("user_id, athlete_id, access_token, refresh_token, expires_at")
            .eq("user_id", user.id)
            .single();

        if (accountError) {
            const message = accountError.message ?? "";
            if (message.toLowerCase().includes("strava_accounts") && message.toLowerCase().includes("does not exist")) {
                return NextResponse.json(
                    { ok: false, error: "Missing DB tables. Run `supabase/strava_schema.sql` in Supabase first." },
                    { status: 500 }
                );
            }
            return NextResponse.json({ ok: false, error: "Strava not connected" }, { status: 400 });
        }

        if (!account) {
            return NextResponse.json({ ok: false, error: "Strava not connected" }, { status: 400 });
        }

        let accessToken = (account as StravaAccountRow).access_token;
        const refreshToken = (account as StravaAccountRow).refresh_token;
        const expiresAt = (account as StravaAccountRow).expires_at;

        // Refresh token if expiring within 60s
        if (expiresAt <= nowEpochSeconds() + 60) {
            const refreshed = await refreshStravaToken({
                clientId,
                clientSecret,
                refreshToken,
            });

            if (!refreshed?.access_token || !refreshed?.refresh_token || !refreshed?.expires_at) {
                return NextResponse.json({ ok: false, error: "Token refresh returned invalid data" }, { status: 502 });
            }

            accessToken = refreshed.access_token;

            await supabase
                .from("strava_accounts")
                .update({
                    access_token: refreshed.access_token,
                    refresh_token: refreshed.refresh_token,
                    expires_at: refreshed.expires_at,
                    scope: refreshed.scope ?? null,
                    token_type: refreshed.token_type ?? null,
                    updated_at: new Date().toISOString(),
                })
                .eq("user_id", user.id);
        }

        // Incremental sync by default (unless full=1)
        let after: number | undefined;
        const explicitAfter = url.searchParams.get("after");
        if (explicitAfter) {
            const parsed = Number(explicitAfter);
            if (Number.isFinite(parsed) && parsed > 0) after = Math.trunc(parsed);
        } else if (!full) {
            const { data: latestRun } = await supabase
                .from("runs")
                .select("start_date")
                .eq("user_id", user.id)
                .order("start_date", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (latestRun?.start_date) {
                const latest = new Date(latestRun.start_date);
                if (!Number.isNaN(latest.getTime())) {
                    // Back up 24h to catch edits/late uploads
                    after = Math.floor(latest.getTime() / 1000) - 60 * 60 * 24;
                }
            }
        }

        let totalFetched = 0;
        let totalUpserted = 0;
        let pagesFetched = 0;

        for (let page = 1; page <= maxPages; page += 1) {
            const activities = await fetchStravaActivities({ accessToken, perPage, page, after });
            pagesFetched += 1;

            if (!Array.isArray(activities) || activities.length === 0) break;

            totalFetched += activities.length;

            const rows = activities.map((a) => ({
                user_id: user.id,
                strava_activity_id: a.id,
                name: a.name ?? null,
                sport_type: a.sport_type ?? a.type ?? null,
                start_date: a.start_date,
                start_date_local: a.start_date_local ?? null,
                timezone: a.timezone ?? null,
                distance_m: a.distance ?? 0,
                moving_time_s: a.moving_time ?? 0,
                elapsed_time_s: a.elapsed_time ?? null,
                total_elevation_gain_m: a.total_elevation_gain ?? null,
                average_speed_mps: a.average_speed ?? null,
                max_speed_mps: a.max_speed ?? null,
                calories: a.calories ?? null,
                average_heartrate_bpm: a.average_heartrate ?? null,
                max_heartrate_bpm: a.max_heartrate ?? null,
                map_summary_polyline: a.map?.summary_polyline ?? null,
                raw: a,
                updated_at: new Date().toISOString(),
            }));

            const { error: upsertError } = await supabase
                .from("runs")
                .upsert(rows, { onConflict: "user_id,strava_activity_id" });

            if (upsertError) {
                return NextResponse.json(
                    { ok: false, error: "Failed to save activities", details: upsertError.message },
                    { status: 500 }
                );
            }

            totalUpserted += rows.length;

            if (activities.length < perPage) break;
        }

        await supabase
            .from("strava_accounts")
            .update({ last_synced_at: new Date().toISOString(), updated_at: new Date().toISOString() })
            .eq("user_id", user.id);

        return NextResponse.json({
            ok: true,
            pagesFetched,
            totalFetched,
            totalUpserted,
            after: after ?? null,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown sync error";
        return NextResponse.json({ ok: false, error: "Strava sync failed", details: message }, { status: 500 });
    }
}
