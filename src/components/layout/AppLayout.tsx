import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-canvas dark:bg-canvas-dark">
      <Sidebar />
      {/* min-w-0 is required here: this div is a flex-item of the row-flex root
          above. Without it, the browser computes this item's minimum width from
          its min-content (e.g. a table with whitespace-nowrap cells), which can
          exceed the viewport and silently push the entire page wider than the
          screen — this was the root cause of the mobile overflow bug. */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col pb-16 lg:pb-0">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}