import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import Accueil from "./pages/Accueil/Accueil";
import Login from "./pages/forms/Login";
import Register from "./pages/forms/Register";
import ForgotPassword from "./pages/forms/password/ForgotPassword";
import ResetPassword from "./pages/forms/password/ResetPassword";
import { rootLoader } from "./loaders/rootLoader";
import UserNotConnected from "./components/ProtectedRoutes/UserNotConnected";
import UserConnected from "./components/ProtectedRoutes/UserConnected";
import Profil from "./pages/Users/Profil";
import LibraryUser from "./pages/Users/LibraryUser";
import StatisticsUser from "./pages/Users/StatisticsUser";
import GamesPage from "./pages/Games/GamesPage";
import Decouvertes from "./pages/Discovers/Decouvertes";
import GenderDiscover from "./pages/Discovers/GenderDiscover";
import DiscoverNews from "./pages/Discovers/DiscoverNews";
import OneGame from "./pages/OneGame/OneGame";
import MentionsLegales from "./pages/RGPD/MentionsLegales";
import PolitiqueConfidentialite from "./pages/RGPD/PolitiqueConfidentialite";
import CookiePreferences from "./pages/RGPD/CookiePreferences";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    loader: rootLoader,
    element: <App />,
    children: [
      {
        path: "/",
        element: <Accueil />,
      },
      {
        path: "/games",
        element: <GamesPage />,
      },
      {
        path: "/games/:id",
        element: <OneGame />,
      },
      {
        path: "/discover",
        children: [
          {
            index: true,
            element: <Decouvertes />,
          },
          {
            path: "/discover/news",
            element: <DiscoverNews />,
          },
          {
            path: "/discover/:id",
            element: <GenderDiscover />,
          },
        ],
      },
      {
        path: "/login",
        element: (
          <UserNotConnected>
            <Login />
          </UserNotConnected>
        ),
      },
      {
        path: "/register",
        element: (
          <UserNotConnected>
            <Register />
          </UserNotConnected>
        ),
      },
      {
        path: "/forgot",
        element: (
          <UserConnected>
            <ForgotPassword />
          </UserConnected>
        ),
      },
      {
        path: "/reset",
        element: (
          <UserConnected>
            <ResetPassword />
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
                <Profil />
              </UserConnected>
            ),
          },
          {
            path: "/profil/library",
            element: (
              <UserConnected>
                <LibraryUser />
              </UserConnected>
            ),
          },
          {
            path: "/profil/statistics",
            element: (
              <UserConnected>
                <StatisticsUser />
              </UserConnected>
            ),
          },
        ],
      },
      {
        path: "/mentions-legales",
        element: <MentionsLegales />,
      },
      {
        path: "/politique-confidentialite",
        element: <PolitiqueConfidentialite />,
      },
      {
        path: "/preferences-cookies",
        element: <CookiePreferences />,
      },
    ],
  },
]);
