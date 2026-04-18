import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sparkles, Moon, Sun, LogOut, LayoutDashboard, Library } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import { useLogout } from "../../features/auth/hooks";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Sparkles className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">PromptForge</span>
        </Link>

        {user && (
          <nav className="hidden items-center gap-1 sm:flex">
            <NavItem to="/dashboard" icon={<LayoutDashboard className="size-4" />}>
              Dashboard
            </NavItem>
            <NavItem to="/templates" icon={<Library className="size-4" />}>
              Templates
            </NavItem>
          </nav>
        )}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>

          {user ? (
            <>
              <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:inline">
                {user.name ?? user.email}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                loading={logout.isPending}
                leftIcon={<LogOut className="size-4" />}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" variant="ghost">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}
