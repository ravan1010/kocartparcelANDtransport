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
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-8">
  <div className="w-full max-w-md rounded-[28px] border border-gray-100 bg-white p-6 text-center shadow-xl sm:p-8">

    {/* Icon / Loader */}
    <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">

      {!locationError && (
        <div className="absolute inset-0 animate-ping rounded-full bg-indigo-100" />
      )}

      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
        <span className="text-4xl">
          📍
        </span>
      </div>

    </div>

    {/* Title */}
    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
      Location Required
    </h2>

    {/* Message */}
    <p className="mt-3 text-sm leading-6 text-gray-500">
      {locationError ||
        "Getting your current location..."}
    </p>

    {/* Loading */}
    {!locationError && (
      <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4">

        <div className="flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600" />

          <p className="text-sm font-semibold text-indigo-700">
            Detecting your location...
          </p>
        </div>

        <p className="mt-2 text-xs text-indigo-500">
          Please wait while we get your GPS location.
        </p>

      </div>
    )}

    {/* Error */}
    {locationError && (
      <div className="mt-6">

        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-xs font-medium leading-5 text-red-600">
            Please enable location permission and make sure GPS is turned on.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="
            flex h-14 w-full
            items-center justify-center gap-2
            rounded-2xl
            bg-indigo-600
            text-sm font-extrabold text-white
            shadow-lg shadow-indigo-200
            transition-all duration-200
            hover:bg-indigo-700
            active:scale-[0.98]
          "
        >
          <span className="text-lg">
            ↻
          </span>

          <span>
            Try Again
          </span>
        </button>

      </div>
    )}

  </div>
</div>
    );
  }

  return <Outlet />;
};

export default Protected;