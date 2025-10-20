import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    contact: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${API}/staff`);
      setStaff(response.data);
    } catch (error) {
      toast.error("Failed to fetch staff");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/staff`, formData);
      toast.success("Staff member added successfully");
      fetchStaff();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add staff member");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await axios.delete(`${API}/staff/${id}`);
        toast.success("Staff member deleted successfully");
        fetchStaff();
      } catch (error) {
        toast.error("Failed to delete staff member");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      contact: "",
      email: "",
      department: "",
    });
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8" data-testid="staff-container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Staff</h1>
        <p className="text-gray-600">Manage hospital staff members</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            data-testid="search-staff"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-staff-btn" className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500">
              <Plus size={20} className="mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input data-testid="staff-name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <Label>Role</Label>
                <Input data-testid="staff-role" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g., Nurse, Receptionist" />
              </div>
              <div>
                <Label>Contact</Label>
                <Input data-testid="staff-contact" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
              </div>
              <div>
                <Label>Email</Label>
                <Input data-testid="staff-email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <Label>Department</Label>
                <Input data-testid="staff-department" required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
              </div>
              <Button data-testid="save-staff-btn" type="submit" className="w-full bg-gradient-to-r from-orange-400 to-red-400">
                Add Staff Member
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-orange-50 to-red-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50 transition-colors" data-testid={`staff-row-${member.id}`}>
                <td className="px-6 py-4 text-gray-800">{member.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{member.department}</td>
                <td className="px-6 py-4 text-gray-600">{member.contact}</td>
                <td className="px-6 py-4 text-gray-600">{member.email}</td>
                <td className="px-6 py-4">
                  <Button data-testid={`delete-staff-${member.id}`} size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(member.id)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStaff.length === 0 && (
          <div className="text-center py-12 text-gray-500">No staff members found</div>
        )}
      </div>
    </div>
  );
};

export default Staff;