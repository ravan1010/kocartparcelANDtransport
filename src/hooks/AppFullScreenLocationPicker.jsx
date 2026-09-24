import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import useMapLocation from "./useMapLocation";
import MapCenterUpdater from "./MapCenterUpdater";

import { Navigation } from "lucide-react";

/*
|--------------------------------------------------------------------------
| RECENTER MAP
|--------------------------------------------------------------------------
*/

const RecenterMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    const lat = Number(location.latitude);
    const lng = Number(location.longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return;
    }

    const currentCenter = map.getCenter();

    const distance = map.distance(
      currentCenter,
      [lat, lng]
    );

    if (distance > 20) {
      map.setView(
        [lat, lng],
        map.getZoom(),
        {
          animate: true,
        }
      );
    }
  }, [
    location?.latitude,
    location?.longitude,
    map,
  ]);

  return null;
};

/*
|--------------------------------------------------------------------------
| MAIN LOCATION PICKER
|--------------------------------------------------------------------------
*/

const AppFullScreenLocationPicker = ({
  type = "pickup",
  initialLocation,
  onConfirm,
  onCancel,
}) => {

  /*
  |--------------------------------------------------------------------------
  | URL PARAMETERS
  |--------------------------------------------------------------------------
  */

  const params = new URLSearchParams(
    window.location.search
  );

  const urlType = params.get("type");

  const urlLatitude =
    Number(params.get("latitude"));

  const urlLongitude =
    Number(params.get("longitude"));

  /*
  |--------------------------------------------------------------------------
  | LOCATION TYPE
  |--------------------------------------------------------------------------
  */

  const locationType =
    urlType || type || "pickup";

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOCATION
  |--------------------------------------------------------------------------
  */

  const urlLocation =
    Number.isFinite(urlLatitude) &&
      Number.isFinite(urlLongitude)
      ? {
        latitude: urlLatitude,
        longitude: urlLongitude,
      }
      : initialLocation;

  /*
  |--------------------------------------------------------------------------
  | MAP LOCATION
  |--------------------------------------------------------------------------
  */

  const {
    location,
    address,
    updateLocation,
    reverseGeocode,
  } = useMapLocation(urlLocation);

  /*
  |--------------------------------------------------------------------------
  | SEARCH STATE
  |--------------------------------------------------------------------------
  */

  const [searchText, setSearchText] =
    useState("");

  const [searchResults, setSearchResults] =
    useState([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | SERVICE AVAILABILITY
  |--------------------------------------------------------------------------
  */

  const [
    serviceAvailability,
    setServiceAvailability,
  ] = useState(null);

  const [
    availabilityLoading,
    setAvailabilityLoading,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CHECK SERVICE AVAILABILITY
  |--------------------------------------------------------------------------
  |
  | Whenever map location changes:
  |
  | frontend
  |    ↓
  | latitude + longitude
  |    ↓
  | backend
  |    ↓
  | check JSON service locations
  |    ↓
  | <= 5km = available
  | > 5km = coming soon
  |
  */

  useEffect(() => {
    // Availability check only for:
    // user + pickup
    if (
      locationType !== "user" &&
      locationType !== "pickup"
    ) {
      setServiceAvailability(null);
      setAvailabilityLoading(false);
      return;
    }

    if (!location) {
      setServiceAvailability(null);
      return;
    }

    const latitude =
      Number(location.latitude);

    const longitude =
      Number(location.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      setServiceAvailability(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setAvailabilityLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL
          }/api/check`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              latitude,
              longitude,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Availability API failed"
          );
        }

        const data =
          await response.json();

        console.log(
          "Service availability:",
          data
        );

        setServiceAvailability(data);

      } catch (error) {
        console.error(
          "Service availability error:",
          error
        );

        setServiceAvailability({
          success: false,
          available: false,
          message:
            "Unable to check service availability",
        });

      } finally {
        setAvailabilityLoading(false);
      }
    }, 700);

    return () => {
      clearTimeout(timer);
    };

  }, [
    locationType,
    location?.latitude,
    location?.longitude,
  ]);

  /*
  |--------------------------------------------------------------------------
  | SEARCH LOCATION
  |--------------------------------------------------------------------------
  */

  const searchLocation = async (text) => {

    if (
      !text.trim() ||
      text.trim().length < 3
    ) {
      setSearchResults([]);
      return;
    }

    try {

      setSearchLoading(true);

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?` +
        `text=${encodeURIComponent(text)}` +
        `&limit=5` +
        `&filter=countrycode:in` +
        `&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY
        }`
      );

      const data =
        await response.json();

      setSearchResults(
        data.features || []
      );

    } catch (error) {

      console.error(
        "Location search error:",
        error
      );

      setSearchResults([]);

    } finally {

      setSearchLoading(false);

    }
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH DEBOUNCE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const timer = setTimeout(() => {

      if (
        searchText.trim().length >= 3
      ) {
        searchLocation(searchText);
      } else {
        setSearchResults([]);
      }

    }, 400);

    return () =>
      clearTimeout(timer);

  }, [searchText]);

  /*
  |--------------------------------------------------------------------------
  | SELECT SEARCH RESULT
  |--------------------------------------------------------------------------
  */

  const handleSearchSelect = (
    feature
  ) => {

    if (
      !feature ||
      !feature.geometry ||
      !feature.geometry.coordinates
    ) {
      return;
    }

    const [
      longitude,
      latitude,
    ] = feature.geometry.coordinates;

    const selectedAddress =
      feature.properties?.formatted ||
      "";

    console.log(
      "📍 Search selected:",
      latitude,
      longitude,
      selectedAddress
    );

    /*
    |--------------------------------------------------------------------------
    | UPDATE MAP
    |--------------------------------------------------------------------------
    */

    updateLocation(
      Number(latitude),
      Number(longitude)
    );

    /*
    |--------------------------------------------------------------------------
    | SHOW SELECTED ADDRESS
    |--------------------------------------------------------------------------
    */

    setSearchText(
      ""
    );

    /*
    |--------------------------------------------------------------------------
    | CLOSE RESULTS
    |--------------------------------------------------------------------------
    */

    setSearchResults([]);
  };

  /*
  |--------------------------------------------------------------------------
  | REVERSE GEOCODE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!location) return;

    const lat =
      Number(location.latitude);

    const lng =
      Number(location.longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return;
    }

    reverseGeocode(
      lat,
      lng
    );

  }, [
    location?.latitude,
    location?.longitude,
  ]);

  /*
  |--------------------------------------------------------------------------
  | MAP LOCATION CHANGED
  |--------------------------------------------------------------------------
  */

  const handleLocationChange = (
    latitude,
    longitude
  ) => {

    updateLocation(
      latitude,
      longitude
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SEND MESSAGE TO REACT NATIVE
  |--------------------------------------------------------------------------
  */

  const sendToReactNative = (
    data
  ) => {

    if (
      window.ReactNativeWebView
    ) {

      window.ReactNativeWebView.postMessage(
        JSON.stringify(data)
      );

      return true;
    }

    return false;
  };

  /*
  |--------------------------------------------------------------------------
  | CANCEL
  |--------------------------------------------------------------------------
  */

  const handleCancel = () => {

    const sent =
      sendToReactNative({
        type: "LOCATION_CANCEL",
      });

    if (
      !sent &&
      onCancel
    ) {
      onCancel();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CONFIRM
  |--------------------------------------------------------------------------
  */

  const handleConfirm = () => {

    // --------------------------------
    // LOCATION REQUIRED
    // --------------------------------

    if (!location) {
      alert(
        "Please select a location"
      );

      return;
    }

    // --------------------------------
    // Availability check ONLY for
    // user and pickup
    // --------------------------------

    if (
      locationType === "user" ||
      locationType === "pickup"
    ) {

      if (availabilityLoading) {
        alert(
          "Checking service availability. Please wait."
        );

        return;
      }

      if (
        !serviceAvailability?.available
      ) {
        alert(
          "Service is not available in this location yet. Coming soon!"
        );

        return;
      }
    }

    // --------------------------------
    // LAT LNG
    // --------------------------------

    const latitude =
      Number(location.latitude);

    const longitude =
      Number(location.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      alert("Invalid location");

      return;
    }

    // --------------------------------
    // RESULT
    // --------------------------------

    const result = {
      type: "LOCATION_SELECTED",

      locationType,

      latitude,

      longitude,

      address: address || "",

      // Only true for user/pickup
      serviceAvailable:
        locationType === "user" ||
          locationType === "pickup"
          ? true
          : null,

      serviceArea:
        locationType === "user" ||
          locationType === "pickup"
          ? serviceAvailability?.serviceArea ||
          null
          : null,
    };

    console.log(
      "📍 Final location:",
      result
    );

    // --------------------------------
    // REACT NATIVE
    // --------------------------------

    const sent =
      sendToReactNative(result);

    // --------------------------------
    // NORMAL REACT
    // --------------------------------

    if (!sent && onConfirm) {
      onConfirm(result);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING MAP
  |--------------------------------------------------------------------------
  */

  if (!location) {

    return (
      <div
        className="
          fixed
          inset-0
          bg-white
          flex
          items-center
          justify-center
          z-[9999]
        "
      >

        <div className="text-center">

          <div
            className="
              w-10
              h-10
              border-4
              border-gray-200
              border-t-indigo-600
              rounded-full
              animate-spin
              mx-auto
              mb-3
            "
          />

          <p className="text-gray-500">
            Loading map...
          </p>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN UI
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-white
      "
    >

      {/* ==========================================================
          MAP
      ========================================================== */}

      <MapContainer
        center={[
          Number(location.latitude),
          Number(location.longitude),
        ]}
        zoom={15}
        scrollWheelZoom={true}
        zoomControl={true}
        doubleClickZoom={true}
        touchZoom={true}
        className="w-full h-full"
      >

        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_KEY
            }`}
          attribution="© OpenStreetMap contributors"
        />

        <MapCenterUpdater
          onLocationChange={
            handleLocationChange
          }
        />

        <RecenterMap
          location={location}
        />

      </MapContainer>


      {/* ==========================================================
          TOP SEARCH
      ========================================================== */}

      <div
        className="
          absolute
          top-0
          left-0
          right-0
          z-[1000]
          p-4
        "
      >

        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-4
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <button
              type="button"
              onClick={handleCancel}
              className="
                w-10
                h-10
                rounded-full
                bg-gray-100
                flex
                items-center
                justify-center
                text-xl
                hover:bg-gray-200
                active:scale-95
                flex-shrink-0
              "
            >
              ←
            </button>

            <div>

              <h2
                className="
                  font-bold
                  text-gray-900
                "
              >
                {locationType === "user"
                  ? "Location"
                  : locationType === "pickup"
                    ? "Pickup"
                    : "Drop"}
              </h2>

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Search or move the map
              </p>

            </div>

          </div>


          {/* ======================================================
              SEARCH INPUT
          ====================================================== */}

          <div
            className="relative mt-4"
          >

            <div
              className="
                flex
                items-center
                gap-2
                border
                border-gray-200
                rounded-xl
                px-3
                py-3
                bg-gray-50
                focus-within:border-indigo-500
                focus-within:bg-white
              "
            >

              <span className="text-lg">
                🔍
              </span>

              <input
                type="text"
                value={searchText}
                onChange={(e) =>
                  setSearchText(
                    e.target.value
                  )
                }
                placeholder="Search location..."
                className="
                  flex-1
                  outline-none
                  bg-transparent
                  text-sm
                  text-gray-900
                "
              />

              {searchLoading && (

                <div
                  className="
                    w-4
                    h-4
                    border-2
                    border-gray-300
                    border-t-indigo-600
                    rounded-full
                    animate-spin
                  "
                />

              )}

            </div>


            {/* ==================================================
                SEARCH RESULTS
            ================================================== */}

            {searchResults.length > 0 && (

              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-full
                  mt-2
                  bg-white
                  rounded-xl
                  shadow-2xl
                  border
                  border-gray-100
                  overflow-hidden
                  z-[2000]
                  max-h-72
                  overflow-y-auto
                "
              >

                {searchResults.map(
                  (
                    feature,
                    index
                  ) => {

                    const properties =
                      feature.properties ||
                      {};

                    return (

                      <button
                        key={
                          properties.place_id ||
                          index
                        }
                        type="button"
                        onClick={() =>
                          handleSearchSelect(
                            feature
                          )
                        }
                        className="
                          w-full
                          text-left
                          px-4
                          py-3
                          hover:bg-gray-50
                          active:bg-gray-100
                          border-b
                          last:border-b-0
                        "
                      >

                        <div
                          className="
                            flex
                            gap-3
                          "
                        >

                          <span className="text-lg">
                            📍
                          </span>

                          <div
                            className="flex-1"
                          >

                            <p
                              className="
                                text-sm
                                font-semibold
                                text-gray-900
                              "
                            >
                              {properties.name ||
                                properties.street ||
                                "Location"}
                            </p>

                            <p
                              className="
                                text-xs
                                text-gray-500
                                mt-1
                                line-clamp-2
                              "
                            >
                              {
                                properties.formatted
                              }
                            </p>

                          </div>

                        </div>

                      </button>

                    );

                  }
                )}

              </div>

            )}

          </div>

        </div>

      </div>


      {/* ==========================================================
          CENTER MARKER
      ========================================================== */}

      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-full
          z-[1000]
          pointer-events-none
        "
      >

        <div className="text-5xl">
          📍
        </div>

      </div>


      {/* ==========================================================
          BOTTOM PANEL
      ========================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-[1000]
          p-4
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            shadow-2xl
            p-5
          "
        >

          {/* ======================================================
              ADDRESS
          ====================================================== */}

          <p
            className="
              text-xs
              text-gray-500
              mb-1
            "
          >
            Selected location
          </p>

          <p
            className="
              font-semibold
              text-gray-900
              mb-4
            "
          >
            {address ||
              "Finding address..."}
          </p>


          {/* ======================================================
              AVAILABILITY LOADING
          ====================================================== */}

          {availabilityLoading && (

            <div
              className="
                mb-4
                rounded-xl
                bg-gray-50
                border
                border-gray-200
                p-3
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-5
                  h-5
                  border-2
                  border-gray-300
                  border-t-indigo-600
                  rounded-full
                  animate-spin
                "
              />

              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  Checking availability...
                </p>

                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Checking service within 5 km
                </p>

              </div>

            </div>

          )}


          {/* ======================================================
              SERVICE AVAILABLE
          ====================================================== */}

          {!availabilityLoading &&
            serviceAvailability?.available && (

              <div
                className="
                  mb-4
                  rounded-xl
                  bg-green-50
                  border
                  border-green-200
                  p-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <div
                    className="
                      w-7
                      h-7
                      rounded-full
                      bg-green-500
                      text-white
                      flex
                      items-center
                      justify-center
                      font-bold
                    "
                  >
                    ✓
                  </div>

                  <div>

                    <p
                      className="
                        text-sm
                        font-bold
                        text-green-700
                      "
                    >
                      Service Available
                    </p>

                    <p
                      className="
                        text-xs
                        text-green-600
                      "
                    >
                      We deliver to this location
                    </p>

                  </div>

                </div>

                {serviceAvailability.distanceKm && (

                  <p
                    className="
                      text-xs
                      text-green-600
                      mt-2
                    "
                  >
                    {serviceAvailability.distanceKm}
                    {" "}
                    km from service area
                  </p>

                )}

              </div>

            )}


          {/* ======================================================
              SERVICE NOT AVAILABLE
          ====================================================== */}

          {!availabilityLoading &&
            serviceAvailability &&
            !serviceAvailability.available && (

              <div
                className="
                  mb-4
                  rounded-xl
                  bg-orange-50
                  border
                  border-orange-200
                  p-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <div
                    className="
                      w-7
                      h-7
                      rounded-full
                      bg-orange-500
                      text-white
                      flex
                      items-center
                      justify-center
                      font-bold
                    "
                  >
                    !
                  </div>

                  <div>

                    <p
                      className="
                        text-sm
                        font-bold
                        text-orange-700
                      "
                    >
                      Coming Soon
                    </p>

                    <p
                      className="
                        text-xs
                        text-orange-600
                      "
                    >
                      Service is not available
                      in this location yet.
                    </p>

                  </div>

                </div>

                {serviceAvailability.distanceToNearestKm && (

                  <p
                    className="
                      text-xs
                      text-orange-600
                      mt-2
                    "
                  >
                    Nearest service area is{" "}
                    {
                      serviceAvailability.distanceToNearestKm
                    }{" "}
                    km away.
                  </p>

                )}

              </div>

            )}


          {/* ======================================================
              CONFIRM BUTTON
          ====================================================== */}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              (locationType === "user" ||
                locationType === "pickup") &&
              (
                availabilityLoading ||
                !serviceAvailability?.available
              )
            }
            className="
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              disabled:bg-gray-400
              disabled:cursor-not-allowed
              text-white
              py-4
              rounded-2xl
              font-bold
              text-lg
              transition
              active:scale-[0.98]
            "
          >

            {availabilityLoading
              ? "Checking..."
              : serviceAvailability?.available
                ? `Confirm ${locationType === "user"
                  ? "Location"
                  : locationType === "pickup"
                    ? "Pickup"
                    : "Drop"
                }`
                : "Service Coming Soon"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default AppFullScreenLocationPicker;