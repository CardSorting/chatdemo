import React from "react";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
              Matrix Mingle
            </span>
          </div>
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/user/${session.user.id}`)}
                  className="hover:bg-green-500/10"
                >
                  Profile
                </Button>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
