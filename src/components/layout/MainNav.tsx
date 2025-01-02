import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Bot,
  Compass,
  LogOut,
  Plus,
  Settings,
  User,
  LogIn,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { usePulse } from "../../hooks/usePulse";
import { Badge } from "../ui/badge";

const MainNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading, signOut } = useAuth();
  const { balance } = usePulse(user?.id || '');

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-green-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-xl font-semibold text-white hover:text-green-400 transition-colors"
            >
              Matrix Mingle
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`${isActive("/explore") ? "text-green-400" : "text-gray-400"} hover:text-green-400`}
                onClick={() => navigate("/explore")}
              >
                <Compass className="w-4 h-4 mr-2" />
                Explore
              </Button>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${isActive("/companions") ? "text-green-400" : "text-gray-400"} hover:text-green-400`}
                  onClick={() => navigate("/companions")}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  My Companions
                </Button>
              )}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/submit")}
                      className="hidden md:flex text-green-400 hover:text-green-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                    </Button>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-green-500/20 text-green-400">
                        {balance} Pulse
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 rounded-full"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  profile?.avatar_url ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name}`
                                }
                                alt={profile?.full_name}
                              />
                              <AvatarFallback>
                                {profile?.full_name?.[0] || user.email?.[0]}
                              </AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => navigate(`/user/${user.id}`)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </DropdownMenuItem>
                          {profile?.role === "admin" && (
                            <DropdownMenuItem onClick={() => navigate("/admin")}>
                              <Settings className="mr-2 h-4 w-4" />
                              Admin
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="text-green-400 hover:text-green-500"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNav;
