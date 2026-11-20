
import React, { useState } from "react";
import api from "../../api.js";
import { generateAndSaveFCMToken } from "../utili/token.js";

export default function MerchantRegister() {
  const [form, setForm] = useState({
    merchantName: "",
    image: "",
    upiId: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Image to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Only JPG, PNG and WEBP allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be below 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // GPS Location
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));

        setLocationLoading(false);
      },
      (error) => {
        alert(error.message);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Enable Notifications
  const enableNotifications = async () => {
    try {
      setNotificationLoading(true);

      await generateAndSaveFCMToken();

    } catch (error) {
      console.error(error);
      alert("Notification setup failed");
    } finally {
      setNotificationLoading(false);
    }
  };

  // Register Merchant
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Please upload merchant image");
      return;
    }

    if (form.latitude === "" || form.longitude === "") {
      alert("Please get your current location");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/register", {
        merchantName: form.merchantName,
        image: form.image,
        upiId: form.upiId,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });

      alert("Merchant registered successfully!");

      console.log(response.data);

      setForm({
        merchantName: "",
        image: "",
        upiId: "",
        latitude: "",
        longitude: "",
      });

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Merchant registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 space-y-5"
      >

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Merchant Registration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Register your business details
          </p>
        </div>

        {/* Merchant Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Merchant Name
          </label>

          <input
            type="text"
            name="merchantName"
            value={form.merchantName}
            onChange={handleChange}
            placeholder="Enter merchant name"
            required
            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Merchant Image */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Merchant Image
          </label>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded-xl p-3"
          />

          {form.image && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={form.image}
                alt="Merchant"
                className="w-24 h-24 object-cover rounded-xl border"
              />
              <span className="text-sm text-green-600">
                Image ready ✓
              </span>
            </div>
          )}
        </div>

        {/* UPI ID */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            UPI ID
          </label>

          <input
            type="text"
            name="upiId"
            value={form.upiId}
            onChange={handleChange}
            placeholder="merchant@okaxis"
            required
            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notifications */}
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-2">
            Notifications
          </h3>

          <p className="text-sm text-gray-500 mb-3">
            Receive nearby customer requests and merchant alerts.
          </p>

          <button
            type="button"
            onClick={enableNotifications}
            disabled={notificationLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {notificationLoading
              ? "Enabling..."
              : "Allow Notifications"}
          </button>
        </div>

        {/* GPS Location */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3">
            Merchant Location
          </h3>

          <button
            type="button"
            onClick={getLocation}
            disabled={locationLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {locationLoading
              ? "Getting Location..."
              : "Get Current GPS Location"}
          </button>

          {form.latitude !== "" && (
            <div className="mt-3 text-sm text-gray-700">
              <p>Latitude: {form.latitude}</p>
              <p>Longitude: {form.longitude}</p>
              <p className="text-green-600 mt-1">
                Location captured ✓
              </p>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register Merchant"}
        </button>

      </form>
    </div>
  );
}
