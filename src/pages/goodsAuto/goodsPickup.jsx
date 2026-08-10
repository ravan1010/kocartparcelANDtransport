import { useEffect, useState } from "react";
import api from "../../../api.js";
import { useNavigate } from "react-router-dom";

export default function GoodsPickedUpOrder() {

    const navigate = useNavigate();


  const [order, setOrder] = useState(null);
  const [deliveryOtp, setDeliveryOtp] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await api.get("/api/partner/orders/picked-up");
      setOrder(res.data.order);
    } catch (err) {
      console.log(err);
      setOrder(null);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const completeDelivery = async () => {
    try {
      const res = await api.put(
        `/api/partner/orders/verify-delivery/${order._id}`,
        {
          otp: deliveryOtp,
        }
      );

      alert(res.data.message);
      navigate("/")


      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  if (!order || order.serviceType !== "goods_auto") {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-xl font-semibold">
          No Picked-up Order
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

    {/* Header */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium">
            Active Delivery
          </p>

          <h2 className="text-2xl font-bold mt-1">
            Picked-up Order
          </h2>
        </div>

        <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold">
          Picked Up
        </span>
      </div>
    </div>

    <div className="p-6 space-y-6">

      {/* Customer */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">

        <div className="flex items-center gap-3 mb-4">

          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
            👤
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">
              Customer
            </p>

            <h3 className="text-lg font-bold text-gray-900">
              {order.drop?.name}
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
              href={`tel:${order.drop?.phone}`}
              className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              📞 {order.drop?.phone}
            </a>
          </div>

        </div>
      </div>

      {/* Route */}
      <div>

        <div className="flex items-center gap-3 mb-3">

          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            📍
          </div>

          <div>
            <p className="text-xs text-red-600 font-bold uppercase tracking-wide">
              Drop Location
            </p>

            <p className="text-xs text-gray-400">
              Passenger destination
            </p>
          </div>

        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">

          <p className="text-sm text-gray-700 leading-6">
            {order.drop.address}
          </p>

          <a
            href={`https://www.google.com/maps?q=${order.drop.location.coordinates[1]},${order.drop.location.coordinates[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition"
          >
            🧭 Navigate to Drop
          </a>

        </div>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-2 gap-3">

        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">

          <p className="text-xs text-gray-400 font-medium">
            Distance
          </p>

          <p className="text-lg font-bold text-gray-900 mt-1">
            {order.distance} km
          </p>

        </div>

      </div>

      {/* Delivery OTP */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-5">

        <div className="flex items-center gap-3 mb-4">

          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            🔐
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              Complete Delivery
            </h3>

            <p className="text-xs text-gray-500">
              Ask the passenger for the delivery OTP
            </p>
          </div>

        </div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Delivery OTP
        </label>

        <input
          type="number"
          value={deliveryOtp}
          onChange={(e) => setDeliveryOtp(e.target.value)}
          placeholder="Enter 4-digit OTP"
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-[0.4em] outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />

        <button
          onClick={completeDelivery}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3.5 rounded-xl font-bold shadow-sm active:scale-[0.98] transition"
        >
          ✓ Complete 
        </button>

      </div>

    </div>
  </div>
</div>
  );
}