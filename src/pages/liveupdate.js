import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../api";

const UPDATE_INTERVAL = 40000; // 40 seconds

const useAutoLiveLocation = () => {
  const [location, setLocation] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [updating, setUpdating] = useState(false);

  const intervalRef = useRef(null);

  // =====================================================
  // GET LOCATION + UPDATE SERVER
  // =====================================================

  const updateLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationAllowed(false);
      setShowLocationPopup(true);
      return;
    }

    setUpdating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setLocation({
            latitude,
            longitude,
          });

          setLocationAllowed(true);
          setShowLocationPopup(false);

          // =============================================
          // UPDATE BACKEND
          // =============================================

          await api.put(
            "/api/update/location",
            {
              latitude,
              longitude,
            },
            {
              withCredentials: true,
            }
          );

          console.log(
            "Auto location updated:",
            latitude,
            longitude
          );

        } catch (error) {
          console.error(
            "Update auto location error:",
            error
          );
        } finally {
          setUpdating(false);
        }
      },

      (error) => {
        console.error(
          "Auto location error:",
          error
        );

        setLocationAllowed(false);
        setShowLocationPopup(true);
        setUpdating(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  }, []);

  // =====================================================
  // START LOCATION TRACKING
  // =====================================================

  useEffect(() => {
    // First update immediately
    updateLocation();

    // Then every 40 seconds
    intervalRef.current = setInterval(() => {
      updateLocation();
    }, UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateLocation]);

  // =====================================================
  // ASK USER TO ALLOW LOCATION
  // =====================================================

  const requestLocation = () => {
    setShowLocationPopup(false);

    updateLocation();
  };

  return {
    location,
    locationAllowed,
    showLocationPopup,
    updating,
    requestLocation,
  };
};

export default useAutoLiveLocation;