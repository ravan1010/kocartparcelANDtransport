import { useEffect, useState } from "react";

const DEFAULT_LOCATION = {
  latitude: 12.2958,
  longitude: 76.6394,  
};

const useMapLocation = (initialLocation = null) => {
  const [location, setLocation] = useState(
    initialLocation || DEFAULT_LOCATION
  );

  const [address, setAddress] = useState("");


  // --------------------------------------------------
  // Sync when parent sends a new initialLocation
  // --------------------------------------------------

  useEffect(() => {
    if (!initialLocation) return;

    const latitude = Number(
      initialLocation.latitude
    );

    const longitude = Number(
      initialLocation.longitude
    );

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    setLocation({
      latitude,
      longitude,
    });
  }, [
    initialLocation?.latitude,
    initialLocation?.longitude,
  ]);

  // --------------------------------------------------
  // Update location when map is moved
  // --------------------------------------------------

  const updateLocation = (
    latitude,
    longitude
  ) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return;
    }

    setLocation({
      latitude: lat,
      longitude: lng,
    });
  };

  // --------------------------------------------------
  // Reverse geocode
  // --------------------------------------------------

  const reverseGeocode = async (
    latitude,
    longitude
  ) => {
    try {
      const apiKey =
        import.meta.env.VITE_GEOAPIFY_KEY;

      if (!apiKey) {
        console.error(
          "VITE_GEOAPIFY_KEY is missing"
        );
        return;
      }

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`
      );

      const data = await response.json();

      const result = data.features?.[0];

      if (result) {
        setAddress(
          result.properties?.formatted || ""
        );
      }
    } catch (error) {
      console.error(
        "Reverse geocoding error:",
        error
      );
    }
  };

  return {
    location,
    address,
    updateLocation,
    reverseGeocode,
  };
};

export default useMapLocation;