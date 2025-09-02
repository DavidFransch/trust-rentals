"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Page() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("*").then(({ data }) => setUsers(data ?? []));
  }, []);

  return (
    <div>
      <h1>Profiles</h1>
      {users.map((user) => (
        <div key={user.id}>{user.name} ({user.role})</div>
      ))}
    </div>
  );
}