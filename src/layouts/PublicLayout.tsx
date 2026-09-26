import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { Navbar } from "@/components/layout/Navbar";
import { PageLoader } from "@/components/layout/PageLoader";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { SearchProvider } from "@/components/layout/SearchContext";

export function PublicLayout() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  return (
    <SearchProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Navbar />
      <MobileNavbar />
      <SearchOverlay />
      <motion.main
        id="main"
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </motion.main>
      <Footer />
    </SearchProvider>
  );
}
