import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { updatePulseBalance } from "../../services/pulse/pulseService";

const RegisterPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.user?.id,
          username,
          email
        });

      if (profileError) throw profileError;
      
      // Award 500 pulse for registering
      await updatePulseBalance(authUser.user?.id as string, 500);

      await signIn(email, password);
      navigate(-1); // Go back to previous page after registration
    } catch (err) {
      if (err.code === '23505') {
        setError("Username already exists");
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/90">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/80 rounded-lg border border-green-500/20">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
          Register
        </h1>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            onClick={handleRegister} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
          <div className="text-center">
            <Button
              variant="link"
              asChild
              className="text-green-500"
            >
              <Link to="/login">
                Already have an account? Login
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate(-1)}
              className="text-gray-400"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
