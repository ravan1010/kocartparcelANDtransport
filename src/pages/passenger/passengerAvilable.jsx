import { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

export default function PassengerNearbyOrders() {
    const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNearbyOrders = async () => {

    let serviceType = "auto_passenger"

    try {
      const res = await api.get(`/api/partner/orders/nearby/${serviceType}`);
      setOrders(res.data.auto_passenger);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyOrders();

    // Refresh every 10 seconds
    const interval = setInterval(fetchNearbyOrders, 10000);

    return () => clearInterval(interval);
  }, []);

  const acceptOrder = async (orderId) => {
  try {
    await api.put(`/api/partner/orders/accept/${orderId}`);

    // Refresh nearby orders after accepting

    if(res.data.success){
      navigate("/current/passenger/arrive/order");
    }
  } catch (err) {
    console.log(err);
  }
};

  if (loading) {
    return <div className="text-center py-10">Loading nearby orders...</div>;
  }

  return (
 <div className="space-y-4">
  {orders.length === 0 ? (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <span className="text-2xl">📦</span>
      </div>

      <h2 className="text-lg font-bold text-gray-800">
        No nearby pending orders
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        New orders will appear here when available.
      </p>
    </div>
  ) : (
    orders.map((order) => (
      <div
        key={order._id}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Order ID
            </p>

            <h2 className="font-bold text-gray-900 mt-0.5">
              {order.orderId}
            </h2>
          </div>

          <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-full text-xs font-semibold capitalize">
            {order.status}
          </span>
        </div>

        {/* Route */}
        <div className="px-5 py-4">
          <div className="relative space-y-5">
            {/* Vertical line */}
            <div className="absolute left-[9px] top-5 bottom-5 w-px bg-gray-200" />

            {/* Pickup */}
            <div className="relative flex gap-3">
              <div className="relative z-10 w-5 h-5 rounded-full bg-green-100 border-4 border-white ring-1 ring-green-500 flex-shrink-0" />

              <div className="min-w-0">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                  Pickup
                </p>

                <p className="text-sm text-gray-700 mt-1 leading-5">
                  {order.pickup.address}
                </p>
              </div>
            </div>

            {/* Drop */}
            <div className="relative flex gap-3">
              <div className="relative z-10 w-5 h-5 rounded-full bg-red-100 border-4 border-white ring-1 ring-red-500 flex-shrink-0" />

              <div className="min-w-0">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                  Drop
                </p>

                <p className="text-sm text-gray-700 mt-1 leading-5">
                  {order.drop.address}
                </p>
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="mt-5 flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-sm text-gray-500">
              Total Distance
            </span>

            <span className="font-bold text-gray-800">
              {order.distance} km
            </span>
          </div>

          {/* Accept Button */}
          <button
            className="mt-4 w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow transition-all duration-200"
            onClick={() => acceptOrder(order._id)}
          >
            Accept Order
          </button>
        </div>
      </div>
    ))
  )}
</div>
  );
}