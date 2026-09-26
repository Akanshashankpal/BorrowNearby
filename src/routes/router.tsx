import { lazy, useEffect } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { RequireRole } from "@/layouts/RequireRole";

const HomePage = lazy(() => import("@/pages/public/HomePage"));
const DiscoverPage = lazy(() => import("@/pages/public/DiscoverPage"));
const SearchPage = lazy(() => import("@/pages/public/SearchPage"));
const CategoryPage = lazy(() => import("@/pages/categories/CategoryPage"));
const HowItWorksPage = lazy(() => import("@/pages/public/HowItWorksPage"));
const SafetyPage = lazy(() => import("@/pages/public/SafetyPage"));
const NeedsPage = lazy(() => import("@/pages/needs/NeedsPage"));
const MapPage = lazy(() => import("@/pages/public/MapPage"));
const HelpPage = lazy(() => import("@/pages/public/HelpPage"));
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));
const LegalPage = lazy(() => import("@/pages/public/LegalPage"));
const NotFoundPage = lazy(() => import("@/pages/public/NotFoundPage"));
const UserProfilePage = lazy(() => import("@/pages/public/UserProfilePage"));
const ItemDetailsPage = lazy(() => import("@/pages/items/ItemDetailsPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ListItemPage = lazy(() => import("@/pages/items/ListItemPage"));
const BorrowRequestPage = lazy(() => import("@/pages/items/BorrowRequestPage"));
const RequestDetailsPage = lazy(() => import("@/pages/items/RequestDetailsPage"));
const PaymentPage = lazy(() => import("@/pages/public/PaymentPage"));
const CreateNeedPage = lazy(() => import("@/pages/needs/CreateNeedPage"));
const DashboardHomePage = lazy(() => import("@/pages/dashboard/DashboardHomePage"));
const BorrowingsPage = lazy(() => import("@/pages/dashboard/BorrowingsPage"));
const MyItemsPage = lazy(() => import("@/pages/dashboard/MyItemsPage"));
const RequestsPage = lazy(() => import("@/pages/dashboard/RequestsPage"));
const WishlistPage = lazy(() => import("@/pages/dashboard/WishlistPage"));
const MessagesPage = lazy(() => import("@/pages/dashboard/MessagesPage"));
const NotificationsPage = lazy(() => import("@/pages/dashboard/NotificationsPage"));
const TrustPage = lazy(() => import("@/pages/dashboard/TrustPage"));
const PaymentsPage = lazy(() => import("@/pages/dashboard/PaymentsPage"));
const SettingsPage = lazy(() => import("@/pages/dashboard/SettingsPage"));
const SellerHomePage = lazy(() => import("@/pages/seller/SellerHomePage"));
const AdminHomePage = lazy(() => import("@/pages/admin/AdminHomePage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminListingsPage = lazy(() => import("@/pages/admin/AdminListingsPage"));
const AdminRequestsPage = lazy(() => import("@/pages/admin/AdminRequestsPage"));
const AdminNeedsPage = lazy(() => import("@/pages/admin/AdminNeedsPage"));

function RootScroll() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <RootScroll />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "discover", element: <DiscoverPage /> },
          { path: "search", element: <SearchPage /> },
          { path: "category/:slug", element: <CategoryPage /> },
          { path: "item/:id", element: <ItemDetailsPage /> },
          { path: "user/:id", element: <UserProfilePage /> },
          { path: "map", element: <MapPage /> },
          { path: "how-it-works", element: <HowItWorksPage /> },
          { path: "safety", element: <SafetyPage /> },
          { path: "needs", element: <NeedsPage /> },
          { path: "help", element: <HelpPage /> },
          { path: "contact", element: <ContactPage /> },
          { path: "legal/:slug", element: <LegalPage /> },
          {
            element: <RequireRole allow="user" />,
            children: [
              { path: "item/:id/request", element: <BorrowRequestPage /> },
              { path: "payment/:id", element: <PaymentPage /> },
              { path: "needs/create", element: <CreateNeedPage /> },
              {
                path: "dashboard",
                element: <DashboardLayout />,
                children: [
                  { index: true, element: <DashboardHomePage /> },
                  { path: "borrowings", element: <BorrowingsPage /> },
                  { path: "requests", element: <RequestsPage /> },
                  { path: "wishlist", element: <WishlistPage /> },
                  { path: "messages", element: <MessagesPage /> },
                  { path: "messages/:conversationId", element: <MessagesPage /> },
                  { path: "notifications", element: <NotificationsPage /> },
                  { path: "trust", element: <TrustPage /> },
                  { path: "payments", element: <PaymentsPage /> },
                  { path: "settings", element: <SettingsPage /> },
                ],
              },
            ],
          },
          {
            element: <RequireRole allow={["user", "seller"]} />,
            children: [
              { path: "list-item", element: <ListItemPage /> },
            ],
          },
          {
            element: <RequireRole allow="seller" />,
            children: [
              {
                path: "seller",
                element: <DashboardLayout />,
                children: [
                  { index: true, element: <SellerHomePage /> },
                  { path: "items", element: <MyItemsPage /> },
                  { path: "requests", element: <RequestsPage /> },
                  { path: "messages", element: <MessagesPage /> },
                  { path: "messages/:conversationId", element: <MessagesPage /> },
                  { path: "notifications", element: <NotificationsPage /> },
                  { path: "trust", element: <TrustPage /> },
                  { path: "payments", element: <PaymentsPage /> },
                  { path: "settings", element: <SettingsPage /> },
                ],
              },
            ],
          },
          {
            element: <RequireRole allow="admin" />,
            children: [
              {
                path: "admin",
                element: <DashboardLayout />,
                children: [
                  { index: true, element: <AdminHomePage /> },
                  { path: "users", element: <AdminUsersPage /> },
                  { path: "listings", element: <AdminListingsPage /> },
                  { path: "requests", element: <AdminRequestsPage /> },
                  { path: "needs", element: <AdminNeedsPage /> },
                ],
              },
            ],
          },
          {
            element: <RequireRole allow={["user", "seller", "admin"]} />,
            children: [{ path: "requests/:id", element: <RequestDetailsPage /> }],
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "signup", element: <SignupPage /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },
]);
