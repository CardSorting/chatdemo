import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@lib/auth";
import { Button } from "@components/ui/button";
import { Loader2, LogOut, Settings, Users, Bot } from "lucide-react";
import { cn } from "@lib/utils";

const AdminLayout = () => {
  const { loading, isAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-green-500/20 bg-black/80 backdrop-blur-sm">
        <div className="flex h-16 items-center border-b border-green-500/20 px-6">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
            Admin Panel
          </span>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink to="/admin" icon={<Users className="h-5 w-5" />} end>
            Users
          </NavLink>
          <NavLink to="/admin/companions" icon={<Bot className="h-5 w-5" />}>
            Companions
          </NavLink>
          <NavLink to="/admin/settings" icon={<Settings className="h-5 w-5" />}>
            Settings
          </NavLink>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
}

const NavLink = ({ to, icon, children, end }: NavLinkProps) => {
  const isActive = window.location.pathname === (end ? to : to + "/");

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "w-full justify-start",
        isActive
          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
          : "text-gray-400 hover:text-green-400 hover:bg-green-500/10",
      )}
    >
      <a href={to}>
        {React.cloneElement(icon as React.ReactElement, {
          className: "mr-2 h-5 w-5",
        })}
        {children}
      </a>
    </Button>
  );
};

export default AdminLayout;
