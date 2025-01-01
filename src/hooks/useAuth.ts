import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Profile } from "../types/profile";
import { useToast } from "../components/ui/use-toast";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setAuthError("Failed to load profile");
    }
  };

  const refreshProfile = async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id);
    }
  };

  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          await fetchProfile(session.user.id);
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user?.id) {
              await fetchProfile(session.user.id);
            }
          }
        );
        authSubscription = { unsubscribe: subscription.unsubscribe };
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthError("Failed to initialize authentication");
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setAuthError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      setAuthError(error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
      setAuthError(error.message);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    user,
    session, 
    profile,
    loading,
    authError,
    signIn, 
    signOut,
    refreshProfile
  };
};

type Session = {
  user: User;
};

type User = {
  id: string;
  email?: string;
  user_metadata: {
    [key: string]: any;
  };
};