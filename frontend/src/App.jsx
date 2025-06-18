import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import MenuProvider from "./components/providers/MenuProvider";
import AuthProvider from "./components/providers/AuthProvider";

function App() {
  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-gray-900 text-black dark:text-white">
      <AuthProvider>
        <MenuProvider>
          <Header />
          <Outlet />
          <Footer />
          <Toaster />
        </MenuProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
