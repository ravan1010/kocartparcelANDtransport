import { useEffect, useState } from "react";
import api from "../../../api";

export default function AcceptedOrder() {
  const [order, setOrder] = useState(null);
  const [WaitingForCustomer, setWaitingForCustomer] = useState(false)
  const [driverQuote, setDriverQuote] = useState(null)
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchAcceptedOrder = async () => {
    try {
      const res = await api.get(
        "/api/parter/accepted/order"
      );

      if (res.data.type === "confirm") {
        // Show waiting/loading screen3
        setWaitingForCustomer(true);
        setOrder(res.data.order);
        setDriverQuote(res.data.driverQuote);
      } else {
        // Show normal accepted-order page
        setWaitingForCustomer(false);
        setOrder(res.data.order);
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

  if (WaitingForCustomer) {
    return (

      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

            {/* Top loading section */}
            <div className="px-6 pt-8 pb-6 text-center">

              {/* Animated loader */}
              <div className="relative w-20 h-20 mx-auto mb-5">

                <div className="absolute inset-0 rounded-full border-4 border-gray-200" />

                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">₹</span>
                </div>

              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Amount Submitted
              </h2>

              <p className="text-gray-500 mt-2 text-sm leading-5">
                Waiting for the customer to choose a driver
              </p>

            </div>


            {/* Amount */}
            <div className="px-5">

              <div className="bg-gray-50 rounded-2xl p-5 text-center">

                <p className="text-sm text-gray-500">
                  Your Amount
                </p>

                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  ₹{driverQuote?.amount}
                </p>

              </div>

            </div>


            {/* Trip information */}
            <div className="p-5 grid grid-cols-2 gap-3">

              <div className="bg-blue-50 rounded-2xl p-4">

                <p className="text-xs text-gray-500">
                  Pickup Distance
                </p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  {driverQuote?.distanceKm} km
                </p>

              </div>


              <div className="bg-green-50 rounded-2xl p-4">

                <p className="text-xs text-gray-500">
                  ETA
                </p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  {driverQuote?.etaMinutes} min
                </p>

              </div>

            </div>


            {/* Status */}
            <div className="px-5 pb-5">

              <div className="border border-yellow-200 bg-yellow-50 rounded-2xl p-4">

                <div className="flex items-start gap-3">

                  <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <span className="animate-pulse">
                      ⏳
                    </span>
                  </div>

                  <div>

                    <p className="font-semibold text-yellow-800">
                      Waiting for customer
                    </p>

                    <p className="text-sm text-yellow-700 mt-1">
                      Your price has been sent to the customer.
                      Please wait while they compare driver offers.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Bottom */}
            <div className="border-t bg-gray-50 px-5 py-4 text-center">

              <p className="text-xs text-gray-500">
                You will be notified when the customer selects a driver.
              </p>

            </div>

          </div>

        </div>
      </div>
    )
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

            <a
              href={`https://www.google.com/maps?q=${order.pickup.location.coordinates[1]},${order.pickup.location.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Navigate →
            </a>
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
            <a
              href={`https://www.google.com/maps?q=${order.drop.location.coordinates[1]},${order.drop.location.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Navigate →
            </a>
          </div>

        </div>

      </div>


      {/* Distance */}

      <div className="bg-white rounded-2xl shadow p-5">

        <h2 className="font-bold text-lg mb-4">
          Trip Details
        </h2>

        <div className="grid grid-cols-1 gap-3">

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Pickup → Drop
            </p>

            <p className="text-xl font-bold mt-1">
              {order.distance || order.pricing?.distance || 0} km
            </p>
          </div>
        </div>
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