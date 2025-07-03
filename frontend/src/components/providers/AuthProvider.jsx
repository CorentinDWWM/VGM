import React, { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLoaderData } from "react-router-dom";
import { signOut } from "../../apis/auth.api";
// import defaultAvatar from "/default_avatar.jpg";

export default function AuthProvider({ children }) {
  const initialUser = useLoaderData();
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const defaultProfilPic = () => {
      if (user?.avatar === null) {
        setUser({
          ...user,
          avatar: "/default_avatar.jpg",
        });
      }
    };

    defaultProfilPic();
  }, [user]);

  const login = (credentials) => {
    setUser(credentials);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
