import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    patient_name: "",
    appointment_id: "",
    items: "",
    total_amount: "",
    payment_status: "pending",
  });

  useEffect(() => {
    fetchBills();
    fetchPatients();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get(`${API}/bills`);
      setBills(response.data);
    } catch (error) {
      toast.error("Failed to fetch bills");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/bills`, formData);
      toast.success("Bill created successfully");
      fetchBills();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create bill");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API}/bills/${id}/status?payment_status=${status}`);
      toast.success("Payment status updated");
      fetchBills();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: "",
      patient_name: "",
      appointment_id: "",
      items: "",
      total_amount: "",
      payment_status: "pending",
    });
  };

  const filteredBills = bills.filter(bill =>
    bill.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-8" data-testid="billing-container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Billing</h1>
        <p className="text-gray-600">Manage invoices and payment records</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            data-testid="search-bills"
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-bill-btn" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500">
              <Plus size={20} className="mr-2" />
              Create Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Bill</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Patient</Label>
                <Select required value={formData.patient_id} onValueChange={(value) => {
                  const patient = patients.find(p => p.id === value);
                  setFormData({...formData, patient_id: value, patient_name: patient?.name || ""});
                }}>
                  <SelectTrigger data-testid="bill-patient">
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
                <Label>Items/Services</Label>
                <textarea data-testid="bill-items" className="w-full px-3 py-2 border rounded-md" rows="3" required placeholder="e.g., Consultation: $50, X-Ray: $100" value={formData.items} onChange={(e) => setFormData({...formData, items: e.target.value})} />
              </div>
              <div>
                <Label>Total Amount ($)</Label>
                <Input data-testid="bill-amount" type="number" step="0.01" required value={formData.total_amount} onChange={(e) => setFormData({...formData, total_amount: e.target.value})} />
              </div>
              <div>
                <Label>Payment Status</Label>
                <Select value={formData.payment_status} onValueChange={(value) => setFormData({...formData, payment_status: value})}>
                  <SelectTrigger data-testid="bill-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button data-testid="save-bill-btn" type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-orange-400">
                Create Bill
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id} className="border-b hover:bg-gray-50 transition-colors" data-testid={`bill-row-${bill.id}`}>
                <td className="px-6 py-4 text-gray-800">{bill.patient_name}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{bill.items}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-gray-800 font-semibold">
                    <DollarSign size={16} className="text-green-600" />
                    {bill.total_amount}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{new Date(bill.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.payment_status)}`}>
                    {bill.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Select value={bill.payment_status} onValueChange={(value) => handleStatusChange(bill.id, value)}>
                    <SelectTrigger data-testid={`bill-status-${bill.id}`} className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBills.length === 0 && (
          <div className="text-center py-12 text-gray-500">No bills found</div>
        )}
      </div>
    </div>
  );
};

export default Billing;