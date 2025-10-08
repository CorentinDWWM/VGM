import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import { rootLoader } from "./loaders/rootLoader";
import UserNotConnected from "./components/ProtectedRoutes/UserNotConnected";
import UserConnected from "./components/ProtectedRoutes/UserConnected";
import LoadingPage from "./components/Loading/LoadingPage";

// Lazy load des composants lourds
const Accueil = lazy(() => import("./pages/Accueil/Accueil"));
const Login = lazy(() => import("./pages/forms/Login"));
const Register = lazy(() => import("./pages/forms/Register"));
const ForgotPassword = lazy(() =>
  import("./pages/forms/password/ForgotPassword")
);
const ResetPassword = lazy(() =>
  import("./pages/forms/password/ResetPassword")
);
const Profil = lazy(() => import("./pages/Users/Profil"));
const LibraryUser = lazy(() => import("./pages/Users/LibraryUser"));
const StatisticsUser = lazy(() => import("./pages/Users/StatisticsUser"));
const GamesPage = lazy(() => import("./pages/Games/GamesPage"));
const Decouvertes = lazy(() => import("./pages/Discovers/Decouvertes"));
const DiscoverNews = lazy(() => import("./pages/Discovers/DiscoverNews"));
const GenderDiscover = lazy(() => import("./pages/Discovers/GenderDiscover"));
const OneGame = lazy(() => import("./pages/OneGame/OneGame"));
const MentionsLegales = lazy(() => import("./pages/RGPD/MentionsLegales"));
const PolitiqueConfidentialite = lazy(() =>
  import("./pages/RGPD/PolitiqueConfidentialite")
);
const CookiePreferences = lazy(() => import("./pages/RGPD/CookiePreferences"));

// Wrapper pour les composants lazy
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<LoadingPage />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    loader: rootLoader,
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <LazyWrapper>
            <Accueil />
          </LazyWrapper>
        ),
      },
      {
        path: "/games",
        element: (
          <LazyWrapper>
            <GamesPage />
          </LazyWrapper>
        ),
      },
      {
        path: "/games/:id",
        element: (
          <LazyWrapper>
            <OneGame />
          </LazyWrapper>
        ),
      },
      {
        path: "/discover",
        children: [
          {
            index: true,
            element: (
              <LazyWrapper>
                <Decouvertes />
              </LazyWrapper>
            ),
          },
          {
            path: "/discover/news",
            element: (
              <LazyWrapper>
                <DiscoverNews />
              </LazyWrapper>
            ),
          },
          {
            path: "/discover/:id",
            element: (
              <LazyWrapper>
                <GenderDiscover />
              </LazyWrapper>
            ),
          },
        ],
      },
      {
        path: "/login",
        element: (
          <UserNotConnected>
            <LazyWrapper>
              <Login />
            </LazyWrapper>
          </UserNotConnected>
        ),
      },
      {
        path: "/register",
        element: (
          <UserNotConnected>
            <LazyWrapper>
              <Register />
            </LazyWrapper>
          </UserNotConnected>
        ),
      },
      {
        path: "/forgot",
        element: (
          <UserConnected>
            <LazyWrapper>
              <ForgotPassword />
            </LazyWrapper>
          </UserConnected>
        ),
      },
      {
        path: "/reset",
        element: (
          <UserConnected>
            <LazyWrapper>
              <ResetPassword />
            </LazyWrapper>
          </UserConnected>
        ),
      },
      {
        path: "/profil",
        children: [
          {
            index: true,
            element: (
              <UserConnected>
                <LazyWrapper>
                  <Profil />
                </LazyWrapper>
              </UserConnected>
            ),
          },
          {
            path: "/profil/library",
            element: (
              <UserConnected>
                <LazyWrapper>
                  <LibraryUser />
                </LazyWrapper>
              </UserConnected>
            ),
          },
          {
            path: "/profil/statistics",
            element: (
              <UserConnected>
                <LazyWrapper>
                  <StatisticsUser />
                </LazyWrapper>
              </UserConnected>
            ),
          },
        ],
      },
      {
        path: "/mentions-legales",
        element: (
          <LazyWrapper>
            <MentionsLegales />
          </LazyWrapper>
        ),
      },
      {
        path: "/politique-confidentialite",
        element: (
          <LazyWrapper>
            <PolitiqueConfidentialite />
          </LazyWrapper>
        ),
      },
      {
        path: "/preferences-cookies",
        element: (
          <LazyWrapper>
            <CookiePreferences />
          </LazyWrapper>
        ),
      },
    ],
  },
]);
