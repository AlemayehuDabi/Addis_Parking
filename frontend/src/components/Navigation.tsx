import { motion } from 'framer-motion';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Map, LayoutGrid, Wallet, User, Car, LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { Button } from './ui/button';

const navItems = [
  { path: '/app', icon: Map, label: 'Map' },
  { path: '/app/lots', icon: LayoutGrid, label: 'Lots' },
  { path: '/app/wallet', icon: Wallet, label: 'Wallet' },
  { path: '/app/dashboard', icon: User, label: 'Dashboard' },
];

export const BottomNav = () => {
  const location = useLocation();


  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 px-4 py-2"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl bg-primary"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export const Sidebar = () => {
  const location = useLocation();

  const handleSignOut = () => signOut()

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-border bg-sidebar md:flex sticky top-0">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 border-b border-sidebar-border p-6 hover:bg-sidebar-accent transition-colors">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Car className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-sidebar-foreground">Addis Parking</h1>
          <p className="text-xs text-sidebar-foreground/60">Smart Parking</p>
        </div>
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 h-8 w-1 rounded-r-full bg-sidebar-primary"
                    />
                  )}
                </NavLink>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">Abebe Kebede</p>
            <p className="text-xs text-sidebar-foreground/60">AA-1234</p>
          </div>
        </div>
        <button
         onClick={handleSignOut}
        // to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
