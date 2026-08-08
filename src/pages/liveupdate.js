// api/bikeParcel.js

import api from "../../api";

export const updateBikeParcelDriverLocation = async (
  latitude,
  longitude
) => {
  const response = await api.put(
    "/api/update/location",
    {
      latitude,
      longitude,
    }
  );

  return response.data;
};