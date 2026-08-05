import { Outlet } from 'react-router-dom';

import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
