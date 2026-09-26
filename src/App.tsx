import { RouterProvider } from "react-router-dom";
import { ToastViewport } from "@/components/ui/Toast";
import { router } from "@/routes/router";
import { AppProviders } from "@/store/providers";

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <ToastViewport />
    </AppProviders>
  );
}
