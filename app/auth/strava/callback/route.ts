import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type StravaTokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    token_type?: string;
    scope?: string;
    athlete: {
        id: number;
    };
};

export async function GET(request: Request) {
    const url = new URL(request.url);
    const { origin: requestOrigin } = url;
    const origin = (process.env.NEXT_PUBLIC_SITE_URL || requestOrigin).replace(/\/$/, "");

    const error = url.searchParams.get("error");
    if (error) {
        return NextResponse.redirect(`${origin}/dashboard/settings?strava=oauth_error`);
    }

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
        return NextResponse.redirect(`${origin}/dashboard/settings?strava=missing_code`);
    }

    const cookieStore = await cookies();
    const stateCookie = cookieStore.get("strava_oauth_state")?.value;

    if (!stateCookie || stateCookie !== state) {
        return NextResponse.redirect(`${origin}/dashboard/settings?strava=bad_state`);
    }

    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        return NextResponse.redirect(`${origin}/dashboard/settings?strava=missing_client_secret`);
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(`${origin}/login`);
    }

    const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
    });

    const tokenRes = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!tokenRes.ok) {
        return NextResponse.redirect(`${origin}/dashboard/settings?strava=token_exchange_failed`);
    }

    const token = (await tokenRes.json()) as StravaTokenResponse;
    if (!token?.access_token || !token?.refresh_token || !token?.expires_at || !token?.athlete?.id) {
        return NextResponse.redirect(`${origin}/dashboard/settings?strava=token_invalid`);
    }

    const { error: upsertError } = await supabase
        .from("strava_accounts")
        .upsert(
            {
                user_id: user.id,
                athlete_id: token.athlete.id,
                access_token: token.access_token,
                refresh_token: token.refresh_token,
                expires_at: token.expires_at,
                scope: token.scope ?? null,
                token_type: token.token_type ?? null,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
        );

    const response = NextResponse.redirect(
        `${origin}/dashboard/settings?strava=${upsertError ? "save_failed" : "connected"}`
    );
    response.cookies.delete("strava_oauth_state");
    return response;
}
