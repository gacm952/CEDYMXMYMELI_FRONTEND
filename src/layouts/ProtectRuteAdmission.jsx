import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { useEffect } from "react";
import { useMediaQuery } from '@mui/material';


const ProtectRuteAdmission = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');

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

    const mobileMessage = (
      <div className=" min-h-full flex justify-center items-center text-center p-4 bg-red-500 text-white">
        Esta vista solo está disponible en PC. Por favor, accede desde una computadora.
      </div>
    );

  return (
    <>
    {auth.role === "Admission" ? (
      <div className="w-full sm:block min-w-600">

        {isMobile && mobileMessage}

          <div className="hidden sm:block fixed top-0 left-0 w-full z-50">
          <Header />
        </div>
        <main className="hidden sm:block">
        
          <Outlet />
        </main>
        <div className="hidden sm:block fixed bottom-0 left-0 w-full z-50">
          <Footer />
        </div>
    
      
      </div>
    ) : (
      navigate("/Login")
    )}
    </>
  );
};

export default ProtectRuteAdmission;