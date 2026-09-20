import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/feature/ProtectedRoute";
import AdminRoute from "../components/feature/AdminRoute";
import CourseRedirect from "../components/feature/CourseRedirect";
import { lazyWithReload } from './lazyWithReload';

const ResetPasswordPage = lazyWithReload(() => import('../pages/reset-password/page'));

// Eager — homepage must load immediately for LCP (no lazy chunk)
import Home from "../pages/home/page";

// Lazy — secondary pages below the fold or deeper routes
const KursPage = lazyWithReload(() => import("../pages/kurs/page"));
const Privacy = lazyWithReload(() => import("../pages/privacy/page"));
const Terms = lazyWithReload(() => import("../pages/terms/page"));
const Cookies = lazyWithReload(() => import("../pages/cookies/page"));
const Withdrawal = lazyWithReload(() => import("../pages/withdrawal/page"));
const LoginPage = lazyWithReload(() => import("../pages/login/page"));
const RegisterPage = lazyWithReload(() => import("../pages/register/page"));
const ForgotPasswordPage = lazyWithReload(() => import("../pages/forgot-password/page"));
const EkipPage = lazyWithReload(() => import("../pages/ekip/page"));
const KontaktPage = lazyWithReload(() => import("../pages/kontakt/page"));
const ReklamaVelikoTarnovoPage = lazyWithReload(() => import("../pages/reklama-veliko-tarnovo/page"));
const VideoProdukciyaVelikoTarnovoPage = lazyWithReload(() => import("../pages/video-produkciya-veliko-tarnovo/page"));
const SEOVelikoTarnovoPage = lazyWithReload(() => import("../pages/seo-veliko-tarnovo/page"));
const NPOVideoPage = lazyWithReload(() => import("../pages/npo-video/page"));
const ImashNujnotoPage = lazyWithReload(() => import("../pages/imash-nujnoto/page"));
const BlogReklamaVTPage = lazyWithReload(() => import("../pages/blog-reklama-vt/page"));
const BlogSEOVTPage = lazyWithReload(() => import("../pages/blog-seo-vt/page"));
const AdminNoviniPage = lazyWithReload(() => import("../pages/admin-novini/page"));
const NoviniPage = lazyWithReload(() => import("../pages/novini/page"));
const AdminLoginPage = lazyWithReload(() => import("../pages/admin-login/page"));
const IzrabotkaNaSaitPage = lazyWithReload(() => import("../pages/uslugi/izrabotka-na-sait/page"));
const SeoGeoPage = lazyWithReload(() => import("../pages/uslugi/seo-geo/page"));
const ReklamniKampaniiPage = lazyWithReload(() => import("../pages/uslugi/reklamni-kampanii/page"));
const VideoProdukciyaUslugiPage = lazyWithReload(() => import("../pages/uslugi/video-produkciya/page"));
const UslugiPage = lazyWithReload(() => import("../pages/uslugi/page"));
const DigitalenMarketingVelikoTarnovoPage = lazyWithReload(() => import("../pages/digitalen-marketing-veliko-tarnovo/page"));
const BlogPage = lazyWithReload(() => import("../pages/blog/page"));
const IzrabotkaNaSaitVTPage = lazyWithReload(() => import("../pages/blog/izrabotka-na-sait-vt/page"));
const GeoAITarnovoPage = lazyWithReload(() => import("../pages/blog/geo-ai-tarnovo/page"));
const GoogleBusinessVTPage = lazyWithReload(() => import("../pages/blog/google-business-vt/page"));
const MetaReklamiTarnovoPage = lazyWithReload(() => import("../pages/blog/meta-reklami-tarnovo/page"));
const SeoOptimizaciyaTarnovo2026Page = lazyWithReload(() => import("../pages/blog/seo-optimizaciya-tarnovo-2026/page"));
const VideoNPOTarnovoPage = lazyWithReload(() => import("../pages/blog/video-npo-tarnovo/page"));
const IzrabotkaNaSaitTarnovoPage = lazyWithReload(() => import("../pages/blog/izrabotka-na-sait-tarnovo/page"));
const BezplatenSeoNomerEdnoPage = lazyWithReload(() => import("../pages/blog/bezplaten-seo-nomer-edno-google/page"));
const TikTokYouTubeReklamaTarnovoPage = lazyWithReload(() => import("../pages/blog/tiktok-youtube-reklama-tarnovo/page"));
const VideoMarketingBiznesTarnovoPage = lazyWithReload(() => import("../pages/blog/video-marketing-biznes-tarnovo/page"));
const KakDaIzbereteAgenciyaTarnovoPage = lazyWithReload(() => import("../pages/blog/kak-da-izberete-agenciya-tarnovo/page"));
const EcommerceTarnovo2026Page = lazyWithReload(() => import("../pages/blog/ecommerce-tarnovo-2026/page"));
const VladimirAtanasovPage = lazyWithReload(() => import("../pages/vladimir-atanasov/page"));
const ZaTavoraPage = lazyWithReload(() => import("../pages/za-tavora/page"));
const SeoRestorantiTarnovoPage = lazyWithReload(() => import("../pages/blog/seo-restoranti-veliko-tarnovo/page"));
const KolkoStruvaDigitalenMarketingTarnovoPage = lazyWithReload(() => import("../pages/blog/kolko-struva-digitalen-marketing-tarnovo/page"));
const AiTursachkiBiznesTarnovoPage = lazyWithReload(() => import("../pages/blog/ai-tursachki-biznes-tarnovo/page"));
const GoogleBusinessVsSaitTarnovoPage = lazyWithReload(() => import("../pages/blog/google-business-vs-sait-tarnovo/page"));
const LokalenBiznesUstoichivoOnlinePrisastviePage = lazyWithReload(() => import("../pages/blog/lokalen-biznes-ustoichivo-online-prisastvie/page"));
const MarketingNablyudeniyaMasazhniUslugiPage = lazyWithReload(() => import("../pages/blog/marketing-nablyudeniya-masazhni-uslugi/page"));
const LokalenVsMasovMarketingPage = lazyWithReload(() => import("../pages/blog/lokalen-vs-masov-marketing/page"));
const PhotoTarnovoStreetPortraitNomerEdnoPage = lazyWithReload(() => import("../pages/blog/photo-tarnovo-street-portrait-nomer-edno/page"));
const MarketingZaFotografiTarnovoPage = lazyWithReload(() => import("../pages/blog/marketing-za-fotografi-tarnovo/page"));
const TuristicheskiBiznesOptimiziranSaitPage = lazyWithReload(() => import("../pages/blog/turisticheski-biznes-optimiziran-sait-tarnovo/page"));
const AiBusinessBlueprintPage = lazyWithReload(() => import("../pages/blog/ai-business-blueprint-putyat-na-koprinata/page"));
const PerfektnotoVideoPage = lazyWithReload(() => import("../pages/blog/perfektnoto-video-biznes-sistema/page"));
const MarketingBasicsPage = lazyWithReload(() => import("../pages/blog/marketing-basics-palna-sistema/page"));
const DigitalniProduktiProverkiPage = lazyWithReload(() => import("../pages/digitalni-produkti/proverki/page"));
const DigitalniProduktiPotvardjeniePage = lazyWithReload(() => import("../pages/digitalni-produkti/proverki/potvardjenie/page"));
const DigitalniProduktiDostapPage = lazyWithReload(() => import("../pages/digitalni-produkti/proverki/dostap/page"));
const DigitalniAgenciiVelikoTarnovoPage = lazyWithReload(() => import("../pages/digitalni-agencii-veliko-tarnovo/page"));

const GorskiBorovinkiNomerEdnoPage = lazyWithReload(() => import("../pages/blog/gorski-borovinki-nomer-edno-google/page"));
const MarketingZaEcommercePlodovePage = lazyWithReload(() => import("../pages/blog/marketing-za-ecommerce-plodove-tarnovo/page"));
const EcommerceSezonniProduktiPage = lazyWithReload(() => import("../pages/blog/ecommerce-sezonni-produkti-gorski-borovinki/page"));

const ModulePage = lazyWithReload(() => import("../pages/module/page"));
const DashboardPage = lazyWithReload(() => import("../pages/dashboard/page"));
const CheckoutAkademiyaPage = lazyWithReload(() => import("../pages/checkout-akademiya/page"));
const KursPotvardjeniePage = lazyWithReload(() => import("../pages/kurs-potvardjenie/page"));

// SEO+GEO funnel landing pages
const AiBusinessBlueprintFunnelPage = lazyWithReload(() => import("../pages/kurs/ai-business-blueprint/page"));
const PerfektnotoVideoFunnelPage = lazyWithReload(() => import("../pages/kurs/perfektnoto-video/page"));
const MarketingBasicsFunnelPage = lazyWithReload(() => import("../pages/kurs/marketing-basics/page"));

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
