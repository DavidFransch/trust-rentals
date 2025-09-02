"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    );
  }, []);

  // Create profile automatically after signup
  useEffect(() => {
    if (user) {
      const createProfile = async () => {
        const { data: existing } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!existing) {
          await supabase.from("profiles").insert({
            id: user.id,
            role: "renter",
            name: "",
          });
        }
      };
      createProfile();
    }
  }, [user]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm text-center">
          <h2 className="text-2xl mb-4">Welcome, {user.email}</h2>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up / Sign In</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            socialLayout="horizontal"
          />
        </div>
      </div>
    </div>
  );
}