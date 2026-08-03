import { useEffect, useState } from "react";
import api from "../../api.js";
import { useNavigate } from "react-router-dom";

export default function CurrentOrder() {

        const navigate = useNavigate();


  const [order, setOrder] = useState(null);
  const [pickupOtp, setPickupOtp] = useState("");

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

  const verifyPickupOtp = async () => {
    try {
      const res = await api.put(
        `/api/partner/orders/verify-pickup/${order._id}`,
        {
          otp: pickupOtp,
        }
      );

      alert(res.data.message);
      navigate("/pickup/order")


      fetchOrder(); // refresh status
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
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
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 mt-6">

      <h2 className="text-2xl font-bold mb-5">
        Current Order
      </h2>

      {/* Customer */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg">
          Customer Details
        </h3>

        <p>Name: {order.customer?.name}</p>
        <p>Phone: {order.customer?.Number}</p>
      </div>

      <hr className="my-4" />

      {/* Pickup */}
<div className="mb-4">
  <h3 className="font-semibold">Pickup Location</h3>

  <p className="mb-2">{order.pickup.address}</p>

  <a
    href={`https://www.google.com/maps?q=${order.pickup.location.coordinates[1]},${order.pickup.location.coordinates[0]}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    📍 Navigate
  </a>
</div>

      {/* Drop */}
      {/* <div className="mb-4">
        <h3 className="font-semibold">
          Drop Location
        </h3>

        <p>{order.drop.address}</p>
      </div> */}

      <hr className="my-4" />

      <p>
        <strong>Distance:</strong> {order.distance} km
      </p>

      <p>
        <strong>Amount:</strong> ₹{order.amount}
      </p>

      <p>
        <strong>Status:</strong> {order.status}
      </p>

      {/* Verify Pickup OTP */}
      {order.status === "driver_assigned" && (
        <div className="mt-6">
          <label className="font-semibold">
            Enter Pickup OTP
          </label>

          <input
            type="number"
            value={pickupOtp}
            onChange={(e) => setPickupOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border rounded-lg p-3 mt-2"
          />

          <button
            onClick={verifyPickupOtp}
            className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Verify Pickup OTP
          </button>
        </div>
      )}
    </div>
  );
}