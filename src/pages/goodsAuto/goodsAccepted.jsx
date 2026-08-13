import { useEffect, useState } from "react";
import api from "../../../api";

export default function AcceptedOrder() {
  const [order, setOrder] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchAcceptedOrder = async () => {
    try {
      const { data } = await api.get(
        "/api/parter/accepted/order"
      );

      if (data.success && data.order) {
        setOrder(data.orders);
        console.log(data.order)
      } else {
        setOrder(null);
      }

    } catch (err) {
      console.error(err);
      setError("Unable to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedOrder();
  }, []);

  const submitAmount = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      setSubmitting(true);

      const { data } = await api.post(
        `/api/parter/accepted/order/amount/${order._id}`,
        {
          amount: Number(amount),
        }
      );

      if (data.success) {
        setOrder(data.order);
        alert("Amount submitted successfully");
      }

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Failed to submit amount"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h2 className="text-xl font-bold">
            No Accepted Order
          </h2>

          <p className="text-gray-500 mt-2">
            You don't have an active order.
          </p>
        </div>
      </div>
    );
  }

  const pickup = order.pickup;
  const drop = order.drop;
  const goods = order.goods;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">

      {/* Header */}

      <div className="bg-white rounded-2xl shadow p-5">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Order
            </p>

            <h1 className="text-xl font-bold">
              #{order.orderId}
            </h1>
          </div>

          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
            Waiting for Amount
          </span>

        </div>

      </div>


      {/* Pickup */}

      <div className="bg-white rounded-2xl shadow p-5">

        <h2 className="font-bold text-lg mb-4">
          Pickup Location
        </h2>

        <div className="flex gap-3">

          <div className="w-3 h-3 rounded-full bg-green-500 mt-2" />

          <div>
            <p className="font-semibold">
              Pickup
            </p>

            <p className="text-gray-600 text-sm mt-1">
              {pickup?.address}
            </p>

            {pickup?.name && (
              <p className="text-sm mt-2">
                {pickup.name}
              </p>
            )}

            {pickup?.phone && (
              <p className="text-sm text-gray-500">
                {pickup.phone}
              </p>
            )}
          </div>

        </div>

      </div>


      {/* Drop */}

      <div className="bg-white rounded-2xl shadow p-5">

        <h2 className="font-bold text-lg mb-4">
          Drop Location
        </h2>

        <div className="flex gap-3">

          <div className="w-3 h-3 rounded-full bg-red-500 mt-2" />

          <div>
            <p className="font-semibold">
              Drop
            </p>

            <p className="text-gray-600 text-sm mt-1">
              {drop?.address}
            </p>

            {drop?.name && (
              <p className="text-sm mt-2">
                {drop.name}
              </p>
            )}

            {drop?.phone && (
              <p className="text-sm text-gray-500">
                {drop.phone}
              </p>
            )}
          </div>

        </div>

      </div>


      {/* Distance */}

      <div className="bg-white rounded-2xl shadow p-5">

        <h2 className="font-bold text-lg mb-4">
          Trip Details
        </h2>

        <div className="grid grid-cols-2 gap-3">

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Pickup → Drop
            </p>

            <p className="text-xl font-bold mt-1">
              {order.distance || order.pricing?.distance || 0} km
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Your distance to pickup
            </p>

            <p className="text-xl font-bold mt-1">
              {order.driverDistanceKm ?? "--"} km
            </p>
          </div>

        </div>

        {order.driverEtaMinutes && (
          <div className="mt-3 bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Estimated arrival
            </p>

            <p className="text-lg font-bold text-blue-700">
              {order.driverEtaMinutes} minutes
            </p>
          </div>
        )}

      </div>


      {/* Goods */}

      {order.serviceType === "goods_auto" && goods && (

        <div className="bg-white rounded-2xl shadow p-5">

          <h2 className="font-bold text-lg mb-4">
            Goods Details
          </h2>

          <div className="space-y-3">

            {goods.itemType && (
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Item
                </span>

                <span className="font-semibold">
                  {goods.itemType}
                </span>
              </div>
            )}

            {goods.estimatedWeight != null && (
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Weight
                </span>

                <span className="font-semibold">
                  {goods.estimatedWeight} kg
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-500">
                Helpers
              </span>

              <span className="font-semibold">
                {goods.helpersRequired || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Loading
              </span>

              <span className="font-semibold">
                {goods.loadingRequired ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Unloading
              </span>

              <span className="font-semibold">
                {goods.unloadingRequired ? "Yes" : "No"}
              </span>
            </div>

            {goods.instructions && (
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-500">
                  Instructions
                </p>

                <p className="mt-1">
                  {goods.instructions}
                </p>
              </div>
            )}

          </div>

        </div>

      )}


      {/* Bike Parcel */}

      {order.serviceType === "bike_parcel" &&
        order.parcel && (

        <div className="bg-white rounded-2xl shadow p-5">

          <h2 className="font-bold text-lg mb-4">
            Parcel Details
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Item
              </span>

              <span className="font-semibold">
                {order.parcel.itemName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Category
              </span>

              <span className="font-semibold">
                {order.parcel.category}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Weight
              </span>

              <span className="font-semibold">
                {order.parcel.weight} kg
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Quantity
              </span>

              <span className="font-semibold">
                {order.parcel.quantity}
              </span>
            </div>

            {order.parcel.instructions && (
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-500">
                  Instructions
                </p>

                <p className="mt-1">
                  {order.parcel.instructions}
                </p>
              </div>
            )}

          </div>

        </div>

      )}


      {/* Amount */}

      <div className="bg-white rounded-2xl shadow p-5">

        <h2 className="font-bold text-lg mb-4">
          Enter Your Amount
        </h2>

        <div className="relative">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
            ₹
          </span>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border rounded-xl py-4 pl-9 pr-4 text-lg font-semibold outline-none focus:ring-2 focus:ring-green-500"
          />

        </div>

        <button
          onClick={submitAmount}
          disabled={submitting}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl"
        >
          {submitting
            ? "Submitting..."
            : "Submit Amount"}
        </button>

      </div>

    </div>
  );
}