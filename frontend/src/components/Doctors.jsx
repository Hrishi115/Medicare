import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    contact: "",
    email: "",
    department: "",
    availability: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API}/doctors`);
      setDoctors(response.data);
    } catch (error) {
      toast.error("Failed to fetch doctors");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await axios.put(`${API}/doctors/${editingDoctor.id}`, formData);
        toast.success("Doctor updated successfully");
      } else {
        await axios.post(`${API}/doctors`, formData);
        toast.success("Doctor added successfully");
      }
      fetchDoctors();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save doctor");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`${API}/doctors/${id}`);
        toast.success("Doctor deleted successfully");
        fetchDoctors();
      } catch (error) {
        toast.error("Failed to delete doctor");
      }
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      contact: doctor.contact,
      email: doctor.email,
      department: doctor.department,
      availability: doctor.availability,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      specialization: "",
      contact: "",
      email: "",
      department: "",
      availability: "",
    });
    setEditingDoctor(null);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8" data-testid="doctors-container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Doctors</h1>
        <p className="text-gray-600">Manage doctor information and schedules</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            data-testid="search-doctors"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-doctor-btn" className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500">
              <Plus size={20} className="mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input data-testid="doctor-name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <Label>Specialization</Label>
                  <Input data-testid="doctor-specialization" required value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact</Label>
                  <Input data-testid="doctor-contact" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input data-testid="doctor-email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Department</Label>
                <Input data-testid="doctor-department" required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
              </div>
              <div>
                <Label>Availability</Label>
                <Input data-testid="doctor-availability" placeholder="e.g., Mon-Fri, 9AM-5PM" required value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} />
              </div>
              <Button data-testid="save-doctor-btn" type="submit" className="w-full bg-gradient-to-r from-blue-400 to-purple-400">
                {editingDoctor ? "Update" : "Add"} Doctor
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Specialization</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Availability</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id} className="border-b hover:bg-gray-50 transition-colors" data-testid={`doctor-row-${doctor.id}`}>
                <td className="px-6 py-4 text-gray-800">{doctor.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {doctor.specialization}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{doctor.department}</td>
                <td className="px-6 py-4 text-gray-600">{doctor.contact}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{doctor.availability}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button data-testid={`edit-doctor-${doctor.id}`} size="sm" variant="outline" onClick={() => handleEdit(doctor)}>
                      <Edit size={16} />
                    </Button>
                    <Button data-testid={`delete-doctor-${doctor.id}`} size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(doctor.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 text-gray-500">No doctors found</div>
        )}
      </div>
    </div>
  );
};

export default Doctors;