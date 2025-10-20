import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    expiry_date: "",
    manufacturer: "",
    category: "",
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${API}/medicines`);
      setMedicines(response.data);
    } catch (error) {
      toast.error("Failed to fetch medicines");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicine) {
        await axios.put(`${API}/medicines/${editingMedicine.id}`, formData);
        toast.success("Medicine updated successfully");
      } else {
        await axios.post(`${API}/medicines`, formData);
        toast.success("Medicine added successfully");
      }
      fetchMedicines();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save medicine");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axios.delete(`${API}/medicines/${id}`);
        toast.success("Medicine deleted successfully");
        fetchMedicines();
      } catch (error) {
        toast.error("Failed to delete medicine");
      }
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      quantity: medicine.quantity,
      price: medicine.price,
      expiry_date: medicine.expiry_date,
      manufacturer: medicine.manufacturer,
      category: medicine.category,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      quantity: "",
      price: "",
      expiry_date: "",
      manufacturer: "",
      category: "",
    });
    setEditingMedicine(null);
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLowStock = (quantity) => quantity < 20;

  return (
    <div className="p-8" data-testid="inventory-container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Inventory</h1>
        <p className="text-gray-600">Manage pharmacy and medical supplies</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            data-testid="search-medicines"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-medicine-btn" className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500">
              <Plus size={20} className="mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMedicine ? "Edit Medicine" : "Add New Medicine"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Medicine Name</Label>
                <Input data-testid="medicine-name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quantity</Label>
                  <Input data-testid="medicine-quantity" type="number" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div>
                  <Label>Price ($)</Label>
                  <Input data-testid="medicine-price" type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input data-testid="medicine-expiry" type="date" required value={formData.expiry_date} onChange={(e) => setFormData({...formData, expiry_date: e.target.value})} />
              </div>
              <div>
                <Label>Manufacturer</Label>
                <Input data-testid="medicine-manufacturer" required value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} />
              </div>
              <div>
                <Label>Category</Label>
                <Input data-testid="medicine-category" required placeholder="e.g., Antibiotic, Pain Relief" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
              <Button data-testid="save-medicine-btn" type="submit" className="w-full bg-gradient-to-r from-indigo-400 to-purple-400">
                {editingMedicine ? "Update" : "Add"} Medicine
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Medicine</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Manufacturer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((med) => (
              <tr key={med.id} className="border-b hover:bg-gray-50 transition-colors" data-testid={`medicine-row-${med.id}`}>
                <td className="px-6 py-4 text-gray-800">{med.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    {med.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800">{med.quantity}</span>
                    {isLowStock(med.quantity) && (
                      <AlertCircle size={16} className="text-red-500" title="Low Stock" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-800">${med.price}</td>
                <td className="px-6 py-4 text-gray-600">{med.expiry_date}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{med.manufacturer}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button data-testid={`edit-medicine-${med.id}`} size="sm" variant="outline" onClick={() => handleEdit(med)}>
                      <Edit size={16} />
                    </Button>
                    <Button data-testid={`delete-medicine-${med.id}`} size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(med.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMedicines.length === 0 && (
          <div className="text-center py-12 text-gray-500">No medicines found</div>
        )}
      </div>
    </div>
  );
};

export default Inventory;