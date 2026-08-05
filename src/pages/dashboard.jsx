import { useEffect, useState } from 'react'
// import Navbar from '../componetstoowner/navbertoowner'
import api from '../../api.js';
import { ToggleRight, ToggleLeft } from 'lucide-react';
import { generateAndSaveFCMToken } from '../utili/token.js';
import PartnerNavbar from './navbar.jsx';

const Dashboard = () => {

  const [kocartAmount, setkocartAmount] = useState(0);
  const [isOnline, setisOnline] = useState(false);
  const [activate, setactivate] = useState(null);
  const [serviceType, setserviceType] = useState(null);
  const [step, setstep] = useState(1);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/parcel/dashboard')
      console.log(res.data.isOnline, 'dashboard')
      setisOnline(res.data.isOnline)
      setkocartAmount(res.data.kocartAmount || 0)
      setactivate(res.data.activate)
      setserviceType(res.data.serviceType)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchDashboard()
      await generateAndSaveFCMToken()
    }
    loadData()
  }, [])

  const handleToggle = async () => {

    const newStatus = !isOnline;
    setisOnline(newStatus);

    try {
      await api.post(
        "/api/parcel/onANDoff",
        { isOnline: newStatus },
        { withCredentials: true }
      ).then((res) => {
        if (res.data.success === true) {
          fetchDashboard()
        }
      })
    } catch (err) {
      console.error(err);
    }
  };


  if (!activate) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black opacity-60"
        ></div>
        {/* Popup Content */}
        <div className="bg-white rounded-2xl shadow-lg text-center z-10 w-96 p-6">
          <h1 className="text-red-500 mb-5">
            ACTIVATE YOUR ACCOUNT
          </h1>
          <p>
            contact (7349343243) or (8088303214) <br /> to active
          </p>

        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

      {/* Delivery Status */}
      {/* Delivery Dashboard */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Left - Online Status */}
          <div className="flex items-center gap-4">

            <div
              className={`p-3 rounded-full ${isOnline
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
                }`}
            >
              {isOnline ? (
                <ToggleRight size={34} />
              ) : (
                <ToggleLeft size={34} />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Partner
              </h2>

              <p
                className={`font-medium ${isOnline ? "text-green-600" : "text-red-600"
                  }`}
              >
                {isOnline
                  ? "🟢 Online - Ready for Orders"
                  : "🔴 Offline"}
              </p>
            </div>

          </div>

          {serviceType === "bike_parcel" && (
            <>
              {/* Center - Dashboard Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">
                    KOCART Cash
                  </p>

                  <h2 className="text-2xl font-bold text-yellow-700">
                    ₹{Number(kocartAmount || 0).toFixed(2)}

                  </h2>
                </div>

              </div>
            </>)

          }

          {/* Right - Toggle */}
          <div className="flex flex-col items-center gap-2">

            <input
              type="checkbox"
              checked={isOnline}
              onChange={handleToggle}
              className="w-7 h-7 cursor-pointer"
            />

            <span className="text-sm text-gray-500">
              {isOnline ? "Online" : "Offline"}
            </span>

          </div>

        </div>
      </div>
      <PartnerNavbar serviceType={serviceType} />
    </div>
  )
}

export default Dashboard;
