const ResetPasswordPage = lazy(() => import('../pages/reset-password/page'));
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/feature/ProtectedRoute";
import AdminRoute from "../components/feature/AdminRoute";
import CourseRedirect from "../components/feature/CourseRedirect";

// Eager — homepage must load immediately for LCP (no lazy chunk)
import Home from "../pages/home/page";

// Lazy — secondary pages below the fold or deeper routes
const KursPage = lazy(() => import("../pages/kurs/page"));
const Privacy = lazy(() => import("../pages/privacy/page"));
const Terms = lazy(() => import("../pages/terms/page"));
const Cookies = lazy(() => import("../pages/cookies/page"));
const Withdrawal = lazy(() => import("../pages/withdrawal/page"));
const LoginPage = lazy(() => import("../pages/login/page"));
const RegisterPage = lazy(() => import("../pages/register/page"));
const ForgotPasswordPage = lazy(() => import("../pages/forgot-password/page"));
const EkipPage = lazy(() => import("../pages/ekip/page"));
const KontaktPage = lazy(() => import("../pages/kontakt/page"));
const ReklamaVelikoTarnovoPage = lazy(() => import("../pages/reklama-veliko-tarnovo/page"));
const VideoProdukciyaVelikoTarnovoPage = lazy(() => import("../pages/video-produkciya-veliko-tarnovo/page"));
const SEOVelikoTarnovoPage = lazy(() => import("../pages/seo-veliko-tarnovo/page"));
const NPOVideoPage = lazy(() => import("../pages/npo-video/page"));
const ImashNujnotoPage = lazy(() => import("../pages/imash-nujnoto/page"));
const BlogReklamaVTPage = lazy(() => import("../pages/blog-reklama-vt/page"));
const BlogSEOVTPage = lazy(() => import("../pages/blog-seo-vt/page"));
const AdminNoviniPage = lazy(() => import("../pages/admin-novini/page"));
const NoviniPage = lazy(() => import("../pages/novini/page"));
const AdminLoginPage = lazy(() => import("../pages/admin-login/page"));
const IzrabotkaNaSaitPage = lazy(() => import("../pages/uslugi/izrabotka-na-sait/page"));
const SeoGeoPage = lazy(() => import("../pages/uslugi/seo-geo/page"));
const ReklamniKampaniiPage = lazy(() => import("../pages/uslugi/reklamni-kampanii/page"));
const VideoProdukciyaUslugiPage = lazy(() => import("../pages/uslugi/video-produkciya/page"));
const UslugiPage = lazy(() => import("../pages/uslugi/page"));
const DigitalenMarketingVelikoTarnovoPage = lazy(() => import("../pages/digitalen-marketing-veliko-tarnovo/page"));
const BlogPage = lazy(() => import("../pages/blog/page"));
const IzrabotkaNaSaitVTPage = lazy(() => import("../pages/blog/izrabotka-na-sait-vt/page"));
const GeoAITarnovoPage = lazy(() => import("../pages/blog/geo-ai-tarnovo/page"));
const GoogleBusinessVTPage = lazy(() => import("../pages/blog/google-business-vt/page"));
const MetaReklamiTarnovoPage = lazy(() => import("../pages/blog/meta-reklami-tarnovo/page"));
const SeoOptimizaciyaTarnovo2026Page = lazy(() => import("../pages/blog/seo-optimizaciya-tarnovo-2026/page"));
const VideoNPOTarnovoPage = lazy(() => import("../pages/blog/video-npo-tarnovo/page"));
const IzrabotkaNaSaitTarnovoPage = lazy(() => import("../pages/blog/izrabotka-na-sait-tarnovo/page"));
const BezplatenSeoNomerEdnoPage = lazy(() => import("../pages/blog/bezplaten-seo-nomer-edno-google/page"));
const TikTokYouTubeReklamaTarnovoPage = lazy(() => import("../pages/blog/tiktok-youtube-reklama-tarnovo/page"));
const VideoMarketingBiznesTarnovoPage = lazy(() => import("../pages/blog/video-marketing-biznes-tarnovo/page"));
const KakDaIzbereteAgenciyaTarnovoPage = lazy(() => import("../pages/blog/kak-da-izberete-agenciya-tarnovo/page"));
const EcommerceTarnovo2026Page = lazy(() => import("../pages/blog/ecommerce-tarnovo-2026/page"));
const VladimirAtanasovPage = lazy(() => import("../pages/vladimir-atanasov/page"));
const ZaTavoraPage = lazy(() => import("../pages/za-tavora/page"));
const SeoRestorantiTarnovoPage = lazy(() => import("../pages/blog/seo-restoranti-veliko-tarnovo/page"));
const KolkoStruvaDigitalenMarketingTarnovoPage = lazy(() => import("../pages/blog/kolko-struva-digitalen-marketing-tarnovo/page"));
const AiTursachkiBiznesTarnovoPage = lazy(() => import("../pages/blog/ai-tursachki-biznes-tarnovo/page"));
const GoogleBusinessVsSaitTarnovoPage = lazy(() => import("../pages/blog/google-business-vs-sait-tarnovo/page"));
const LokalenBiznesUstoichivoOnlinePrisastviePage = lazy(() => import("../pages/blog/lokalen-biznes-ustoichivo-online-prisastvie/page"));
const MarketingNablyudeniyaMasazhniUslugiPage = lazy(() => import("../pages/blog/marketing-nablyudeniya-masazhni-uslugi/page"));
const LokalenVsMasovMarketingPage = lazy(() => import("../pages/blog/lokalen-vs-masov-marketing/page"));
const PhotoTarnovoStreetPortraitNomerEdnoPage = lazy(() => import("../pages/blog/photo-tarnovo-street-portrait-nomer-edno/page"));
const MarketingZaFotografiTarnovoPage = lazy(() => import("../pages/blog/marketing-za-fotografi-tarnovo/page"));
const TuristicheskiBiznesOptimiziranSaitPage = lazy(() => import("../pages/blog/turisticheski-biznes-optimiziran-sait-tarnovo/page"));
const AiBusinessBlueprintPage = lazy(() => import("../pages/blog/ai-business-blueprint-putyat-na-koprinata/page"));
const PerfektnotoVideoPage = lazy(() => import("../pages/blog/perfektnoto-video-biznes-sistema/page"));
const MarketingBasicsPage = lazy(() => import("../pages/blog/marketing-basics-palna-sistema/page"));
const DigitalniProduktiProverkiPage = lazy(() => import("../pages/digitalni-produkti/proverki/page"));
const DigitalniProduktiPotvardjeniePage = lazy(() => import("../pages/digitalni-produkti/proverki/potvardjenie/page"));
const DigitalniProduktiDostapPage = lazy(() => import("../pages/digitalni-produkti/proverki/dostap/page"));
const DigitalniAgenciiVelikoTarnovoPage = lazy(() => import("../pages/digitalni-agencii-veliko-tarnovo/page"));

const GorskiBorovinkiNomerEdnoPage = lazy(() => import("../pages/blog/gorski-borovinki-nomer-edno-google/page"));
const MarketingZaEcommercePlodovePage = lazy(() => import("../pages/blog/marketing-za-ecommerce-plodove-tarnovo/page"));
const EcommerceSezonniProduktiPage = lazy(() => import("../pages/blog/ecommerce-sezonni-produkti-gorski-borovinki/page"));

const ModulePage = lazy(() => import("../pages/module/page"));
const DashboardPage = lazy(() => import("../pages/dashboard/page"));
const CheckoutAkademiyaPage = lazy(() => import("../pages/checkout-akademiya/page"));
const KursPotvardjeniePage = lazy(() => import("../pages/kurs-potvardjenie/page"));

// SEO+GEO funnel landing pages
const AiBusinessBlueprintFunnelPage = lazy(() => import("../pages/kurs/ai-business-blueprint/page"));
const PerfektnotoVideoFunnelPage = lazy(() => import("../pages/kurs/perfektnoto-video/page"));
const MarketingBasicsFunnelPage = lazy(() => import("../pages/kurs/marketing-basics/page"));

const routes: RouteObject[] = [
  { path: '/reset-password', element: <ResetPasswordPage /> },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/kurs",
    element: <KursPage />,
  },
  {
    path: "/ekip",
    element: <EkipPage />,
  },
  {
    path: "/kontakt",
    element: <KontaktPage />,
  },
  {
    path: "/reklama-veliko-tarnovo",
    element: <ReklamaVelikoTarnovoPage />,
  },
  {
    path: "/video-produkciya-veliko-tarnovo",
    element: <VideoProdukciyaVelikoTarnovoPage />,
  },
  {
    path: "/seo-veliko-tarnovo",
    element: <SEOVelikoTarnovoPage />,
  },
  {
    path: "/npo-video",
    element: <NPOVideoPage />,
  },
  {
    path: "/imash-nujnoto",
    element: <ImashNujnotoPage />,
  },
  {
    path: "/blog-reklama-vt",
    element: <BlogReklamaVTPage />,
  },
  {
    path: "/blog-seo-vt",
    element: <BlogSEOVTPage />,
  },
  {
    path: "/digitalen-marketing-veliko-tarnovo",
    element: <DigitalenMarketingVelikoTarnovoPage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/blog/izrabotka-na-sait-vt",
    element: <IzrabotkaNaSaitVTPage />,
  },
  {
    path: "/blog/geo-ai-tarnovo",
    element: <GeoAITarnovoPage />,
  },
  {
    path: "/blog/google-business-vt",
    element: <GoogleBusinessVTPage />,
  },
  {
    path: "/blog/meta-reklami-tarnovo",
    element: <MetaReklamiTarnovoPage />,
  },
  {
    path: "/blog/seo-optimizaciya-tarnovo-2026",
    element: <SeoOptimizaciyaTarnovo2026Page />,
  },
  {
    path: "/blog/video-npo-tarnovo",
    element: <VideoNPOTarnovoPage />,
  },
  {
    path: "/blog/izrabotka-na-sait-tarnovo",
    element: <IzrabotkaNaSaitTarnovoPage />,
  },
  {
    path: "/blog/bezplaten-seo-nomer-edno-google",
    element: <BezplatenSeoNomerEdnoPage />,
  },
  {
    path: "/blog/tiktok-youtube-reklama-tarnovo",
    element: <TikTokYouTubeReklamaTarnovoPage />,
  },
  {
    path: "/blog/video-marketing-biznes-tarnovo",
    element: <VideoMarketingBiznesTarnovoPage />,
  },
  {
    path: "/blog/kak-da-izberete-agenciya-tarnovo",
    element: <KakDaIzbereteAgenciyaTarnovoPage />,
  },
  {
    path: "/blog/ecommerce-tarnovo-2026",
    element: <EcommerceTarnovo2026Page />,
  },
  {
    path: "/za-tavora",
    element: <ZaTavoraPage />,
  },
  {
    path: "/blog/seo-restoranti-veliko-tarnovo",
    element: <SeoRestorantiTarnovoPage />,
  },
  {
    path: "/blog/kolko-struva-digitalen-marketing-tarnovo",
    element: <KolkoStruvaDigitalenMarketingTarnovoPage />,
  },
  {
    path: "/blog/ai-tursachki-biznes-tarnovo",
    element: <AiTursachkiBiznesTarnovoPage />,
  },
  {
    path: "/blog/google-business-vs-sait-tarnovo",
    element: <GoogleBusinessVsSaitTarnovoPage />,
  },
  {
    path: "/blog/lokalen-biznes-ustoichivo-online-prisastvie",
    element: <LokalenBiznesUstoichivoOnlinePrisastviePage />,
  },
  {
    path: "/blog/marketing-nablyudeniya-masazhni-uslugi",
    element: <MarketingNablyudeniyaMasazhniUslugiPage />,
  },
  {
    path: "/blog/lokalen-vs-masov-marketing",
    element: <LokalenVsMasovMarketingPage />,
  },
  {
    path: "/blog/photo-tarnovo-street-portrait-nomer-edno",
    element: <PhotoTarnovoStreetPortraitNomerEdnoPage />,
  },
  {
    path: "/blog/marketing-za-fotografi-tarnovo",
    element: <MarketingZaFotografiTarnovoPage />,
  },
  {
    path: "/blog/turisticheski-biznes-optimiziran-sait-tarnovo",
    element: <TuristicheskiBiznesOptimiziranSaitPage />,
  },
  {
    path: "/blog/ai-business-blueprint-putyat-na-koprinata",
    element: <AiBusinessBlueprintPage />,
  },
  {
    path: "/blog/perfektnoto-video-biznes-sistema",
    element: <PerfektnotoVideoPage />,
  },
  {
    path: "/blog/marketing-basics-palna-sistema",
    element: <MarketingBasicsPage />,
  },
  {
    path: "/vladimir-atanasov",
    element: <VladimirAtanasovPage />,
  },
  {
    path: "/uslugi",
    element: <UslugiPage />,
  },
  {
    path: "/uslugi/izrabotka-na-sait",
    element: <IzrabotkaNaSaitPage />,
  },
  {
    path: "/uslugi/seo-geo",
    element: <SeoGeoPage />,
  },
  {
    path: "/uslugi/reklamni-kampanii",
    element: <ReklamniKampaniiPage />,
  },
  {
    path: "/uslugi/video-produkciya",
    element: <VideoProdukciyaUslugiPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/novini",
    element: (
      <AdminRoute>
        <AdminNoviniPage />
      </AdminRoute>
    ),
  },
  {
    path: "/novini",
    element: <NoviniPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/course/:moduleId",
    element: <CourseRedirect />,
  },
  {
    path: "/module/:moduleId",
    element: (
      <ProtectedRoute>
        <ModulePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/cookies",
    element: <Cookies />,
  },
  {
    path: "/withdrawal",
    element: <Withdrawal />,
  },
  {
    path: "/digitalni-produkti/proverki",
    element: <DigitalniProduktiProverkiPage />,
  },
  {
    path: "/digitalni-produkti/proverki/potvardjenie",
    element: <DigitalniProduktiPotvardjeniePage />,
  },
  {
    path: "/digitalni-produkti/proverki/dostap",
    element: <DigitalniProduktiDostapPage />,
  },
  {
    path: "/digitalni-agencii-veliko-tarnovo",
    element: <DigitalniAgenciiVelikoTarnovoPage />,
  },
  {
    path: "/kurs/checkout",
    element: <CheckoutAkademiyaPage />,
  },
  {
    path: "/kurs/potvardjenie",
    element: <KursPotvardjeniePage />,
  },
  {
    path: "/kurs/ai-business-blueprint",
    element: <AiBusinessBlueprintFunnelPage />,
  },
  {
    path: "/kurs/perfektnoto-video",
    element: <PerfektnotoVideoFunnelPage />,
  },
  {
    path: "/kurs/marketing-basics",
    element: <MarketingBasicsFunnelPage />,
  },
  {
    path: "/blog/gorski-borovinki-nomer-edno-google",
    element: <GorskiBorovinkiNomerEdnoPage />,
  },
  {
    path: "/blog/marketing-za-ecommerce-plodove-tarnovo",
    element: <MarketingZaEcommercePlodovePage />,
  },
  {
    path: "/blog/ecommerce-sezonni-produkti-gorski-borovinki",
    element: <EcommerceSezonniProduktiPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
