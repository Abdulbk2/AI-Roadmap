import { Outlet, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Map, BookOpen, Target, Cpu, MessageSquare, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';

export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Academic Roadmap', path: '/roadmap/academic', icon: BookOpen },
    { name: 'Career Path', path: '/roadmap/career', icon: Target },
    { name: 'Skill Gap Analysis', path: '/skills', icon: Cpu },
    { name: 'AI Assistant', path: '/assistant', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Map className="w-6 h-6 text-primary mr-3" />
          <span className="font-bold text-lg tracking-tight">AI Roadmap</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border border-opacity-50">
          <div className="px-2 mb-4">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-accent-foreground hover:bg-accent transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold mr-3 flex-shrink-0">
              {user?.displayName?.charAt(0) || 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-accent-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border bg-card flex items-center px-4 justify-between">
          <div className="flex items-center">
            <Map className="w-6 h-6 text-primary mr-2" />
            <span className="font-bold">AI Roadmap</span>
          </div>
          <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
