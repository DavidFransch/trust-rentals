"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthPage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"renter" | "landlord">("renter");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    );
  }, []);

  async function signUp() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        name,
        role,
      });
      alert("Signup successful! Check your email for confirmation.");
    }
  }

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);
    if (data.user) setUser(data.user);
  }

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
          <h2 className="text-2xl font-bold mb-6 text-center">
            Sign Up / Sign In
          </h2>

          {/* Custom signup form */}
          <div className="flex flex-col gap-4 mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "renter" | "landlord")}
              className="w-full p-2 border rounded"
            >
              <option value="renter">Renter</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={signUp}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Sign Up
            </button>
            <button
              onClick={signIn}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            >
              Sign In
            </button>
          </div>

          <div className="mt-6">
            <p className="text-center text-gray-500 text-sm">
              Or use the Supabase Auth UI
            </p>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              socialLayout="horizontal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}