import { useEffect, useState } from "react";
import api from "../../../api.js";
import { useNavigate } from "react-router-dom";

export default function GoodsCurrentOrder() {

  const navigate = useNavigate();



  const [order, setOrder] = useState(null);
  const [pickupOtp, setPickupOtp] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await api.get("/api/partner/orders/Arrived");
      setOrder(res.data.order);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const verifyPickupOtp = async () => {
    try {
      const res = await api.put(
        `/api/partner/orders/verify-pickup/${order._id}`,
        {
          otp: pickupOtp,
        }
      );

      navigate("/goods/pickup/order")


      fetchOrder(); // refresh status
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  if (!order || order.serviceType !== "goods_auto") {
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

            {/* Order Information */}
            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <span className="text-lg">
                    📦
                  </span>
                </div>

                <p className="text-green-100 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                  Current Order
                </p>

              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold mt-2 truncate">
                {order.orderId || "Active Ride"}
              </h2>

              <div className="flex items-center gap-1.5 mt-1.5">

                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />

                <span className="text-xs text-green-100">
                  Active Order
                </span>

              </div>

            </div>


            {/* SOS */}
            <a
              href="tel:8088303214"
              className="
        shrink-0
        flex
        items-center
        justify-center
        gap-2
        min-w-[78px]
        h-12
        px-4
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

          {/* Customer Details */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-4">

              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">
                👤
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Customer
                </p>

                <h3 className="text-lg font-bold text-gray-900">
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

          {/* Pickup */}
          <div className="mt-6">

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                📍
              </div>

              <div>
                <p className="text-xs text-green-600 font-bold uppercase tracking-wide">
                  Pickup Location
                </p>

                <p className="text-sm text-gray-400">
                  Customer pickup point
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">

              <p className="text-sm text-gray-700 leading-6">
                {order.pickup.address}
              </p>

              <a
                href={`https://www.google.com/maps?q=${order.pickup.location.coordinates[1]},${order.pickup.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition"
              >
                🧭 Navigate to Pickup
              </a>

            </div>
          </div>

          {/* Order Information */}
          <div className="mt-6 grid grid-cols-2 gap-3">

            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 font-medium">
                Distance
              </p>

              <p className="text-lg font-bold text-gray-900 mt-1">
                {order.distance} km
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 font-medium">
                Amount
              </p>

              <p className="text-sm font-bold text-green-600 capitalize mt-2">
                ₹{order.amount}
              </p>
            </div>

          </div>

          {/* Pickup OTP */}
          {order.status === "driver_arrived" && (
            <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-5">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  🔐
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Verify Pickup
                  </h3>

                  <p className="text-xs text-gray-500">
                    Ask the customer for the pickup OTP
                  </p>
                </div>

              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pickup OTP
              </label>

              <input
                type="number"
                value={pickupOtp}
                onChange={(e) => setPickupOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-[0.4em] outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

              <button
                onClick={verifyPickupOtp}
                className="mt-4 w-full bg-green-600 text-white py-3.5 rounded-xl font-bold shadow-sm hover:bg-green-700 active:scale-[0.98] transition"
              >
                ✓ Verify Pickup OTP
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}