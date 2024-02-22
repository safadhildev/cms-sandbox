import React, { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../components";

import DashboardLayout from "../components/Layouts/DashboardLayout";
import UserProvider, { UserContext } from "../context/userContext";

const Root = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, setLoading } = useContext(UserContext);

  useEffect(() => {
    const onLocationChange = async () => {
      if (user) {
        setLoading(false);
        if (location.pathname === "/") {
          return navigate("/laman-utama", { replace: true });
        }
      }
    };

    onLocationChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(location)]);

  return (
    <UserProvider>
      {loading ? (
        <LoadingOverlay />
      ) : (
        <DashboardLayout>{<Outlet />}</DashboardLayout>
      )}
    </UserProvider>
  );
};

export default Root;
