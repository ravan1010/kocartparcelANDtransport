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
        `/api/partner/orders/driverArrived/${order._id}`,{}
      );

      if(res.data.success){
      navigate("/goods/current/order")
      }

      fetchOrder(); // refresh status
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const Reassign = async () => {
    try {
      const res = await api.put(
        `/api/partner/orders/Reassign/${order._id}`,{}
      );

      if(res.data.success){
      navigate("/goods/available/order")
      }

      fetchOrder(); // refresh status
    } catch (err) {
      alert(err.response?.data?.message );
    }
  }


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
    <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm font-medium">
            Current Ride
          </p>

          <h2 className="text-2xl font-bold mt-1">
            {order.orderId}
          </h2>
        </div>

        <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold capitalize">
          {order.status?.replace("_", " ")}
        </span>
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
              Passenger
            </p>

            <h3 className="font-bold text-gray-900">
              {order.passenger?.name}
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
              href={`tel:${order.passenger?.phone}`}
              className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              📞 {order.passenger?.phone}
            </a>
          </div>

          {/* Passengers */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Passengers
            </span>

            <span className="font-semibold text-gray-800">
              👥 {order.passenger?.passengers}
            </span>
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
            Status
          </p>

          <p className="text-sm font-bold text-green-600 mt-2 capitalize">
            {order.status?.replace("_", " ")}
          </p>
        </div>

      </div>

      {/* Driver Actions */}
      {order.status === "driver_assigned" && (
        <div className="mt-7 pt-5 border-t border-gray-100">

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Ride Actions
          </p>

          <div className="grid grid-cols-2 gap-3">

            {/* Cancel */}
            <button
              onClick={Reassign}
              className="py-3.5 rounded-xl bg-red-50 text-red-600 border border-red-100 font-semibold hover:bg-red-100 active:scale-[0.98] transition"
            >
              ✕ Cancel
            </button>

            {/* Arrived */}
            <button
              onClick={arrivedUpdate}
              className="py-3.5 rounded-xl bg-green-600 text-white font-semibold shadow-sm hover:bg-green-700 active:scale-[0.98] transition"
            >
              ✓ Arrived
            </button>

          </div>

        </div>
      )}

    </div>
  </div>
</div>
  );
}