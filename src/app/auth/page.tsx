"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AuthForm } from "@/components/auth-form";
import { Button } from "@/components/ui/button";
import type { SignInFormData, SignUpFormData } from "@/lib/auth-schema";

export default function AuthPage() {
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    );
  }, []);

  async function handleSignUp(formData: SignUpFormData) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.user && formData.name && formData.role) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          name: formData.name,
          role: formData.role,
        });
        alert("Signup successful! Check your email for confirmation.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignIn(formData: SignInFormData) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
        return;
      }
      if (data.user) setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(formData: SignInFormData | SignUpFormData) {
    if (authMode === "signin") {
      await handleSignIn(formData as SignInFormData);
    } else {
      await handleSignUp(formData as SignUpFormData);
    }
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
            {authMode === "signin" ? "Sign In" : "Sign Up"}
          </h2>

          <div className="flex gap-2 mb-6">
            <Button
              variant={authMode === "signin" ? "default" : "outline"}
              onClick={() => setAuthMode("signin")}
              className="flex-1"
            >
              Sign In
            </Button>
            <Button
              variant={authMode === "signup" ? "default" : "outline"}
              onClick={() => setAuthMode("signup")}
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>

          <AuthForm
            mode={authMode}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

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