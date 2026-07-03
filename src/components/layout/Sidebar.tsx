import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  FileBarChart,
  Tags,
  ChevronsLeft,
  ChevronsRight,
  Wallet,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/format';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { to: '/categories', label: 'Kategori', icon: Tags },
  { to: '/budget', label: 'Anggaran', icon: PiggyBank },
  { to: '/reports', label: 'Laporan', icon: FileBarChart },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-line bg-surface transition-all duration-200 lg:flex dark:border-line-dark dark:bg-surface-dark',
        collapsed ? 'w-[76px]' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-white dark:bg-ink-dark dark:text-ink">
          <Wallet className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tightest text-ink dark:text-ink-dark">
            Ledger
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-surface-subtle text-ink dark:bg-surface-subtle-dark dark:text-ink-dark'
                  : 'text-ink-muted hover:bg-surface-subtle/70 hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-subtle-dark/70 dark:hover:text-ink-dark'
              )
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line px-3 py-3 dark:border-line-dark">
        {!collapsed && user && (
          <div className="mb-2 flex items-center gap-2.5 rounded-xl px-2 py-1.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-700/30 dark:text-brand-100">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink dark:text-ink-dark">{user.name}</p>
              <p className="truncate text-[11px] text-ink-muted dark:text-ink-muted-dark">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-subtle-dark dark:hover:text-ink-dark"
        >
          <LogOut className="h-[18px] w-[18px]" />
          {!collapsed && <span>Keluar</span>}
        </button>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-subtle-dark dark:hover:text-ink-dark"
        >
          {collapsed ? <ChevronsRight className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
          {!collapsed && <span>Ciutkan</span>}
        </button>
      </div>
    </aside>
  );
}