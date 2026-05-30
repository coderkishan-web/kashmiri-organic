'use strict';

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Detect if we are on an admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <main className="w-full min-h-screen bg-bg-mist text-text-primary">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[72px] sm:pt-[80px] flex flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
