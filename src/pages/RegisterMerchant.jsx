
import React, { useState } from "react";
import axios from "axios";
import api from "../api";

export default function MerchantRegister() {
  const [form, setForm] = useState({
    merchantName: "",
    image: "",
    upiId: "",
    fcmToken: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Get current GPS location
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/api/register",
        form
      );

      alert("Merchant registered successfully!");

      console.log(response.data);

      setForm({
        merchantName: "",
        image: "",
        upiId: "", 
        fcmToken: "",
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
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 space-y-5"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Merchant Registration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Register your business and UPI details
          </p>
        </div>

        {/* Merchant Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Merchant Name
          </label>
          <input
            type="text"
            name="merchantName"
            value={form.merchantName}
            onChange={handleChange}
            placeholder="Enter merchant name"
            required
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Merchant Image URL
          </label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {form.image && (
            <img
              src={form.image}
              alt="Merchant preview"
              className="mt-3 w-24 h-24 rounded-xl object-cover"
            />
          )}
        </div>

        {/* UPI ID */}
        <div>
          <label className="block text-sm font-medium mb-2">
            UPI ID
          </label>
          <input
            type="text"
            name="upiId"
            value={form.upiId}
            onChange={handleChange}
            placeholder="merchant@okaxis"
            required
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* FCM Token */}
        <div>
          <label className="block text-sm font-medium mb-2">
            FCM Token
          </label>
          <input
            type="text"
            name="fcmToken"
            value={form.fcmToken}
            onChange={handleChange}
            placeholder="Enter FCM token (optional)"
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="bg-blue-50 p-4 rounded-xl space-y-3">
          <h3 className="font-semibold text-gray-800">
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

          {form.latitude && (
            <div className="text-sm text-gray-700">
              <p>Latitude: {form.latitude}</p>
              <p>Longitude: {form.longitude}</p>
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
