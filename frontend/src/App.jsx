import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import MenuProvider from "./components/providers/MenuProvider";
import AuthProvider from "./components/providers/AuthProvider";
import UserProfilProvider from "./components/providers/UserProfilProvider";

function App() {
  return (
    <div className="min-h-screen font-inter flex flex-col justify-between bg-white dark:bg-gray-900 text-black dark:text-white">
      <AuthProvider>
        <UserProfilProvider>
          <MenuProvider>
            <Header />
            <Outlet />
            <Footer />
            <Toaster />
          </MenuProvider>
        </UserProfilProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
