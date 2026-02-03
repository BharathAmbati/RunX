import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { origin: requestOrigin } = new URL(request.url);
    const origin = (process.env.NEXT_PUBLIC_SITE_URL || requestOrigin).replace(/\/$/, "");

    const clientId = process.env.STRAVA_CLIENT_ID;
    if (!clientId) {
        return NextResponse.redirect(`${origin}/dashboard/settings?strava=missing_client_id`);
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(`${origin}/login`);
    }

    const state = crypto.randomUUID();
    const redirectUri = `${origin}/auth/strava/callback`;

    const authorizeUrl = new URL("https://www.strava.com/oauth/authorize");
    authorizeUrl.search = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        approval_prompt: "auto",
        scope: "read,activity:read_all",
        state,
    }).toString();

    const response = NextResponse.redirect(authorizeUrl.toString());
    response.cookies.set({
        name: "strava_oauth_state",
        value: state,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10,
    });
    return response;
}
