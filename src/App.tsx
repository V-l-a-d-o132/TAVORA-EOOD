import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import PageMetadataSync from "./components/feature/PageMetadataSync";
import CookieBanner from "./components/feature/CookieBanner";
import ScrollToTop from "./components/feature/ScrollToTop";
import AutoPageView from "./components/feature/AutoPageView";
import LevelUpToast from "./components/feature/LevelUpToast";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  useEffect(() => {
    // Inject A/B test seed for deterministic variant assignment
    try {
      if (!window.sessionStorage.getItem("ab_seed")) {
        window.sessionStorage.setItem("ab_seed", Math.random().toString(36).slice(2));
      }
    } catch { /* Public pages also work when browser storage is unavailable. */ }
  }, []);

  return (
      <BrowserRouter basename={__BASE_PATH__}>
        <AuthProvider>
          <PageMetadataSync />
          <AutoPageView />
          <ScrollToTop />
          <a href="#main-content" className="skip-link">
            Напред към съдържанието
          </a>
          <div id="main-content">
            <AppRoutes />
          </div>
          <LevelUpToast />
          <CookieBanner />
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;
