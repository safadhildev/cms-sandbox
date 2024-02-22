import { async } from "@firebase/util";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

export const UserContext = createContext([]);

const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  const signIn = async (data) => {
    try {
      setUser(data);
    } catch (err) {
      console.log("[ERROR] :: ", { err });
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.log("[ERROR] :: ", { err });
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const authListener = onAuthStateChanged(auth, (userData) => {
      try {
        setLoading(true);
        if (userData?.uid) {
          setUser({
            uid: userData.uid,
            displayName: userData?.displayName,
            email: userData.email,
          });
          setLoading(false);
        } else {
          navigate("/login", { replace: true });
          setLoading(false);
        }
      } catch (err) {
        console.log("[DEBUG] :: ", { err });
        navigate("/login", { replace: true });
        setLoading(false);
      }
    });

    return () => authListener();
  }, []);

  const value = {
    user,
    setUser,
    signOut,
    signIn,
    loading,
    setLoading,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
