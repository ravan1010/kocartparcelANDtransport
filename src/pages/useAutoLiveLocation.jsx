import useAutoLiveLocation from "./liveupdate";

const AutoHome = () => {
  const {
    location,
    locationAllowed,
    showLocationPopup,
    updating,
    requestLocation,
  } = useAutoLiveLocation();

  return (
    <div>

      {/* Your page */}

      {locationAllowed && location && (
        <div className="text-sm text-green-600">
          📍 Location is active
        </div>
      )}

      {updating && (
        <div className="text-xs text-gray-500">
          Updating location...
        </div>
      )}

      {/* LOCATION POPUP */}

      {showLocationPopup && (
        <div className="
          fixed
          inset-0
          z-[9999]
          bg-black/50
          flex
          items-center
          justify-center
          p-5
        ">
          <div className="
            bg-white
            rounded-3xl
            p-6
            w-full
            max-w-sm
            shadow-2xl
            text-center
          ">

            <div className="text-5xl mb-4">
              📍
            </div>

            <h2 className="
              text-xl
              font-bold
              text-gray-900
            ">
              Turn on your location
            </h2>

            <p className="
              text-sm
              text-gray-500
              mt-2
              leading-6
            ">
              Location access is required to receive
              bookings and share your live location
              with customers.
            </p>

            <button
              onClick={requestLocation}
              className="
                w-full
                mt-5
                bg-indigo-600
                text-white
                py-3
                rounded-xl
                font-semibold
                hover:bg-indigo-700
              "
            >
              Allow Location
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default AutoHome;