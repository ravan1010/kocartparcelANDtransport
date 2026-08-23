import { Navigate, Outlet } from "react-router-dom";
import useDeliveryBoyAuth from "./authmiddleware";
import useBikeParcelDriverLocation from "../pages/useBikeParcelDriverLocation.js";

const Protected = () => {
  const { isAdmin, checking } = useDeliveryBoyAuth();

  const {
    locationReady,
    locationError,
  } = useBikeParcelDriverLocation({
    enabled: !checking && isAdmin,
  });

  if (checking) {
    return (
      <div>
        Checking delivery boy access...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Don't show any protected page until GPS is ready
  if (!locationReady) {
    return (
      <div>
        <h2>Location Required</h2>

        <p>
          {locationError ||
            "Getting your current location..."}
        </p>

        {!locationError && (
          <p>
            Please wait while we get your GPS location.
          </p>
        )}

        {locationError && (
          <button
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return <Outlet />;
};

export default Protected;