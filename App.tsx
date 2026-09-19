import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import CookieBanner from "./components/feature/CookieBanner";
import ScrollToTop from "./components/feature/ScrollToTop";
import AutoPageView from "./components/feature/AutoPageView";
import LevelUpToast from "./components/feature/LevelUpToast";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).__removeSkeleton) {
      (window as any).__removeSkeleton();
    }

    // Inject A/B test seed for deterministic variant assignment
    if (typeof window !== "undefined" && !window.sessionStorage.getItem("ab_seed")) {
      window.sessionStorage.setItem("ab_seed", Math.random().toString(36).slice(2));
    }

    // Lazy-load non-critical below-fold images immediately after mount
    if (typeof window !== "undefined") {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
              }
              imgObserver.unobserve(img);
            }
          });
        }, { rootMargin: "200px" });
        lazyImages.forEach((img) => imgObserver.observe(img));
      }
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AuthProvider>
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
    </I18nextProvider>
  );
}

export default App;