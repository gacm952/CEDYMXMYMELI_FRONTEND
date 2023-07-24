import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectRute = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <>
      {auth?.role === "User" && <Outlet />}
      {!auth && navigate('/')}
    </>
  );
};

export default ProtectRute;