import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import Patients from "@/components/Patients";
import Doctors from "@/components/Doctors";
import Staff from "@/components/Staff";
import Appointments from "@/components/Appointments";
import MedicalRecords from "@/components/MedicalRecords";
import Billing from "@/components/Billing";
import Inventory from "@/components/Inventory";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;