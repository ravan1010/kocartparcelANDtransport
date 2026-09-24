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
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Sync when parent sends a new initialLocation
  // --------------------------------------------------
  useEffect(() => {
    if (!initialLocation) return;

    const latitude = Number(initialLocation.latitude);
    const longitude = Number(initialLocation.longitude);

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
  const updateLocation = (latitude, longitude) => {
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

    // Clear old address because coordinates changed
    setAddress("");
    setError("");
  };

  // --------------------------------------------------
  // Reverse geocode
  // --------------------------------------------------
  const reverseGeocode = async (
    latitude = location.latitude,
    longitude = location.longitude
  ) => {
    try {
      setLoadingAddress(true);
      setError("");

      const lat = Number(latitude);
      const lng = Number(longitude);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        setError("Invalid location");
        return "";
      }

      const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;

      if (!apiKey) {
        const message = "VITE_GEOAPIFY_KEY is missing";
        console.error(message);
        setError(message);
        return "";
      }

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(
          `Geoapify request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const result = data.features?.[0];

      const formattedAddress =
        result?.properties?.formatted || "";

      setAddress(formattedAddress);

      return formattedAddress;
    } catch (error) {
      console.error(
        "Reverse geocoding error:",
        error
      );

      setError(
        error?.message ||
          "Unable to get address"
      );

      return "";
    } finally {
      setLoadingAddress(false);
    }
  };

  return {
    location,
    address,
    loadingAddress,
    error,
    updateLocation,
    reverseGeocode,
  };
};

export default useMapLocation;

