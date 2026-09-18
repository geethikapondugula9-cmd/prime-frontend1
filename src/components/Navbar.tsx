import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Download, Video, Home, PhoneCall, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProfileMenu from "@/components/ProfileMenu";

interface NavbarProps {
  user?: any;
  drawerOpen?: boolean;
  setDrawerOpen?: (open: boolean) => void;
}

const Navbar = ({ user: propUser, drawerOpen, setDrawerOpen }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalUser, setInternalUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use passed-in user or fetch if not provided
  const user = propUser !== undefined ? propUser : internalUser;

  useEffect(() => {
    if (propUser === undefined) {
      supabase.auth.getUser().then(({ data }) => {
        setInternalUser(data?.user || null);
      });
    }
  }, [propUser]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("prime_user");
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* LEFT - BRAND LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/landing")}
        >
          <img
            src="/logo.png"
            alt="PrimeTalker Logo"
            className="w-28 sm:w-40 h-auto object-contain select-none"
          />
        </div>

        {/* CENTER - DESKTOP NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => navigate("/landing")}
            className={`transition-colors flex items-center gap-1.5 ${
              isActive("/landing") || isActive("/")
                ? "text-primary font-semibold border-b-2 border-primary pb-0.5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={() => (user ? navigate("/rooms") : navigate("/auth"))}
            className={`transition-colors flex items-center gap-1.5 ${
              isActive("/rooms")
                ? "text-primary font-semibold border-b-2 border-primary pb-0.5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video className="w-4 h-4" />
            Rooms
          </button>

          <a
            href="/PrimeTalker-User-Guide.html"
            download="PrimeTalker-User-Guide.html"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            User Guide
          </a>

          <button
            onClick={() => navigate("/contact")}
            className={`transition-colors flex items-center gap-1.5 ${
              isActive("/contact")
                ? "text-primary font-semibold border-b-2 border-primary pb-0.5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            Contact Us
          </button>
        </div>

        {/* RIGHT - AUTH / USER CONTROLS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {setDrawerOpen && (
                <ProfileMenu
                  user={user}
                  drawerOpen={drawerOpen || false}
                  setDrawerOpen={setDrawerOpen}
                />
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="text-sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                size="sm"
                className="shadow-primary text-sm"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <div className="flex md:hidden items-center gap-2">
          {user && setDrawerOpen && (
            <ProfileMenu
              user={user}
              drawerOpen={drawerOpen || false}
              setDrawerOpen={setDrawerOpen}
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/landing");
            }}
            className={`w-full text-left py-2 px-3 rounded-md text-base font-medium flex items-center gap-2 ${
              isActive("/landing") || isActive("/")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <Home className="w-5 h-5 text-primary" />
            Home
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              user ? navigate("/rooms") : navigate("/auth");
            }}
            className={`w-full text-left py-2 px-3 rounded-md text-base font-medium flex items-center gap-2 ${
              isActive("/rooms")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <Video className="w-5 h-5 text-primary" />
            Rooms
          </button>

          <a
            href="/PrimeTalker-User-Guide.html"
            download="PrimeTalker-User-Guide.html"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left py-2 px-3 rounded-md text-base font-medium text-foreground hover:bg-accent flex items-center gap-2"
          >
            <Download className="w-5 h-5 text-primary" />
            User Guide
          </a>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/contact");
            }}
            className={`w-full text-left py-2 px-3 rounded-md text-base font-medium flex items-center gap-2 ${
              isActive("/contact")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <PhoneCall className="w-5 h-5 text-primary" />
            Contact Us
          </button>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {user ? (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/auth");
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/auth");
                  }}
                  className="w-full shadow-primary"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
