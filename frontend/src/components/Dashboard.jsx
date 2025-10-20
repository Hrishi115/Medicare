import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Stethoscope, Calendar, CreditCard, UserCog, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_patients: 0,
    total_doctors: 0,
    total_appointments: 0,
    total_staff: 0,
    pending_bills: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Patients",
      value: stats.total_patients,
      icon: Users,
      color: "from-teal-400 to-teal-500",
      testId: "stat-patients"
    },
    {
      title: "Total Doctors",
      value: stats.total_doctors,
      icon: Stethoscope,
      color: "from-blue-400 to-blue-500",
      testId: "stat-doctors"
    },
    {
      title: "Appointments",
      value: stats.total_appointments,
      icon: Calendar,
      color: "from-purple-400 to-purple-500",
      testId: "stat-appointments"
    },
    {
      title: "Staff Members",
      value: stats.total_staff,
      icon: UserCog,
      color: "from-orange-400 to-orange-500",
      testId: "stat-staff"
    },
    {
      title: "Pending Bills",
      value: stats.pending_bills,
      icon: CreditCard,
      color: "from-red-400 to-red-500",
      testId: "stat-bills"
    },
  ];

  return (
    <div className="p-8" data-testid="dashboard-container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to MediCare Hospital Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="card-hover" data-testid={card.testId}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                  <Icon className="text-white" size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{card.value}</div>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp size={14} className="mr-1" />
                  <span>Active</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-blue-400 text-white rounded-lg font-medium hover:shadow-lg" data-testid="quick-add-patient">
              Add New Patient
            </button>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg font-medium hover:shadow-lg" data-testid="quick-schedule-appointment">
              Schedule Appointment
            </button>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg font-medium hover:shadow-lg" data-testid="quick-add-medicine">
              Add Medicine Stock
            </button>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Backup</span>
                <span className="text-gray-800 text-sm">Today, 12:00 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">System Health</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;