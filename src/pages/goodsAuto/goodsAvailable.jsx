import { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

export default function GoodsNearbyOrders() {
    const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [oneclick, setOneclick] = useState(1);   

  const isDisabled = oneclick !== 1;

 const fetchNearbyOrders = async () => {

    let serviceType = "goods_auto"

    try {
      const res = await api.get(`/api/partner/orders/nearby/${serviceType}`);
      setOrders(res.data.orders);
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
    if (oneclick === 2) {
      return
    }

    setOneclick(2)

    try {
      const res = await api.put(`/api/partner/orders/accept/${orderId}`);

      // Refresh nearby orders after accepting

      if (res.data.success) {
        setOneclick(1)
        navigate("/goods/accepted/order");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading nearby orders...</div>;
  }

  return (
<div className="space-y-5">
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
            <span className="text-3xl">📦</span>
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            No nearby pending orders
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            New orders will appear here when available.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Looking for orders...
          </div>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden "
          >
            {
              order.serviceType !== "goods_auto" && (
                
              <div className="text-center mt-10">
                  Not for you
              </div>           
              )
            } 

           { /* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                      <span className="text-lg">📦</span>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                        Order ID
                      </p>

                      <h2 className="font-bold text-gray-900 text-sm">
                        {order.orderId}
                      </h2>
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  {order.status}
                </span>
              </div>
            </div>

            {/* Route */}
            <div className="px-5 py-5">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[10px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-green-300 via-gray-200 to-red-300" />

                {/* Pickup */}
                <div className="relative flex gap-4">
                  <div className="relative z-10 w-[22px] h-[22px] rounded-full bg-green-500 border-[5px] border-white ring-1 ring-green-200 flex-shrink-0 shadow-sm" />

                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">
                        Pickup
                      </span>

                      <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                        Start
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-800 mt-1.5 leading-5">
                      {order.pickup.address}
                    </p>
                  </div>
                </div>

                {/* Drop */}
                <div className="relative flex gap-4">
                  <div className="relative z-10 w-[22px] h-[22px] rounded-full bg-red-500 border-[5px] border-white ring-1 ring-red-200 flex-shrink-0 shadow-sm" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                        Drop
                      </span>

                      <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                        Destination
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-800 mt-1.5 leading-5">
                      {order.drop.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {/* Distance */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                      <span className="text-sm">📍</span>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">
                        Distance
                      </p>

                      <p className="text-sm font-bold text-gray-800 mt-0.5">
                        {order.distance} km
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-yellow-50 flex items-center justify-center">
                      <span className="text-sm">⚡</span>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">
                        Availability
                      </p>

                      <p className="text-sm font-bold text-green-600 mt-0.5">
                        Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accept Button */}
              {/* <button
                disabled={isDisabled}
                onClick={() => acceptOrder(order._id)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <span>Accept Order</span>
                <span className="text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button> */}

              <button
                disabled={isDisabled}
                onClick={() => acceptOrder(order._id)}
                className={`
                  mt-4 w-full flex items-center justify-center gap-2
                  font-bold py-3.5 rounded-2xl
                  shadow-sm transition-all duration-200
                  ${isDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white hover:shadow-md cursor-pointer"
                  }
                `}
              >
                <span>
                  {isDisabled ? "Accepting..." : "Accept Order"}
                </span>

                <span className="text-lg">
                  {isDisabled ? "⏳" : "→"}
                </span>
              </button>

            </div>
          </div>
        ))
      )}
    </div>
  );
}