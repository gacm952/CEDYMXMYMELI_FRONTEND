import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProtectRuteAdmission = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return 'Cargando...';
  }

  return (
    <>
      {auth.role === "Admission" ?  (
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