import { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

export default function GoodsNearbyOrders() {
    const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNearbyOrders = async () => {
    try {
      const res = await api.get("/api/partner/orders/nearby");
      setOrders(res.data.goods_auto);
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


    navigate("/current/order");

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
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-lg font-semibold">
            No nearby pending orders
          </h2>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow border p-5"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold">{order.orderId}</h2>

              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                {order.status}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <p>
                <strong>Pickup:</strong> {order.pickup.address}
              </p>

              <p>
                <strong>Drop:</strong> {order.drop.address}
              </p>

              <p>
                <strong>Distance:</strong> {order.distance} km
              </p>


              <button
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
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