import { Navigate, Outlet } from "react-router-dom";
import useDeliveryBoyAuth from "./authmiddleware"; 

const Protected = () => {
  const { isAdmin, checking } = useDeliveryBoyAuth();

  if (checking) return <div>Checking delivery boy access...</div>;

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Protected;  
 