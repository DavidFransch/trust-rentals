"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

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
      // Automatically create a profile in 'profiles' table
      await supabase.from("profiles").insert({
        id: data.user.id,
        role: "renter", // default role; can add a selector later
        name: "",
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
      <div>
        <h2>Welcome, {user.email}</h2>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 border rounded">
      <h2 className="text-xl mb-4">Sign Up / Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="flex gap-2">
        <button onClick={signUp} className="bg-blue-500 text-white p-2 rounded">
          Sign Up
        </button>
        <button onClick={signIn} className="bg-green-500 text-white p-2 rounded">
          Sign In
        </button>
      </div>
    </div>
  );
}