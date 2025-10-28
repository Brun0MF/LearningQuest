import React from 'react';
import { SidebarProvider, useSidebar } from "../../components/base/sidebar/sidebarContext";
import { Outlet } from "react-router";
import Header from '../../components/base/header/header';
import Sidebar from '../../components/base/sidebar/sidebar';
import Backdrop from '../../components/base/sidebar/backdrop';
import Footer from '../../components/base/footer/footer';


const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <Sidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <div className='sticky top-0 z-[60] bg-white'>
        <Header />  
        </div>
        
        <div className="relative z-0 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
