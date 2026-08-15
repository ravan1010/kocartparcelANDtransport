import { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

export default function AcceptedOrder() {

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [WaitingForCustomer, setWaitingForCustomer] = useState(false)
  const [driverQuote, setDriverQuote] = useState(null)
  const [driverId, setdriverId] = useState(null)
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");


  const fetchAcceptedOrder = async () => {
  try {
    const res = await api.get("/api/parter/accepted/order");

    const data = res.data;

    // IMPORTANT:
    // Use fresh API response values, not old React state
    const currentOrder = data.order;
    const currentDriverId = data.driverId;



    setOrder(currentOrder);
    setdriverId(currentDriverId);

    if (data.type === "confirm") {
      setWaitingForCustomer(true);
      setDriverQuote(data.driverQuote);
      return;
    }

    setWaitingForCustomer(false);

    // Driver selected
    if (
      currentOrder.status === "driver_assigned" &&
      String(currentOrder.driver) === String(currentDriverId)
    ) {
      navigate("/goods/arrive/order", { replace: true });
      return;
    }

    // Another driver selected
    if (
      currentOrder.status === "driver_assigned" &&
      String(currentOrder.driver) !== String(currentDriverId)
    ) {
      navigate("/goods/available/order", { replace: true });
      return;
    }

    // Another driver selected
    if (
      currentOrder.status === "cancelled"    ) {
      navigate("/goods/available/order", { replace: true });
      return;
    }

  } catch (err) {
    console.error("Fetch accepted order error:", err);
    setError("Unable to load order");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  // First request immediately
  fetchAcceptedOrder();

  // Then check every 5 seconds
  const interval = setInterval(() => {
    fetchAcceptedOrder();
  }, 5000);

  return () => {
    clearInterval(interval);
  };
}, []);


  const submitAmount = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      setSubmitting(true);
      setLoading(true)

      const { data } = await api.post(
        `/api/parter/accepted/order/amount/${order._id}`,
        {
          amount: Number(amount),
        }
      );

      if (data.success) {
        setOrder(data.order);
        alert("Amount submitted successfully");
        fetchAcceptedOrder();
      }

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Failed to submit amount"
      );
    } finally {
      setSubmitting(false);
      setLoading(false)
    }
  };

  const Reassign = async () => {
  try {
    // if (!order?._id) return;

    setLoading(true);

    const res = await api.put(
      `/api/partner/orders/Reassign/${order._id}`,
      {}
    );

    if (res.data.success) {
      navigate("/goods/available/order", { replace: true });
      return;
    }

  } catch (err) {
    console.error("Reassign error:", err);

    alert(
      err.response?.data?.message ||
      "Unable to cancel order"
    );
  } finally {
    setLoading(false);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 overflow-hidden">

          {/* Header / Loader */}
          <div className="px-6 pt-9 pb-7 text-center">

            {/* Animated loader */}
            <div className="relative w-24 h-24 mx-auto mb-5">

              <div className="absolute inset-0 rounded-full bg-green-50" />

              <div className="absolute inset-1 rounded-full border-4 border-gray-200" />

              <div className="absolute inset-1 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    ₹
                  </span>
                </div>
              </div>

            </div>

            <h2 className="text-2xl font-extrabold text-gray-900">
              Amount Submitted
            </h2>

            <p className="text-gray-500 mt-2 text-sm leading-5 max-w-xs mx-auto">
              Waiting for the customer to choose a driver
            </p>

          </div>


          {/* Amount */}
          <div className="px-5">

            <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5 text-center">

              <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-green-100/60" />

              <p className="relative text-sm font-medium text-gray-500">
                Your Amount
              </p>

              <p className="relative text-4xl font-black text-gray-900 mt-1">
                ₹{driverQuote?.amount}
              </p>

            </div>

          </div>


          {/* Trip Information */}
          <div className="p-5 grid grid-cols-2 gap-3">

            {/* Distance */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">
                    📍
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Pickup Distance
                  </p>

                  <p className="text-xl font-extrabold text-gray-900 mt-0.5">
                    {driverQuote?.distanceKm} km
                  </p>
                </div>

              </div>

            </div>


            {/* ETA */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                  <span className="text-lg">
                    🕐
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    ETA
                  </p>

                  <p className="text-xl font-extrabold text-gray-900 mt-0.5">
                    {driverQuote?.etaMinutes} min
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* Waiting Status */}
          <div className="px-5 pb-5">

            <div className="border border-yellow-200 bg-yellow-50 rounded-2xl p-4">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">

                  <span className="text-lg animate-pulse">
                    ⏳
                  </span>

                </div>

                <div className="flex-1">

                  <p className="font-bold text-yellow-800">
                    Waiting for customer
                  </p>

                  <p className="text-sm text-yellow-700 mt-1 leading-5">
                    Your price has been sent to the customer.
                    Please wait while they compare driver offers.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* Bottom Actions */}
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-5">

            <p className="text-xs text-gray-500 text-center mb-4">
              You will be notified when the customer selects a driver.
            </p>
{/* Cancel */}
  <button
    type="button"
    onClick={Reassign}
    disabled={submitting || loading}
    className="
      w-full
      h-14
      flex
      items-center
      justify-center
      gap-2
      rounded-2xl
      bg-red-50
      text-red-600
      border-2
      border-red-200
      hover:bg-red-100
      hover:border-red-300
      active:scale-[0.98]
      disabled:opacity-50
      disabled:cursor-not-allowed
      font-bold
      text-base
      transition-all
      duration-200
    "
  >
    <span className="text-lg">
      ✕
    </span>

    <span>
      Cancel Order
    </span>
  </button>


          </div>

        </div>

      </div>

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

      {/* Amount */}

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5 sm:p-6">

  {/* Header */}
  <div className="mb-5">
    <h2 className="text-xl font-extrabold text-gray-900">
      Enter Your Amount
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Enter the amount you want to charge for this order.
    </p>
  </div>


  {/* Amount Input */}
  <div className="relative">

    <span
      className="
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        text-gray-500
        text-xl
        font-bold
        pointer-events-none
      "
    >
      ₹
    </span>

    <input
      type="number"
      min="0"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      placeholder="Enter amount"
      className="
        w-full
        h-16
        border
        border-gray-200
        bg-gray-50
        rounded-2xl
        pl-11
        pr-4
        text-xl
        font-bold
        text-gray-900
        placeholder:text-gray-400
        outline-none
        transition-all
        duration-200
        focus:bg-white
        focus:border-green-500
        focus:ring-4
        focus:ring-green-100
      "
    />

  </div>


  {/* Actions */}
  {/* Actions */}
<div className="mt-6 space-y-3">

  {/* Submit Amount */}
  <button
    type="button"
    onClick={submitAmount}
    disabled={submitting || !amount}
    className="
      w-full
      h-14
      flex
      items-center
      justify-center
      gap-2
      rounded-2xl
      bg-green-600
      hover:bg-green-700
      active:scale-[0.98]
      disabled:bg-gray-300
      disabled:text-gray-500
      disabled:cursor-not-allowed
      text-white
      font-bold
      text-base
      shadow-md
      transition-all
      duration-200
    "
  >
    {submitting ? (
      <>
        <span
          className="
            w-5 h-5
            border-2
            border-white/40
            border-t-white
            rounded-full
            animate-spin
          "
        />

        <span>Submitting...</span>
      </>
    ) : (
      <>
        <span className="text-lg">✓</span>
        <span>Submit Amount</span>
      </>
    )}
  </button>


  {/* Cancel */}
  <button
    type="button"
    onClick={Reassign}
    disabled={submitting || loading}
    className="
      w-full
      h-14
      flex
      items-center
      justify-center
      gap-2
      rounded-2xl
      bg-red-50
      text-red-600
      border-2
      border-red-200
      hover:bg-red-100
      hover:border-red-300
      active:scale-[0.98]
      disabled:opacity-50
      disabled:cursor-not-allowed
      font-bold
      text-base
      transition-all
      duration-200
    "
  >
    <span className="text-lg">
      ✕
    </span>

    <span>
      Cancel Order
    </span>
  </button>

</div>

</div>

    </div>
  );
}