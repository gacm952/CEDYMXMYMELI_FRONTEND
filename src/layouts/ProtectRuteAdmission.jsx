import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { useEffect } from "react";

const ProtectRuteAdmission = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsAuthReady(true);
    }
  }, [loading]);

  if (loading || !isAuthReady) {
    return (
      <div className="flex justify-center min-h-screen items-center h-full">
        <img className="h-16 w-16" src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt=""/>
      </div>
    );
  }

  return (
    <>
      {auth.role === "Admission" ? (
        <div className="w-full hidden sm:block min-w-600">
          <div className="flex">
            <Header />
          </div>
          <main className="">
            <Outlet />
          </main>
          <div className="flex">
            <Footer />
          </div>
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default ProtectRuteAdmission;