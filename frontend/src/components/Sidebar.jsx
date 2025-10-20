import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  UserCog, 
  Calendar, 
  FileText, 
  CreditCard, 
  Package 
} from "lucide-react";

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "patients", label: "Patients", icon: Users, path: "/patients" },
    { id: "doctors", label: "Doctors", icon: Stethoscope, path: "/doctors" },
    { id: "staff", label: "Staff", icon: UserCog, path: "/staff" },
    { id: "appointments", label: "Appointments", icon: Calendar, path: "/appointments" },
    { id: "medical-records", label: "Medical Records", icon: FileText, path: "/medical-records" },
    { id: "billing", label: "Billing", icon: CreditCard, path: "/billing" },
    { id: "inventory", label: "Inventory", icon: Package, path: "/inventory" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white shadow-xl border-r border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
          MediCare
        </h1>
        <p className="text-xs text-gray-500 mt-1">Hospital Management</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setActiveView(item.id)}
              data-testid={`nav-${item.id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-teal-400 to-blue-400 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-teal-600"
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;