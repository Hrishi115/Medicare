from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")


# ==================== MODELS ====================

# Patient Models
class Patient(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: int
    gender: str
    contact: str
    address: str
    blood_group: str
    medical_history: Optional[str] = ""
    registration_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
    contact: str
    address: str
    blood_group: str
    medical_history: Optional[str] = ""

# Doctor Models
class Doctor(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    specialization: str
    contact: str
    email: str
    department: str
    availability: str
    created_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class DoctorCreate(BaseModel):
    name: str
    specialization: str
    contact: str
    email: str
    department: str
    availability: str

# Staff Models
class Staff(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    contact: str
    email: str
    department: str
    created_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class StaffCreate(BaseModel):
    name: str
    role: str
    contact: str
    email: str
    department: str

# Appointment Models
class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    patient_name: str
    doctor_id: str
    doctor_name: str
    date: str
    time: str
    status: str = "scheduled"
    reason: str
    notes: Optional[str] = ""
    created_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AppointmentCreate(BaseModel):
    patient_id: str
    patient_name: str
    doctor_id: str
    doctor_name: str
    date: str
    time: str
    reason: str
    notes: Optional[str] = ""

# Medical Record Models
class MedicalRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    patient_name: str
    doctor_id: str
    doctor_name: str
    date: str
    diagnosis: str
    prescriptions: str
    tests: Optional[str] = ""
    notes: Optional[str] = ""
    created_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MedicalRecordCreate(BaseModel):
    patient_id: str
    patient_name: str
    doctor_id: str
    doctor_name: str
    date: str
    diagnosis: str
    prescriptions: str
    tests: Optional[str] = ""
    notes: Optional[str] = ""

# Billing Models
class Bill(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    patient_name: str
    appointment_id: Optional[str] = ""
    items: str
    total_amount: float
    payment_status: str = "pending"
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class BillCreate(BaseModel):
    patient_id: str
    patient_name: str
    appointment_id: Optional[str] = ""
    items: str
    total_amount: float
    payment_status: str = "pending"

# Medicine/Inventory Models
class Medicine(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    quantity: int
    price: float
    expiry_date: str
    manufacturer: str
    category: str
    created_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MedicineCreate(BaseModel):
    name: str
    quantity: int
    price: float
    expiry_date: str
    manufacturer: str
    category: str


# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Hospital Management System API"}

# ---------- PATIENT ROUTES ----------
@api_router.post("/patients", response_model=Patient)
async def create_patient(patient: PatientCreate):
    patient_obj = Patient(**patient.model_dump())
    doc = patient_obj.model_dump()
    await db.patients.insert_one(doc)
    return patient_obj

@api_router.get("/patients", response_model=List[Patient])
async def get_patients():
    patients = await db.patients.find({}, {"_id": 0}).to_list(1000)
    return patients

@api_router.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(patient_id: str):
    patient = await db.patients.find_one({"id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@api_router.put("/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, patient: PatientCreate):
    result = await db.patients.update_one(
        {"id": patient_id},
        {"$set": patient.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    updated = await db.patients.find_one({"id": patient_id}, {"_id": 0})
    return updated

@api_router.delete("/patients/{patient_id}")
async def delete_patient(patient_id: str):
    result = await db.patients.delete_one({"id": patient_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"message": "Patient deleted successfully"}

# ---------- DOCTOR ROUTES ----------
@api_router.post("/doctors", response_model=Doctor)
async def create_doctor(doctor: DoctorCreate):
    doctor_obj = Doctor(**doctor.model_dump())
    doc = doctor_obj.model_dump()
    await db.doctors.insert_one(doc)
    return doctor_obj

@api_router.get("/doctors", response_model=List[Doctor])
async def get_doctors():
    doctors = await db.doctors.find({}, {"_id": 0}).to_list(1000)
    return doctors

@api_router.get("/doctors/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: str):
    doctor = await db.doctors.find_one({"id": doctor_id}, {"_id": 0})
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@api_router.put("/doctors/{doctor_id}", response_model=Doctor)
async def update_doctor(doctor_id: str, doctor: DoctorCreate):
    result = await db.doctors.update_one(
        {"id": doctor_id},
        {"$set": doctor.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    updated = await db.doctors.find_one({"id": doctor_id}, {"_id": 0})
    return updated

@api_router.delete("/doctors/{doctor_id}")
async def delete_doctor(doctor_id: str):
    result = await db.doctors.delete_one({"id": doctor_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {"message": "Doctor deleted successfully"}

# ---------- STAFF ROUTES ----------
@api_router.post("/staff", response_model=Staff)
async def create_staff(staff: StaffCreate):
    staff_obj = Staff(**staff.model_dump())
    doc = staff_obj.model_dump()
    await db.staff.insert_one(doc)
    return staff_obj

@api_router.get("/staff", response_model=List[Staff])
async def get_staff():
    staff = await db.staff.find({}, {"_id": 0}).to_list(1000)
    return staff

@api_router.delete("/staff/{staff_id}")
async def delete_staff(staff_id: str):
    result = await db.staff.delete_one({"id": staff_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Staff not found")
    return {"message": "Staff deleted successfully"}

# ---------- APPOINTMENT ROUTES ----------
@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment: AppointmentCreate):
    appointment_obj = Appointment(**appointment.model_dump())
    doc = appointment_obj.model_dump()
    await db.appointments.insert_one(doc)
    return appointment_obj

@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments():
    appointments = await db.appointments.find({}, {"_id": 0}).to_list(1000)
    return appointments

@api_router.put("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: str, appointment: AppointmentCreate):
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": appointment.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    updated = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    return updated

@api_router.patch("/appointments/{appointment_id}/status")
async def update_appointment_status(appointment_id: str, status: str):
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Status updated successfully"}

@api_router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    result = await db.appointments.delete_one({"id": appointment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted successfully"}

# ---------- MEDICAL RECORD ROUTES ----------
@api_router.post("/medical-records", response_model=MedicalRecord)
async def create_medical_record(record: MedicalRecordCreate):
    record_obj = MedicalRecord(**record.model_dump())
    doc = record_obj.model_dump()
    await db.medical_records.insert_one(doc)
    return record_obj

@api_router.get("/medical-records", response_model=List[MedicalRecord])
async def get_medical_records():
    records = await db.medical_records.find({}, {"_id": 0}).to_list(1000)
    return records

@api_router.get("/medical-records/patient/{patient_id}", response_model=List[MedicalRecord])
async def get_patient_medical_records(patient_id: str):
    records = await db.medical_records.find({"patient_id": patient_id}, {"_id": 0}).to_list(1000)
    return records

# ---------- BILLING ROUTES ----------
@api_router.post("/bills", response_model=Bill)
async def create_bill(bill: BillCreate):
    bill_obj = Bill(**bill.model_dump())
    doc = bill_obj.model_dump()
    await db.bills.insert_one(doc)
    return bill_obj

@api_router.get("/bills", response_model=List[Bill])
async def get_bills():
    bills = await db.bills.find({}, {"_id": 0}).to_list(1000)
    return bills

@api_router.patch("/bills/{bill_id}/status")
async def update_bill_status(bill_id: str, payment_status: str):
    result = await db.bills.update_one(
        {"id": bill_id},
        {"$set": {"payment_status": payment_status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Bill not found")
    return {"message": "Payment status updated successfully"}

# ---------- MEDICINE/INVENTORY ROUTES ----------
@api_router.post("/medicines", response_model=Medicine)
async def create_medicine(medicine: MedicineCreate):
    medicine_obj = Medicine(**medicine.model_dump())
    doc = medicine_obj.model_dump()
    await db.medicines.insert_one(doc)
    return medicine_obj

@api_router.get("/medicines", response_model=List[Medicine])
async def get_medicines():
    medicines = await db.medicines.find({}, {"_id": 0}).to_list(1000)
    return medicines

@api_router.put("/medicines/{medicine_id}", response_model=Medicine)
async def update_medicine(medicine_id: str, medicine: MedicineCreate):
    result = await db.medicines.update_one(
        {"id": medicine_id},
        {"$set": medicine.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Medicine not found")
    updated = await db.medicines.find_one({"id": medicine_id}, {"_id": 0})
    return updated

@api_router.delete("/medicines/{medicine_id}")
async def delete_medicine(medicine_id: str):
    result = await db.medicines.delete_one({"id": medicine_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return {"message": "Medicine deleted successfully"}

@api_router.get("/dashboard/stats")
async def get_dashboard_stats():
    total_patients = await db.patients.count_documents({})
    total_doctors = await db.doctors.count_documents({})
    total_appointments = await db.appointments.count_documents({})
    total_staff = await db.staff.count_documents({})
    pending_bills = await db.bills.count_documents({"payment_status": "pending"})
    
    return {
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "total_staff": total_staff,
        "pending_bills": pending_bills
    }

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()