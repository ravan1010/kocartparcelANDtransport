import { useEffect, useState } from "react";
import { updateBikeParcelDriverLocation } from "./liveupdate.js";

const useBikeParcelDriverLocation = ({
  enabled = true,
  intervalTime = 30 * 1000,
} = {}) => {
  const [locationReady, setLocationReady] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setLocationReady(false);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationReady(false);
      return;
    }

    let isMounted = true;

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!isMounted) return;

          try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            await updateBikeParcelDriverLocation(
              latitude,
              longitude
            );

            if (isMounted) {
              setLocationReady(true);
              setLocationError(null);
            }

            console.log("Location updated:", {
              latitude,
              longitude,
            });
          } catch (error) {
            console.error(
              "Location update failed:",
              error.response?.data || error.message
            );

            // GPS exists, so don't block the app
            // if only the API request failed.
            if (isMounted) {
              setLocationReady(true);
            }
          }
        },
        (error) => {
          if (!isMounted) return;

          console.error("Location error:", error);

          setLocationReady(false);

          if (error.code === 1) {
            setLocationError(
              "Please turn on location permission to continue."
            );
          } else if (error.code === 2) {
            setLocationError(
              "Unable to get your location. Please check GPS."
            );
          } else if (error.code === 3) {
            setLocationError(
              "Location request timed out. Please try again."
            );
          } else {
            setLocationError(
              "Unable to get your location."
            );
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    // Get location immediately
    updateLocation();

    // Continue every 30 seconds
    const interval = setInterval(
      updateLocation,
      intervalTime
    );

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [enabled, intervalTime]);

  return {
    locationReady,
    locationError,
  };
};

export default useBikeParcelDriverLocation;