import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";
import { generateAndSaveFCMToken } from "../utili/token";
import FullScreenLocationPicker from "../hooks/AppFullScreenLocationPicker.jsx";

const Details = () => {
  const navigate = useNavigate();

  // =========================
  // FORM STATES
  // =========================
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicalNO, setVehicalNO] = useState("");
  const [vehicalName, setVehicalName] = useState("");
  const [serviceType, setServiceType] = useState("");

  // =========================
  // LOCATION STATES
  // =========================
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // =========================
  // LOADING / ERROR
  // =========================
  const [loading, setLoading] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");

  // =========================
  // FCM TOKEN
  // =========================
  useEffect(() => {
    generateAndSaveFCMToken();
  }, []);

  // =========================
  // OPEN LOCATION PICKER
  // =========================
  const openLocationPicker = () => {
    setLocationError("");
    setShowLocationPicker(true);
  };

  // =========================
  // LOCATION CONFIRM
  // =========================
  const handleLocationConfirm = async (location) => {
    try {
      setLoadingLoc(true);
      setLocationError("");
      setError("");

      console.log("Selected location:", location);

      const lat = Number(location?.latitude);
      const lng = Number(location?.longitude);

      // Validate coordinates
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        setLocationError("Invalid location selected.");
        return;
      }

      /*
        Your picker may return:
        {
          latitude,
          longitude,
          address,
          city
        }
      */

      const selectedCity =
        location?.city ||
        location?.town ||
        location?.village ||
        location?.county ||
        location?.address ||
        "";

      // =========================
      // UPDATE LOCATION STATE
      // =========================
      setLatitude(lat);
      setLongitude(lng);
      setCity(selectedCity);

      setSelectedLocation({
        latitude: lat,
        longitude: lng,
        address: location?.address || "",
        city: selectedCity,
      });


      console.log("Location saved successfully");

      // Close picker
      setShowLocationPicker(false);
    } catch (err) {
      console.error(
        "Save selected location error:",
        err?.response?.data || err
      );

      setLocationError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update location."
      );
    } finally {
      setLoadingLoc(false);
    }
  };

  // =========================
  // LOCATION CANCEL
  // =========================
  const handleLocationCancel = () => {
    console.log("Location picker cancelled");

    setShowLocationPicker(false);
    setLocationError("");
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // =========================
    // LOCATION VALIDATION
    // =========================
    if (
      !latitude ||
      !longitude ||
      !city ||
      city === "city"
    ) {
      alert("Please select your location");
      return;
    }

    // =========================
    // FORM VALIDATION
    // =========================
    if (
      !phoneNumber ||
      !vehicalNO ||
      !vehicalName ||
      !serviceType
    ) {
      alert("Please enter all fields");
      return;
    }

    // =========================
    // PHONE VALIDATION
    // =========================
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);

      const res = await api.put(
        "/api/parcelandtransport/details",
        {
          city,
          phoneNumber,
          longitude,
          latitude,
          vehicalNO,
          vehicalName,
          serviceType,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Vehicle details response:", res.data);

      if (res.data?.success === true) {
        navigate("/");
      } else {
        setError(
          res.data?.message ||
            "Unable to save vehicle details."
        );
      }
    } catch (err) {
      console.error("Vehicle details error:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Server error. Please try again."
        );
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FULLSCREEN LOCATION PICKER
  // =====================================================
  if (showLocationPicker) {
    return (
      <FullScreenLocationPicker
        type="user"
        initialLocation={selectedLocation}
        onConfirm={handleLocationConfirm}
        onCancel={handleLocationCancel}
      />
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">

      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          px-5
          py-6
          shadow-xl
        "
      >

        {/* =========================
            TITLE
        ========================= */}
        <h2 className="font-bold text-3xl text-center mt-3 mb-6">
          Enter your vehicle details
        </h2>

        <form onSubmit={handleSubmit}>

          {/* =========================
              PHONE NUMBER
          ========================= */}
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Enter your number"
            value={phoneNumber}
            onChange={(e) => {
              const value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 10);

              setPhoneNumber(value);
            }}
            className="
              border
              border-gray-300
              w-full
              px-3
              py-3
              rounded-xl
              my-3
              outline-none
              focus:border-blue-500
            "
          />

          {/* =========================
              VEHICLE NUMBER
          ========================= */}
          <input
            type="text"
            placeholder="Enter your vehicle number"
            value={vehicalNO}
            onChange={(e) => {
              setVehicalNO(
                e.target.value.toUpperCase()
              );
            }}
            className="
              border
              border-gray-300
              w-full
              px-3
              py-3
              rounded-xl
              my-3
              outline-none
              focus:border-blue-500
            "
            maxLength={15}
          />

          {/* =========================
              VEHICLE NAME
          ========================= */}
          <input
            type="text"
            placeholder="Enter your vehicle name"
            value={vehicalName}
            onChange={(e) => {
              setVehicalName(e.target.value);
            }}
            className="
              border
              border-gray-300
              w-full
              px-3
              py-3
              rounded-xl
              my-3
              outline-none
              focus:border-blue-500
            "
            maxLength={30}
          />

          {/* =========================
              SERVICE TYPE
          ========================= */}
          <label
            htmlFor="serviceType"
            className="
              block
              text-sm
              font-semibold
              text-gray-700
              mt-4
              mb-2
            "
          >
            Choose service type
          </label>

          <select
            id="serviceType"
            value={serviceType}
            onChange={(e) => {
              setServiceType(e.target.value);
            }}
            className="
              w-full
              px-3
              py-3
              border
              border-gray-300
              rounded-xl
              outline-none
              focus:border-blue-500
            "
          >
            <option value="">
              Select service
            </option>

            <option value="goods_auto">
              3 Wheel Goods Auto
            </option>

            <option value="4_wheel_goods_auto">
              4 Wheel Goods Auto
            </option>
          </select>

          {/* =========================
              LOCATION
          ========================= */}
          <div className="mt-5 mb-4">

            <button
              type="button"
              onClick={openLocationPicker}
              disabled={loadingLoc}
              className={`
                w-full
                flex
                items-center
                text-left
                px-4
                py-3
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition

                ${
                  loadingLoc
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 active:scale-[0.99]"
                }
              `}
            >

              {loadingLoc ? (
                <div className="flex items-center gap-3">

                  <span
                    className="
                      w-5
                      h-5
                      border-2
                      border-gray-300
                      border-t-gray-700
                      rounded-full
                      animate-spin
                    "
                  />

                  <span className="text-sm font-semibold text-gray-700">
                    Updating location...
                  </span>

                </div>
              ) : (
                <>
                  {/* LOCATION ICON */}
                  <div
                    className="
                      w-11
                      h-11
                      rounded-full
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                      mr-3
                      shrink-0
                    "
                  >
                    <span className="text-2xl">
                      📍
                    </span>
                  </div>

                  {/* LOCATION TEXT */}
                  <div className="flex-1 min-w-0">

                    <p
                      className="
                        text-[10px]
                        text-gray-500
                        font-bold
                        tracking-widest
                      "
                    >
                      YOUR LOCATION
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-gray-800
                        truncate
                      "
                    >
                      {city || "Select Location"}
                    </p>

                  </div>

                  {/* ARROW */}
                  <div className="text-gray-500 text-lg ml-2">
                    ▼
                  </div>
                </>
              )}

            </button>

          </div>

          {/* =========================
              SELECTED LOCATION
          ========================= */}
          {selectedLocation && (
            <div
              className="
                bg-blue-50
                border
                border-blue-100
                rounded-xl
                px-4
                py-3
                mb-4
              "
            >

              <p
                className="
                  text-[10px]
                  font-bold
                  tracking-widest
                  text-blue-600
                "
              >
                SELECTED LOCATION
              </p>

              <p className="text-sm font-semibold text-gray-800 mt-1">
                📍 {city}
              </p>

              {selectedLocation.address && (
                <p className="text-xs text-gray-600 mt-1">
                  {selectedLocation.address}
                </p>
              )}

            </div>
          )}

          {/* =========================
              LOCATION ERROR
          ========================= */}
          {locationError && (
            <p className="text-red-500 text-sm mb-3">
              {locationError}
            </p>
          )}

          {/* =========================
              API ERROR
          ========================= */}
          {error && (
            <p className="text-red-500 text-sm mb-3">
              {error}
            </p>
          )}

          {/* =========================
              NEXT BUTTON
          ========================= */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              my-4
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-300
              text-white
              font-semibold
              py-3
              px-4
              rounded-xl
              shadow-md
              transition
            "
          >
            {loading ? "Saving..." : "Next"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Details;
