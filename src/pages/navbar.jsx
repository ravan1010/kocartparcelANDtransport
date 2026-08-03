import NAV_ITEMS from "../navbar.json"
import { NavLink } from "react-router-dom";

export default function PartnerNavbar({ serviceType }) {
  const items = NAV_ITEMS[serviceType] || [];

  return (
    <nav className="bg-white shadow rounded-xl p-3">
      <div className="flex gap-3 overflow-x-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg whitespace-nowrap transition ${
                isActive
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}