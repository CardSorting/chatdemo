import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Bot,
  Compass,
  Plus,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-black border-r border-green-500/10 p-4">
      <nav className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={`justify-start ${
            isActive("/explore") ? "text-green-400" : "text-gray-400"
          } hover:text-green-400`}
          onClick={() => navigate("/explore")}
        >
          <Compass className="w-4 h-4 mr-2" />
          Explore
        </Button>

        {user && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className={`justify-start ${
                isActive("/companions") ? "text-green-400" : "text-gray-400"
              } hover:text-green-400`}
              onClick={() => navigate("/companions")}
            >
              <Bot className="w-4 h-4 mr-2" />
              My Companions
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`justify-start ${
                isActive("/submit") ? "text-green-400" : "text-gray-400"
              } hover:text-green-400`}
              onClick={() => navigate("/submit")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Companion
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`justify-start ${
                isActive(`/user/${user.id}`) ? "text-green-400" : "text-gray-400"
              } hover:text-green-400`}
              onClick={() => navigate(`/user/${user.id}`)}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>

            {profile?.role === "admin" && (
              <Button
                variant="ghost"
                size="sm"
                className={`justify-start ${
                  isActive("/admin") ? "text-green-400" : "text-gray-400"
                } hover:text-green-400`}
                onClick={() => navigate("/admin")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;