import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Tags, PiggyBank, FileBarChart } from 'lucide-react';
import { cn } from '@/lib/format';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { to: '/categories', label: 'Kategori', icon: Tags },
  { to: '/budget', label: 'Anggaran', icon: PiggyBank },
  { to: '/reports', label: 'Laporan', icon: FileBarChart },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface/95 backdrop-blur lg:hidden dark:border-line-dark dark:bg-surface-dark/95">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
              isActive ? 'text-brand-500' : 'text-ink-muted dark:text-ink-muted-dark'
            )
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}