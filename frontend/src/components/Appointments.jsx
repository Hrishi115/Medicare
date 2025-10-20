import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    patient_name: "",
    doctor_id: "",
    doctor_name: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API}/appointments`);
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API}/patients`);
      setPatients(response.data);
    } catch (error) {
      console.error("Failed to fetch patients");
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API}/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/appointments`, formData);
      toast.success("Appointment scheduled successfully");
      fetchAppointments();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to schedule appointment");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API}/appointments/${id}/status?status=${status}`);
      toast.success("Status updated successfully");
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: "",
      patient_name: "",
      doctor_id: "",
      doctor_name: "",
      date: "",
      time: "",
      reason: "",
      notes: "",
    });
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-8" data-testid="appointments-container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Appointments</h1>
        <p className="text-gray-600">Schedule and manage patient appointments</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            data-testid="search-appointments"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-appointment-btn" className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500">
              <Plus size={20} className="mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Patient</Label>
                <Select required value={formData.patient_id} onValueChange={(value) => {
                  const patient = patients.find(p => p.id === value);
                  setFormData({...formData, patient_id: value, patient_name: patient?.name || ""});
                }}>
                  <SelectTrigger data-testid="appointment-patient">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Doctor</Label>
                <Select required value={formData.doctor_id} onValueChange={(value) => {
                  const doctor = doctors.find(d => d.id === value);
                  setFormData({...formData, doctor_id: value, doctor_name: doctor?.name || ""});
                }}>
                  <SelectTrigger data-testid="appointment-doctor">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialization}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input data-testid="appointment-date" type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input data-testid="appointment-time" type="time" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Reason</Label>
                <Input data-testid="appointment-reason" required value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} />
              </div>
              <div>
                <Label>Notes</Label>
                <textarea data-testid="appointment-notes" className="w-full px-3 py-2 border rounded-md" rows="3" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </div>
              <Button data-testid="save-appointment-btn" type="submit" className="w-full bg-gradient-to-r from-purple-400 to-pink-400">
                Schedule Appointment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Doctor</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reason</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((apt) => (
              <tr key={apt.id} className="border-b hover:bg-gray-50 transition-colors" data-testid={`appointment-row-${apt.id}`}>
                <td className="px-6 py-4 text-gray-800">{apt.patient_name}</td>
                <td className="px-6 py-4 text-gray-800">{apt.doctor_name}</td>
                <td className="px-6 py-4 text-gray-600">{apt.date} {apt.time}</td>
                <td className="px-6 py-4 text-gray-600">{apt.reason}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Select value={apt.status} onValueChange={(value) => handleStatusChange(apt.id, value)}>
                    <SelectTrigger data-testid={`status-${apt.id}`} className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 text-gray-500">No appointments found</div>
        )}
      </div>
    </div>
  );
};

export default Appointments;