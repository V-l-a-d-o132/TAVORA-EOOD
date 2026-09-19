import { useNavigate, type NavigateFunction, useRoutes } from "react-router-dom";
import { useEffect, Suspense } from "react";
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

export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();
  useEffect(() => {
    window.REACT_APP_NAVIGATE = navigate;
    navigateResolver(window.REACT_APP_NAVIGATE);
  });
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 animate-spin" style={{ borderColor: '#1a1a1a', borderTopColor: '#e53e3e', borderRadius: '50%' }} />
        </div>
      </div>
    }>
      {element}
    </Suspense>
  );
}
