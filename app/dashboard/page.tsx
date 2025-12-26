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

    return <OverviewView user={user} profile={profile} />;
}
