"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchProfile(data.user.id);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });
  }, []);

  async function fetchProfile(id: string) {
    const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    setProfile(data);
  }

  if (!user) return <a href="/auth">Sign Up / Sign In</a>;

  return (
    <div>
      <h1>Welcome, {profile?.name || user.email}</h1>
      <p>Role: {profile?.role}</p>
    </div>
  );
}