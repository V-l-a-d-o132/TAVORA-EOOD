import { useNavigate, type NavigateFunction, useRoutes } from "react-router-dom";
import { useEffect, Suspense, type ReactNode } from "react";
import routes from "./config";

let navigateResolver: (navigate: ReturnType<typeof useNavigate>) => void;

declare global {
  interface Window {
    REACT_APP_NAVIGATE: ReturnType<typeof useNavigate>;
  }
}

export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});

function RouteReady({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.dispatchEvent(new Event('tavora:page-ready'));
  }, []);
  return children;
}

export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();
  useEffect(() => {
    window.REACT_APP_NAVIGATE = navigate;
    navigateResolver(window.REACT_APP_NAVIGATE);
  });
  return (
    <Suspense fallback={
      <div role="status" aria-live="polite" aria-busy="true" className="min-h-screen flex items-center justify-center bg-white text-[#0A2540]">
        <div className="flex flex-col items-center gap-3">
          <div aria-hidden="true" className="w-10 h-10 border-2 border-[#0A2540]/15 border-t-[#0A2540] rounded-full motion-safe:animate-spin" />
          <p className="text-sm">Зареждане на страницата…</p>
        </div>
      </div>
    }>
      <RouteReady>{element}</RouteReady>
    </Suspense>
  );
}
