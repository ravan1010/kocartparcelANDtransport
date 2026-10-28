
import { Navigate, Outlet } from "react-router-dom";
import ADMINMainauth from "./authmiddleware";

const Protected = () => {
  const { admin, checking } = ADMINMainauth();

  if (checking) {
    return <div>Checking admin authentication...</div>;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default Protected;
