
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="dashboard-layout flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="content-area p-4 lg:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
