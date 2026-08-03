import { useEffect, useState } from "react";
import api from "../../api.js";
import { useNavigate } from "react-router-dom";

export default function PickedUpOrder() {

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
      navigate("/available/order")


      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  if (!order) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-xl font-semibold">
          No Picked-up Order
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 space-y-5">

      <h2 className="text-2xl font-bold">
        Picked-up Order
      </h2>

      {/* Customer */}
      <div>
        <h3 className="font-semibold text-lg">Customer</h3>
        <p>{order.drop.name}</p>
        <p>Phone: <a
                      href={`tel:${order.drop?.phone}`}
                      className="font-medium text-blue-600"
                    >
                      📞 {order.drop?.phone}
                    </a>
                    </p>
      </div>

      {/* Pickup */}

      {/* Drop */}
      <div>
        <h3 className="font-semibold">Drop Location</h3>

        <p>{order.drop.address}</p>

        <a
          href={`https://www.google.com/maps?q=${order.drop.location.coordinates[1]},${order.drop.location.coordinates[0]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          📍 Navigate
        </a>
      </div>

      {/* Order Info */}
      <div>
        <p>
          <strong>Distance:</strong> {order.distance} km
        </p>

        <p>
          <strong>Amount:</strong> ₹{order.amount}
        </p>
      </div>

      {/* Delivery OTP */}
      <div>
        <label className="block font-semibold mb-2">
          Delivery OTP
        </label>

        <input
          type="number"
          value={deliveryOtp}
          onChange={(e) => setDeliveryOtp(e.target.value)}
          placeholder="Enter Delivery OTP"
          className="w-full border rounded-lg p-3"
        />

        <button
          onClick={completeDelivery}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
        >
          Complete Delivery
        </button>
      </div>
    </div>
  );
}