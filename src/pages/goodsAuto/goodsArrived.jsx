import { useEffect, useState } from "react";
import api from "../../../api.js";
import { useNavigate } from "react-router-dom";
import { updateBikeParcelDriverLocation } from "../liveupdate.js";

export default function GoodsArrive() {

  const navigate = useNavigate();



  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await api.get("/api/partner/orders/current");
      setOrder(res.data.order);
      console.log(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    if (!order?._id) return;

    if (order.status !== "driver_assigned") {
      return;
    }

    const updateLocation = () => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const data =
              await updateBikeParcelDriverLocation(
                latitude,
                longitude
              );

            console.log("Location updated:", data);

          } catch (error) {
            console.error(
              "Location update failed:",
              error.response?.data || error.message
            );
          }
        },
        (error) => {
          console.error("Location error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    // Update immediately
    updateLocation();

    // Update every 30 seconds
    const interval = setInterval(
      updateLocation,
      30 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [order?._id, order?.status]);


  const arrivedUpdate = async () => {
    try {
      const res = await api.put(
        `/api/partner/orders/driverArrived/${order._id}`, {}
      );

      if (res.data.success) {
        navigate("/goods/current/order")
      }

      fetchOrder(); // refresh status
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };




  if (!order) {
    return (
      <div className="text-center mt-10">
        No Active Order
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">


        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 via-green-600 to-emerald-500 px-5 sm:px-6 py-5 text-white">

          <div className="flex items-center justify-between gap-4">

            {/* Ride Information */}
            <div className="min-w-0">

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                  <span className="text-base">
                    🚗
                  </span>
                </div>

                <p className="text-green-100 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                  Current Ride
                </p>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold mt-2 truncate">
                {order.orderId}
              </h2>

              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />

                <p className="text-xs text-green-100">
                  Ride in progress
                </p>
              </div>

            </div>


            {/* SOS Button */}
            <a
              href="tel:8088303214"
              className="
        shrink-0
        flex
        items-center
        gap-2
        px-4
        py-3
        rounded-2xl
        bg-white
        text-red-600
        font-extrabold
        text-sm
        shadow-lg
        shadow-green-900/20
        hover:bg-red-50
        active:scale-95
        transition-all
        duration-200
      "
            >
              <span className="text-lg">
                📞
              </span>

              <span>
                SOS
              </span>
            </a>

          </div>

        </div>

        <div className="p-6">

          {/* Customer Card */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-xl">
                👤
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  client
                </p>

                <h3 className="font-bold text-gray-900">
                  {order.pickup?.name}
                </h3>
              </div>
            </div>

            <div className="space-y-3">

              {/* Phone */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Phone
                </span>

                <a
                  href={`tel:${order.pickup?.phone}`}
                  className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                >
                  📞 {order.pickup?.phone}
                </a>
              </div>


            </div>
          </div>

          {/* Route */}
          <div className="mt-6">

            <h3 className="text-lg font-bold text-gray-900 mb-5">
              Ride Route
            </h3>

            <div className="relative">

              {/* Route Line */}
              <div className="absolute left-[10px] top-5 bottom-6 w-[2px] bg-gray-200" />

              {/* Pickup */}
              <div className="relative flex gap-4 mb-7">

                <div className="relative z-10 w-5 h-5 mt-1 rounded-full bg-green-500 border-4 border-white ring-1 ring-green-500 flex-shrink-0" />

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wide">
                      Pickup
                    </p>

                    <a
                      href={`https://www.google.com/maps?q=${order.pickup.location.coordinates[1]},${order.pickup.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Navigate →
                    </a>
                  </div>

                  <p className="mt-1 text-sm text-gray-700 leading-5">
                    {order.pickup.address}
                  </p>
                </div>
              </div>

              {/* Drop */}
              <div className="relative flex gap-4">

                <div className="relative z-10 w-5 h-5 mt-1 rounded-full bg-red-500 border-4 border-white ring-1 ring-red-500 flex-shrink-0" />

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wide">
                      Drop Location
                    </p>

                    <a
                      href={`https://www.google.com/maps?q=${order.drop.location.coordinates[1]},${order.drop.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Navigate →
                    </a>
                  </div>

                  <p className="mt-1 text-sm text-gray-700 leading-5">
                    {order.drop.address}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Navigate Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">

            <a
              href={`https://www.google.com/maps?q=${order.pickup.location.coordinates[1]},${order.pickup.location.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 py-3 rounded-xl font-semibold hover:bg-blue-100 transition"
            >
              📍 Pickup
            </a>

            <a
              href={`https://www.google.com/maps?q=${order.drop.location.coordinates[1]},${order.drop.location.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-100 py-3 rounded-xl font-semibold hover:bg-red-100 transition"
            >
              📍 Drop
            </a>

          </div>

          {/* Ride Information */}
          <div className="mt-6 grid grid-cols-2 gap-3">

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium">
                Distance
              </p>

              <p className="text-lg font-bold text-gray-900 mt-1">
                {order.distance} km
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium">
                Amount
              </p>

              <p className="text-sm font-bold text-green-600 mt-2 capitalize">
                ₹{order.amount}
              </p>
            </div>

          </div>

          {/* Goods Details */}
          {order.goods && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 mt-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Goods Details
              </h3>

              <div className="space-y-3">
                {/* Item Type */}
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Item Type</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {order.goods.itemType || "Not specified"}
                  </span>
                </div>

                {/* Weight */}
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Estimated Weight</span>
                  <span className="font-semibold text-gray-900">
                    {order.goods.estimatedWeight
                      ? `${order.goods.estimatedWeight} kg`
                      : "Not specified"}
                  </span>
                </div>

                {/* Helpers */}
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Helpers Required</span>
                  <span className="font-semibold text-gray-900">
                    {order.goods.helpersRequired ?? 0}
                  </span>
                </div>

                {/* Loading */}
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Loading Required</span>
                  <span
                    className={`font-semibold ${order.goods.loadingRequired
                        ? "text-green-600"
                        : "text-gray-500"
                      }`}
                  >
                    {order.goods.loadingRequired ? "Yes" : "No"}
                  </span>
                </div>

                {/* Unloading */}
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Unloading Required</span>
                  <span
                    className={`font-semibold ${order.goods.unloadingRequired
                        ? "text-green-600"
                        : "text-gray-500"
                      }`}
                  >
                    {order.goods.unloadingRequired ? "Yes" : "No"}
                  </span>
                </div>

                {/* Instructions */}
                {order.goods.instructions && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-gray-500 mb-1">Instructions</p>
                    <p className="text-gray-900 font-medium">
                      {order.goods.instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Driver Actions */}
          {order.status === "driver_assigned" && (
            <div className="mt-7 pt-6 border-t border-gray-100">

              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-base font-extrabold text-gray-900">
                    Ride Actions
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Update your current ride status
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <span className="text-lg">
                    🚗
                  </span>
                </div>
              </div>


              {/* Action Card */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-xl">
                      📍
                    </span>
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">
                      Ready at pickup?
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Confirm when you reach the pickup location.
                    </p>
                  </div>

                </div>


                {/* Arrived Button */}
                <button
                  onClick={arrivedUpdate}
                  className="
          w-full
          h-14
          flex
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-green-600
          hover:bg-green-700
          active:scale-[0.98]
          text-white
          font-bold
          text-base
          shadow-md
          shadow-green-200
          transition-all
          duration-200
        "
                >
                  <span className="text-xl">
                    ✓
                  </span>

                  <span>
                    Arrived at Pickup
                  </span>
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}