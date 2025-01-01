import React, { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "@/services/profile/profileTypes";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false); // Changed to false by default
  const [error, setError] = useState<string | null>(null);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  const fetchProfile = async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          await createProfile(userId);
          return fetchProfile(userId);
        }
        throw error;
      }

      setProfile(data as Profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch profile");
    }
  };

  const createProfile = async (userId: string): Promise<void> => {
    try {
      const { error } = await supabase.from("profiles").insert({
        id: userId,
        role: "user",
        email: user?.email,
        full_name: user?.user_metadata?.full_name || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("Failed to create profile");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          await fetchProfile(initialSession.user.id);
        }

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id);
          } else {
            setProfile(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        setError("Failed to initialize auth");
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    isAdmin: profile?.role === "admin",
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
