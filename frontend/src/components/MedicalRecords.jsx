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

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
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
    diagnosis: "",
    prescriptions: "",
    tests: "",
    notes: "",
  });

  useEffect(() => {
    fetchRecords();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${API}/medical-records`);
      setRecords(response.data);
    } catch (error) {
      toast.error("Failed to fetch medical records");
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
      await axios.post(`${API}/medical-records`, formData);
      toast.success("Medical record added successfully");
      fetchRecords();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add medical record");
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: "",
      patient_name: "",
      doctor_id: "",
      doctor_name: "",
      date: "",
      diagnosis: "",
      prescriptions: "",
      tests: "",
      notes: "",
    });
  };

  const filteredRecords = records.filter(record =>
    record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8" data-testid="medical-records-container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Medical Records</h1>
        <p className="text-gray-600">Manage patient medical history and diagnoses</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            data-testid="search-records"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-record-btn" className="bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500">
              <Plus size={20} className="mr-2" />
              Add Medical Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Medical Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient</Label>
                  <Select required value={formData.patient_id} onValueChange={(value) => {
                    const patient = patients.find(p => p.id === value);
                    setFormData({...formData, patient_id: value, patient_name: patient?.name || ""});
                  }}>
                    <SelectTrigger data-testid="record-patient">
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
                    <SelectTrigger data-testid="record-doctor">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Date</Label>
                <Input data-testid="record-date" type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <Label>Diagnosis</Label>
                <Input data-testid="record-diagnosis" required value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} />
              </div>
              <div>
                <Label>Prescriptions</Label>
                <textarea data-testid="record-prescriptions" className="w-full px-3 py-2 border rounded-md" rows="3" required value={formData.prescriptions} onChange={(e) => setFormData({...formData, prescriptions: e.target.value})} />
              </div>
              <div>
                <Label>Tests Recommended</Label>
                <textarea data-testid="record-tests" className="w-full px-3 py-2 border rounded-md" rows="2" value={formData.tests} onChange={(e) => setFormData({...formData, tests: e.target.value})} />
              </div>
              <div>
                <Label>Notes</Label>
                <textarea data-testid="record-notes" className="w-full px-3 py-2 border rounded-md" rows="2" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </div>
              <Button data-testid="save-record-btn" type="submit" className="w-full bg-gradient-to-r from-green-400 to-teal-400">
                Add Medical Record
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow-md p-6 card-hover" data-testid={`record-card-${record.id}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{record.patient_name}</h3>
                <p className="text-sm text-gray-600">Dr. {record.doctor_name} • {record.date}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Medical Record
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Diagnosis</p>
                <p className="text-gray-600">{record.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Prescriptions</p>
                <p className="text-gray-600">{record.prescriptions}</p>
              </div>
              {record.tests && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Tests</p>
                  <p className="text-gray-600">{record.tests}</p>
                </div>
              )}
              {record.notes && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Notes</p>
                  <p className="text-gray-600">{record.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredRecords.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg">No medical records found</div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;