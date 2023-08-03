import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectRute = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen items-center h-full">
        <img className="h-16 w-16" src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt=""/>
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