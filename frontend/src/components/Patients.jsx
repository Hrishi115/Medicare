import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    contact: "",
    address: "",
    blood_group: "A+",
    medical_history: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API}/patients`);
      setPatients(response.data);
    } catch (error) {
      toast.error("Failed to fetch patients");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await axios.put(`${API}/patients/${editingPatient.id}`, formData);
        toast.success("Patient updated successfully");
      } else {
        await axios.post(`${API}/patients`, formData);
        toast.success("Patient added successfully");
      }
      fetchPatients();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save patient");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`${API}/patients/${id}`);
        toast.success("Patient deleted successfully");
        fetchPatients();
      } catch (error) {
        toast.error("Failed to delete patient");
      }
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      contact: patient.contact,
      address: patient.address,
      blood_group: patient.blood_group,
      medical_history: patient.medical_history || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "Male",
      contact: "",
      address: "",
      blood_group: "A+",
      medical_history: "",
    });
    setEditingPatient(null);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8" data-testid="patients-container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Patients</h1>
        <p className="text-gray-600">Manage patient records and information</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            data-testid="search-patients"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-patient-btn" className="bg-gradient-to-r from-teal-400 to-blue-400 hover:from-teal-500 hover:to-blue-500">
              <Plus size={20} className="mr-2" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPatient ? "Edit Patient" : "Add New Patient"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input data-testid="patient-name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input data-testid="patient-age" type="number" required value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <SelectTrigger data-testid="patient-gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Blood Group</Label>
                  <Select value={formData.blood_group} onValueChange={(value) => setFormData({...formData, blood_group: value})}>
                    <SelectTrigger data-testid="patient-blood-group">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Contact</Label>
                <Input data-testid="patient-contact" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
              </div>
              <div>
                <Label>Address</Label>
                <Input data-testid="patient-address" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <Label>Medical History</Label>
                <textarea data-testid="patient-medical-history" className="w-full px-3 py-2 border rounded-md" rows="3" value={formData.medical_history} onChange={(e) => setFormData({...formData, medical_history: e.target.value})} />
              </div>
              <Button data-testid="save-patient-btn" type="submit" className="w-full bg-gradient-to-r from-teal-400 to-blue-400">
                {editingPatient ? "Update" : "Add"} Patient
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-teal-50 to-blue-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Age</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gender</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Blood Group</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-b hover:bg-gray-50 transition-colors" data-testid={`patient-row-${patient.id}`}>
                <td className="px-6 py-4 text-gray-800">{patient.name}</td>
                <td className="px-6 py-4 text-gray-600">{patient.age}</td>
                <td className="px-6 py-4 text-gray-600">{patient.gender}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {patient.blood_group}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{patient.contact}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button data-testid={`edit-patient-${patient.id}`} size="sm" variant="outline" onClick={() => handleEdit(patient)}>
                      <Edit size={16} />
                    </Button>
                    <Button data-testid={`delete-patient-${patient.id}`} size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(patient.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPatients.length === 0 && (
          <div className="text-center py-12 text-gray-500">No patients found</div>
        )}
      </div>
    </div>
  );
};

export default Patients;